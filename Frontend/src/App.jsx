import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// components
import Navbar from './components/navbar';
import Loading from './helper/Loading'; // Correct path to your helper file
import Workspace from './components/workspace';

//importing utils
import api from './utils/axios.js';

// pages
import Home from './pages/home';
import WorkspacePage from './pages/WorkspacePage';
import Classroom from './pages/classroom';
import SpecificClass from './pages/specificClass.jsx';
import ClassMembers from './pages/classMembers';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import OtpVerification from './pages/otpVerification.jsx';
import PasswordChange from './pages/PasswordChange.jsx';
import CreateClassroom from './pages/createClassroom.jsx';
import CreateAssignment from './pages/createAssignment.jsx';
import Footer from './components/Footer.jsx';

// We create a wrapper component to ensure Navbar is always present and only content changes
const MainContent = () => {
  // useLocation is required here to pass to the Routes component and trigger the animation wrapper
  const location = useLocation(); 

  const [user, setUser] = useState();


  // fetching data of user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user/data/getUser');
        if (res.data.success) {
          setUser(res.data.user); 
        } else {
          setUser(undefined); 
        }
        
    {console.log(user)}
      } catch (error) {
        console.error("API error:", error);
        setUser(undefined);
      }
    }

    fetchData();
  }, []); // runs once when component mounts

  return (
    <>
      {/* Navbar stays fixed outside the animation logic */}
      <Navbar user ={user} /> 
      
      {/* The PageTransitionWrapper handles the smooth exit and entry animation for all content */}
      <Loading> 
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/classroom/create" element={<CreateClassroom />} />
          <Route path="/classroom/createAssignment" element={<CreateAssignment />} />
          <Route path="/classroom/class/:id" element={<SpecificClass />} />
          <Route path="/classroom/class/:id/members" element={<ClassMembers />} />
          <Route path="/workspace/new" element={<Workspace />} />
          <Route path="/workspace/:projectId" element={<Workspace />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route path="/user/passwordChange" element={<PasswordChange />} />
          <Route path="/user/otpVerification" element={<OtpVerification />} />

        </Routes>
      </Loading>
      <Footer/>
    </>
  );
};


function App() {
  return (
    <Router>
      <div className="App">
        <MainContent />
      </div>
    </Router>
  );
}

export default App;