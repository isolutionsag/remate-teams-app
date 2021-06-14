import IUserItem from "./IUserItem";

export default interface IRankingItem {
  rankedPoints: number;
  rankedGames: number;
  user?: IUserItem;
  position?: number;
}