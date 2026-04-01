import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart } from 'lucide-react';
import { getListAllUsers } from "../../api/admin";
import { getOrderAdmin, changeOrderStatus } from "../../api/admin";
import useFigureStore from "../../store/figure-store";
import { numberFormat } from "../../utils/number";
import { Link } from "react-router-dom";
import SalesChart from "./SalesChart";

const FormDashboard = () => {
    const token = useFigureStore((state) => state.token);
    const [users, setUsers] = useState([]);
    const getCategory = useFigureStore((state) => state.getCategory)
    const categories = useFigureStore((state) => state.categories)
    const getProduct = useFigureStore((state) => state.getProduct)
    const products = useFigureStore((state) => state.products)
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        handleGetListAllUsers(token)
        getCategory(token)
        getProduct(token)
        handleGetOrder(token)
    }, [])

    const handleGetListAllUsers = (token) => {
        getListAllUsers(token)
            .then((res) => {
                //console.log(res.data)
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleGetOrder = (token) => {
        getOrderAdmin(token)
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link to={'/admin/user'}>
                    <div className="bg-white p-6 flex items-center gap-4 border border-gray-200">
                        <Users className="text-blue-500 w-10 h-10" />
                        <div>
                            <h3 className="text-lg font-semibold">ผู้ใช้งาน</h3>
                            <p className="text-2xl font-bold">{numberFormat(users.length)}</p>
                        </div>
                    </div>
                </Link>
                <Link to={'/admin/product'}>
                    <div className="bg-white p-6 flex items-center gap-4 border border-gray-200">
                        <Package className="text-green-500 w-10 h-10" />
                        <div>
                            <h3 className="text-lg font-semibold">Products</h3>
                            <p className="text-2xl font-bold">{numberFormat(products.length)}</p>
                        </div>
                    </div>
                </Link>
                <Link to={'/admin/order'}>
                    <div className="bg-white p-6 flex items-center gap-4 border border-gray-200">
                        <ShoppingCart className="text-red-500 w-10 h-10" />
                        <div>
                            <h3 className="text-lg font-semibold">Orders</h3>
                            <p className="text-2xl font-bold">{numberFormat(orders.length)}</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Table Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 mt-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
                    <SalesChart />
                </div>
            </div> */}
        </>
    )
}

export default FormDashboard