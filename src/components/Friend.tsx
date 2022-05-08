import styled from 'styled-components' 

import {ReactComponent as SvgCircle} from '../svg/circle.svg'
import { getProfile } from "../firebase/firestore"
import { IFriend, IProfile } from '../type/interface'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

function Friend({friend}:{friend:IFriend}) {
  const svgProp = {width:20,height:20,fill:bright,style:{padding:4,margin:4}}
  const [data,setData] = useState<IProfile | null>(null)
  useEffect(()=>{
    if(data === null) getProfile(friend.uid).then((result)=>{setData(result)})
    console.log(data)
  },[data, friend])

  return (
    <Container>
      <div>
        <Profile alt='profile' src={data?.img} />
        <Name onClick={()=>{
          sessionStorage.setItem("opp",JSON.stringify(data))
        }} to={`/chat/${friend?.chatId}`}>{data?.name}</Name>
      </div>
      <SvgCircle {...svgProp} />
    </Container>
  )
}

const bright = '#F5F5F5';
const dark = '#474747';

const Container = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${dark};
  box-shadow: 0px 4px 16px 4px rgba(0,0,0,0.25);
  border-radius: 12px;
  padding: 12px;
  padding-left: 14px;
  padding-right: 14px;
  width:80%;
  margin-top: 16px;
  margin-bottom: 16px;
  max-width:450px;
`
const Profile = styled.img`
  width:36px;
  height:36px;
  border-radius: 12px;
`
const Name = styled(Link)`
  font-size: 18px;
  color:${bright};
  display:flex;
  justify-content: center;
  align-items:center;
  padding-left:10px;
  padding-right:10px;
`

export default Friend
