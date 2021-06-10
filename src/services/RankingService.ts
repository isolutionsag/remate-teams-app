import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IWeb, sp, Web } from "@pnp/sp/presets/all";
import { ISiteUserInfo } from "@pnp/sp/site-users/types";
import IRankingItem from "data/IRankingItem";

export default class RankingService {
    public constructor(private context: WebPartContext, private url) {
        sp.setup({
            spfxContext: this.context
        });
    }

    public async addPointsToCurrentUser(points: number): Promise<void> {

        const _web = Web(this.url);

        const currentUser = await this.getCurrentUser(_web);

        var ranking = await this.getRankingByEmployee(_web, currentUser);

        if (ranking) {
            await this.updateRankingItem(_web, ranking, points);
        } else {
            await this.addRankingItem(_web, currentUser.Id, points);
        }
    }

    private async getCurrentUser(_web: IWeb): Promise<ISiteUserInfo> {
        return await _web.currentUser.get();
    }

    private async getRankingByEmployee(_web: IWeb, user: ISiteUserInfo): Promise<IRankingItem> {
        const results = await _web.lists.getByTitle('Remate-Ranking').renderListDataAsStream({
            ViewXml: `
                <View>
                    <ViewFields>
                        <FieldRef Name="ID" />
                        <FieldRef Name="RankedEmployee" />
                        <FieldRef Name="RankedPoints" />
                        <FieldRef Name="RankedGames" />
                    </ViewFields>
                    <RowLimit>1</RowLimit>
                    <Query>
                        <Where>
                            <Eq>
                                <FieldRef Name="RankedEmployee" LookupId="TRUE"/>
                                <Value Type="Integer">${user.Id}</Value>
                            </Eq>
                        </Where>
                    </Query>
                </View>` 
        });

        if (results.Row.length === 0) {
            return null;
        }

        return {
            id: results.Row[0]["ID"],
            rankedPoints: parseInt(results.Row[0]["RankedPoints"]),
            rankedGames: parseInt(results.Row[0]["RankedGames"])
        };
    }

    private async updateRankingItem(_web: IWeb, ranking: IRankingItem, points: number) {
        await _web.lists.getByTitle('Remate-Ranking').items.getById(ranking.id).update({
            'RankedPoints': points + ranking.rankedPoints,
            'RankedGames': ranking.rankedGames + 1
        });
    }

    private async addRankingItem(_web: IWeb, userId: number, points: number) {
        await _web.lists.getByTitle('Remate-Ranking').items.add({
            'RankedEmployeeId': userId,
            'RankedPoints': points,
            'RankedGames': 1
        });
    }
}