import React, { useState, useEffect } from 'react'
import useFigureStore from "../store/figure-store";
import { currentAdmin } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'


const ProtectRouteAdmin = ({ element }) => {
    const [ok, setOk] = useState(false)
    const user = useFigureStore((state) => state.user)
    const token = useFigureStore((state) => state.token)

    useEffect(() => {
        if (user && token) {
            // send to back
            currentAdmin(token)
                .then((res) => setOk(true))
                .catch((err) => setOk(false))
        }
    }, [])

    return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteAdmin