import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Flip, ToastContainer } from 'react-toastify';

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
import Unauthorized from './pages/unathorized.jsx';
import ErrorPage from './pages/errorPage.jsx';

// We create a wrapper component to ensure Navbar is always present and only content changes
const MainContent = () => {
  // useLocation is required here to pass to the Routes component and trigger the animation wrapper
  const location = useLocation();

  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true); // loading state while fetching user

  // fetch user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user/data/getUser');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("API error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // show loading spinner/page while fetching user
  if (loading) return <Loading />;

  return (
    <>
      {/* Navbar stays fixed outside the animation logic */}
      <Navbar user={user} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
      />
      {/* The PageTransitionWrapper handles the smooth exit and entry animation for all content */}
      <Loading>
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<WorkspacePage />} />

          {/* Public-Only Routes (Redirect if logged in) */}
          <Route path="/user/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/user/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/user/passwordChange" element={user ? <Navigate to="/" /> : <PasswordChange />} />
          <Route path="/user/otpVerification" element={user ? <Navigate to="/" /> : <OtpVerification />} />

          {/* Protected Routes (Require Login) */}
          <Route path="/workspace/:projectId" element={user ? <Workspace /> : <Navigate to="/user/login" />} />

          <Route path="/classroom" element={user ? <Classroom user={user} /> : <Navigate to="/user/login" />} />
          <Route path="/classroom/class" element={user ? <SpecificClass user={user} /> : <Navigate to="/user/login" />} />
          <Route path="/classroom/class/:id/members" element={user ? <ClassMembers /> : <Navigate to="/user/login" />} />

          {/* Professor-Only Routes */}
          <Route path="/classroom/createClassroom" element={user?.role === 'professor' ? <CreateClassroom /> : <Unauthorized />} />
          <Route path="/classroom/createAssignment" element={user?.role === 'professor' ? <CreateAssignment /> : <Unauthorized />} />

          {/* Error Routes */}
          <Route path="/error/unathorizedAscess" element={<Unauthorized />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Loading>
      <Footer />
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

