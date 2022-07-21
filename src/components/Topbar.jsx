import React, { useState, useEffect } from 'react'
import '../styles/App.css'
import Dropdown from 'react-bootstrap/Dropdown';
import MyModal from './UI/modal/MyModal';

import { GET } from '../api/api';
import { numberFormatter } from '../utils/formatter'

///////////////////////////////////////LOGOUT////////////////////////////////////
    // async function logout() {
    //     return fetch('https://cabinet.mdokon.uz/auth/logout',{
    //         method: 'POST',
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         }
    //     })
    //     .then(data => data.json())
    // }
///////////////////////////////////////LOGOUT////////////////////////////////////

export default function Topbar() {
    const [modal, setModal] = useState(false)
    const [balance, setBalance] = useState(0)
    const [user, setUser] = useState('')
    const [fullScreen, setFullScreen] = useState(false)
    
    function exit() {
        localStorage.clear();
        window.location.reload(); 
    }

    function toggleFullScreen() {
        if(fullScreen){
            document.exitFullscreen()
            setFullScreen(false)
        }else{
            document.querySelector("#root").requestFullscreen()
            setFullScreen(true)
        }
    }

    const token = JSON.parse(localStorage.getItem('token'))
    const balanceUrl = 'https://cabinet.mdokon.uz/services/web/api/pos-balance'
    const userNameUrl = 'https://cabinet.mdokon.uz/services/uaa/api/account'

    useEffect(() => {
        GET(balanceUrl, token).then(function(result){setBalance(result.data)})
        GET(userNameUrl, token).then(function(result){setUser(result.data.login)})
    }, [])

    return(
        <div className="topbar-container">
            <Dropdown className='bg-white'>
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                Русский
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>Русский</Dropdown.Item>
                    <Dropdown.Item>O'zbekcha</Dropdown.Item>
                    <Dropdown.Item>Узбекча</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <MyModal visible={modal} setVisible={setModal}>
                <span>Вы уверены что хотите выйти из системы?</span>
                <hr />
                <button 
                    onClick={() => setModal(false)}
                    type="button" 
                    className="btn btn-warning modal__btns"
                >
                    Отмена
                </button>
                <button
                    onClick={exit}
                    type="button" 
                    className="btn btn-primary modal__btns"
                >
                    Подтвердить
                </button>
            </MyModal>

            <div className='expandIcon' onClick={toggleFullScreen}>
                {fullScreen 
                    ?   <i className="bi bi-fullscreen-exit"></i> 
                    :   <i className="bi bi-arrows-fullscreen"></i>
                }
            </div>
            <div className='logout' onClick={() => setModal(true)}>
                <div className='mx-2'>
                    <p className='mb-0'>Логин: {user}</p>
                    <p className='mb-0'>Баланс: {numberFormatter(balance)}</p>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                        <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}