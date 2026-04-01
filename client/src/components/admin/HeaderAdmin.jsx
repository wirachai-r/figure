import React, { useState, useEffect } from "react";
import { Menu, X, Search, Bell, User, LayoutGrid, Users, Package, ShoppingCart, List, House, LogOut } from "lucide-react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import useFigureStore from "../../store/figure-store";

const HeaderAdmin = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const logout = useFigureStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left section */}
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-600 lg:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}>
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="hidden lg:flex lg:items-center lg:space-x-6">
                                <NavLink to="/admin" className="text-gray-900 font-bold text-2xl">Dashboard</NavLink>
                            </div>
                        </div>
                        <div className="lg:hidden">
                            <NavLink to="/admin" className="text-gray-900 font-bold text-2xl">Dashboard</NavLink>
                        </div>

                        {/* Right section */}
                        {/* <div className="flex items-center gap-4">
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-64 rounded-md border-0 py-2 pl-10 pr-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            <button type="button" className="relative rounded-full p-1 text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    className="flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <User className="h-8 w-8 rounded-full p-1" />
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="relative z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/25"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu panel */}
                    <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="text-lg font-semibold">Menu</div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <nav className="px-4 py-6">
                            <div className="space-y-4">
                                <NavLink
                                    to="/admin"
                                    end
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <LayoutGrid /> Dashboard
                                </NavLink>
                                <NavLink
                                    to="user"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <Users /> User
                                </NavLink>
                                <NavLink
                                    to="product"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <Package /> Product
                                </NavLink>
                                <NavLink
                                    to="category"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <List /> Category
                                </NavLink>
                                <NavLink
                                    to="order"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-gray-900 text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                            : "text-black hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    }>
                                    <ShoppingCart /> Order
                                </NavLink>
                                <div className="border-t border-gray-200 pt-4">
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
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderAdmin;
