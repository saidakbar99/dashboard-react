export default function Dashboard({token}) {

    async function logout() {
        return fetch('https://cabinet.mdokon.uz/auth/logout',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(data => data.json())
    }

    return(
        <div>
            <h1>DASHBOARD</h1>
            <h2>AUTH OK</h2>

            <span>TOKEN: {token}</span>
            <br /><br /><br />
            {/* <button onClick={() => {localStorage.clear(); window.location.reload()}}>LOGOUT</button> */}
            <button onClick={logout}>LOGOUT</button>
        </div>
    )
}