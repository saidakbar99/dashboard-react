import PropTypes from 'prop-types'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function loginUser({username,password}) {
    return fetch('https://cabinet.mdokon.uz/auth/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username,password})
    })
    .then(data => data.json())
}

async function checkRole({access_token}) {
    return fetch('https://cabinet.mdokon.uz/services/uaa/api/account', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
    .then(data => data.json())
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
        toast.error('Error', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    }

    return(
        <div className="login-wrapper">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                <p>Username</p>
                <input type="text" onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                <p>Password</p>
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </label>
                <div>
                <button type="submit" onClick={wrongInput}>Submit</button>
                </div>
            </form>
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
        </div>
    )
}

Login.propTypes = { 
    setToken: PropTypes.func.isRequired
}