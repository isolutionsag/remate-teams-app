import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from '@microsoft/sp-http';

export interface IWhoIsWhoProps {
  context: WebPartContext;
  graphClient: MSGraphClient;
}
