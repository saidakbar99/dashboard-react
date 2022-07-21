import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import DocumentsIn from '../components/Dashboard/DocumentIn/DocumentsIn' 
import Create from '../components/Dashboard/DocumentIn/Create'
import Preview from '../components/Dashboard/DocumentIn/Preview'
import Main from "../components/Dashboard/Main";
import Nomenclature from "../components/Dashboard/Nomenclature";

export default function Dashboard() {
    return(
        <div className="main-container">
                <Routes>
                    <Route path="*" element={<Navigate to='/dashboard' replace />} />
                    <Route path='dashboard' element={<Main />} />
                    <Route path='nomenclature' element={<Nomenclature />} />
                    <Route path='documents-in' element={<DocumentsIn />} />
                    <Route path='documents-in/create' element={<Create />} />
                    <Route path='documents-in/preview/:id' element={<Preview />} />
                </Routes>
        </div>
    )
}