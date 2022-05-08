import styled from 'styled-components' 
import { Routes,Route } from 'react-router-dom'
import Home from './page/FriendList'
import Chat from './page/Chat'
import { signIn,getCurrentUser, signOut } from "./firebase/auth"

function Router() {
  const user = getCurrentUser()
  return (
    <Container>
      {
        user
        ? <Routes>
            <Route path="/chat/:id" element={<Chat/>} />
            <Route path="/" element={<Home/>} />
          </Routes>
        : (<><h2 onClick={()=>{signIn()}}>로그인</h2><h2 onClick={()=>{signOut()}}>로그아웃</h2></>)
      }
    </Container>
  )
}

const Container = styled.div`
  display:flex;
  width:100%;
  min-height:100%;
`

export default Router