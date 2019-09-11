import { PointApi } from "../main";
import { SuggestionMeta } from "./autocompleteSession";

/** Result containing just a status field */
export interface StatusResponse {
  status: string;
}

/** Class to keep track of api credentials and make requests to the custom suggestions api */
export default class InteractionsApiModule {
  private readonly api: PointApi;

  private readonly url: string = "/interactions";

  constructor(api: PointApi) {
    this.api = api;
  }

  public async pastedData(origin: string, data: string) {
    await this.storeInteraction("pastedData", origin, { data });
  }

  public async chosenSuggestion(responseId: string, origin: string, suggestion: SuggestionMeta) {
    await this.storeInteraction("chosenSuggestion", origin, { responseId, suggestion });
  }

  public async draftDiscarded() {
    await this.storeInteraction("draftDiscarded");
  }

  public async emailSent(messageId: string) {
    await this.storeInteraction("emailSent", undefined, { messageId });
  }

  public async pointSearchOpened(trigger: string, origin: string) {
    await this.storeInteraction("pointSearchOpened"+trigger, origin);
  }

  public async pointSearchClosed(trigger: string, origin: string) {
    await this.storeInteraction("pointSearchClosed"+trigger, origin);
  }

  public async hotkeyCopied(trigger: string, origin: string) {
    await this.storeInteraction("hotkeyCopied", origin, { trigger });
  }

  public async hotkeyIconMoved(origin: string) {
    await this.storeInteraction("hotkeyIconMoved", origin);
  }

  public async tutorialOpened() {
    await this.storeInteraction("tutorialOpened");
  }

  public async tutorialStepViewed(step: number, stepText?: string) {
    await this.storeInteraction("tutorialStepViewed", undefined, { step, stepText });
  }

  public async tutorialFinished() {
    await this.storeInteraction("tutorialFinished");
  }

  public async tutorialClosed() {
    await this.storeInteraction("tutorialClosed");
  }

  private async storeInteraction(type: string, origin?: string, data?: object) {
    await this.authFetch("POST", { type, origin, data });
  }

  /** Make authenticated request to interactions api */
  private async authFetch(method: string, data?: object) {
    const headers = {
      "Content-Type": "application/json"
    };
    await this.api.authFetch(method, this.url, data, headers);
  }
}
