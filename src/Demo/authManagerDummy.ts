import { AuthManager } from "../authManager";

export default class AuthManagerDummy implements AuthManager {
  public setCredentials(emailAddress: string, apiKey: string) {
    // do nothing - no credentials needed
  }

  public getJwt() {
    // return dummy jwt token
    return Promise.resolve("jwt-dummy");
  }

  public onJwtChange(listener: (jwt: string | undefined) => void) {
    // do nothing - jwt will never change
  }

  public offJwtChange(listener: (jwt: string | undefined) => void) {
    // do nothing - jwt will never change
  }

  public isUserActive() {
    // dummy user is always active
    return true;
  }
}