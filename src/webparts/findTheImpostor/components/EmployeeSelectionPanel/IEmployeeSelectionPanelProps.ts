import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';
import IGraphService from 'services/IGraphService';
import IRankingService from 'services/IRankingService';

export default interface IEmployeeSelectionPanelProps {
  graphService: IGraphService;
  rankingService: IRankingService;
  group: IGroupItem;
  impostorsCount: number;
}
