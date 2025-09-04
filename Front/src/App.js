
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './component/Header';

function App() {
  return (
   <>
   <Router>
    <Routes>
      <Router path="/" element={<Home />} ></Router>
      <Router path="/header" element={<Header />} ></Router>

    </Routes>

   </Router>
   </>
  );
}

export default App;
