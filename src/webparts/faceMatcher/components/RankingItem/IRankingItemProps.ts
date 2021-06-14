import { MSGraphClient } from '@microsoft/sp-http';
import IRankingItem from 'data/IRankingItem';

export interface IRankingItemProps {
    graphClient: MSGraphClient;
    position: number;
    rankingInfo: IRankingItem;
    isCurrentUser: boolean;
}