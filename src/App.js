import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import useToken from "./useToken";

function App() {
  const {token, setToken} = useToken()

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard token={token}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
