import { MSGraphClient } from '@microsoft/sp-http';
import IGroupItem from 'data/IGroupItem';
import IUserItem from 'data/IUserItem';

export class GraphService {

    constructor(private client: MSGraphClient) {}

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
        let n = Math.min(count, result.length);

        var users: Array<IUserItem> = new Array<IUserItem>();
        while (users.length < n) {

            const random = Math.floor(Math.random() * result.length);

            users.push({
                id: result[random].id,
                displayName: result[random].displayName,
                mail: result[random].mail,
                userPrincipalName: result[random].userPrincipalName,
                initials: result[random].displayName.match(/\b(\w)/g).join('').substr(0, 2),
                jobTitle: result[random].jobTitle,
                officeLocation: result[random].officeLocation,
                interests: result[random].interests
            });

            result = result.filter((value, index, arr) => { 
                return index !== random;
            });
        }

        return Promise.resolve(users);
    }

    public async getCurrentUserProfile(): Promise<IUserItem> {
        
        const res = await this.client
            .api("me")
            .version("v1.0")
            .select("id,displayName,mail,userPrincipalName")
            .get(); 

        if (!res) {
          return Promise.reject("No results have been fetched");
        }

        const user = {
            id: res[0].id,
            displayName: res[0].displayName,
            mail: res[0].mail,
            userPrincipalName: res[0].userPrincipalName,
            initials: ''
        };

        return Promise.resolve(user);
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
            }
        });

        return Promise.resolve(result);
    }

    public async getGroupMembers(groupId: string): Promise<Array<IGroupItem>> {
        
        const res: any = await this.client
            .api(`groups/${groupId}/members`)
            .version("v1.0")
            //.select("id,mailNickname")
            .get(); 

        if (!res) {
          return Promise.reject("No results have been fetched");
        }

        console.dir(res);
        // const result: Array<IGroupItem> = res.value.map(group => {
        //     return {
        //         id: group.id,
        //         mailNickname: group.mailNickname
        //     }
        // });

        return Promise.resolve(res);
    }
    
}