import axios from "axios";

export const createCategory = async (token, form) => {
    return await axios.post('http://localhost:3001/api/categories', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCategory = async () => {
    return await axios.get('http://localhost:3001/api/categories')
}

export const removeCategory = async (token, id) => {
    return await axios.delete('http://localhost:3001/api/categories/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateCategory = async (token, id, name) => {
    return await axios.put('http://localhost:3001/api/categories/' + id, { name }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}