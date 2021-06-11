import IUserItem from "./IUserItem";

export default interface IResult {
    employee: IUserItem;
    //selectedDisplayName?: string;
    selectedEmployee?: IUserItem;
    valid: boolean;
    completed: boolean;
  }