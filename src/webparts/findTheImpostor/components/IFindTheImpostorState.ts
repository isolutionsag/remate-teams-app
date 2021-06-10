import IGroupItem from "data/IGroupItem";

export interface IFindTheImpostorState {
  loaded: boolean;
  groups: Array<IGroupItem>;
}
