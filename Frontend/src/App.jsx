// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import Navbar from './components/navbar';
import Workspace from './components/workspace'; // Your existing canvas component

// pages
import Home from './pages/home';
import WorkspacePage from './pages/WorkspacePage';
import Classroom from './pages/classroom';

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/classroom" element={<Classroom />} />
          {/* A dedicated route for creating a new circuit */}
          <Route path="/workspace/new" element={<Workspace />} />
          {/* A dynamic route for opening existing projects */}
          <Route path="/workspace/:projectId" element={<Workspace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;