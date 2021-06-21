import { MSGraphClient } from '@microsoft/sp-http';
import IRankingItem from 'data/IRankingItem';

export default interface IRankingService {

    getFullRanking(): Promise<Array<IRankingItem>>;

    addPointsToCurrentUser(points: number): Promise<any>;

   
}