import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp, IStorageEntity } from "@pnp/sp/presets/all";

export default class TenantService {
    public constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
        });
    }

    // https://tenant.sharepoint.com/sites/site/_api/web/GetStorageEntity('key')

    public async getStorageKey(key: string): Promise<string> {
        
        const prop: IStorageEntity = await sp.web.getStorageEntity(key);

        return prop.Value;
    }
}