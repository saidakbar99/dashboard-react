import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from 'react'


import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [ token, setToken ] = useState()

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
