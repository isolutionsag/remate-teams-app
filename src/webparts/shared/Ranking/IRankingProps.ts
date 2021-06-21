import { MSGraphClient } from '@microsoft/sp-http';
import IGraphService from 'services/IGraphService';
import IRankingService from 'services/IRankingService';

export interface IRankingProps {
    graphService: IGraphService;
    rankingService: IRankingService;
}