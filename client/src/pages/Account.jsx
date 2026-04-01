import React, { useState, useEffect } from "react";
import { saveAddress, getAddresses, readUser, updateUser, readAddress, updateAddress, deleteAddress } from "../api/user";
import useFigureStore from "../store/figure-store";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus } from 'lucide-react';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const initialState = {
    address_id: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postal_code: ""
}

const Account = () => {
    const token = useFigureStore((state) => state.token);
    const [addresses, setAddresses] = useState([]);
    const [getaddress, setAddress] = useState(initialState);

    const [open, setOpen] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openSubmit, setOpenSubmit] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: ""
    });

    const MySwal = withReactContent(Swal)

    useEffect(() => {
        hdlGetUser(token)
        hdlGetAddress(token);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // console.log(formData);
    };

    const hdlGetUser = (token) => {
        readUser(token)
            .then((res) => {
                setFormData({
                    username: res.data[0].username,
                    email: res.data[0].email,
                    first_name: res.data[0].first_name,
                    last_name: res.data[0].last_name,
                    phone_number: res.data[0].phone_number,
                });
                //console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUpadte = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUser(token, formData);
            //console.log(res.data.message);
            toast.success(`${res.data.message}`);
        } catch (err) {
            console.log(err);
        }
        hdlGetUser(token)
    };

    //console.log(addresses);

    const handleOnChange = async (e) => {
        console.log(e.target.name, e.target.value)
        setAddress({
            ...getaddress, [e.target.name]: e.target.value
        })
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

    const hdlSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await saveAddress(token, getaddress);
            toast.success(`เพิ่มที่อยู่สำเร็จ`);
            setAddress(initialState);

            // โหลดข้อมูลที่อยู่ใหม่
            hdlGetAddress(token);
            setOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleReaed = async (id) => {
        readAddress(token, id)
            .then((res) => {
                setAddress({
                    address_id: res.data[0].address_id,
                    address: res.data[0].address,
                    subdistrict: res.data[0].subdistrict,
                    district: res.data[0].district,
                    province: res.data[0].province,
                    postal_code: res.data[0].postal_code,
                });

                //console.log(res.data);

                setOpenEdit(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleUpadteAddress = async (e) => {
        e.preventDefault();
        //console.log(getaddress.address_id)
        try {
            const res = await updateAddress(token, getaddress.address_id, getaddress);
            toast.success(`${res.data.message}`);
        } catch (err) {
            console.log(err);
        }

        setOpenEdit(false);
        hdlGetAddress(token);
    };

    const handleReaedDelete = async (id) => {
        try {
            const res = await readAddress(token, id);
            if (res.data.length === 0) {
                return toast.error("ไม่พบข้อมูลที่อยู่");
            }

            const addressData = res.data[0]; // ใช้ค่าจาก API ที่เพิ่งโหลดมาใหม่
            setAddress(addressData);
            setOpenSubmit(true);
            MySwal.fire({
                title: "คุณแน่ใจหรือไม่ว่าต้องการลบ",
                text: `ข้อมูลทั้งหมดของ ${addressData.address} จะถูกลบออกอย่างถาวร การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ยันยัน",
                cancelButtonText: "ยกเลิก"
            }).then((result) => {
                if (result.isConfirmed) {
                }
                if (result.isConfirmed) {
                    handleDelete(addressData.address_id);
                    Swal.fire({
                        title: "ลบสำเร็จ",
                        text: "ข้อมูลทั้งหมดไม่สามารถย้อนกลับได้",
                        icon: "success",
                        confirmButtonColor: "#32CD32"
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    setOpenSubmit(false);
                }
            });

        } catch (err) {
            console.log(err);
            toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!id) {
                return toast.error("ไม่พบ ID ที่ต้องการลบ");
            }

            const res = await deleteAddress(token, id);
            toast.success(`ลบข้อมูลสำเร็จ`);
        } catch (err) {
            console.log(err);
            toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
        // โหลดข้อมูลที่อยู่ใหม่
        hdlGetAddress(token);
        setOpenSubmit(false);
    };

    console.log(open)

    useEffect(() => {
        if (!openEdit && !openSubmit || open) {
            const timer = setTimeout(() => {
                setAddress({
                    address_id: "",
                    address: "",
                    subdistrict: "",
                    district: "",
                    province: "",
                    postal_code: ""
                });
            }, 300); // หน่วงเวลา 500 มิลลิวินาที (0.5 วินาที)

            return () => clearTimeout(timer); // เคลียร์ timeout ถ้ามีการเปลี่ยนค่า `openEdit` ก่อน timeout ทำงาน
        }
    }, [openEdit, openSubmit, open]);

    const dataPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(addresses.length / dataPerPage);

    const currentData = addresses.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

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
        <div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                <div>
                    <div className="flex items-baseline justify-between pt-5 pb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">บัญชีผู้ใช้</h1>
                    </div>
                    <form onSubmit={handleUpadte} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                ชื่อผู้ใช้
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    disabled
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-gray-200   px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                อีเมล
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />

                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">
                                    ชื่อ
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">
                                    นามสกุล
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="block text-sm/6 font-medium text-gray-900">
                                เบอร์โทร
                            </label>
                            <div className="mt-2">
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="text"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        {/* <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                รหัสผ่านใหม่
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                ยืนยันรหัสผ่าน
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />
                            </div>
                        </div> */}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                แก้ไข
                            </button>
                        </div>
                    </form>
                </div>
                <div className="border-t border-gray-200 mt-5 pt-5">
                    <div className="flex items-center justify-between  pt-5 pb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">ที่อยู่</h1>
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex cursor-pointer">
                            <Plus className="pr-2" /> เพิ่มที่อยู่
                        </button>
                    </div>
                    <div className="overflow-x-auto ">
                        <table className="table-auto w-full min-w-max divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <td className="text-lg font-semibold pt-5 pb-5">ลำดับ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ที่อยู่</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จัดการ</td>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 mt-6" >
                                        <td className="pt-5 pb-5 pr-5">{index + ((currentPage - 1) * dataPerPage + 1)}</td>
                                        <td className="pt-5 pb-5 pr-5">ที่อยู่ {item.address} ตำบล {item.subdistrict} อำเภอ {item.district} จังหวัด {item.province} รหัสไปรษณีย์ {item.postal_code} </td>
                                        <td className="pt-5 pb-5 pr-5 flex items-center justify-between">
                                            <button className="text-blue-500 hover:text-blue-700 flex cursor-pointer" onClick={() => handleReaed(item.address_id)}> <Pencil className="pr-2" />แก้ไข</button>
                                            <button className="text-red-500 hover:text-red-700 ml-4 flex cursor-pointer" onClick={() => handleReaedDelete(item.address_id)}> <Trash2 className="pr-2" />Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="sm:hidden px-4 py-3 sm:px-6">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, addresses.length)}</span> of <span className="font-medium">{addresses.length}</span> results
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
                                    Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, addresses.length)}</span> of <span className="font-medium">{addresses.length}</span> results
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

            <Dialog open={open} onClose={setOpen} className="relative z-60">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:block" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <DialogPanel
                            transition
                            className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-2xl" >
                            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8">
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                </button>

                                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">

                                    <div className="col-span-12">
                                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">เพิ่มหมวดหมู่</h2>

                                        <section aria-labelledby="options-heading" className="mt-10">
                                            <form onSubmit={hdlSaveAddress}>
                                                <div className="space-y-2">
                                                    <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-3">ที่อยู่ใหม่</label>
                                                    <input
                                                        id="address"
                                                        name="address"
                                                        type="text"
                                                        placeholder="กรุณากรอกที่อยู่"
                                                        value={getaddress.address}
                                                        onChange={handleOnChange}
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white mt-5 px-4 py-2 hover:bg-blue-700 w-full rounded-md">
                                                    บันทึกที่อยู่
                                                </button>
                                            </form>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openEdit} onClose={setOpenEdit} className="relative z-60">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:block" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <DialogPanel
                            transition
                            className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-2xl" >
                            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                <button
                                    type="button"
                                    onClick={() => setOpenEdit(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8">
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                </button>

                                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">

                                    <div className="col-span-12">
                                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">เพิ่มหมวดหมู่</h2>

                                        <section aria-labelledby="options-heading" className="mt-10">
                                            <form onSubmit={handleUpadteAddress}>
                                                <div className="space-y-2">
                                                    <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-3">ที่อยู่ใหม่</label>
                                                    <input
                                                        id="address"
                                                        name="address"
                                                        type="text"
                                                        placeholder="กรุณากรอกที่อยู่"
                                                        value={getaddress.address}
                                                        onChange={handleOnChange}
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
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
                                                        className="w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-3 rounded-md"
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white mt-5 px-4 py-2 hover:bg-blue-700 w-full rounded-md">
                                                    บันทึกที่อยู่
                                                </button>
                                            </form>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div >
    )
}

export default Account