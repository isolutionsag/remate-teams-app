import { MSGraphClient } from '@microsoft/sp-http';
import IResult from 'data/IResult';
import IUserItem from 'data/IUserItem';

export default interface IEmployeeCardProps {
    graphClient: MSGraphClient;
    person: IUserItem;
    onUserDropped: any;
    validated: boolean;
    // selectedDisplayName?: string;
    selectedEmployee?: IUserItem;
    expanded: boolean;
    result: IResult;
  }