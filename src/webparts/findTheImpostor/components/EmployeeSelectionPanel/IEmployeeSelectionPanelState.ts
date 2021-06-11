import IUserItem from "data/IUserItem";

export interface IEmployeeSelectionPanelState {
  members: Array<IUserItem>;
  remainingImpostors: number;
  attempts: number;
}
