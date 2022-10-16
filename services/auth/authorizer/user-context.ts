export interface IUserContext {
    username: string;
    userEmail: string;
    nameOfUser: string;
    roles: string;
  }

  export abstract class UserContext {
    public static context: UserContext;
  }
  