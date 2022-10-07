import axios from 'axios'

export const GET = async(url, token) => {
    
    try{
        const result = await axios.get(
            url,{
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                }
            }
        );
        return result
    }catch(error){
        console.log('Error when fetch data: ', error)
        localStorage.clear()
        window.location.reload()
    }
}

