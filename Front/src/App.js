
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './component/Header';

function App() {
  return (
   <>
   <Router>
    <Routes>
      <Route path="/" element={<Home />} ></Route>
      <Route path="/header" element={<Header />} ></Route>

    </Routes>

   </Router>
   </>
  );
}

export default App;
