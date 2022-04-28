import styled from 'styled-components' 
import { Routes,Route } from 'react-router-dom'
import Home from './page/Home'
import Chat from './page/Chat'
import { signIn,getCurrentUser } from "./firebase/auth"
const Container = styled.div`
  width:100%;
  height:100%;
`

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
        : <h2 onClick={()=>{signIn()}}>로그인</h2>
      }
    </Container>
  )
}

export default Router
