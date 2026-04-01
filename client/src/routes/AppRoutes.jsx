import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Account from '../pages/Account'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import History from '../pages/History'
import Shop from '../pages/Shop'
import ProductShop from '../pages/ProductShop'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Layout from '../layouts/Layout'
import Dashboard from '../pages/admin/Dashboard'
import ManageOrders from '../pages/admin/ManageOrders'
import ManageProduct from '../pages/admin/ManageProduct'
import ManageUser from '../pages/admin/ManageUser'
import ManageCategory from '../pages/admin/ManageCategory'
import LayoutAdmin from '../layouts/LayoutAdmin'
import NotFound from '../pages/NotFound'
import ProtectRouteUser from './ProtectRouteUser'
import ProtectRouteAdmin from './ProtectRouteAdmin'
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'account', element: <ProtectRouteUser element={<Account />} /> },
            { path: 'cart', element: <Cart /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'history', element: <ProtectRouteUser element={<History />} /> },
            { path: 'shop', element: <Shop /> },
            { path: 'shop/:id', element: <ProductShop /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: '*', element: <NotFound /> }
        ]
    },
    {
        path: '/admin',
        element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'order', element: <ManageOrders /> },
            { path: 'product', element: <ManageProduct /> },
            { path: 'category', element: <ManageCategory /> },
            { path: 'user', element: <ManageUser /> }
        ]
    }
])

const AppRoutes = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRoutes