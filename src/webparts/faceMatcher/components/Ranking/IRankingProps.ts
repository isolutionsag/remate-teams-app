import { MSGraphClient } from '@microsoft/sp-http';
import IUserItem from 'data/IUserItem';

export interface IRankingProps {
    graphClient: MSGraphClient;
    currentUser: IUserItem;
}