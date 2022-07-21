import React from 'react'
import useToken from "./hooks/useToken";

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

function App() {
  const {token, setToken} = useToken()

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
      <div id="App">
        <Sidebar />
        <Topbar />
        <Dashboard />
      </div>
  );
}

export default App;
