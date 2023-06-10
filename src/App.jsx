import { useState } from 'react'
import { AppContextContainer, AppContext } from './Context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// guest components
import Login from './Guest/login'
import Register from './Guest/register';
//user components
import Details from './User/Details';
import Create from './User/Create';
import HomePage from './User/HomePage';
import EditPost from './User/EditPost';
import SinglePost from './User/SinglePost';
import LostUser from './LostUser';
import UserPage from './User/UserPage';
import TokenVerify from './TokenVerify';
function App() {
  return (<AppContext>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/:msg' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/tokenverify/:currentToken' element={<TokenVerify />} />


        <Route path="/home" element={<HomePage />} />
        <Route path="/changeDetails" element={<Details />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/create" element={<Create />} />

        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="*" element={<LostUser />} />
      </Routes>
    </Router>
  </AppContext>);
}

export default App
  // <Route path="*" element={<LostUser />} />
