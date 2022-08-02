import React, { useState, useEffect } from 'react'
import '../styles/App.css'
import MyModal from './UI/modal/MyModal';

import { GET } from '../api/api';

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
    const [fullScreen, setFullScreen] = useState(false)

    const user = window.localStorage.getItem('login')
    
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

    useEffect(() => {
        GET(balanceUrl, token).then(function(result){setBalance(result.data)})
    }, [])

    return(
        <div className="topbar-container">
            <MyModal visible={modal} setVisible={setModal}>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <div className='modal-title h4'>Выйти</div>
                        <button type='button' className='btn-close outline-none' onClick={() => setModal(false)}></button>
                    </div>
                    <div className='modal-body'>
                        <span>Вы уверены что хотите выйти из системы?</span>
                        <hr />
                        <div className='d-flex w-100 mt-3'>
                            <button 
                                onClick={() => setModal(false)}
                                type="button" 
                                className="btn btn-outline-warning w-100 me-2"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={exit}
                                type="button" 
                                className="btn btn-primary w-100"
                            >
                                Подтвердить
                            </button>
                        </div>
                    </div>

                </div>
            </MyModal>

            <div className='expandIcon' onClick={toggleFullScreen}>
                <svg className='fz-22 c-555b6d' xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
                    width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.18 4h2.1a1 1 0 0 0 0-2h-2.1a1 1 0 0 0 0 2ZM3 11.28a1 1 0 0 0 1-1v-2.1a1 1 0 0 0-2 0v2.1a1 1 0 0 0 1 1ZM14.46 4a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2ZM21 7.54h-4.54a1 1 0 1 0-2 0H8.54a1 1 0 0 0-1 1v5.92a1 1 0 1 0 0 2V21a1 1 0 0 0 1 1H21a1 1 0 0 0 1-1V8.54a1 1 0 0 0-1-1ZM20 20H9.54V9.54H20ZM4 2H3a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0a1 1 0 0 0 0-2Zm0 12.46a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 0-2Z"/>
                </svg>
            </div>
            <div className='logout' onClick={() => setModal(true)}>
                <div className='mx-2'>
                    <div className='d-flex justify-content-between mb-0 fz-09 c-555b6d'>
                        <span>Логин: </span>
                        <span>{user}</span>
                    </div>
                    <div className='d-flex justify-content-between mb-0 fz-09 c-555b6d'>
                        <span>Баланс: </span>
                        <span>{balance.toLocaleString('ru')}</span>
                    </div>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className='fz-22 c-555b6d'
                        width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 12a1 1 0 0 0-1-1h-7.59l2.3-2.29a1 1 0 1 0-1.42-1.42l-4 4a1 1 0 0 0-.21.33a1 1 0 0 0 0 .76a1 1 0 0 0 .21.33l4 4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L11.41 13H19a1 1 0 0 0 1-1ZM17 2H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3a1 1 0 0 0-2 0v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3a1 1 0 0 0 2 0V5a3 3 0 0 0-3-3Z"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}