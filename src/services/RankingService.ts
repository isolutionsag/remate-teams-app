import { MSGraphClient } from '@microsoft/sp-http';
import IRankingItem from 'data/IRankingItem';
import IRankingService from './IRankingService';

export default class RankingService implements IRankingService {
    constructor(private client: MSGraphClient) {}

    public async getFullRanking(): Promise<Array<IRankingItem>> {

        let res = await this.client
            .api("users")
            .version("v1.0")
            .select("Id,mail,displayName,jobTitle")
            .filter("accountEnabled eq true and userType eq 'member'")
            .expand("extensions($filter=id eq 'com.onmicrosoft.isdmartos.remateData')")
            .get();

        if (!res) {
            return Promise.reject("No results have been fetched");
        }

        let result: any[] = res.value.slice();

        while (res["@odata.nextLink"]) {
            res = await this.client.api(res["@odata.nextLink"]).get();
            result = result.concat(res.value);
        }

        const rankedUsers: Array<IRankingItem> = result
            .map(user => {
                let points: number = 0;
                let attempts: number = 0;

                if (user.extensions && user.extensions.length > 0) {
                    points = user.extensions[0].faceMatcherPoints;
                    attempts = user.extensions[0].faceMatcherAttempts;
                }

                return {
                    rankedPoints: points,
                    rankedGames: attempts,
                    user: {
                        id: user.id,
                        displayName: user.displayName,
                        mail: user.mail,
                        jobTitle: user.jobTitle,
                        initials: this.getInitials(user.displayName)                  
                    }
                };
            })
            .sort((a, b) => { return a.rankedPoints < b.rankedPoints ? 1: -1; } );
        
        return rankedUsers.map((ranking: IRankingItem, index: number) => {
            let original = ranking;
            original.position = index + 1;
            
            return ranking;
        });
    }

    public async addPointsToCurrentUser(points: number): Promise<any> {
        const res: IRankingItem = await this.getCurrentUserRanking();

        if (res) {
            await this.updateRankingForCurrentUser(res, points);
        } else {
            await this.createRankingForCurrentUser(points);
        }
    }

    private getInitials(displayName: string): string {
        try {
            return displayName.match(/\b(\w)/g).join('').substr(0, 2);
        } catch {
            return "??";
        }
    }

    private async getCurrentUserRanking(): Promise<IRankingItem> {
        const res = await this.client
            .api("me")
            .version("v1.0")
            .expand("extensions")
            .select("id,displayName,mail,jobTitle,officeLocation")
            .get(); 

        if (!res) {
          return Promise.reject("No results have been fetched");
        }

        if (!res.extensions) {
            return null;
        }

        const validExtensions = res.extensions.filter(ext => ext.id === "com.onmicrosoft.isdmartos.remateData");
        if (validExtensions.length === 0) {
            return null;
        }

        return {
            rankedGames: validExtensions[0].faceMatcherAttempts,
            rankedPoints: validExtensions[0].faceMatcherPoints
        };

    }

    private async createRankingForCurrentUser(points: number): Promise<void> {
        await this.client
            .api("me/extensions")
            .version("v1.0")
            .post({
                "@odata.type": "microsoft.graph.openTypeExtension",
                "extensionName": "com.onmicrosoft.isdmartos.remateData",
                "faceMatcherAttempts": 1,
                "faceMatcherPoints": points
            }); 
    }

    private async updateRankingForCurrentUser(previousRanking: IRankingItem, points: number): Promise<void> {
        await this.client
            .api("me/extensions/com.onmicrosoft.isdmartos.remateData")
            .version("v1.0")
            .patch({
                "faceMatcherAttempts": previousRanking.rankedGames + 1,
                "faceMatcherPoints": previousRanking.rankedPoints + points
            }); 
    }
}