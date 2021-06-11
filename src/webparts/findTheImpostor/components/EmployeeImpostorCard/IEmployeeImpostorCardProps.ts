import { MSGraphClient } from '@microsoft/sp-http';
import IUserItem from 'data/IUserItem';

export interface IEmployeeImpostorCardProps {
  graphClient: MSGraphClient;
  employee: IUserItem;
  onCardClicked: any;
  remainingImpostors: number;
}
