import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, ShoppingBagIcon, XMarkIcon, } from "@heroicons/react/24/outline";
import { UserCircleIcon } from '@heroicons/react/24/solid'

import { ChevronDown } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useFigureStore from "../store/figure-store";

const Navbar = () => {
    const carts = useFigureStore((state) => state.carts);
    const user = useFigureStore((state) => state.user);
    const logout = useFigureStore((state) => state.logout);

    const [open, setOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setOpen(false);
        setIsOpen(false);
    }, [location]);

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-white">
            {/* Mobile menu */}
            <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop transition className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0" />

                <div className="fixed inset-0 z-50 flex justify-end">
                    <DialogPanel
                        transition
                        className="relative flex w-full transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <div className="flex px-4 pt-5 pb-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>

                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                            <div className="flow-root">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    HOME
                                </NavLink>
                            </div>
                            <div className="flow-root">
                                <NavLink
                                    to="/shop"
                                    end
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    SHOP
                                </NavLink>
                            </div>
                            <div className="flow-root">
                                <NavLink
                                    to="/about"
                                    end
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    ABOUT
                                </NavLink>
                            </div>
                        </div>

                        {
                            user ?
                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    {user.role == "admin" ?
                                        <div className="flow-root">
                                            <Link
                                                to={"/admin"}
                                                className="text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">
                                                Admin
                                            </Link>
                                        </div> : ""
                                    }
                                    <div className="flow-root">
                                        <NavLink
                                            to={"/account"}
                                            end
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                                    : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"}>
                                            Account
                                        </NavLink>
                                    </div>
                                    <div className="flow-root">
                                        <NavLink
                                            to={"/history"}
                                            end
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                                    : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"}>
                                            History
                                        </NavLink>
                                    </div>
                                    <div className="flow-root">
                                        <Link
                                            to={"/"}
                                            onClick={() => logout()}
                                            className="text-black hover:bg-red-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    <div className="flow-root">
                                        <NavLink
                                            to="/login"
                                            end
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                                    : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            }>
                                            Login
                                        </NavLink>
                                    </div>
                                    <div className="flow-root">
                                        <NavLink
                                            to="/register"
                                            end
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "bg-blue-400 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                                    : "text-black hover:bg-blue-400 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            }>
                                            Register
                                        </NavLink>
                                    </div>

                                </div>
                        }
                    </DialogPanel>
                </div>
            </Dialog >

            <header className="fixed top-0 left-0 right-0 z-40 bg-white">
                <nav aria-label="Top" className="mx-auto container px-4 sm:px-6 lg:px-8" >

                    <div className="flex h-16 items-center justify-between">

                        {/* Logo */}
                        <div className="ml-4 flex lg:ml-0">
                            <Link to={"/"} className="text-2xl font-bold mb-1 bg-blue-400 p-1 text-white">FIGURE SHOP</Link>
                        </div>

                        {/* Flyout menus */}
                        <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                            <div className="flex h-full space-x-8">
                                <NavLink
                                    to={'/'}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center text-sm font-medium text-blue-400"
                                            : "flex items-center text-sm font-medium text-gray-700 hover:text-blue-400"}>
                                    HOME
                                </NavLink>
                                <NavLink
                                    to={'/shop'}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center text-sm font-medium text-blue-400"
                                            : "flex items-center text-sm font-medium text-gray-700 hover:text-blue-400"}>
                                    SHOP
                                </NavLink>
                                <NavLink
                                    to={'/about'}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center text-sm font-medium text-blue-400"
                                            : "flex items-center text-sm font-medium text-gray-700 hover:text-blue-400"}>
                                    ABOUT
                                </NavLink>
                            </div>
                        </PopoverGroup>

                        <div className="ml-auto flex items-center">
                            {user ?
                                <div className="hidden lg:flex lg:items-center lg:gap-4">
                                    <button onClick={toggleDropdown} className="flex items-center gap-2 rounded-4xl hover:bg-gray-200">
                                        <UserCircleIcon aria-hidden="true" className="size-10 text-gray-400" />
                                        <ChevronDown className="pr-2" />
                                    </button>

                                    {isOpen && (
                                        <div className="absolute top-16 bg-white shadow-md z-50">
                                            {user.role == "admin" ?
                                                <Link
                                                    to={"/admin"}
                                                    className="block px-4 py-2 text-black hover:bg-blue-400 hover:text-white"
                                                >
                                                    Admin
                                                </Link> : ""
                                            }
                                            <NavLink
                                                to={"/account"}
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "block px-4 py-2 bg-blue-400 text-white"
                                                        : "block px-4 py-2 text-black hover:bg-blue-400 hover:text-white"}>
                                                Account
                                            </NavLink>
                                            <NavLink
                                                to={"/history"}
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "block px-4 py-2 bg-blue-400 text-white"
                                                        : "block px-4 py-2 text-black hover:bg-blue-400 hover:text-white"}>
                                                History
                                            </NavLink>
                                            <Link
                                                to={"/"}
                                                onClick={() => logout()}
                                                className="block px-4 py-2 text-black hover:bg-red-400 hover:text-white">
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                :
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    <NavLink
                                        to={'/register'}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "flex items-center text-sm font-medium text-blue-400"
                                                : "flex items-center text-sm font-medium text-gray-700 hover:text-blue-400"}>
                                        Register
                                    </NavLink>
                                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                                    <NavLink
                                        to={'/login'}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "flex items-center text-sm font-medium text-blue-400"
                                                : "flex items-center text-sm font-medium text-gray-700 hover:text-blue-400"}>
                                        Login
                                    </NavLink>
                                </div>
                            }
                            {/* Cart */}
                            <div className="ml-4 flow-root lg:ml-6 mr-6">
                                <NavLink
                                    to={'/cart'} className="group -m-2 flex items-center p-2">
                                    <ShoppingBagIcon
                                        aria-hidden="true"
                                        className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                                    />
                                    {carts.length > 0 && (
                                        <span
                                            className="absolute top-2 ml-5 bg-red-600 rounded-full px-2 text-white"
                                        >
                                            {carts.length}
                                        </span>
                                    )}
                                </NavLink>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="border-b border-gray-200 w-full"></div>
            </header>
        </div >
    );
}

export default Navbar;