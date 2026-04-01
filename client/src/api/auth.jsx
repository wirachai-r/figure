import axios from "axios";

export const currentUser = async (token) => {
    return await axios.post('http://localhost:3001/api/current-user', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentAdmin = async (token) => {
    return await axios.post('http://localhost:3001/api/current-admin', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}