import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// components
import Workspace from './components/workspace';
import Navbar from './components/navbar';

// pages
import Home from './pages/home';
import Classroom from './pages/classroom';

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/classroom" element={<Classroom />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;