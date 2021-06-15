import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';

export default interface IEmployeeSelectionPanelProps {
  graphClient: MSGraphClient;
  group: IGroupItem;
  impostorsCount: number;
}
