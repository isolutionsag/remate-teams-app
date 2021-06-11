import { MSGraphClient } from '@microsoft/sp-http';
import IUserItem from 'data/IUserItem';

export default interface IEmployeeCardProps {
  graphClient: MSGraphClient;
  person: IUserItem;
}