import styled from 'styled-components' 
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Friend from '../components/Friend'

import {ReactComponent as SvgSearch} from '../svg/search.svg'
import {ReactComponent as SvgFile} from '../svg/file.svg'
import {ReactComponent as SvgAddFriend} from '../svg/addFriend.svg'
import {ReactComponent as SvgMessageCopy} from '../svg/message_copy.svg'

import { addFriend, getFriendList } from "../firebase/firestore"
import { signOut,getCurrentUser } from "../firebase/auth"
import { useEffect, useState } from 'react'
import {TFriendList} from '../type/interface'


function Home() {
  const svgProp = {width:28,height:28,fill:dark,style:{padding:10,margin:10}}
  const user = getCurrentUser()
  const [isCopy,setIsCopy] = useState(false)
  const [friendList,setFriendList] = useState<TFriendList>(null)
  const [isAddFriend,setIsAddFriend] = useState(false)
  const [addFriendText,setAddFriendText] = useState('')

  useEffect(()=>{
    if(friendList === null) getFriendList().then((result)=>{setFriendList(result)})
  },[friendList])
  
  return (
    <Container>
      <Profile onClick={()=>{signOut()}} alt='profile' src={user?.img} />
      <Title>{user?.name}</Title>
      <CopyToClipboard text={user?.uid || ""}>
        <UserId onClick={()=>{
          setIsCopy(true);
          setTimeout(()=>{
            setIsCopy(false);
          },1000)
        }}>{user?.uid}</UserId>
      </CopyToClipboard>
      <div><SvgMessageCopy style={{display:isCopy?'flex':'none',position:'absolute',marginLeft:-48}} /></div>
      <div>
        <SvgSearch {...svgProp} />
        <SvgAddFriend onClick={()=>{
          if(addFriendText === ''){
            setIsAddFriend(!isAddFriend)
          }else if(addFriendText !== '' && isAddFriend){
            addFriend(addFriendText)
            setAddFriendText('')
          }
        }} {...svgProp} />
        <SvgFile {...svgProp} />
      </div>
      {
        isAddFriend &&
        <AddFriendContainer>
          <AddFriendInput value={addFriendText} onChange={(e)=>{setAddFriendText(e.target.value)}} placeholder='친구 ID 입력' type="text"></AddFriendInput>
        </AddFriendContainer>
      }
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

const bright = '#F5F5F5';
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
  border-radius: 1000px;
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
const AddFriendContainer = styled.div`
  width:100%;
  display:flex;
  align-items: center;
  justify-content: center;
`
const AddFriendInput = styled.input`
  padding: 12px;
  padding-left: 16px;
  padding-right: 16px;
  width:35vw;
  font-size: 14px;
  background-color: ${dark};
  color:${bright};
  border-radius: 8px;
  margin: 8px;
  margin-top: 4px;
`

export default Home
