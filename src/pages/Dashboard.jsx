export default function Dashboard({token}) {
    return(
        <div>
            <h1>DASHBOARD</h1>
            <h2>AUTH OK</h2>

            <span>TOKEN: {token}</span>
            <br /><br /><br />
            <button onClick={() => localStorage.clear()}>LOGOUT</button>
        </div>
    )
}