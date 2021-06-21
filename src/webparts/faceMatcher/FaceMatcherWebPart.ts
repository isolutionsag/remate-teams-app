import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { MSGraphClient } from '@microsoft/sp-http';
import IFaceMatcherProps from './components/FaceMatcher/IFaceMatcherProps';
import FaceMatcher from './components/FaceMatcher/FaceMatcher';
import { initializeIcons } from 'office-ui-fabric-react';
import GraphService from 'services/GraphService';
import RankingService from 'services/RankingService';

export default class FaceMatcherWebPart extends BaseClientSideWebPart<{}> {

  private graphClient: MSGraphClient;

  public onInit(): Promise<void> {
    initializeIcons();
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient): void => {
          this.graphClient = client;
          resolve();
        }, err => reject(err));
    });
  }

  public render(): void {
    const element: React.ReactElement<IFaceMatcherProps> = React.createElement(
      FaceMatcher,
      {
        graphService: new GraphService(this.graphClient),
        rankingService: new RankingService(this.graphClient)
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
