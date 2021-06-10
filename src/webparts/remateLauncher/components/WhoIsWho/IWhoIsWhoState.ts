import IResult from "data/IResult";
import IUserItem from "data/IUserItem";

export interface IWhoIsWhoState {
    loading: boolean;
    employees: Array<IUserItem>;
    assignedEmployees: string[];
    completed: boolean;
    validated: boolean;
    results: Array<IResult>;
    shuffledNames: Array<IUserItem>;
    attempts: number;
    showDialog: boolean;
  }