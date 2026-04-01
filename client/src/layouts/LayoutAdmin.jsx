import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from '../components/admin/HeaderAdmin';
import SidebarAdmin from '../components/admin/SidebarAdmin';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderAdmin />

            {/* Sidebar for larger screens */}

            <SidebarAdmin />

            {/* Main content */}
            <div className="lg:pl-64">
                <main className="py-10">
                    <div className="px-4 mt-13 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Layout;