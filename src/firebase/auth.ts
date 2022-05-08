import firebase from "./config";
import {IProfile} from '../type/interface'

const db = firebase.firestore();

export const getCurrentUser = ():IProfile | null => {
  const user = firebase.auth().currentUser;
  if (user !== null && user !== undefined) {
    const name = user.displayName;
    const img = user.photoURL;
    const uid = user.uid.substr(0, 8);
    if(name !== null && img !== null){
      return { name,img,uid }
    }
    return null
  }else{
    const user = JSON.parse(localStorage.getItem('user') || JSON.stringify(''))
    if(user && user !== '') return user
    return null
  }  
}

export const signIn = () => {
  const user = getCurrentUser();
  if(!user){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL) // 로그인 유지
      .then(() => {
        var provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
      }).catch(() => alert('로그인 실패'))
      .then(({user}:any):void => {
        const name:string = user.displayName;
        const img:string = user.photoURL;
        const uid:string = user.uid.substr(0, 8);
        db.collection('user').doc(uid).set({name,img}).then(()=>{
          localStorage.setItem('user',JSON.stringify({img,name,uid}));
          alert('로그인 성공!');
          window.location.reload();
        }).catch(()=>{alert('사용자 정보 저장 실패')});
      }).catch(() => {alert('사용자 정보 저장 실패')});
  }else alert('이미 로그인 했습니다.')
}

export const signOut = () => {
  const user = getCurrentUser();
  if(user){
    if(window.confirm('로그아웃 하겠습니까?')){
      firebase.auth().signOut().then(() => {
        localStorage.removeItem('user')
        alert('로그아웃완료');
        window.location.reload();
      }).catch(() => {alert('로그아웃 실패')});
    }
  }else alert('로그인되어 있지 않습니다.');
}