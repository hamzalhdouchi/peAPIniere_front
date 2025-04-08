import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Auth/Login';
import Home from './plant/home';
import EmployeeDashboard from './dachbord/dachbordEmployee';
import './index.css';

function App()
{
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/EmployeeDashboard" element={<EmployeeDashboard />}/>
      </Routes>
    </Router>
  )
}

export default App;
