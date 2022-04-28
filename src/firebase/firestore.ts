import firebase from "./config";
import { getCurrentUser } from "./auth";
import { getRandomUid } from "./function";
import moment from "moment";

import {IFriend,TFriendList,IProfile,IChat} from '../type/interface'

const db = firebase.firestore();

export const getFriendList = async():Promise<TFriendList> => {
  const user = getCurrentUser();
  const query = db.collection('list').where("users", "array-contains", user?.friendId).get();
  const result = await query.then((docs)=>{
    const data:IFriend[] = [];
    docs.forEach((doc:any)=>{
      const friend:string = doc.data().users.filter((filterData:string)=>filterData !== user?.uid)[0];
      const id:string = doc.id;
      data.push({friend,id})
    })
    if(data.length !== 0) return data
    return []
  }).catch((err)=>{
    alert('에러 발생\n' + err)
  })
  return result || []
}

export const getProfile = async(friendId:string) => {
  const query = db.collection('user').doc(friendId).get();
  const profileStorge:IProfile[] | [] = JSON.parse(sessionStorage.getItem('profile')||JSON.stringify([]))
  const result = await query.then((doc:any)=>{
    const name:string = doc.id.split('@')[0]
    const img:string = doc.data().img
    const friendId:string = doc.id
    const data:IProfile = {name,img,friendId}
    sessionStorage.setItem('profile',JSON.stringify([...profileStorge,data]))
    // TODO: 기존 값이 있으면 스토리지에 추가 말고 기존값을 반환
    return data
  }).catch((err)=>{
    alert('에러 발생\n' + err)
  })
  return result || null
}


export const getChat = async(id:string) => {
  const query = db.collection("list").doc(id).collection('chat').orderBy("date", "desc").get()
  const result = await query.then((docs)=>{
    const dataArray:IChat[] = []
    docs.forEach((doc:any)=>{
      dataArray.push(doc.data())
      // TODO: friendId로 profileStorage에서 데이터를 가져와서 병합
    })
    return dataArray
  }).catch((err)=>{
    alert('에러 발생\n' + err)
  })
  return result || null
}


export const addChat = async(id:string,chat:string,name:string) => {
  const query = db.collection("list").doc(id).collection('chat').doc(getRandomUid()).set({chat,date:String(moment().format('YYMMDDHHmmssmsms'))})
  query.then(()=>{
    console.log("추가 성공")
  }).catch((err:any)=>{
    console.log(err)
  })
}