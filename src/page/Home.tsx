import styled from 'styled-components' 
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Friend from '../components/Friend'

import {ReactComponent as SvgSearch} from '../svg/search.svg'
import {ReactComponent as SvgFile} from '../svg/file.svg'
import {ReactComponent as SvgAddFriend} from '../svg/addFriend.svg'
import {ReactComponent as SvgMessageCopy} from '../svg/message_copy.svg'

import { getFriendList } from "../firebase/firestore"
import { signOut,getCurrentUser } from "../firebase/auth"
import { useEffect, useState } from 'react'
import {TFriendList} from '../type/interface'

// const bright = '#F5F5F5';
const dark = '#474747';


const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  width:100%;
  min-height:100%;
` 
const Profile = styled.img`
  width:78px;
  height:78px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
  margin: 2rem;
  margin-bottom: 1.25rem;
`
const Title = styled.h1`
  font-size: 32px;
  color:${dark};
`
const UserId = styled.h3`
  font-size: 16px;
  color:${dark};
  opacity: 0.6;
  margin-bottom: 8px;
  padding: 2px;
  cursor: pointer;
`

function Home() {
  const svgProp = {width:28,height:28,fill:dark,style:{padding:10,margin:10}}
  const user = getCurrentUser()
  const [isCopy,setIsCopy] = useState(false)
  const [friendList,setFriendList] = useState<TFriendList>(null)

  useEffect(()=>{
    if(friendList === null) getFriendList().then((result)=>{setFriendList(result)})
  },[friendList])
  
  return (
    <Container>
      <Profile onClick={()=>{signOut()}} alt='profile' src={user?.img} />
      <Title>{user?.name}</Title>
      <CopyToClipboard text={user?.friendId || "No Data"}>
        <UserId onClick={()=>{
          setIsCopy(true);
          setTimeout(()=>{
            setIsCopy(false);
          },1000)
        }}>{user?.friendId}</UserId>
      </CopyToClipboard>
      <div><SvgMessageCopy style={{display:isCopy?'flex':'none',position:'absolute',marginLeft:-48}} /></div>
      <div>
        <SvgSearch {...svgProp} />
        <SvgAddFriend {...svgProp} />
        <SvgFile {...svgProp} />
      </div>
      {
        friendList !== []
        ? friendList?.map((friend,key)=>{
          return <Friend key={key} friend={friend} />
        })
        : friendList === [] &&
        <div>친구가 없음</div>
      }
    </Container>
  )
}

export default Home
