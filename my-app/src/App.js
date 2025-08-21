import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Success from './Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;