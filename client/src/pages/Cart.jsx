import React from 'react'
import { ListCheck, Trash2, Minus, Plus } from 'lucide-react';
import useFigureStore from "../store/figure-store";
import { Link, useNavigate } from "react-router-dom";
import { createUserCart } from "../api/user";
import { toast } from "react-toastify";
import { numberFormat } from '../utils/number';

const Cart = () => {
    const cart = useFigureStore((state) => state.carts);
    const user = useFigureStore((state) => state.user);
    const token = useFigureStore((state) => state.token);

    const getTotalPrice = useFigureStore((state) => state.getTotalPrice);

    const navigate = useNavigate();

    const actionUpdateQuantity = useFigureStore(
        (state) => state.actionUpdateQuantity
    );

    const actionRemoveProduct = useFigureStore(
        (state) => state.actionRemoveProduct
    );

    const handleSaveCart = async () => {
        await createUserCart(token, { cart }, user.id)
            .then((res) => {
                console.log(res);
                toast.success("บันทึกใส่ตะกร้าเรียบร้อยแล้ว", {
                    position: "top-center",
                });
                navigate("/checkout");
            })
            .catch((err) => {
                console.log("err", err);
                toast.warning(err.response.data.message);
            });
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="text-3xl font-bold text-gray-900 mb-6 flex">
                <ListCheck size={36} className='mr-4' />
                <p className="text-2xl font-bold">รายการสินค้า {cart.length} รายการ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    {cart.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 rounded-lg p-4 flex items-center space-x-4 mb-3">
                            {
                                item.images && item.images.length > 0 && item.images[0].image_id != null
                                    ? <img src={`http://localhost:3001/img/${item.images[0].image_name}`} className="aspect-square w-30 rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8" />
                                    : <div className="aspect-square w-30 rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 text-center items-center flex justify-center"> No image</div>
                            }
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                                    <button onClick={() => actionRemoveProduct(item.product_id)}>
                                        <Trash2 className='text-red-400 hover:text-red-600' />
                                    </button>
                                </div>
                                <div className="flex justify-between mt-5">
                                    <div className="border border-gray-200 rounded-sm px-2 py-1 flex items-center">
                                        <button
                                            onClick={() => actionUpdateQuantity(item.product_id, item.count - 1)}
                                            className="px-2 py-1 bg-gray-200 rounded-sm hover:bg-gray-300">
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-4">{item.count}</span>
                                        <button
                                            onClick={() => actionUpdateQuantity(item.product_id, item.count + 1)}
                                            className="px-2 py-1 bg-gray-200 rounded-sm hover:bg-gray-300">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="text-gray-700 text-md">ราคา {numberFormat(item.price)} บาท</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-100 p-4 space-y-4 h-50">
                    <p className="text-2xl font-bold">ยอดรวม</p>
                    <div className="flex justify-between">
                        <span>รวมสุทธิ</span>
                        <span>{numberFormat(getTotalPrice())}</span>
                    </div>
                    {
                        user ? (
                            cart.length == 0 ? (
                                <Link to={"/shop"}>
                                    <button className="mt-4 bg-red-700 hover:bg-red-800 text-white w-full py-2 ">
                                        กรุณาเลือกสินค้า
                                    </button>
                                </Link>

                            ) : (
                                <button disabled={cart.length < 1} className="mt-4 bg-red-700 hover:bg-red-800 text-white w-full py-2 " onClick={handleSaveCart}>
                                    ดำเนินการสั่งซื้อ
                                </button>
                            )
                        ) : (
                            <Link to={"/login"}>
                                <button className="mt-4 bg-red-700 hover:bg-red-800 text-white w-full py-2 ">
                                    Login
                                </button>
                            </Link>
                        )
                    }

                </div>

            </div>
        </div>
    );
}

export default Cart;
