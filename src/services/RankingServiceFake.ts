import { MSGraphClient } from '@microsoft/sp-http';
import IRankingItem from 'data/IRankingItem';
import IRankingService from './IRankingService';

export default class RankingServiceFake implements IRankingService {
    
    public async getFullRanking(): Promise<Array<IRankingItem>> {
        return Promise.resolve([]);
    }

    public async addPointsToCurrentUser(points: number): Promise<any> {
        return Promise.resolve("");
    }
}