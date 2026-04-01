import { useEffect, useState } from "react";
import { getOrderAdmin, changeOrderStatus } from "../../api/admin";
import useFigureStore from "../../store/figure-store";
import { toast } from 'react-toastify';
import { numberFormat } from "../../utils/number";

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { dateFormat } from "../../utils/dateformat";

const FormOrders = () => {
    const token = useFigureStore((state) => state.token);
    const [orders, setOrders] = useState([]);

    //console.log(products)

    useEffect(() => {
        handleGetOrder(token)
    }, [])

    const handleGetOrder = (token) => {
        getOrderAdmin(token)
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log(orders);

    const handleChangeOrderStatus = (token, orderId, orderStatus) => {
        // code
        console.log(orderId, orderStatus);
        changeOrderStatus(token, orderId, orderStatus)
            .then((res) => {
                console.log(res);
                toast.success("Update Status Success!!!");
                handleGetOrder(token);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Not Process":
                return "bg-gray-200";
            case "Processing":
                return "bg-blue-200";
            case "Completed":
                return "bg-green-200";
            case "Cancelled":
                return "bg-red-200";
        }
    };

    const dataPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(orders.length / dataPerPage);

    const currentData = orders.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

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
                    <h2 className="text-lg font-semibold">คำสั่งซื้อ</h2>
                </div>
            </div>
            <div className="bg-white border border-gray-200 mt-5">
                <div className="p-4 lg:px-8 ">
                    <div className="overflow-x-auto ">
                        <table className="table-auto w-full min-w-6xl divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <td className="text-lg font-semibold pt-5 pb-5">ลำดับ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ผู้ใช้งาน</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">สินค้า</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">วันที่</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ที่อยู่ในการจัดส่ง</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">รวม</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">สถานะ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จัดการ</td>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData?.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 mt-6" >
                                        <td className="pt-5 pb-5 pr-5">{index + ((currentPage - 1) * dataPerPage + 1)}</td>
                                        <td className="pt-5 pb-5 pr-5">
                                            <p>{item.user.username}</p>
                                            <p className="text-gray-500">{item.user.email}</p>
                                        </td>
                                        <td className="pt-5 pb-5 pr-5">
                                            {item.products?.map((product, index) => (
                                                <li key={index}>
                                                    {product.name} {"  "}
                                                    <span className="text-sm">{product.count} x{" "}{product.price}
                                                    </span>
                                                </li>
                                            ))}
                                        </td>
                                        <td>
                                            {dateFormat(item.created_at)}
                                        </td>
                                        <td>
                                            ที่อยู่ {item.user.addresses[0].address} ตำบล {item.user.addresses[0].subdistrict} อำเภอ {item.user.addresses[0].district} จังหวัด {item.user.addresses[0].province} รหัสไปรษณีย์ {item.user.addresses[0].postal_code}
                                        </td>
                                        <td>
                                            {numberFormat(item.cart_total)}
                                        </td>
                                        <td>
                                            <span className={`${getStatusColor(item.order_status)} px-2 py-1 rounded-full`}>
                                                {item.order_status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={item.order_status}
                                                onChange={(e) =>
                                                    handleChangeOrderStatus(token, item.order_id, e.target.value)
                                                }>
                                                <option>Not Process</option>
                                                <option>Processing</option>
                                                <option>Completed</option>
                                                <option>Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="sm:hidden px-4 py-3 sm:px-6">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, orders.length)}</span> of <span className="font-medium">{orders.length}</span> results
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
                                    Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, orders.length)}</span> of <span className="font-medium">{orders.length}</span> results
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

export default FormOrders;
