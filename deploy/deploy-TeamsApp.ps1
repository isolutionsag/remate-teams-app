
[CmdletBinding()]
Param(
     [Parameter(Mandatory=$true)]
     $TenantUrl
 )
 
 try {
     
    Clear-Host
    Write-Host "|---------------------------------------------------------------------|"
    Write-Host "| Welcome to the Remate Teams App deployment process.                 |"
    Write-Host "| This script will deploy a SharePoint App into the App Catalog       |"
    Write-Host "| and will grant the app some permissions on the Graph API            |"
    Write-Host "| provided that you have all required permissions.                    |"
    Write-Host "|                                                                     |"
    Write-Host "| At a certain point, the script will ask you whether you want the    |"
    Write-Host "| script to approve all API access requests. If you have already done |"
    Write-Host "| that in the past, you can safely skip this part.                    |"
    Write-Host "|---------------------------------------------------------------------|`n"

    Write-Host " > Connecting to M365 Tenant...             " -NoNewline
    Connect-PnpOnline $TenantUrl -UseWebLogin -WarningAction SilentlyContinue
    Write-Host "OK" -ForegroundColor Green

    Write-Host " > Connecting to App Catalog...             " -NoNewline
    $catalogUrl = Get-PnPTenantAppCatalogUrl
    Connect-PnPOnline $catalogUrl -UseWebLogin -WarningAction SilentlyContinue
    Write-Host "OK" -ForegroundColor Green

    Write-Host " > Deploying App...                         " -NoNewline
    $c = Add-PnPApp -Path ./../sharepoint/solution/remate-teams-app.sppkg -Publish -Overwrite -SkipFeatureDeployment
    Write-Host "OK" -ForegroundColor Green

    Write-Host " > Syncronizing App with Teams...           " -NoNewline
    Sync-PnPAppToTeams -Identity $c.Id
    Write-Host "OK`n" -ForegroundColor Green

    Do { $approveRequests = Read-Host " >>> Would you like the script to approve API access requests? ([Y]es / [N]o)" } 
    Until ("yes","no","y","n" -contains $approveRequests)

    If ($approveRequests -Eq 'Y' -Or $approveRequests -Eq 'Yes') {

        
        Write-Host "`n > Approving pending API access requests... "
        $requests = Get-PnPTenantServicePrincipalPermissionRequests
        $requestsToApprove = $requests | Where-Object { $_.PackageName -Like 'remate-teams-app-*' }

        If ($null -ne $requestsToApprove)
        {
            ForEach($request In $requestsToApprove)
            {
                $scope = $request.Scope
                Write-Host "     $scope... "   -NoNewline
                Approve-PnPTenantServicePrincipalPermissionRequest -RequestId $request.Id -Force -ErrorAction SilentlyContinue > $null
                Write-Host "OK" -ForegroundColor Green
            }
        }
    } Else {
        Write-Host "`nClick https://admin.microsoft.com/sharepoint?page=webApiPermissionManagement to approve requests manually`n"
    }

    Write-Host "`n-----------------------------------------" -ForegroundColor Green
    Write-Host "Deployment process completed successfully" -ForegroundColor Green
    Write-Host "-----------------------------------------`n" -ForegroundColor Green

 }
 catch  {
    Write-Host $_ -ForegroundColor Red
 }
