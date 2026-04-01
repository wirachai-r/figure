import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar'
import Footers from "../components/Footers";

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="px-4 mt-20 mx-auto container">
                <Outlet />
            </main>
            <Footers />
        </>
    );
};

export default Layout;