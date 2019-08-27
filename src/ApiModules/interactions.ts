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

  public async pastedData(data:string) {
    await this.storeInteraction("pastedData", {'data': data});
  }

  public async chosenSuggestion(responseId: string, suggestion: SuggestionMeta) {
    await this.storeInteraction("chosenSuggestion", { responseId, suggestion });
  }

  public async draftDiscarded() {
    await this.storeInteraction("draftDiscarded");
  }

  public async emailSent(messageId: string) {
    await this.storeInteraction("emailSent", { messageId });
  }

  public async hotkeyMenuOpened() {
    await this.storeInteraction("hotkeyMenuOpened");
  }

  public async hotkeyMenuClosed() {
    await this.storeInteraction("hotkeyMenuClosed");
  }

  public async hotkeyCopied(trigger: string) {
    await this.storeInteraction("hotkeyCopied", { trigger });
  }

  public async hotkeyIconMoved() {
    await this.storeInteraction("hotkeyIconMoved");
  }

  public async tutorialOpened() {
    await this.storeInteraction("tutorialOpened");
  }

  public async tutorialStepViewed(step: number, stepText?: string) {
    await this.storeInteraction("tutorialStepViewed", { step, stepText });
  }

  public async tutorialFinished() {
    await this.storeInteraction("tutorialFinished");
  }

  public async tutorialClosed() {
    await this.storeInteraction("tutorialClosed");
  }

  private async storeInteraction(type: string, data?: object) {
    await this.authFetch("POST", { type, data });
  }

  /** Make authenticated request to interactions api */
  private async authFetch(method: string, data?: object) {
    const headers = {
      "Content-Type": "application/json"
    };
    await this.api.authFetch(method, this.url, data, headers);
  }
}
