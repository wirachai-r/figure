import React from "react";
import { LayoutGrid, Users, Package, ShoppingCart, List, House, LogOut } from 'lucide-react';
import { NavLink, Link } from "react-router-dom";
import useFigureStore from "../../store/figure-store";

const SidebarAdmin = () => {
    const logout = useFigureStore((state) => state.logout);
    return (
        <>
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col h-full border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            className="h-8 w-auto"
                            src="/api/placeholder/32/32"
                            alt="Your Company"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col mt-5">
                        <ul role="list" className="space-y-1">
                            <li>
                                <NavLink to={"/admin"}
                                    end
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <LayoutGrid /> Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="user"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <Users /> User
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="product"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <Package /> Product
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="category"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <List /> Category
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="order"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <ShoppingCart /> Order
                                </NavLink>
                            </li>
                        </ul>
                        {/* ปุ่ม Logout อยู่ล่างสุด */}
                        <div className="mt-auto border-t border-gray-200 pt-4">
                            <Link
                                to={"/"}
                                className="text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 mb-4">
                                <House /> Home
                            </Link>
                            <Link
                                to="/"
                                onClick={() => logout()}
                                className="text-red-600 hover:bg-red-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">
                                <LogOut /> Logout
                            </Link>
                        </div>
                    </nav>

                </div >
            </div >
        </>
    );
};

export default SidebarAdmin;