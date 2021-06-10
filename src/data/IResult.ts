import IUserItem from "./IUserItem";

export default interface IResult {
    employee: IUserItem;
    selectedDisplayName?: string;
    valid: boolean;
  }