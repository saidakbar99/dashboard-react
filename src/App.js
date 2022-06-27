import useToken from "./useToken";
import { Container, Col, Row } from "react-bootstrap";

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
    <div className="p-2">
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10}>
            <div className="">
              <Topbar token={token} />
              <div className="mt-[50px] p-4">
                <Dashboard />
              </div>
            </div>
          </Col>
        </Row>
    </div>
  );
}

export default App;
