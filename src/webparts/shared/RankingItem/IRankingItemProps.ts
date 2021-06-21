import IRankingItem from 'data/IRankingItem';
import IGraphService from 'services/IGraphService';

export default interface IRankingItemProps {
    graphService: IGraphService;
    position: number;
    rankingInfo: IRankingItem;
    isCurrentUser: boolean;
}