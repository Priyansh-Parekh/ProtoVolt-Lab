import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';

// components
import Navbar from './components/navbar';
import Loading from './helper/Loading'; // Correct path to your helper file
import Workspace from './components/workspace';

// pages
import Home from './pages/home';
import WorkspacePage from './pages/WorkspacePage';
import Classroom from './pages/classroom';
import ClassroomClass from './pages/classroomClass';
import ClassMembers from './pages/classMembers';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';

// We create a wrapper component to ensure Navbar is always present and only content changes
const MainContent = () => {
  // useLocation is required here to pass to the Routes component and trigger the animation wrapper
  const location = useLocation(); 

  return (
    <>
      {/* Navbar stays fixed outside the animation logic */}
      <Navbar /> 
      
      {/* The PageTransitionWrapper handles the smooth exit and entry animation for all content */}
      <Loading> 
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/classroom/class/:id" element={<ClassroomClass />} />
          <Route path="/classroom/class/:id/members" element={<ClassMembers />} />
          <Route path="/workspace/new" element={<Workspace />} />
          <Route path="/workspace/:projectId" element={<Workspace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Loading>
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