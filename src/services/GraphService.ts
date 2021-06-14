import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';
import IUserItem from 'data/IUserItem';

export class GraphService {

    constructor(private client: MSGraphClient) {}

    public async getCurrentUserProfile(): Promise<IUserItem> {
        const res = await this.client
            .api("me")
            .version("v1.0")
            .select("id,displayName,mail,userPrincipalName,jobTitle,officeLocation")
            .get(); 

        if (!res) {
            return Promise.reject("No results have been fetched");
        }

        const result: IUserItem = this.mapUserData(res);

        return Promise.resolve(result);
    }

    public async getRandomEmployeesList(count: number): Promise<Array<IUserItem>> {
        
        const res = await this.client
            .api("users")
            .version("v1.0")
            .select("id,displayName,mail,userPrincipalName,jobTitle,officeLocation")
            .get(); 

        if (!res) {
          return Promise.reject("No results have been fetched");
        }

        let result: any[] = res.value.slice();
        let totalItems = Math.min(count, result.length);

        var users: Array<IUserItem> = new Array<IUserItem>();
        
        while (users.length < totalItems) {

            const random = Math.floor(Math.random() * result.length);

            users.push(this.mapUserData(result[random]));

            result = result.filter((value, index, arr) => { 
                return index !== random;
            });
        }

        return Promise.resolve(users);
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
        try {
            const result = await  this.client
            .api(`users/${employeeId}/profile/skills`)
            .version('beta')
            .get();

            console.dir(result);
            const skills: Array<string> = result.value.map(x => {
                return x.displayName;
            });

            return Promise.resolve(skills);

        } catch (err) {
            Promise.reject(err);
        }
    }

    public async getAllGroups(): Promise<Array<IGroupItem>> {
        
        const res: any = await this.client
            .api("groups")
            .version("v1.0")
            .select("id,mailNickname")
            .get(); 

        if (!res) {
          return Promise.reject("No results have been fetched");
        }

        const result: Array<IGroupItem> = res.value.map(group => {
            return {
                id: group.id,
                mailNickname: group.mailNickname
            };
        });

        return Promise.resolve(result);
    }

    public async getGroupMembers(groupId: string): Promise<Array<IUserItem>> {
        
        const res: any = await this.client
            .api(`groups/${groupId}/members`)
            .version("v1.0")
            .select("id,displayName,mail,jobTitle")
            .get(); 

        if (!res) {
          return Promise.reject("No results have been fetched");
        }

        const result: Array<IUserItem> = res.value.map(member => this.mapUserData(member));

        return Promise.resolve(result);
    }

    public async appendRandomEmployees(groupMembers: Array<IUserItem>, numberToAdd: number) {
        const allEmployeesRaw = await this.client
            .api("users")
            .version("v1.0")
            .select("id,displayName,mail,userPrincipalName,jobTitle,officeLocation")
            .get(); 

        if (!allEmployeesRaw) {
          return Promise.reject("No results have been fetched");
        }

        const unexistingEmployees = this.getUnexistingEmployees(groupMembers, allEmployeesRaw.value);

        if (unexistingEmployees.length < numberToAdd) {
            Promise.reject("Can't play with this group.");
        }

        let result: any[] = unexistingEmployees.slice();
        let added: number = 0;
        
        var users: Array<IUserItem> = groupMembers.slice();
        while (added < numberToAdd) {

            const random = Math.floor(Math.random() * result.length);
            let userToAdd: IUserItem = this.mapUserData(result[random]);
            userToAdd.impostor = true;
            users.push(userToAdd);

            result = result.filter((value, index, arr) => { 
                return index !== random;
            });

            added ++;
        }

        return Promise.resolve(users);

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
            userPrincipalName: graphResult.userPrincipalName,
            initials: graphResult.displayName.match(/\b(\w)/g).join('').substr(0, 2),
            jobTitle: graphResult.jobTitle,
            officeLocation: graphResult.officeLocation
        };
    }
    
}