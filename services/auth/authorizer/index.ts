import {
    APIGatewayRequestAuthorizerEvent,
    APIGatewaySimpleAuthorizerResult
  } from "aws-lambda";
  import jwt, { JwtPayload } from "jsonwebtoken";
  import { Role, controllers, enumFromStringValue } from './permissions'

  const publicKey = ['-----BEGIN PUBLIC KEY-----', 
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAngFH+GEMWiduoA+QA03+Ov/ekWr5HaGxEacJ/AOoc2HEbNuXmVMVwOMtVHWlOpEXdLkHCWmLXHVLhATHiI/2HcLv6buB4AJnYz1ud6/+2of7y+9yfiC73JpJQgJV0g1eT76CxFPjZ2inlxR4H/erf/w0o8cGNW9B9TWXMzNy2Jpvak2t95Tl3mONIxEHSeJcftA8as4k8a73GB1E/FAy/4dkYGifOFP2/DH6Y1J2MgnfVBjZM/HV7i6DE58H+MaDTPPNZdWQN4qDCoBR/X8xCP8cVuBwmIPXwJ8cR2thIpdX5AOOlCkhUBUNv3iJgaQO9ynk0G9NH5cT3MROhFSL+wIDAQAB',
    '-----END PUBLIC KEY-----'].join('\n');
  
  async function validateToken(token: string): Promise<string> {
    try {
      
        var payload = await jwt.verify(token, publicKey, {
            issuer: 'https://access-uat.alberta.ca/auth/realms/5ce2889d-0965-4e85-a139-483662b2442c',
            audience: ['trds:transcripts-api', 'account'],
            algorithms: ['RS256'],
        });

        if (typeof(payload) === 'object')
          payload = JSON.stringify(payload);
        console.log(payload);
        return typeof(payload) === 'string' ? payload : JSON.stringify(payload);
      }
    catch (error) {
      throw new Error(`Token is not valid: ${JSON.stringify(error)}`);
    }
  };

  function extractRolesFromToken(tokenPayload: string): Role[] {
    const payload = JSON.parse(tokenPayload);
    const rolesAsString: string[] = payload?.resource_access?.['trds:transcripts-api']?.roles;
    let roles: Role[] = [];
    rolesAsString.forEach(roleAsString => {
        const role = enumFromStringValue(Role, roleAsString);
        roles.push(role);
    })
    return roles;
  }


  
  export async function lambdaHandler(
    event: APIGatewayRequestAuthorizerEvent
  ): Promise<APIGatewaySimpleAuthorizerResult> {
    try {
      // get Authorization bearer token from headers and remove the 'Bearer' part
      console.log(event);
      const token = event?.headers?.["Authorization"].replace('Bearer ', '');
  
      if (!token) {
        throw new Error("authorization token not found");
      }
  
      // perform authentication
      const payload = await validateToken(token);
      const payloadJson = JSON.parse(payload);
      
      // perform authorization
      const userRoles = extractRolesFromToken(payload);
      const authorizedRoles = controllers.find(x => x.path === event.path && x.method === event.httpMethod)?.Roles;
      const authorized = (userRoles.filter(userRole => authorizedRoles.includes(userRole))).length > 0;

      if (!authorized) {
        throw new Error("user is not authorized to perform this action");
      }

      return {
        isAuthorized: true,
        // add the permissions to the context which will make its way to consuming lambda function
        context: {
          username: payloadJson.preferred_username,
          userEmail: payloadJson.email,
          nameOfUser: payloadJson.name,
          roles: userRoles.toString(),
        },
      } as APIGatewaySimpleAuthorizerResult;
    } catch (error) {
      console.error("An error happened during authentication", error);
      throw new Error("Unauthorized");
    }
  }