import IGroupItem from "data/IGroupItem";

export interface IFindTheImpostorState {
  impostorsCount?: number;
  selectedGroup?: IGroupItem;
  groups: Array<IGroupItem>;
}
