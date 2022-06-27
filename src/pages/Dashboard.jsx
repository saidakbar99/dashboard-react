import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import {routes} from '../routes/routes'


export default function Dashboard() {

    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to='/dashboard' replace />} />

                    {
                        routes.map(({path, element}, idx) => {
                            return <Route key={idx} path={path} element={element} />
                        })
                    }

                </Routes>
            </BrowserRouter>
        </div>
    )
}