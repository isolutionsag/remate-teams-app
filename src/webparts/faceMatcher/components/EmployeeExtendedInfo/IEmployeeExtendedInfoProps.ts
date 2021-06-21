import { MSGraphClient } from '@microsoft/sp-http';
import IUserItem from 'data/IUserItem';
import IGraphService from 'services/IGraphService';

export default interface IEmployeeCardProps {
  graphService: IGraphService;
  person: IUserItem;
}