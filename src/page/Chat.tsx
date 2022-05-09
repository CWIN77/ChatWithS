import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router';
import styled from 'styled-components'
import { getCurrentUser } from '../firebase/auth';
import { addChat, chatListener } from "../firebase/firestore"
import { IChat } from '../type/interface'
import {ReactComponent as SvgBackBtn} from '../svg/backBtn.svg'
import {ReactComponent as SvgSendBtn} from '../svg/sendBtn.svg'
import { Link } from 'react-router-dom';
import firebase from "../firebase/config";
const db = firebase.firestore();

function Chat() {
  const {id} = useParams();
  const [data,setData] = useState<IChat[] | null | "noData">(null)
  const me = getCurrentUser()
  const opp = JSON.parse(sessionStorage.getItem("opp") || JSON.stringify(null))
  const backIcon = {fill:"#474747",style:{padding:8,margin:6,marginLeft:12},width:32,height:32}
  const sendIcon = {fill:"#F5F5F5",width:26,height:26}
  const [sendMsgText,setSendMsgText] = useState('')
  const chatListRef:any = useRef(null)

  useEffect(()=>{
    if( id !== undefined && data === null ) chatListener(id,setData);
  },[])

  useEffect(()=>{
    if(data && window.scrollY < chatListRef.current.clientHeight) window.scrollTo(0,chatListRef.current.scrollHeight)
  },[data])

  return (
    <Container>
      <Top>
        <Link style={{display:'flex'}} to={"/"}><SvgBackBtn {...backIcon} /></Link>
        <div style={{marginRight:18}}>
          <TopProfile src={me?.img} />
          <TopProfile src={opp?.img} />
        </div>
      </Top>
      <span ref={chatListRef} style={{paddingTop:70,paddingBottom:75,width:'100%',minHeight:"calc(100% - 145px)"}}>
        {
          data === null
          ? (
            <>
              {/* <Chatting style={{justifyContent:'flex-end',opacity:0.7}}>
                <Message>ㅤㅤㅤㅤㅤㅤㅤ</Message>
                <ThumbnailProfile/>
              </Chatting>
              <Chatting style={{justifyContent:'flex-start',opacity:0.7}}>
                <ThumbnailProfile/>
                <Message>ㅤㅤㅤㅤㅤㅤㅤ</Message>
              </Chatting>
              <Chatting style={{justifyContent:'flex-end',opacity:0.7}}>
                <Message>ㅤㅤㅤㅤㅤㅤㅤ</Message>
                <ThumbnailProfile/>
              </Chatting>
              <Chatting style={{justifyContent:'flex-start',opacity:0.7}}>
                <ThumbnailProfile/>
                <Message>ㅤㅤㅤㅤㅤㅤㅤ</Message>
              </Chatting> */}
            </>
          )
          : data !== "noData" &&
            data && data.map((data,key)=>{
              return (
                <Chatting style={{justifyContent:data.uid === me?.uid ? 'flex-end' : 'flex-start'}} key={key}>
                  {
                    data.uid === me?.uid
                    ? (
                      <>
                        <Message>{data.msg}</Message>
                        <MsgProfile src={me?.img} />
                      </>
                    )
                    : (
                      <>
                        <MsgProfile src={opp?.img} />
                        <Message>{data.msg}</Message>
                      </>
                    )
                  }
                </Chatting>
              )
            })
        }
      </span>
      <SendMsg>
        <SendMsgInput placeholder='메세지를 보내보세요!' value={sendMsgText}
        onChange={(e)=>{
          setSendMsgText(e.target.value)
        }}
        onKeyUp={(e)=>{
          if(e.key === 'Enter'){
            if(sendMsgText !== '' && id !== undefined && me?.uid !== undefined){
              addChat(id,sendMsgText,me?.uid)
              setSendMsgText('')
            }
          }
        }}
        />
        <SendMsgBtn>
          <SvgSendBtn {...sendIcon} onClick={()=>{
            if(sendMsgText !== '' && id !== undefined && me?.uid !== undefined){
              addChat(id,sendMsgText,me?.uid)
              setSendMsgText('')
            }
          }} />
        </SendMsgBtn>
      </SendMsg>
    </Container>
  )
}

const bright = '#F5F5F5';
const dark = '#474747';

const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  width:100%;
  min-height:100%;
` 
const Top = styled.nav`
  position: fixed;
  background-color:${bright};
  display:flex;
  z-index: 2;
  width:100%;
  height:auto;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1.5px solid rgba(0,0,0,0.2);
`
const TopProfile = styled.img`
  border-radius: 100px;
  width:36px;
  height:36px;
  padding:6px;
  margin:6px;
  margin-left: 8px;
  margin-right:2px;
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
`
const MsgProfile = styled.img`
  border-radius: 100px;
  width:42px;
  height:42px;
  padding:6px;
  margin:2px;
  margin-left: 8px;
  margin-right: 8px;
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
`
const ThumbnailProfile = styled.div`
  border-radius: 100px;
  width:42px;
  height:42px;
  margin:14px;
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: #888888;
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
`
const Chatting = styled.div`
  width:100%;
  display:flex;
  align-items: center;
  margin-top: 1px;
  margin-bottom: 1px;
`
const Message = styled.h4`
  word-break:break-all;
  background-color: ${dark};
  color:${bright};
  padding:12px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 8px;
  max-width: 50vw;
`
const SendMsg = styled.div`
  width:calc(100% - 36px);
  display:flex;
  justify-content: center;
  position:fixed;
  bottom:0px;
  padding: 18px;
  padding-top: 2px;
  border: none;
  background-color: ${bright};
`
const SendMsgInput = styled.input`
  background-color:#474747;
  color:#F5F5F5;
  font-size: 16px;
  width:100%;
  padding:10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 12px 0px 0px 12px;
`
const SendMsgBtn = styled.button`
  padding:10px;
  padding-left: 12px;
  padding-right: 12px;
  background-color:#636363;
  border-radius: 0px 12px 12px 0px;
`

export default Chat
