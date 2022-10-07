import React, { useState} from 'react'
import {Link,useLocation} from 'react-router-dom'

import logo from '../assets/logo.svg'

export default function Sidebar() {
    let activePage = useLocation().pathname.split('/').slice(1,2)

    const activeTab = JSON.parse(localStorage.getItem('activeTab'))
    const [tab, setTab] = useState(activeTab)

    if(tab === null){
        setTab(0)
    }
    const setActiveTab = (id) => {
        setTab(id)
        localStorage.setItem('activeTab', id)
    }
    
    return(
        <div className="sidebar-container">
            <div className='logo-tabs-position'>
                <Link to='/dashboard' className='logo-wrapper' tabIndex={-1}>
                    <img className='logo' src={logo} alt="logo" />
                </Link>
                <div>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation" onClick={() =>setActiveTab(0)}>
                            <button tabIndex='-1' className={`nav-link ${tab === 0 ? 'active' : ''}`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="m20 8l-6-5.26a3 3 0 0 0-4 0L4 8a3 3 0 0 0-1 2.26V19a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-8.75A3 3 0 0 0 20 8Zm-6 12h-4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1Zm5-1a1 1 0 0 1-1 1h-2v-5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v5H6a1 1 0 0 1-1-1v-8.75a1 1 0 0 1 .34-.75l6-5.25a1 1 0 0 1 1.32 0l6 5.25a1 1 0 0 1 .34.75Z"/>
                                </svg>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation" onClick={() => setActiveTab(1)}>
                            <button tabIndex='-1' className={`nav-link ${tab === 1 ? 'active' : ''}`} id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M21.17 2.06A13.1 13.1 0 0 0 19 1.87a12.94 12.94 0 0 0-7 2.05a12.94 12.94 0 0 0-7-2a13.1 13.1 0 0 0-2.17.19a1 1 0 0 0-.83 1v12a1 1 0 0 0 1.17 1a10.9 10.9 0 0 1 8.25 1.91l.12.07h.11a.91.91 0 0 0 .7 0h.11l.12-.07A10.9 10.9 0 0 1 20.83 16A1 1 0 0 0 22 15V3a1 1 0 0 0-.83-.94ZM11 15.35a12.87 12.87 0 0 0-6-1.48H4v-10a8.69 8.69 0 0 1 1 0a10.86 10.86 0 0 1 6 1.8Zm9-1.44h-1a12.87 12.87 0 0 0-6 1.48V5.67a10.86 10.86 0 0 1 6-1.8a8.69 8.69 0 0 1 1 0Zm1.17 4.15a13.1 13.1 0 0 0-2.17-.19a12.94 12.94 0 0 0-7 2.05a12.94 12.94 0 0 0-7-2.05a13.1 13.1 0 0 0-2.17.19A1 1 0 0 0 2 19.21a1 1 0 0 0 1.17.79a10.9 10.9 0 0 1 8.25 1.91a1 1 0 0 0 1.16 0A10.9 10.9 0 0 1 20.83 20a1 1 0 0 0 1.17-.79a1 1 0 0 0-.83-1.15Z"/>
                                </svg>
                            </button>
                        </li>
                        <li className='nav-item' role="presentation" onClick={() => setActiveTab(0)}>
                            <Link to='/settings' tabIndex={-1}>
                                <button tabIndex={-1} className={`nav-link ${tab === 2 ? 'active' : ''}`} id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                        width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98Zm-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z"/>
                                    </svg>
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="tab-content tab-links-position" id="myTabContent">
                <div 
                    className={`tab-pane fade sidebar-menu ${tab === 0 ? 'show active' : ''}`} 
                    id="home" 
                    role="tabpanel" 
                    aria-labelledby="home-tab"
                >
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className={activePage == 'dashboard' ? 'mm-active' : ''} >
                            <Link className={`sidebar-links ${activePage == 'dashboard' ? 'activee' : ''}`} tabIndex='-1' to="/dashboard">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M21 20h-1V5a1 1 0 0 0-2 0v15h-2V9a1 1 0 0 0-2 0v11h-2v-7a1 1 0 0 0-2 0v7H8v-3a1 1 0 0 0-2 0v3H4V3a1 1 0 0 0-2 0v18a1 1 0 0 0 1 1h18a1 1 0 0 0 0-2Z"/>
                                </svg>
                                <span>Главная</span>
                            </Link>
                        </li>
                        <li className={activePage == 'documents-in' ? 'mm-active' : ''} >
                            <Link className={`sidebar-links ${activePage == 'documents-in' ? 'activee' : ''}`} tabIndex='-1' to="/documents-in">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M11.29 17.3L10 18.59V7a1 1 0 0 0-2 0v11.6l-1.29-1.3a1 1 0 0 0-1.42 0a1 1 0 0 0 0 1.41l3 3a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.41a1 1 0 0 0-1.42 0ZM22 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H4V4h16v4h-7a1 1 0 0 0 0 2h1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9Zm-2 11h-4v-4h4Z"/>
                                </svg>
                                <span>Прием товаров</span>
                            </Link>
                        </li>
                        <li className={activePage == 'nomenclature' ? 'mm-active' : ''} >
                            <Link className={`sidebar-links ${activePage == 'nomenclature' ? 'activee' : ''}`} tabIndex='-1' to="/nomenclature">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3.71 16.29a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21a1 1 0 0 0-.21.33a1 1 0 0 0 .21 1.09a1.15 1.15 0 0 0 .33.21a.94.94 0 0 0 .76 0a1.15 1.15 0 0 0 .33-.21a1 1 0 0 0 .21-1.09a1 1 0 0 0-.21-.33ZM7 8h14a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2Zm-3.29 3.29a1 1 0 0 0-1.09-.21a1.15 1.15 0 0 0-.33.21a1 1 0 0 0-.21.33a.94.94 0 0 0 0 .76a1.15 1.15 0 0 0 .21.33a1.15 1.15 0 0 0 .33.21a.94.94 0 0 0 .76 0a1.15 1.15 0 0 0 .33-.21a1.15 1.15 0 0 0 .21-.33a.94.94 0 0 0 0-.76a1 1 0 0 0-.21-.33ZM21 11H7a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2ZM3.71 6.29a1 1 0 0 0-.33-.21a1 1 0 0 0-1.09.21a1.15 1.15 0 0 0-.21.33a.94.94 0 0 0 0 .76a1.15 1.15 0 0 0 .21.33a1.15 1.15 0 0 0 .33.21a1 1 0 0 0 1.09-.21a1.15 1.15 0 0 0 .21-.33a.94.94 0 0 0 0-.76a1.15 1.15 0 0 0-.21-.33ZM21 16H7a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z"/>
                                </svg>
                                <span>Номенклатура</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/history">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 2a10 10 0 0 0-6.88 2.77V3a1 1 0 0 0-2 0v4.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 0-2h-2.4A8 8 0 1 1 4 12a1 1 0 0 0-2 0A10 10 0 1 0 12 2Zm0 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2h-1V9a1 1 0 0 0-1-1Z"/>
                                </svg>
                                <span>История</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/documents-out">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 5H9.83a3 3 0 0 0-2.12.88l-5.42 5.41a1 1 0 0 0 0 1.42l5.42 5.41a3 3 0 0 0 2.12.88H19a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H9.83a1.05 1.05 0 0 1-.71-.29L4.41 12l4.71-4.71A1.05 1.05 0 0 1 9.83 7H19a1 1 0 0 1 1 1Zm-3.29-6.71a1 1 0 0 0-1.42 0L14 10.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l1.3 1.29l-1.3 1.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l1.29-1.3l1.29 1.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L15.41 12l1.3-1.29a1 1 0 0 0 0-1.42Z"/>
                                </svg>
                                <span>Возврат товаров</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/scale">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.964 13.823a.948.948 0 0 0-.028-.175l-2.305-6.137A2.996 2.996 0 0 0 22 5a1 1 0 0 0-2 0a1 1 0 0 1-1.882.473A2.893 2.893 0 0 0 15.54 4H13V3a1 1 0 0 0-2 0v1H8.46a2.893 2.893 0 0 0-2.578 1.473A1 1 0 0 1 4 5a1 1 0 0 0-2 0a2.996 2.996 0 0 0 1.369 2.511l-2.305 6.137a.948.948 0 0 0-.028.175A.949.949 0 0 0 1 14c0 .01.003.018.003.027c0 .013.003.025.004.039a3.994 3.994 0 0 0 7.986 0c.001-.014.004-.026.004-.039c0-.01.003-.018.003-.027a.949.949 0 0 0-.036-.177a.948.948 0 0 0-.028-.175L6.629 7.504A2.99 2.99 0 0 0 7.643 6.42A.917.917 0 0 1 8.46 6H11v14H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3V6h2.54a.917.917 0 0 1 .817.42a2.99 2.99 0 0 0 1.014 1.084l-2.307 6.144a.948.948 0 0 0-.028.175A.949.949 0 0 0 15 14c0 .01.003.018.003.027c0 .013.003.025.004.039a3.994 3.994 0 0 0 7.986 0c.001-.014.004-.026.004-.039c0-.01.003-.018.003-.027a.949.949 0 0 0-.036-.177ZM5 8.856L6.556 13H3.444ZM6.723 15A2.023 2.023 0 0 1 5 16a2 2 0 0 1-1.731-1ZM19 8.856L20.556 13h-3.112ZM19 16a2 2 0 0 1-1.731-1h3.454A2.023 2.023 0 0 1 19 16Z"/>
                                </svg>
                                <span>Весы</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/grouping">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M16 10h-2V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2v2a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Zm-6 1v1H9V9h3v1h-1a1 1 0 0 0-1 1Zm5 4h-3v-3h3Zm6 3.28V5.72A2 2 0 1 0 18.28 3H5.72A2 2 0 1 0 3 5.72v12.56A2 2 0 1 0 5.72 21h12.56A2 2 0 1 0 21 18.28Zm-2 0a1.91 1.91 0 0 0-.72.72H5.72a1.91 1.91 0 0 0-.72-.72V5.72A1.91 1.91 0 0 0 5.72 5h12.56a1.91 1.91 0 0 0 .72.72Z"/>
                                </svg>
                                <span>Группировка</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/transfer">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M1 12.5v5a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1v-12a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v2H6a3 3 0 0 0-2.4 1.2l-2.4 3.2a.61.61 0 0 0-.07.14l-.06.11a1 1 0 0 0-.07.35Zm16 6a1 1 0 1 1 1 1a1 1 0 0 1-1-1Zm-7-13a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v11h-.78a3 3 0 0 0-4.44 0H10Zm-2 6H4l1.2-1.6a1 1 0 0 1 .8-.4h2Zm-3 7a1 1 0 1 1 1 1a1 1 0 0 1-1-1Zm-2-5h5v2.78a3 3 0 0 0-4.22.22H3Z"/>
                                </svg>
                                <span>Перемещение</span>
                            </Link>
                        </li>
                        <li className={activePage == 'inventory' ? 'mm-active' : ''}>
                            <Link className={`sidebar-links ${activePage == 'inventory' ? 'activee' : ''}`} tabIndex='-1' to="/inventory">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M5.5 8H6v.5a1 1 0 0 0 2 0V8h.5a1 1 0 0 0 0-2H8v-.5a1 1 0 0 0-2 0V6h-.5a1 1 0 0 0 0 2Zm-.62 11.12a1 1 0 0 0 1.41 0l.71-.71l.71.71a1 1 0 0 0 1.41 0a1 1 0 0 0 0-1.41L8.41 17l.71-.71a1 1 0 0 0-1.41-1.41l-.71.71l-.71-.71a1 1 0 0 0-1.41 1.41l.71.71l-.71.71a1 1 0 0 0 0 1.41ZM20 1H4a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3Zm-9 20H4a1 1 0 0 1-1-1v-7h8Zm0-10H3V4a1 1 0 0 1 1-1h7Zm10 9a1 1 0 0 1-1 1h-7v-8h8Zm0-9h-8V3h7a1 1 0 0 1 1 1Zm-5.5 5.5h3a1 1 0 0 0 0-2h-3a1 1 0 0 0 0 2Zm3-10.5h-3a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2Zm-3 13.5h3a1 1 0 0 0 0-2h-3a1 1 0 0 0 0 2Z"/>
                                </svg>
                                <span>Инвентаризация</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/cheques">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M13 16H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm-4-6h2a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2Zm12 2h-3V3a1 1 0 0 0-.5-.87a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0A1 1 0 0 0 2 3v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1ZM5 20a1 1 0 0 1-1-1V4.73l2 1.14a1.08 1.08 0 0 0 1 0l3-1.72l3 1.72a1.08 1.08 0 0 0 1 0l2-1.14V19a3 3 0 0 0 .18 1Zm15-1a1 1 0 0 1-2 0v-5h2Zm-7-7H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z"/>
                                </svg>
                                <span>Чеки</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/notifications">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M18 13.18V10a6 6 0 0 0-5-5.91V3a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 10v3.18A3 3 0 0 0 4 16v2a1 1 0 0 0 1 1h3.14a4 4 0 0 0 7.72 0H19a1 1 0 0 0 1-1v-2a3 3 0 0 0-2-2.82ZM8 10a4 4 0 0 1 8 0v3H8Zm4 10a2 2 0 0 1-1.72-1h3.44A2 2 0 0 1 12 20Zm6-3H6v-1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z"/>
                                </svg>
                                <span>Уведомления</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/price-tags">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M7 6a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm14.71 5.78l-9.48-9.46A1 1 0 0 0 11.5 2h-6a1 1 0 0 0-.71.29l-2.5 2.49a1 1 0 0 0-.29.71v6a1.05 1.05 0 0 0 .29.71l9.49 9.5a1.05 1.05 0 0 0 .71.29a1 1 0 0 0 .71-.29l8.51-8.51a1 1 0 0 0 .29-.71a1.05 1.05 0 0 0-.29-.7Zm-9.22 7.81L4 11.09V5.9L5.9 4h5.18l8.5 8.49Z"/>
                                </svg>
                                <span>Ценники</span>
                            </Link> 
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/reports">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 12h-7V5c0-.6-.4-1-1-1c-5 0-9 4-9 9s4 9 9 9s9-4 9-9c0-.6-.4-1-1-1zm-7 7.9c-3.8.6-7.4-2.1-7.9-5.9c-.6-3.8 2.1-7.4 5.9-7.9V13c0 .6.4 1 1 1h6.9c-.4 3.1-2.8 5.5-5.9 5.9zM15 2c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h6c.6 0 1-.4 1-1c0-3.9-3.1-7-7-7zm1 6V4.1c2 .4 3.5 1.9 3.9 3.9H16z"/>
                                </svg>
                                <span>Отчеты</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div 
                    className={`tab-pane fade  sidebar-menu ${tab === 1 ? 'show active' : ''}`} 
                    id="profile" 
                    role="tabpanel" 
                    aria-labelledby="profile-tab"
                >
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/workers">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M14.81 12.28a3.73 3.73 0 0 0 1-2.5a3.78 3.78 0 0 0-7.56 0a3.73 3.73 0 0 0 1 2.5A5.94 5.94 0 0 0 6 16.89a1 1 0 0 0 2 .22a4 4 0 0 1 7.94 0A1 1 0 0 0 17 18h.11a1 1 0 0 0 .88-1.1a5.94 5.94 0 0 0-3.18-4.62ZM12 11.56a1.78 1.78 0 1 1 1.78-1.78A1.78 1.78 0 0 1 12 11.56ZM19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Zm1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"/>
                                </svg>
                                <span>Мои пользователи</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/pos">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22 5H2a1 1 0 0 0-1 1v4a3 3 0 0 0 2 2.82V22a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9.18A3 3 0 0 0 23 10V6a1 1 0 0 0-1-1Zm-7 2h2v3a1 1 0 0 1-2 0Zm-4 0h2v3a1 1 0 0 1-2 0ZM7 7h2v3a1 1 0 0 1-2 0Zm-3 4a1 1 0 0 1-1-1V7h2v3a1 1 0 0 1-1 1Zm10 10h-4v-2a2 2 0 0 1 4 0Zm5 0h-3v-2a4 4 0 0 0-8 0v2H5v-8.18a3.17 3.17 0 0 0 1-.6a3 3 0 0 0 4 0a3 3 0 0 0 4 0a3 3 0 0 0 4 0a3.17 3.17 0 0 0 1 .6Zm2-11a1 1 0 0 1-2 0V7h2ZM4.3 3H20a1 1 0 0 0 0-2H4.3a1 1 0 0 0 0 2Z"/>
                                </svg>
                                <span>Торговая точка</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/cashbox">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22 2H2a1 1 0 0 0-1 1v4a3 3 0 0 0 2 2.82V21a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9.82A3 3 0 0 0 23 7V3a1 1 0 0 0-1-1Zm-7 2h2v3a1 1 0 0 1-2 0Zm-4 0h2v3a1 1 0 0 1-2 0ZM7 4h2v3a1 1 0 0 1-2 0ZM4 8a1 1 0 0 1-1-1V4h2v3a1 1 0 0 1-1 1Zm10 12h-4v-4a2 2 0 0 1 4 0Zm5 0h-3v-4a4 4 0 0 0-8 0v4H5V9.82a3.17 3.17 0 0 0 1-.6a3 3 0 0 0 4 0a3 3 0 0 0 4 0a3 3 0 0 0 4 0a3.17 3.17 0 0 0 1 .6Zm2-13a1 1 0 0 1-2 0V4h2Z"/>
                                </svg>
                                <span>Кассы</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/products">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M8.5 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 19ZM19 16H7a1 1 0 0 1 0-2h8.491a3.013 3.013 0 0 0 2.885-2.176l1.585-5.55A1 1 0 0 0 19 5H6.74a3.007 3.007 0 0 0-2.82-2H3a1 1 0 0 0 0 2h.921a1.005 1.005 0 0 1 .962.725l.155.545v.005l1.641 5.742A3 3 0 0 0 7 18h12a1 1 0 0 0 0-2Zm-1.326-9l-1.22 4.274a1.005 1.005 0 0 1-.963.726H8.754l-.255-.892L7.326 7ZM16.5 19a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5Z"/>
                                </svg>
                                <span>Продукты</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/suppliers">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22 16h-2.18a3 3 0 0 0 .18-1v-5a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v5a3 3 0 0 0 .18 1H7a1 1 0 0 1-1-1V5a3 3 0 0 0-3-3H2a1 1 0 0 0 0 2h1a1 1 0 0 1 1 1v10a3 3 0 0 0 2.22 2.88a3 3 0 1 0 5.6.12h3.36a3 3 0 1 0 5.64 0H22a1 1 0 0 0 0-2ZM9 20a1 1 0 1 1 1-1a1 1 0 0 1-1 1Zm2-4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1Zm7 4a1 1 0 1 1 1-1a1 1 0 0 1-1 1Z"/>
                                </svg>
                                <span>Поставщики</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/clients">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.3 12.22A4.92 4.92 0 0 0 14 8.5a5 5 0 0 0-10 0a4.92 4.92 0 0 0 1.7 3.72A8 8 0 0 0 1 19.5a1 1 0 0 0 2 0a6 6 0 0 1 12 0a1 1 0 0 0 2 0a8 8 0 0 0-4.7-7.28ZM9 11.5a3 3 0 1 1 3-3a3 3 0 0 1-3 3Zm9.74.32A5 5 0 0 0 15 3.5a1 1 0 0 0 0 2a3 3 0 0 1 3 3a3 3 0 0 1-1.5 2.59a1 1 0 0 0-.5.84a1 1 0 0 0 .45.86l.39.26l.13.07a7 7 0 0 1 4 6.38a1 1 0 0 0 2 0a9 9 0 0 0-4.23-7.68Z"/>
                                </svg>
                                <span>Клиенты</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="sidebar-links" tabIndex='-1' to="/currency">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M6 11a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm12 0a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm2-6H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1Zm-9-7a3 3 0 1 0 3 3a3 3 0 0 0-3-3Zm0 4a1 1 0 1 1 1-1a1 1 0 0 1-1 1Z"/>
                                </svg>
                                <span>Валюта</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div 
                    className={`tab-pane fade ${tab === 1 ? 'show active' : ''}`}
                    id="contact" 
                    role="tabpanel" 
                    aria-labelledby="contact-tab"
                >
                </div>
            </div>
        </div>
    )
}