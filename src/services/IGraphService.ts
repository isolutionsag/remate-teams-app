import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';
import IUserItem from 'data/IUserItem';

export default interface IGraphService {


    getCurrentUserProfile(): Promise<IUserItem>;

    getRandomEmployeesList(count: number): Promise<Array<IUserItem>>;
         
    getEmployeePhoto(employeeId: string): Promise<string>;

    getEmployeeInterests(employeeId: string): Promise<Array<string>>;

    getAllGroups(): Promise<Array<IGroupItem>>;

    getGroupMembers(groupId: string): Promise<Array<IUserItem>>;

    appendRandomEmployees(groupMembers: Array<IUserItem>, numberToAdd: number);

    shuffleUsers(users: Array<IUserItem>): Array<IUserItem>;

   
    
}