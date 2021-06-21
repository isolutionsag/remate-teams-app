import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';
import IUserItem from 'data/IUserItem';
import IGraphService from './IGraphService';

export default class GraphServiceFake implements IGraphService {

    public async getCurrentUserProfile(): Promise<IUserItem> {

        return new Promise<IUserItem>(resolve => {

            let user: IUserItem = 
                {
                    id: 'string',
                    displayName: 'string',
                    mail: 'string',
                    initials: 'string',
                    jobTitle: 'string',
                    officeLocation: 'string',
                    impostor: true,
                    voted: true,
                    blocked: true
                };
            
            resolve(user);
        });
    }

    public async getRandomEmployeesList(count: number): Promise<Array<IUserItem>> {
        
        return new Promise<Array<IUserItem>>(resolve => {

            let list: IUserItem[] = [
                {
                    id: 'string',
                    displayName: 'string',
                    mail: 'string',
                    initials: 'string',
                    jobTitle: 'string',
                    officeLocation: 'string',
                    impostor: true,
                    voted: true,
                    blocked: true
                }
            ] as IUserItem[];
            
            resolve(list);
        });
    }
         
    public async getEmployeePhoto(employeeId: string): Promise<string> {
      return Promise.resolve("photo");
    }

    public async getEmployeeInterests(employeeId: string): Promise<Array<string>> {
      return null;
    }

    public async getAllGroups(): Promise<Array<IGroupItem>> {
        
        return null;
    }

    public async getGroupMembers(groupId: string): Promise<Array<IUserItem>> {
        
        return null;
    }

    public async appendRandomEmployees(groupMembers: Array<IUserItem>, numberToAdd: number) {
      return null;
    }

    public shuffleUsers(users: Array<IUserItem>): Array<IUserItem> {
       return null;
      }

   
    
}