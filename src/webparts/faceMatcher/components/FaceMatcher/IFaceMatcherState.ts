import IResult from "data/IResult";
import IUserItem from "data/IUserItem";

export interface IFaceMatcherState {
    loading: boolean;
    assignedEmployees: string[];
    completed: boolean;
    validated: boolean;
    results: Array<IResult>;
    shuffledUsers: Array<IUserItem>;
    attempts: number;
    showDialog: boolean;
  }