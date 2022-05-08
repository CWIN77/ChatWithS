import firebase from "./config";
import { getCurrentUser } from "./auth";
import { getRandomUid } from "./function";
import moment from "moment";

import {IFriend,TFriendList,IProfile,IChat} from '../type/interface'

const db = firebase.firestore();

export const getFriendList = async():Promise<TFriendList> => {
  const user = getCurrentUser();
  const query = db.collection('list').where("users", "array-contains", user?.uid).get();
  const result = await query.then((docs)=>{
    const data:IFriend[] = [];
    docs.forEach((doc:any)=>{
      const uid:string = doc.data().users.filter((filterData:string)=>filterData !== user?.uid)[0];
      const chatId:string = doc.id;
      data.push({uid,chatId})
    })
    if(data.length !== 0) return data
    return []
  }).catch((err)=>{
    alert('에러 발생\n' + err)
  })
  return result || []
}

export const getProfile = async(uid:string):Promise<IProfile | null> => {
  const query = db.collection('user').doc(uid).get();
  const profileStorge:IProfile[] | [] = JSON.parse(sessionStorage.getItem('profile')||JSON.stringify([]))
  let isSetStorage:boolean|IProfile = false
  profileStorge.forEach((data)=>{
    if(data.uid === uid){
      isSetStorage = {...data}
    }
  })
  if(!isSetStorage){
    const result = await query.then((doc:any)=>{
      const name:string = doc.data().name
      const img:string = doc.data().img
      const uid:string = doc.id
      const data:IProfile = {name,img,uid}
      sessionStorage.setItem('profile',JSON.stringify([...profileStorge,data]))
      return data
    }).catch((err)=>{
      alert('에러 발생\n' + err)
    })
    return result || null
  }
  return isSetStorage || null
}


export const getChat = async(id:string):Promise<IChat[] | "noData" | null> => {
  const query = db.collection("list").doc(id).collection('chat').orderBy("date", "desc").limit(300).get()
  const result = await query.then((docs)=>{
    const dataArray:IChat[] = []
    docs.forEach((doc:any)=>{
      dataArray.unshift(doc.data())
    })
    if ( dataArray.length > 0 ) return dataArray
    return "noData"
  }).catch((err)=>{
    alert('에러 발생\n' + err)
    return null
  })
  return result || null
}


export const addChat = async(chatId:string,msg:string,uid:string) => {
  const query = db.collection("list").doc(chatId).collection('chat').doc(getRandomUid()).set({msg,uid,date:String(moment().format('YYMMDDHHmmss'))})
  query.then(()=>{
    console.log("추가 성공")
  }).catch((err:any)=>{
    console.log(err)
  })
}