import { useEffect, useState } from "react";
import { createProduct, readProduct, updateProduct, deleteProduct } from "../../api/product";
import useFigureStore from "../../store/figure-store";
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { numberFormat } from "../../utils/number";

import Uploadfile from './Uploadfile';
import Updatefile from './Updatefile';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { dateFormat } from "../../utils/dateformat";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const initialState = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    manufacturer: "",
    series: "",
    character_name: "",
    scale: "",
    release_date: "",
    category_id: null,
    image: [],
}

const FormCategory = () => {
    const token = useFigureStore((state) => state.token);
    // const [categories, setCategories] = useState([]);
    const getCategory = useFigureStore((state) => state.getCategory)
    const categories = useFigureStore((state) => state.categories)
    const getProduct = useFigureStore((state) => state.getProduct)
    const products = useFigureStore((state) => state.products)

    //console.log(products)

    const [form, setForm] = useState(initialState);

    const [open, setOpen] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openSubmit, setOpenSubmit] = useState(false)

    const MySwal = withReactContent(Swal)

    useEffect(() => {
        getCategory(token)
        getProduct(token)
    }, [])

    const handleOnChange = async (e) => {
        console.log(e.target.name, e.target.value)
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // เพิ่มข้อมูลจาก form ไปใน formData
        for (const key in form) {
            if (form.hasOwnProperty(key)) {
                formData.append(key, form[key]);
            }
        }

        // เพิ่มไฟล์ลงใน formData (ใช้ 'images' แทน 'image' ถ้าฝั่ง server ใช้ array)
        if (form.image) {
            form.image.forEach((file) => {
                formData.append('images', file);  // ชื่อ 'images' ตรงกับที่ตั้งใน multer.array('images')
            });
        }

        try {
            const res = await createProduct(token, formData);
            console.log(res.data.name);
            toast.success(`Add Category ${res.data.name} success!!!`);
            getCategory(token)
            getProduct(token)
        } catch (err) {
            console.log(err);
        }

        setOpen(false);
    };

    const handleReaed = async (id) => {
        try {
            const productReaed = await readProduct(token, id);
            const product = productReaed.data[0]; // เอา object ตัวแรกจาก data (ถ้ามีหลายตัวให้วนลูปตามต้องการ)

            //console.log(productReaed.data[0])
            // ตั้งค่า form ด้วยข้อมูลจาก product

            const images = product.images && product.images.length > 0 ? product.images : [];
            const category_id = product.category_id ?? null;

            //console.log(product.category_id)
            //console.log(images)
            setForm({
                id: product.product_id || 0,
                name: product.name || "",
                description: product.description || "",
                price: product.price || 0,
                quantity: product.quantity || 0,
                manufacturer: product.manufacturer || "",
                series: product.series || "",
                character_name: product.character_name || "",
                scale: product.scale || "",
                release_date: product.release_date || "",
                category_id: category_id,
                image: images,
            });

            setOpenEdit(true);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!openEdit && !openSubmit || open) {
            const timer = setTimeout(() => {
                setForm({
                    name: "",
                    description: "",
                    price: 0,
                    quantity: 0,
                    manufacturer: "",
                    series: "",
                    character_name: "",
                    scale: "",
                    release_date: "",
                    category_id: "",
                    image: [],
                });
            }, 1000); // หน่วงเวลา 500 มิลลิวินาที (0.5 วินาที)

            return () => clearTimeout(timer); // เคลียร์ timeout ถ้ามีการเปลี่ยนค่า `openEdit` ก่อน timeout ทำงาน
        }
    }, [openEdit, openSubmit, open]);

    const handleUpadte = async (e) => {
        e.preventDefault();
        console.log(form.category_id)
        try {
            const res = await updateProduct(token, form.id, form);
            console.log(res.data.name);
            toast.success(`Update ${res.data.name} success!!!`);
        } catch (err) {
            console.log(err);
        }

        setOpenEdit(false);
        getCategory(token)
        getProduct(token)
    };

    const handleReaedDelete = async (id) => {
        try {
            const productReaed = await readProduct(token, id);
            const product = productReaed.data[0]; // เอา object ตัวแรกจาก data (ถ้ามีหลายตัวให้วนลูปตามต้องการ)

            //console.log(productReaed.data[0])
            // ตั้งค่า form ด้วยข้อมูลจาก product

            const images = product.images && product.images.length > 0 ? product.images : [];
            const category_id = product.category_id ?? null;

            //console.log(images)
            setForm({
                name: product.name || "",
                description: product.description || "",
                price: product.price || 0,
                quantity: product.quantity || 0,
                manufacturer: product.manufacturer || "",
                series: product.series || "",
                character_name: product.character_name || "",
                scale: product.scale || "",
                release_date: product.release_date || "",
                category_id: category_id,
                image: images,
            });

            setOpenSubmit(true);

            MySwal.fire({
                title: "คุณแน่ใจหรือไม่ว่าต้องการลบ",
                text: `ข้อมูลทั้งหมดของ ${form.name} จะถูกลบออกอย่างถาวร การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ยันยัน",
                cancelButtonText: "ยกเลิก"
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(id);
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
        }
    }

    const handleDelete = async (id) => {
        console.log(id)
        try {
            const res = await deleteProduct(token, id)
            console.log(res)
            toast.success(`Deleted success`)
        } catch (err) {
            console.log(err)
        }
        setOpenSubmit(false);
        getCategory(token)
        getProduct(token)
    }

    const dataPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / dataPerPage);

    const currentData = products.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

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
                    <h2 className="text-lg font-semibold">สินค้า</h2>
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition flex cursor-pointer">
                        <Plus className="pr-2" />
                        เพิ่มสินค้า
                    </button>
                </div>
            </div>
            <div className="bg-white border border-gray-200 mt-5">
                <div className="p-4 lg:px-8 ">
                    <div className="overflow-x-auto ">
                        <table className="table-fixed w-full min-w-6xl divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <td className="text-lg font-semibold pt-5 pb-5">ลำดับ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">รูป</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ชื่อ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ราคา</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จำนวนคงเหลือ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จำนวนที่ขายได้</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">วันที่อัพเดต</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จัดการ</td>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 mt-6" >
                                        <td className="pt-5 pb-5 pr-5 align-text-top">{index + ((currentPage - 1) * dataPerPage + 1)}</td>
                                        <td className="pt-5 pb-5 pr-5">
                                            {item.images && item.images.length > 0 && item.images[0].image_id != null
                                                ? <img src={`http://localhost:3001/img/${item.images[0].image_name}`} className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8" />
                                                : <div className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 text-center items-center flex justify-center"> No image</div>}
                                        </td>
                                        <td className="pt-5 pb-5 pr-5 align-text-top">{item.name}</td>
                                        <td className="pt-5 pb-5 pr-5 align-text-top">{numberFormat(item.price)}</td>
                                        <td className="pt-5 pb-5 pr-5 align-text-top">{item.quantity}</td>
                                        <td className="pt-5 pb-5 pr-5 align-text-top">{item.sold}</td>
                                        <td className="pt-5 pb-5 pr-5 align-text-top">{dateFormat(item.updated_at)}</td>
                                        <td className="pt-5 pb-5 pr-5 flex items-center justify-between">
                                            <button className="text-blue-500 hover:text-blue-700 flex cursor-pointer" onClick={() => handleReaed(item.product_id)}> <Pencil className="pr-2" />แก้ไข</button>
                                            <button className="text-red-500 hover:text-red-700 ml-4 flex cursor-pointer" onClick={() => handleReaedDelete(item.product_id)}> <Trash2 className="pr-2" />ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="sm:hidden px-4 py-3 sm:px-6">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, products.length)}</span> of <span className="font-medium">{products.length}</span> results
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
                                    Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, products.length)}</span> of <span className="font-medium">{products.length}</span> results
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
            </div >
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
                                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">เพิ่มสินค้า</h2>

                                        <section aria-labelledby="options-heading" className="mt-10">

                                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                <fieldset aria-label="Product Details" className="mt-10">
                                                    {/* Basic Product Information */}
                                                    <div className="space-y-4 mb-4">
                                                        <div>
                                                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                                                ชื่อสินค้า
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                value={form.name}
                                                                onChange={handleOnChange}
                                                                placeholder="กรุณากรอกชื่อสินค้า"
                                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                                                                รายละเอียดสินค้า
                                                            </label>
                                                            <textarea
                                                                id="description"
                                                                name="description"
                                                                value={form.description}
                                                                onChange={handleOnChange}
                                                                placeholder="กรุณากรอกรายละเอียดสินค้า"
                                                                rows={3}
                                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Categories */}
                                                    <div className="space-y-4 mb-4">
                                                        <label htmlFor="category_id" className="block text-sm/6 font-medium text-gray-900">
                                                            หมวดหมู่สินค้า
                                                        </label>
                                                        <select
                                                            id="category_id"
                                                            name="category_id"
                                                            value={form.category_id}
                                                            onChange={handleOnChange}
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                            required
                                                        >
                                                            <option value="" disabled selected>กรุณาเลือกหมวดหมู่สินค้า</option>
                                                            {categories.map((item, index) => (
                                                                <option key={index} value={item.category_id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Inventory and Pricing */}
                                                    <div className="space-y-4 mb-8">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                                                                    ราคา
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="price"
                                                                    name="price"
                                                                    value={form.price}
                                                                    onChange={handleOnChange}
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="quantity" className="block text-sm/6 font-medium text-gray-900">
                                                                    จำนวน
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="quantity"
                                                                    name="quantity"
                                                                    value={form.quantity}
                                                                    onChange={handleOnChange}
                                                                    min="0"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="space-y-4 mb-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="manufacturer" className="block text-sm/6 font-medium text-gray-900">
                                                                    ผู้ผลิต
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="manufacturer"
                                                                    name="manufacturer"
                                                                    value={form.manufacturer}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกผู้ผลิต"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="series" className="block text-sm/6 font-medium text-gray-900">
                                                                    ซีรีส์สินค้า
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="series"
                                                                    name="series"
                                                                    value={form.series}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกซีรีส์สินค้า"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>


                                                    </div>

                                                    {/* Inventory and Pricing */}
                                                    <div className="space-y-4 mb-8">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                                                                    สัดส่วนสินค้า
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="scale"
                                                                    name="scale"
                                                                    value={form.scale}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกสัดส่วนสินค้า"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="character_name" className="block text-sm/6 font-medium text-gray-900">
                                                                    ชื่อตัวละคร
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="character_name"
                                                                    name="character_name"
                                                                    value={form.character_name}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกชื่อตัวละคร"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Image */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label htmlFor="image_url" className="block text-sm/6 font-medium text-gray-900">
                                                                รูปภาพ
                                                            </label>

                                                            <Uploadfile form={form} setForm={setForm} />

                                                            {/* <input
                                                                type="url"
                                                                id="image_url"
                                                                name="image_url"
                                                                value={form.image_url}
                                                                onChange={handleOnChange}
                                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                required
                                                            /> */}
                                                        </div>
                                                    </div>
                                                </fieldset>

                                                <button
                                                    type="submit"
                                                    className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
                                                >
                                                    ยืนยัน
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
                                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">แก้ไขสินค้า</h2>

                                        <section aria-labelledby="options-heading" className="mt-10">

                                            <form onSubmit={handleUpadte} encType="multipart/form-data">
                                                <fieldset aria-label="Product Details" className="mt-10">
                                                    {/* Basic Product Information */}
                                                    <div className="space-y-4 mb-4">
                                                        <div>
                                                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                                                ชื่อสินค้า
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                value={form.name}
                                                                onChange={handleOnChange}
                                                                placeholder="กรุณากรอกชื่อสินค้า"
                                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                                                                ละเอียดสินค้า
                                                            </label>
                                                            <textarea
                                                                id="description"
                                                                name="description"
                                                                value={form.description}
                                                                onChange={handleOnChange}
                                                                placeholder="กรุณากรอกรายละเอียดสินค้า"
                                                                rows={3}
                                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Categories */}
                                                    <div className="space-y-4 mb-4">
                                                        <label htmlFor="category_id" className="block text-sm/6 font-medium text-gray-900">
                                                            หมวดหมู่สินค้า
                                                        </label>
                                                        <select
                                                            id="category_id"
                                                            name="category_id"
                                                            value={String(form.category_id)} // เปลี่ยนให้เป็น string
                                                            onChange={handleOnChange}
                                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                            required
                                                        >
                                                            <option value="" disabled>กรุณาเลือกหมวดหมู่สินค้า</option>
                                                            {categories.map((item, index) => (
                                                                <option key={index} value={String(item.category_id)}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Inventory and Pricing */}
                                                    <div className="space-y-4 mb-8">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                                                                    ราคา
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="price"
                                                                    name="price"
                                                                    value={form.price}
                                                                    onChange={handleOnChange}
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="quantity" className="block text-sm/6 font-medium text-gray-900">
                                                                    จำนวน
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="quantity"
                                                                    name="quantity"
                                                                    value={form.quantity}
                                                                    onChange={handleOnChange}
                                                                    min="0"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="space-y-4 mb-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="manufacturer" className="block text-sm/6 font-medium text-gray-900">
                                                                    ผู้ผลิต
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="manufacturer"
                                                                    name="manufacturer"
                                                                    value={form.manufacturer}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกผู้ผลิต"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="series" className="block text-sm/6 font-medium text-gray-900">
                                                                    ซีรีส์สินค้า
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="series"
                                                                    name="series"
                                                                    value={form.series}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกซีรีส์สินค้า"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Inventory and Pricing */}
                                                    <div className="space-y-4 mb-8">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                                                                    สัดส่วนสินค้า
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="scale"
                                                                    name="scale"
                                                                    value={form.scale}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกสัดส่วนสินค้า"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="character_name" className="block text-sm/6 font-medium text-gray-900">
                                                                    ชื่อตัวละคร
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="character_name"
                                                                    name="character_name"
                                                                    value={form.character_name}
                                                                    onChange={handleOnChange}
                                                                    placeholder="กรุณากรอกชื่อตัวละคร"
                                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Image */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label htmlFor="image_url" className="block text-sm/6 font-medium text-gray-900">
                                                                รูปภาพ
                                                            </label>

                                                            <Updatefile form={form} setForm={setForm} />

                                                            {/* <input
                                                                type="url"
                                                                id="image_url"
                                                                name="image_url"
                                                                value={form.image_url}
                                                                onChange={handleOnChange}
                                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                                required
                                                            /> */}
                                                        </div>
                                                    </div>
                                                </fieldset>

                                                <button
                                                    type="submit"
                                                    className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
                                                >
                                                    ยืนยัน
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

            {/* <Dialog open={openSubmit} onClose={setOpenSubmit} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                            Delete {form.name}
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                คุณแน่ใจหรือไม่ว่าต้องการลบ Product ข้อมูลทั้งหมดของ Product จะถูกลบออกอย่างถาวรการดำเนินการนี้ไม่สามารถย้อนกลับได้
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => { handleDelete(form.id); }}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => setOpenSubmit(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div >
            </Dialog > */}
        </>
    );
};

export default FormCategory;
