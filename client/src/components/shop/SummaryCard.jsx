import React, { useState, useEffect } from "react";
import { ListCheck } from 'lucide-react';
import { listUserCart, saveAddress, saveOrder, getAddresses } from "../../api/user";
import useFigureStore from "../../store/figure-store";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";

const initialState = {
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postal_code: ""
}

const SummaryCard = () => {
    const token = useFigureStore((state) => state.token);
    const clearCart = useFigureStore((state) => state.clearCart);

    const [products, setProducts] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const [addresses, setAddresses] = useState([]);

    const [getaddress, setAddress] = useState(initialState);
    const [addressSaved, setAddressSaved] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        hdlGetUserCart(token);
        hdlGetAddress(token);
    }, []);

    console.log(addresses);

    const handleOnChange = async (e) => {
        console.log(e.target.name, e.target.value)
        setAddress({
            ...getaddress, [e.target.name]: e.target.value
        })
    };

    const hdlSaveAddress = async () => {
        try {
            const res = await saveAddress(token, getaddress);
            toast.success(`เพิ่มที่อยู่สำเร็จ`);
            // รีเซ็ตค่า form กลับไปเป็นค่าเริ่มต้น
            setAddress(initialState);
            setSelectedAddress("");
            setAddressSaved(false);

            // โหลดข้อมูลที่อยู่ใหม่
            hdlGetAddress(token);
        } catch (err) {
            console.log(err);
        }
    };

    const hdlGetUserCart = (token) => {
        listUserCart(token)
            .then((res) => {
                //console.log(res)
                setProducts(res.data.products);
                setCartTotal(res.data.cartTotal);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const hdlGetAddress = (token) => {
        getAddresses(token)
            .then((res) => {
                setAddresses(res.data)
                //console.log(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const hdlAddress = async (e) => {
        console.log(e.target.value)
        setSelectedAddress(e.target.value); // อัปเดตค่าเมื่อมีการเลือก
        setAddressSaved(true);
    };

    const hdlNewAddress = async () => {
        setAddressSaved(false);
        setSelectedAddress(""); // รีเซ็ตค่าให้กลับไปเป็นตัวเลือกเริ่มต้น
    };

    const handleSaveCart = async () => {
        if (!token) {
            toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
            return;
        }

        if (!addressSaved) {
            return toast.warning("กรุณาเลือกทีอยู่");
        }

        await saveOrder(token, selectedAddress)
            .then((res) => {
                console.log(res);
                toast.success("ดำเนินการสั่งซื้อสำเร็จ", { position: "top-center" });
                navigate("/");
                clearCart()
            })
            .catch((err) => {
                console.log("err", err);
                toast.warning(err.response?.data?.message || "เกิดข้อผิดพลาด");
            });
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="text-3xl font-bold text-gray-900 mb-6 flex">
                <ListCheck size={36} className='mr-4' />
                <p className="text-2xl font-bold">รายละเอียดการสั่งซื้อ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-gray-300 p-4 space-y-4 h-full">
                    <h1 className="font-bold text-lg">ที่อยู่ในการจัดส่ง</h1>

                    <div className="space-y-2">
                        <label htmlFor="existing_address" className="text-sm font-semibold text-gray-700 mb-3">เลือกที่อยู่ที่มีอยู่แล้ว</label>
                        <select
                            id="addressSave"
                            name="addressSave"
                            onChange={hdlAddress}
                            value={selectedAddress}
                            className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                        >
                            <option value="" disabled selected>เลือกที่อยู่</option>
                            {/* {Array.isArray(address) && address.length > 0 ? ( */}
                            {Array.isArray(addresses) && addresses.length > 0 ? (
                                addresses.map((item, index) => (
                                    <option key={index} value={item.address_id}>
                                        {item.address}
                                    </option>
                                ))
                            ) : (
                                <option disabled>ไม่มีที่อยู่</option>
                            )}
                        </select>
                    </div>

                    {
                        addressSaved
                            ?
                            <button
                                onClick={hdlNewAddress}
                                className="bg-blue-500 text-white px-4 py-2 shadow-md hover:bg-blue-700 w-full">
                                เพิ่มที่อยู่ใหม่
                            </button>
                            : <div>
                                <div className="space-y-2">
                                    <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-3">ที่อยู่ใหม่</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="กรุณากรอกที่อยู่"
                                        value={getaddress.address}
                                        onChange={handleOnChange}
                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subdistrict" className="text-sm font-semibold text-gray-700 mb-3">ตำบล</label>
                                    <input
                                        id="subdistrict"
                                        name="subdistrict"
                                        type="text"
                                        placeholder="กรุณากรอกตำบล"
                                        value={getaddress.subdistrict}
                                        onChange={handleOnChange}
                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="district" className="text-sm font-semibold text-gray-700 mb-3">อำเภอ</label>
                                    <input
                                        id="district"
                                        name="district"
                                        type="text"
                                        placeholder="กรุณากรอกอำเภอ"
                                        value={getaddress.district}
                                        onChange={handleOnChange}
                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="province" className="text-sm font-semibold text-gray-700 mb-3">จังหวัด</label>
                                    <input
                                        id="province"
                                        name="province"
                                        type="text"
                                        placeholder="กรุณากรอกจังหวัด"
                                        value={getaddress.province}
                                        onChange={handleOnChange}
                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="postal_code" className="text-sm font-semibold text-gray-700 mb-3">รหัสไปรษณีย์</label>
                                    <input
                                        id="postal_code"
                                        name="postal_code"
                                        type="text"
                                        placeholder="กรุณากรอกรหัสไปรษณีย์"
                                        value={getaddress.postal_code}
                                        onChange={handleOnChange}
                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                        required
                                    />
                                </div>

                                <button
                                    onClick={hdlSaveAddress}
                                    className="bg-blue-500 text-white mt-5 px-4 py-2 hover:bg-blue-700 w-full rounded-md">
                                    บันทึกที่อยู่
                                </button>
                            </div>
                    }
                    {/* ถ้าผู้ใช้ไม่เลือกที่อยู่เก่า ให้กรอกที่อยู่ใหม่ */}


                </div>
                <div className="border border-gray-300 p-4 space-y-4 h-full">
                    <h1 className="text-lg font-bold">คำสั่งซื้อของคุณ</h1>

                    {/* Item List */}

                    {products?.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm">
                                        จำนวน : {item.count} x {numberFormat(item.price)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-red-500 font-bold">
                                        {numberFormat(item.count * item.price)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div>
                        <div className="flex justify-between">
                            <p>ค่าจัดส่ง:</p>
                            <p>0.00</p>
                        </div>
                        <div className="flex justify-between">
                            <p>ส่วนลด:</p>
                            <p>0.00</p>
                        </div>
                    </div>

                    <hr />
                    <div>
                        <div className="flex justify-between">
                            <p className="font-bold">ยอดรวมสุทธิ : </p>
                            <p className="text-red-500 font-bold text-lg">{numberFormat(cartTotal)}</p>
                        </div>
                    </div>

                    <hr />
                    <div>
                        {
                            products == 0 ?
                                <Link to={"/cart"}>
                                    <button className="mt-4 bg-red-700 hover:bg-red-800 text-white w-full py-2 ">
                                        กรุณาเลือกสินค้า
                                    </button>
                                </Link>
                                : <button
                                    type="submit"
                                    onClick={handleSaveCart}
                                    className="bg-green-600 w-full p-2 text-white hover:bg-green-700">
                                    ดำเนินการสั่งซื้อ
                                </button>
                        }
                        <Link to={"/cart"}>
                            <button className="mt-4 bg-gray-700 hover:bg-gray-800 text-white w-full py-2 ">
                                แก้ไขสินค้า
                            </button>
                        </Link>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;