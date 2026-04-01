import { useEffect, useState } from "react";
import { getListAllUsers, changeUserStatus, changeUserRole } from "../../api/admin";
import useFigureStore from "../../store/figure-store";
import { toast } from "react-toastify";

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { dateFormat } from "../../utils/dateformat";

const FormUser = () => {
    const token = useFigureStore((state) => state.token);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        handleGetListAllUsers(token)
    }, [])

    const handleGetListAllUsers = (token) => {
        getListAllUsers(token)
            .then((res) => {
                console.log(res.data)
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChangeUserStatus = (userId, userStatus) => {
        // console.log(userId, userStatus);
        const value = {
            id: userId,
            enabled: !userStatus,
        };
        changeUserStatus(token, value)
            .then((res) => {
                // console.log(res);
                handleGetListAllUsers(token);
                toast.success("Update Status Success!!");
            })
            .catch((err) => console.log(err));
    };

    const handleChangeUserRole = (userId, userRole) => {
        // console.log(userId, userStatus);
        const value = {
            id: userId,
            role: userRole,
        };
        changeUserRole(token, value)
            .then((res) => {
                console.log(res);
                handleGetListAllUsers(token);
                toast.success("Update Role Success!!");
            })
            .catch((err) => console.log(err));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return "bg-green-200";
            case 0:
                return "bg-red-200";
        }
    };

    const dataPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(users.length / dataPerPage);

    const currentData = users.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // จำนวนหน้าสูงสุดที่จะแสดง (ยกเว้น first, last, ...)

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-4 py-2 ring-1 ring-gray-300 ring-inset ${currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-50'}`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            let startPage = Math.max(currentPage - 1, 1);
            let endPage = Math.min(currentPage + 1, totalPages);

            if (currentPage <= 3) {
                endPage = 3;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 2;
            }

            if (startPage > 1) {
                pageNumbers.push(
                    <button key={1} onClick={() => setCurrentPage(1)} className="px-4 py-2 text-gray-900 hover:bg-gray-50 ring-1 ring-gray-300 ring-inset">
                        1
                    </button>
                );
                if (startPage > 2) {
                    pageNumbers.push(<span key="start-ellipsis" className="px-4 py-2 text-gray-700 ring-1 ring-gray-300 ring-inset">...</span>);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-4 py-2 ring-1 ring-gray-300 ring-inset ${currentPage === i ? 'bg-blue-600 text-white ' : 'text-gray-900 hover:bg-gray-50'}`}
                    >
                        {i}
                    </button>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push(<span key="end-ellipsis" className="px-4 py-2 text-gray-700 ring-1 ring-gray-300 ring-inset">...</span>);
                }
                pageNumbers.push(
                    <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="px-4 py-2 text-gray-900 hover:bg-gray-50 ring-1 ring-gray-300 ring-inset">
                        {totalPages}
                    </button>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <>
            <div className="bg-white border border-gray-200">
                <div className="p-4 lg:px-8 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">ผู้ใช้งาน</h2>
                </div>
            </div>
            <div className="bg-white border border-gray-200 mt-5">
                <div className="p-4 lg:px-8 ">
                    <div className="overflow-x-auto ">
                        <table className="table-auto w-full min-w-6xl divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <td className="text-lg font-semibold pt-5 pb-5">ลำดับ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ชื่อผู้ใช้</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">อีเมล</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ชื่อ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">วันที่แก้ไขล่าสุด</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">สิทธ์</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">สถานะ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จัดการ</td>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData?.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 mt-6" >
                                        <td className="pt-5 pb-5 pr-5">{index + ((currentPage - 1) * dataPerPage + 1)}</td>
                                        <td className="pt-5 pb-5 pr-5">{item.username}</td>
                                        <td className="pt-5 pb-5 pr-5">{item.email}</td>
                                        <td className="pt-5 pb-5 pr-5">{item.first_name} {item.last_name}</td>
                                        <td className="pt-5 pb-5 pr-5">{dateFormat(item.updated_at)}</td>
                                        <td className="pt-5 pb-5 pr-5">
                                            <select
                                                onChange={(e) => handleChangeUserRole(item.user_id, e.target.value)}
                                                value={item.role}
                                            >
                                                <option>user</option>
                                                <option>admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`${getStatusColor(item.enabled)} px-2 py-1 rounded-full`}>
                                                {item.enabled ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="bg-yellow-500 text-white p-1 rounded-md shadow-md"
                                                onClick={() => handleChangeUserStatus(item.user_id, item.enabled)}
                                            >
                                                {item.enabled ? "Disable" : "Enable"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="sm:hidden px-4 py-3 sm:px-6">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, users.length)}</span> of <span className="font-medium">{users.length}</span> results
                        </p>
                    </div>

                    <div className="flex items-center justify-between sm:border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>

                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, users.length)}</span> of <span className="font-medium">{users.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                                    </button>
                                    {renderPageNumbers()}
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormUser;
