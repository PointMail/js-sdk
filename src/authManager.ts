import { EventEmitter } from "events";

interface AuthResponse {
  active: boolean;
  expiresAt: number;
  jwt: string;
}

export interface AuthManager {
  setCredentials: (
    emailAddress: string,
    apiKey: string
  ) => void;
  getJwt: () => Promise<string>;
  onJwtChange: (
    listener: (jwt: string | undefined) => void
  ) => void;
  offJwtChange: (
    listener: (jwt: string | undefined) => void
  ) => void;
  isUserActive: () => boolean | undefined;
}

export default class AuthManagerImpl implements AuthManager {
  private emailAddress: string;
  private apiKey: string;

  /** Point API URL */
  private readonly ApiUrl: string;

  /** Point API version */
  private readonly ApiVersionAccept: string;

  private userActive: boolean | undefined;

  private jwt: string | undefined;
  private jwtRenewTimeoutId: NodeJS.Timer;

  private jwtChangedEmitter: EventEmitter;

  /**
   * Creates AuthManager instance
   * 
   * @param emailAddress Email address of Point user account
   * @param apiKey User's API Key
   * @param apiUrl Point API URL
   */
  constructor(
    emailAddress: string,
    apiKey: string,
    apiUrl: string = "https://v1.pointapi.com",
    apiVersion: string
  ) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;
    this.ApiUrl = apiUrl;
    this.ApiVersionAccept = apiVersion;

    this.jwtChangedEmitter = new EventEmitter();
  }

  public setCredentials = (emailAddress: string, apiKey: string): void => {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;

    this.jwt = undefined;
    this.userActive = undefined;
    if (this.jwtRenewTimeoutId) {
      clearTimeout(this.jwtRenewTimeoutId);
    }

    this.refreshJwtToken();
  }

  /**
   * Returns JWT token. 
   * 
   * If the token hasn't been fetched yet the method will fetch it from 
   * the server by caliing /auth endpoint.
   * 
   * @returns JWT string
   */
  public getJwt = async (): Promise<string> => {
    if (!this.jwt) {
      await this.refreshJwtToken();

      if (!this.jwt) {
        throw new Error("Unauthorized");
      }
    }

    return this.jwt;
  }

  /**
   * Adds a listener that will be called upon JWT change.
   * @param listener: <Function> The callback function
   */
  public onJwtChange = (listener: (jwt: string | undefined) => void) => {
    this.jwtChangedEmitter.on('jwt', listener);
  }

  /**
   * Removes a listener that will be called upon JWT change.
   * @param listener: <Function> The callback function
   */
  public offJwtChange = (listener: (jwt: string | undefined) => void) => {
    this.jwtChangedEmitter.off('jwt', listener);
  }

  public isUserActive = () => {
    return this.userActive;
  }

  private refreshJwtToken = async (
    autoRenew: boolean = true,
    retryCount: number = 0
  ): Promise<void> => {
    const { ApiUrl, ApiVersionAccept, emailAddress, apiKey } = this;

    try {
      const response = await fetch(
        `${ApiUrl}/auth?emailAddress=${emailAddress}`,
        {
          headers: {
            Accept: ApiVersionAccept,
            Authorization: `Bearer ${apiKey}`
          },
          method: "POST",
          credentials: "include"
        }
      );

      if (response.ok) {
        const responseJson: AuthResponse = await response.json();
        this.jwt = responseJson.jwt;
        this.userActive = responseJson.active;

        if (autoRenew) {
          if (this.jwtRenewTimeoutId) {
            clearTimeout(this.jwtRenewTimeoutId);
          }

          // Renew JWT 5 seconds before it's exipration
          this.jwtRenewTimeoutId = setTimeout(async () => {
            await this.refreshJwtToken();
          }, responseJson.expiresAt - Date.now() - 5000);
        }

        // If the API User is active, ask server to initialize for autocomplete
        if (this.userActive) {
          this.initSession();
        }

      } else {
        this.jwt = undefined;
        this.userActive = undefined;

        if (response.status === 401) {
          // Unauthorized (wrong token, invalid user, etc.)
          // Don't retry.
        }
        else if (response.status >= 500 && retryCount < 10) {
          // Server returned an internal error
          // Retry /auth after some delay
          const delay = Math.pow(2, retryCount) * 500;
          await new Promise(r => setTimeout(r, delay));
          await this.refreshJwtToken(true, retryCount + 1);
        }
      }
    } catch (e) {
      this.jwt = undefined;
      this.userActive = undefined;

      if (retryCount < 10) {
        // Retry /auth after some delay
        const delay = Math.pow(2, retryCount) * 500;
        await new Promise(r => setTimeout(r, delay));
        await this.refreshJwtToken(true, retryCount + 1);
      }
    }

    // Emit JWT changed event
    this.jwtChangedEmitter.emit('jwt', this.jwt);
  }

  /**
   * Calls /init endpoint which is used to speed up session initialization 
   * for autocomplete. Can be called right after successfull authorization. 
   */
  private initSession = async (): Promise<void> => {
    const { ApiUrl, ApiVersionAccept, emailAddress, jwt } = this;

    await fetch(
      `${ApiUrl}/init?emailAddress=${emailAddress}`,
      {
        headers: {
          Accept: ApiVersionAccept,
          Authorization: `Bearer ${jwt}`,
        },
        method: "GET",
        credentials: "include"
      }
    );
  }
}