import {
    APIGatewayRequestAuthorizerEvent,
    APIGatewaySimpleAuthorizerResult
  } from "aws-lambda";
  import jwt, { JwtPayload } from "jsonwebtoken";
  import { Role, controllers } from './permissions'
  
  async function validateToken(token: string): Promise<string> {
    try {
        var payload = await jwt.verify(token, 'secretKey', {
            issuer: 'https://access-uat.alberta.ca/auth/realms/5ce2889d-0965-4e85-a139-483662b2442c',
            audience: ['trds:transcripts-api', 'account']
        });
        if (typeof(payload) === 'object')
          payload = '334'
        console.log(payload);
        return typeof(payload) === 'string' ? payload : JSON.stringify(payload);
      }
    catch (error) {
      throw new Error(`Token is not valid: ${JSON.stringify(error)}`);
    }
  };

  function extractRolesFromToken(tokenPayload: string): Role[] {
    const payload = JSON.parse(tokenPayload);
    const rolesAsString: (keyof typeof Role)[] = payload?.resource_access?.['trds:transcripts-api']?.roles;
    let roles: Role[]
    rolesAsString.forEach(roleAsString => {
        roles.push(Role[roleAsString]);
    })
    return roles;
  }
  
  export async function lambdaHandler(
    event: APIGatewayRequestAuthorizerEvent
  ): Promise<APIGatewaySimpleAuthorizerResult> {
    try {
      const token = event?.headers?.["Authorization"];
  
      if (!token) {
        throw new Error("authorization token not found");
      }
  
      // perform authentication
      const payload = await validateToken(token);
      const payloadJson = JSON.parse(payload);
      
      // perform authorization
      const userRoles = extractRolesFromToken(payload);
      const authorizedRoles = controllers.find(x => x.path === event.path && x.method === event.httpMethod).Roles;
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