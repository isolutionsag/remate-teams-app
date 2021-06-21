import { MSGraphClient } from '@microsoft/sp-http';
import IGraphService from 'services/IGraphService';
import IRankingService from 'services/IRankingService';

export default interface IFaceMatcherProps {
  graphService: IGraphService;
  rankingService: IRankingService;
}
