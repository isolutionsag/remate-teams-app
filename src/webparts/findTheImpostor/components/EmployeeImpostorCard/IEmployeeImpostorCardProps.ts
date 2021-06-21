import { MSGraphClient } from '@microsoft/sp-http';
import IUserItem from 'data/IUserItem';
import IGraphService from 'services/IGraphService';

export interface IEmployeeImpostorCardProps {
  graphService: IGraphService;
  employee: IUserItem;
  onCardClicked: any;
  remainingImpostors: number;
}
