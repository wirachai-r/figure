import axios from "axios";

export const createProduct = async (token, form) => {
    return await axios.post('http://localhost:3001/api/product', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listProduct = async () => {
    return await axios.get('http://localhost:3001/api/products')
}

export const readProduct = async (token, id) => {
    // code body
    return axios.get("http://localhost:3001/api/product/" + id, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteProduct = async (token, id) => {
    // code body
    return axios.delete("http://localhost:3001/api/product/" + id, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateProduct = async (token, id, form) => {
    // code body
    console.log(id)
    return axios.put("http://localhost:3001/api/product/" + id, form, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const uploadFiles = async (token, id, formData) => {
    console.log(formData)

    return axios.post(
        `http://localhost:3001/api/images/${id}`, formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const removeFiles = async (token, id, imageName) => {
    // code
    // console.log('form api frontent', form)
    return axios.post(
        `http://localhost:3001/api/removeimages/${id}`, { imageName },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
};

export const searchFilters = async (arg) => {
    return await axios.post('http://localhost:3001/api/search/filters', arg)
}

export const listProductBy = async (sort, order, limit) => {
    // code body
    return axios.post("http://localhost:3001/api/productby", {
        sort,
        order,
        limit,
    });
};