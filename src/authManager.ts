import { EventEmitter } from "events";

export default class AuthManager {

  private emailAddress: string;
  private apiKey: string;
  private apiUrl: string;

  private jwt: Promise<string> | null;
  private jwtRenewTimeoutId: NodeJS.Timer;

  // True if the user is an active member
  private active: boolean | null;

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
    apiUrl: string = "https://v1.pointapi.com"
  ) {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;

    this.jwtChangedEmitter = new EventEmitter();
  }

  public setCredentials = (emailAddress: string, apiKey: string): void => {
    this.emailAddress = emailAddress;
    this.apiKey = apiKey;

    this.jwt = null;
    this.active = null;
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
   * Returns True if the account (membership) is active, 
   * False if it's inactive or the server responded with an error.
   */
  public isActive = async (): Promise<boolean> => {
    if (!this.active) {
      await this.refreshJwtToken();
    }

    return !!this.active;
  }

  /**
   * Adds a listener that will be called upon JWT change.
   * @param listener: <Function> The callback function
   */
  public onJwtChange = (listener: (jwt: string | null) => void) => {
    this.jwtChangedEmitter.on('jwt', listener);
  }

  /**
   * Removes a listener that will be called upon JWT change.
   * @param listener: <Function> The callback function
   */
  public offJwtChange = (listener: (jwt: string | null) => void) => {
    this.jwtChangedEmitter.off('jwt', listener);
  }

  private refreshJwtToken = async (
    autoRenew: boolean = true,
    retryCount: number = 0
  ): Promise<void> => {
    const { emailAddress, apiUrl, apiKey } = this;

    try {
      const response = await fetch(
        `${apiUrl}/auth?init&emailAddress=${emailAddress}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          },
          method: "POST",
          credentials: "include"
        }
      );

      if (response.ok) {
        const responseJson = await response.json();

        this.jwt = responseJson.jwt;
        this.active = responseJson.subscription.isActive;

        if (autoRenew) {
          if (this.jwtRenewTimeoutId) {
            clearTimeout(this.jwtRenewTimeoutId);
          }

          // Renew JWT 5 seconds before it's exipration
          this.jwtRenewTimeoutId = setTimeout(async () => {
            await this.refreshJwtToken();
          }, responseJson.expiresAt - Date.now() - 5000);
        }
      } else {
        this.jwt = null;
        this.active = null;

        if (response.status === 401) {
          // Unauthorized (wrong token, invalid user, etc.)
          // Don't retry.
        }
        else if (response.status >= 500 && retryCount < 10) {
          // Server returned an internal error
          // Retry /auth after some delay
          const delay = Math.pow(2, retryCount) * 500;
          await new Promise(r => setTimeout(r, delay))
          await this.refreshJwtToken(true, retryCount + 1);
        }
      }
    } catch (e) {
      this.jwt = null;
      this.active = null;

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
}