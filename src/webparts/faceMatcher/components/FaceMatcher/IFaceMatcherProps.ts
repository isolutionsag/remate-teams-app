import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from '@microsoft/sp-http';

export interface IFaceMatcherProps {
  context: WebPartContext;
  graphClient: MSGraphClient;
}
