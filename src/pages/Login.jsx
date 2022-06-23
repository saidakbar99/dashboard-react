import PropTypes from 'prop-types'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function loginUser(credentials) {
    return fetch('https://cabinet.mdokon.uz/auth/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}
export default function Login({setToken}) {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        const token = await loginUser({username,password})
        setToken(token)
    }

    const notify = () => {
        toast.error('Wrong login/password', {
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
                <button type="submit" onClick={notify}>Submit</button>
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