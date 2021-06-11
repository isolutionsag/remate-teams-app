export default interface IUserItem {
    id: string;
    displayName: string;
    mail: string;
    userPrincipalName: string;
    initials: string;
    jobTitle?: string;
    officeLocation?: string;
    impostor?: boolean;
  }