import { MSGraphClient } from '@microsoft/sp-http';
import IUserItem from 'data/IUserItem';

export default interface IPersonProps {
    graphClient: MSGraphClient;
    person: IUserItem;
    onUserDropped: any;
    validated: boolean;
    selectedDisplayName?: string;
    expanded: boolean;
  }