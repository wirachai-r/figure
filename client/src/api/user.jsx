import axios from "axios";

export const createUserCart = async (token, cart, id) => {
    return await axios.post('http://localhost:3001/api/user/cart/' + id, cart, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listUserCart = async (token) => {
    return await axios.get('http://localhost:3001/api/user/cart', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveAddress = async (token, address) => {
    return await axios.post('http://localhost:3001/api/user/address', address, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getAddresses = async (token) => {
    return await axios.get('http://localhost:3001/api/user/address', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveOrder = async (token, selectedAddress) => {

    return await axios.post('http://localhost:3001/api/user/order', { selectedAddress },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const getOrder = async (token) => {
    return await axios.get('http://localhost:3001/api/user/order',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const readUser = async (token) => {
    return await axios.get('http://localhost:3001/api/user',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const updateUser = async (token, formData) => {
    return await axios.put('http://localhost:3001/api/user', formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const readAddress = async (token, id) => {
    return await axios.get(`http://localhost:3001/api/user/address/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateAddress = async (token, id, form) => {
    return await axios.put(`http://localhost:3001/api/user/address/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteAddress = async (token, id) => {
    return await axios.put(`http://localhost:3001/api/user/addresses/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
