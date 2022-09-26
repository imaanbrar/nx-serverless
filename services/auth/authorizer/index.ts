import {
    APIGatewayRequestAuthorizerEvent,
    AuthResponse,
    PolicyDocument,
  } from "aws-lambda";
  import jwt, { JwtPayload } from "jsonwebtoken";
  import { Role, controllers } from './permissions'
  
  type DecodedToken = {
    sub: string;
    username: string;
  };
  
  function generatePolicy(effect: string, resource: string): PolicyDocument {
    const policyDocument = {} as PolicyDocument;
    if (effect && resource) {
      policyDocument.Version = "2012-10-17";
      policyDocument.Statement = [];
      const statementOne: any = {};
      statementOne.Action = "execute-api:Invoke";
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
    }
    console.log(`Policy document: ${JSON.stringify(policyDocument)}`);
    return policyDocument;
  }
  
  async function validateToken(token: string): Promise<string> {
    try {
        const payload = await jwt.verify(token, 'secretKey', {
            issuer: 'https://access-uat.alberta.ca/auth/realms/5ce2889d-0965-4e85-a139-483662b2442c',
            audience: ['trds:transcripts-api', 'account']
        });
        console.log(payload);
        return typeof(payload) === 'string' ? payload : JSON.stringify(payload);
      }
    catch (error) {
      throw new Error(`Token is not valid: ${error}`);
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
  
  export async function authHandler(
    event: APIGatewayRequestAuthorizerEvent
  ): Promise<AuthResponse> {
    try {
      const token = event?.headers?.["Authorization"];
  
      if (!token) {
        throw new Error("authorization token not found");
      }
  
      // perform authentication
      const payload = await validateToken(token);
      const payloadJson = JSON.parse(payload);
  
      const decodedToken = jwt.decode(token) as DecodedToken;
      if (!decodedToken) throw new Error("token can not be decoded");
      
      // perform authorization
      const userRoles = extractRolesFromToken(payload);
      const authorizedRoles = controllers.find(x => x.path === event.path && x.method === event.httpMethod).Roles;
      const authorized = (userRoles.filter(userRole => authorizedRoles.includes(userRole))).length > 0;

      if (!authorized) {
        throw new Error("user is not authorized to perform this action");
        
      }
  
      const policyDoc = generatePolicy("Allow", "*");
      return {
        principalId: decodedToken.sub,
        policyDocument: policyDoc,
        // add the permissions to the context which will make its way to consuming lambda function
        context: {
          username: payloadJson.preferred_username,
          userEmail: payloadJson.email,
          nameOfUser: payloadJson.name,
          roles: userRoles.toString(),
        },
      } as AuthResponse;
    } catch (error) {
      console.error("An error happened during authentication", error);
      throw new Error("Unauthorized");
    }
  }