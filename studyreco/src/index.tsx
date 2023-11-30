import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './tsx/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './tsx/Login';
import Profile from './tsx/Profile';
import Edit_Profile from './tsx/Edit_Profile';
import Register from './tsx/Register';
import SubjectAdd from './tsx/SubjectAdd';
import SaveRecords from './tsx/SaveRecords';
import Ranking from './tsx/Ranking';
import StudyRooms from './tsx/StudyRooms';
import Contact from './tsx/Contact';
import Edit_Email from './tsx/Edit_Email';
import Edit_Password from './tsx/Edit_Password';
import Edit_Name from './tsx/Edit_Name';
import Edit_Account from './tsx/Edit_Account';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Edit_Profile" element={<Edit_Profile />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/SubjectAdd" element={<SubjectAdd />} />
      <Route path="/SaveRecords" element={<SaveRecords />} />
      <Route path="/Ranking" element={<Ranking />} />
      <Route path="/StudyRooms" element={<StudyRooms />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Edit_Account" element={<Edit_Account />} />
      <Route path="/Edit_Email" element={<Edit_Email />} />
      <Route path="/Edit_Password" element={<Edit_Password />} />
      <Route path="/Edit_Name" element={<Edit_Name />} />
    </Routes>
    </BrowserRouter>
   
  </React.StrictMode>
);

