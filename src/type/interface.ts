export interface IFriend {
  readonly friend:string;
  readonly id:string;
}

export type TFriendList = IFriend[] | null | []

export interface IProfile {
  readonly name:string;
  readonly img:string;
  readonly uid?:string;
  readonly friendId:string;
}

export interface IChat {
  readonly chat:string;
  readonly date:number;
  readonly friendId:string;
}

