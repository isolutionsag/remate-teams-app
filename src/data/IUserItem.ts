export default interface IUserItem {
    id: string;
    displayName: string;
    mail: string;
    initials: string;
    jobTitle?: string;
    officeLocation?: string;
    impostor?: boolean;
    voted?: boolean;
    blocked?: boolean;
  }