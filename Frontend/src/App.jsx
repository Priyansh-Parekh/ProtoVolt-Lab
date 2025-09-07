// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import Navbar from './components/navbar';
import Workspace from './components/workspace'; // Your existing canvas component

// pages
import Home from './pages/home';
import WorkspacePage from './pages/WorkspacePage';
import Classroom from './pages/classroom';
import ClassroomClass from './pages/classroomClass.jsx';
import ClassMembers from './pages/classMembers.jsx';

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/classroom/class/:id" element={<ClassroomClass />} />
          <Route path="/classroom/class/:id/members" element={<ClassMembers />} />
          <Route path="/workspace/new" element={<Workspace />} />
          <Route path="/workspace/:projectId" element={<Workspace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;