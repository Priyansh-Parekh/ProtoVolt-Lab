// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         hello
//       </div>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Workspace from './components/workspace'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/workspace" element={<Workspace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;