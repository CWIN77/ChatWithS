import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import styled from 'styled-components'
import { getChat } from "../firebase/firestore"
import { IChat } from '../type/interface'

const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  width:100%;
  min-height:100%;
` 
function Chat() {
  const {id} = useParams();
  const [data,setData] = useState<IChat[] | null>()
  useEffect(()=>{
    if( id !== undefined ) getChat(id).then((result)=>{setData(result)})
  },[])

  useEffect(()=>{
    console.log(data)
  },[data])
  return (
    <Container>
      {
        data === null 
        ? <div>error</div>
        : data && data.map((data,key)=>{
          return <div key={key}>{data.chat}</div>
        })
      }
    </Container>
  )
}

export default Chat
