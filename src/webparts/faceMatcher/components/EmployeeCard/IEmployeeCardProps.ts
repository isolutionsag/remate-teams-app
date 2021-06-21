import { MSGraphClient } from '@microsoft/sp-http';
import IResult from 'data/IResult';
import IUserItem from 'data/IUserItem';
import IGraphService from 'services/IGraphService';

export default interface IEmployeeCardProps {
    graphService: IGraphService;
    person: IUserItem;
    onUserDropped: any;
    validated: boolean;
    // selectedDisplayName?: string;
    selectedEmployee?: IUserItem;
    expanded: boolean;
    result: IResult;
  }