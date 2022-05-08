export interface IFriend {
  readonly uid:string;
  readonly chatId:string;
}

export type TFriendList = IFriend[] | null | []

export interface IProfile {
  readonly name:string;
  readonly img:string;
  readonly uid:string;
}

export interface IChat {
  readonly msg:string;
  readonly date:number;
  readonly uid:string;
}

