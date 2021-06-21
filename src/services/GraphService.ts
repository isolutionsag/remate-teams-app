import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';
import IUserItem from 'data/IUserItem';
import IGraphService from './IGraphService';

export default class GraphService implements IGraphService {

    constructor(private client: MSGraphClient) {}

    public async getCurrentUserProfile(): Promise<IUserItem> {

        try {
            const apiResponse: any = await this.client
            .api("me")
            .version("v1.0")
            .select("id,displayName,mail,jobTitle,officeLocation")
            .get(); 

            if (!apiResponse) {
                return Promise.reject("Current user profile not found");
            }

            const result: IUserItem = this.mapUserData(apiResponse);

            return Promise.resolve(result);
        } catch (err) {
            Promise.reject(err);
        }
        
    }

    public async getRandomEmployeesList(count: number): Promise<Array<IUserItem>> {
        
        try {
            let apiResponse = await this.client
                .api("users")
                .version("v1.0")
                .filter("accountEnabled eq true and userType eq 'member'")
                .select("id,displayName,mail,jobTitle,officeLocation")
                .get(); 

            if (!apiResponse) {
                return Promise.reject("No results have been fetched");
            }

            let result: any[] = apiResponse.value.slice();

            while (apiResponse["@odata.nextLink"]) {
                apiResponse = await this.client.api(apiResponse["@odata.nextLink"]).get();
                result = result.concat(apiResponse.value);
            }
            
            let itemsToReturn: number = Math.min(count, result.length);

            var randomEmployees: Array<IUserItem> = new Array<IUserItem>();
            
            while (randomEmployees.length < itemsToReturn) {

                const random = Math.floor(Math.random() * result.length);

                randomEmployees.push(this.mapUserData(result[random]));

                result = result.filter((value, index, array) => { 
                    return index !== random;
                });
            }

            return Promise.resolve(randomEmployees);
        } catch (err) {
            Promise.reject(err);
        }
    }
         
    public async getEmployeePhoto(employeeId: string): Promise<string> {
        try {
            const blob = await  this.client
            .api(`users/${employeeId}/photo/$value`)
            .version('v1.0')
            .responseType('blob')
            .get();

            const url = window.URL;
            const blobUrl = url.createObjectURL(blob);
            return Promise.resolve(blobUrl);

        } catch (err) {
            Promise.reject(err);
        }
    }

    public async getEmployeeInterests(employeeId: string): Promise<Array<string>> {
        // TODO: this method uses a beta endpoint and should not go in production
        try {
           

            const apiResponse = await  this.client
                .api(`users/${employeeId}/profile/skills`)
                .version('beta')
                .get();

            const skills: Array<string> = apiResponse.value.map(skill => {
                return skill.displayName;
            });

            return Promise.resolve(skills);

        } catch (err) {
            return Promise.resolve([]);
        }
    }

    public async getAllGroups(): Promise<Array<IGroupItem>> {
        
        try {
            const apiResponse: any = await this.client
                .api("groups")
                .version("v1.0")
                .select("id,mailNickname")
                .get(); 

            if (!apiResponse) {
                return Promise.reject("No results have been fetched");
            }

            const result: Array<IGroupItem> = apiResponse.value.map(group => {
                return {
                    id: group.id,
                    mailNickname: group.mailNickname
                };
            });

            return Promise.resolve(result);

        } catch (err) {
            Promise.reject(err);
        }
    }

    public async getGroupMembers(groupId: string): Promise<Array<IUserItem>> {
        
        try {
            const apiResponse: any = await this.client
                .api(`groups/${groupId}/members`)
                .version("v1.0")
                .select("id,displayName,mail,jobTitle")
                .get(); 

            if (!apiResponse) {
                return Promise.reject("No results have been fetched");
            }

            const result: Array<IUserItem> = apiResponse.value
                .map(member => this.mapUserData(member));

            return Promise.resolve(result);
        } catch (err) {
            Promise.reject(err);
        }
    }

    public async appendRandomEmployees(groupMembers: Array<IUserItem>, numberToAdd: number) {
        try {
            let apiResponse = await this.client
                .api("users")
                .version("v1.0")
                .select("id,displayName,mail,jobTitle,officeLocation")
                .get(); 

            let allEmployees: any[] = apiResponse.value.slice();

            while (apiResponse["@odata.nextLink"]) {
                apiResponse = await this.client.api(apiResponse["@odata.nextLink"]).get();
                allEmployees = allEmployees.concat(apiResponse.value);
            }

            if (!apiResponse) {
                return Promise.reject("No results have been fetched");
            }

            const unexistingEmployees = this.getUnexistingEmployees(groupMembers, allEmployees);

            if (unexistingEmployees.length < numberToAdd) {
                Promise.reject("Can't play with this group.");
            }

            let result: any[] = unexistingEmployees.slice();
            let addedEmployees: number = 0;
            
            var users: Array<IUserItem> = groupMembers.slice();
            while (addedEmployees < numberToAdd) {

                const random = Math.floor(Math.random() * result.length);
                let userToAdd: IUserItem = this.mapUserData(result[random]);
                userToAdd.impostor = true;
                users.push(userToAdd);

                result = result.filter((value, index, arr) => { 
                    return index !== random;
                });

                addedEmployees ++;
            }

            return Promise.resolve(users);
        } catch (err) {
            Promise.reject(err);
        }
    }

    public shuffleUsers(users: Array<IUserItem>): Array<IUserItem> {
        const shuffledUsers = users.slice();
    
        for (let i: number = shuffledUsers.length - 1; i > 0; i--) {
          const j: number = Math.floor(Math.random() * (i + 1));
          const temp: IUserItem = shuffledUsers[i];
          shuffledUsers[i] = shuffledUsers[j];
          shuffledUsers[j] = temp;
        }
    
        return shuffledUsers;
      }

    private getUnexistingEmployees(groupMembers: Array<IUserItem>, allEmployees: Array<any>): Array<any> {
        const ids: Array<string> = groupMembers.map(x => x.id);

        const unexistingEmployees = allEmployees.filter((value, index, arr) => {
            return ids.indexOf(value.id) === -1;
        });

        return unexistingEmployees;
    }

    private mapUserData(graphResult: any): IUserItem {
        return {
            id: graphResult.id,
            displayName: graphResult.displayName,
            mail: graphResult.mail,
            initials: this.getInitials(graphResult.displayName),
            jobTitle: graphResult.jobTitle,
            officeLocation: graphResult.officeLocation
        };
    }

    private getInitials(displayName: string): string {
        try {
            return displayName.match(/\b(\w)/g).join('').substr(0, 2);
        } catch {
            return "??";
        }
    }
    
}