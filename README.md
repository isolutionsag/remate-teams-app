# REMATE Teams SPFx (SharePoint Framework) APP

## Summary

Who's who game for Teams

![image](https://user-images.githubusercontent.com/85878792/121888006-c0f29f80-cd17-11eb-8eb6-7c81757bd956.png)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.12.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

* Office 365 tenant
* App configuration in Azure Active Directory (AAD)
    * Permissions
        * Microsoft Graph -> User.Read.All
        * Microsoft Graph -> User.ReadWrite

## Solution

Solution|Author(s)
--------|---------
RemateTeamsApp | David Martos (isolutions AG, @davidmartos)

## Version history

Version|Date|Comments
-------|----|--------
1.0|January 29, 2021|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

1. <b>Install the latest version of [Node.js LTS 14.x]</b>(https://nodejs.org/en/download/releases/)(Note: SPFx v1.12.1 support Node.js v10/12/14)
2. You can either download [Visual Studio Code](https://code.visualstudio.com) and install Teams Toolkit V2 or download TeamsFx CLI.
3. Open the project with VSCode and in the Teams Toolkit V2 sidebar, click `Provision in the Cloud` under PROJECT.

    Or you can use TeamsFx CLI with running this cmd under your project path:
    `teamsfx provision`

    It will provision an app in Teams App Studio. You may need to login with your M365 tenant admin account.

4. Build and Deploy your SharePoint Package.
    - Click `Deploy to the Cloud` in Teams Toolkit V2 sidebar, or run `Teams: Deploy to the Cloud` from command palette. This will generate a SharePoint package(*.sppkg) under sharepoint/solution folder.
  
    Or you can use TeamsFx CLI with running this cmd under your project path:
        `teamsfx deploy`

    - Upload or drag and drop the *.sppkg to the SharePoint App Catalog site, please follow the instruction: [Deploy the HelloWorld package to App Catalog](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page#deploy-the-helloworld-package-to-app-catalog)
5. Go back to Teams Toolkit V2, and in the sidebar, click `Publish to Teams`. 

    Or you can use TeamsFx CLI with running this cmd under your project path:
        `teamsfx publish`

You will find your app in [Microsoft Teams admin center](https://admin.teams.microsoft.com/policies/manage-apps). Enter your app name in the search box.
Click the item and select `Publish` in the Publishing status.
6. You may need to wait for a few minutes after publishing your teams app.And then login to Teams, and you will find your app in the `Apps - Built for {your-tenant-name}` category.

## Features

This Teams app let's you play the well-known who's who game, showing a list of 4 random faces from your organization and asking you to drag one name into each one of them. You will get a score depending on how many attempts you need to match all employees with their right name. A ranking will be available so you can compare your performance with your peers.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
