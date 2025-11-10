import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Flip, ToastContainer } from 'react-toastify';

// components
import Navbar from './components/navbar';
import Loading from './helper/Loading'; 
import Workspace from './components/workspace';

// importing utils
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
import PasswordChange from './pages/passwordChange.jsx';
import CreateClassroom from './pages/createClassroom.jsx';
import CreateAssignment from './pages/createAssignment.jsx';
import Footer from './components/Footer.jsx';
import Unauthorized from './pages/unathorized.jsx';
import ErrorPage from './pages/errorPage.jsx';
import SpecificAssignment from './pages/specificAssignment.jsx';
import AboutUs from './pages/aboutUs.jsx';
import Dashboard from './pages/Dashboard.jsx';

const MainContent = () => {
  const location = useLocation();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user/data/getUser');
        if (res.data.success) setUser(res.data.user);
        else setUser(null);
      } catch (error) {
        console.error("API error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
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
      <Loading>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Auth Routes */}
          <Route path="/user/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/user/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/user/passwordChange" element={user ? <Navigate to="/" /> : <PasswordChange />} />
          <Route path="/user/otpVerification" element={user ? <Navigate to="/" /> : <OtpVerification />} />

          {/* Protected Routes */}
          <Route path="/workspace/:projectId" element={user ? <Workspace /> : <Navigate to="/user/login" />} />
          <Route path="/classroom" element={user ? <Classroom user={user} /> : <Navigate to="/user/login" />} />
          <Route path="/classroom/class" element={user ? <SpecificClass user={user} /> : <Navigate to="/user/login" />} />
          <Route path="/classroom/class/:id/members" element={user ? <ClassMembers /> : <Navigate to="/user/login" />} />
          <Route
            path="/classroom/:classroomId/assignment/:assignmentId"
            element={user ? <SpecificAssignment user={user} /> : <Navigate to="/user/login" />}
          />
          <Route
            path="/classroom/:classroomId/assignment/:assignmentId/:subtabId/:projectId"
            element={user ? <Workspace /> : <Navigate to="/user/login" />}
          />

          {/* Professor-only */}
          <Route path="/classroom/createClassroom" element={user?.role === 'professor' ? <CreateClassroom /> : <Unauthorized />} />
          <Route path="/classroom/createAssignment" element={user?.role === 'professor' ? <CreateAssignment /> : <Unauthorized />} />

          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/user/login" />} />


          {/* Error routes */}
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
    <div className="App">
      <MainContent />
    </div>
  );
}

export default App;
