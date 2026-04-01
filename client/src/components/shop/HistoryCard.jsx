import React, { useState, useEffect } from "react";
import { getOrder } from "../../api/user";
import useFigureStore from "../../store/figure-store";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const HistoryCard = () => {

    const token = useFigureStore((state) => state.token);
    // console.log(token);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // code
        hdlGetOrders(token);
    }, []);

    const hdlGetOrders = (token) => {
        getOrder(token)
            .then((res) => {
                console.log(res);
                setOrders(res.data.orders);
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

    return (
        <div className="min-h-screen">
            <div className="flex items-baseline justify-between  pt-5 pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">ประวัติการสั่งซื้อ</h1>
            </div>
            <div className="space-y-4">
                {/* ตรวจสอบว่ามีข้อมูลหรือไม่ */}
                {orders?.length > 0 ? (
                    orders.map((item, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-md">
                            {/* ทีมงาน header */}
                            <div className="flex justify-between mb-2">
                                <div>
                                    <p className="text-sm">Order date</p>
                                    <p className="font-bold">{dateFormat(item.created_at)}</p>
                                </div>
                                <div>
                                    <span className={`${getStatusColor(item.order_status)} px-2 py-1 rounded-full`}>
                                        {item.order_status}
                                    </span>
                                </div>
                            </div>

                            {/* ทีมงาน table Loop Product */}
                            <div>
                                <table className="w-full rounded-md">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <td className="text-lg font-semibold pt-5 pb-5 pl-5">สินค้า</td>
                                            <td className="text-lg font-semibold pt-5 pb-5">ราคา</td>
                                            <td className="text-lg font-semibold pt-5 pb-5">จำนวน</td>
                                            <td className="text-lg font-semibold pt-5 pb-5 pr-5 text-right">รวม</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {item.products?.map((product, index) => (
                                            <tr key={index}>
                                                <td className="pt-5 pb-5 pr-5 pl-5">{product.name}</td>
                                                <td className="pt-5 pb-5 pr-5">{product.price}</td>
                                                <td className="pt-5 pb-5 pr-5">{product.count}</td>
                                                <td className="pt-5 pb-5 pr-5 text-right">
                                                    {numberFormat(product.count * product.price)}{" "}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ทีมงาน Total */}
                            <div className="text-right pr-5">
                                <p>ราคาสุทธิ</p>
                                <p className="font-bold text-xl text-red-600">{item.cart_total}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    // ถ้าไม่มีข้อมูล ให้แสดงข้อความนี้
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">ไม่มีข้อมูลการสั่งซื้อ</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistoryCard