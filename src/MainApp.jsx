import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AddMeeting } from './components/pages/AddMeeting';
import { Home } from './components/pages/Home';

function MainApp() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} exact></Route>
            <Route path='/add-meeting' element={<AddMeeting/>} exact></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default MainApp