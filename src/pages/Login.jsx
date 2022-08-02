import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/Login.css'
import '../styles/Circles.css'

async function loginUser({username,password}) {
    try{
        let response = await fetch('https://cabinet.mdokon.uz/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username,password})
            })
        return await response.json()
    }catch(error){
        console.log("Login error: ", error)
    }
}
async function checkRole({access_token}) {
    try{
        let response = await fetch('https://cabinet.mdokon.uz/services/uaa/api/account', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })
        return await response.json()
    }catch(error){
        console.log("Role error: ", error)
    }
}

export default function Login({setToken}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        const token = await loginUser({username,password})
        const access = await checkRole(token)
        if(access.authorities[0] === 'ROLE_OWNER') {
            setToken(token)
        }
        
    }
    const wrongInput = () => {
        window.localStorage.setItem('login', username)
        toast.error('Error: 401 Unauthorized', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            delay: 1000,
        });
    }
    return(
        <>
        <ToastContainer
            limit={1}
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
        />
        <div className='auth-bg'>
            <div className="account-pages h-100 vertical-center">
                <div className='container'>
                    <div className='row align-items-center justify-content-center'>
                        <div className='col-md-8 col-lg-6 col-xl-4'>
                            <div className='auth-card'>
                                <div className='text-center my-2'>
                                    <h3 className='login-header'>Вход в систему</h3>
                                </div>
                                <div className='p-2'>
                                    <form onSubmit={handleSubmit}>
                                        <input 
                                            type="text"
                                            name='username'
                                            className='login-input'
                                            onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            placeholder='Логин'
                                            autoComplete="off"
                                        />
                                        <input 
                                            type="password" 
                                            name='password'
                                            className='login-input'
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            placeholder='Пароль'
                                        />
                                        <div className='text-center' onClick={wrongInput}>
                                            <button type='submit' className='login-button'>Войти</button>
                                        </div>
                                        <div className='text-white text-center mt-4 fw-medium fz-09'>
                                            Забыли пароль?
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='about-mdokon position-absolute'>
                Контакт-центр: +998 55 500-00-89 <br />
                Производитель: ООО «AUTOMATION SOURCE», Республика Узбекистан <br />
                Программное обеспечение для автоматизации торговых сетей и точек «mDokon– POS»
                </div>
                <div className=''>
                    <ul className='circles'>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
        </>
        
    )
}

Login.propTypes = { 
    setToken: PropTypes.func.isRequired
}