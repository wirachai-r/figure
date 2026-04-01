import { useEffect, useState } from "react";
import { createCategory, listCategory, removeCategory, updateCategory } from "../../api/category";
import useFigureStore from "../../store/figure-store";
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus } from 'lucide-react';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const FormCategory = () => {
    const token = useFigureStore((state) => state.token);
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    // const [categories, setCategories] = useState([]);
    const categories = useFigureStore((state) => state.categories)
    const getCategory = useFigureStore((state) => state.getCategory)

    const [open, setOpen] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openSubmit, setOpenSubmit] = useState(false)

    const MySwal = withReactContent(Swal)

    useEffect(() => {
        getCategory(token)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            return toast.warning('Please fill data');
        }

        try {
            const res = await createCategory(token, { name });
            console.log(res.data.name);
            toast.success(`Add Category ${res.data.name} success!!!`);
            getCategory(token);
        } catch (err) {
            console.log(err);
        }
        setOpen(false);
        setName('');
    };

    const handleReaed = async (id, name) => {
        try {
            setOpenEdit(true); // เปิด Modal
            setName(name)
            setId(id)
        } catch (err) {
            console.log(err);
        }
    }

    const handleReaedDelete = async (id, name) => {
        try {
            setOpenSubmit(true); // เปิด Modal
            setName(name)
            setId(id)
            MySwal.fire({
                title: "คุณแน่ใจหรือไม่ว่าต้องการลบ",
                text: `ข้อมูลทั้งหมดของ ${name} จะถูกลบออกอย่างถาวร การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
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

    useEffect(() => {
        if (!openEdit && !openSubmit || open) {
            const timer = setTimeout(() => {
                setName('')
                setId('')
            }, 1000); // หน่วงเวลา 500 มิลลิวินาที (0.5 วินาที)

            return () => clearTimeout(timer); // เคลียร์ timeout ถ้ามีการเปลี่ยนค่า `openEdit` ก่อน timeout ทำงาน
        }
    }, [openEdit, openSubmit, open]);

    const handleUpadte = async (e) => {
        e.preventDefault();
        // console.log(id)
        // console.log(name)
        try {
            const res = await updateCategory(token, id, name);
            console.log(res.data.name);
            toast.success(`Update ${res.data.name} success!!!`);
        } catch (err) {
            console.log(err);
        }
        getCategory(token);
        setOpenEdit(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await removeCategory(token, id)
            console.log(res)
            toast.success(`Deleted success`)
            getCategory(token);
        } catch (err) {
            console.log(err)
        }
        getCategory(token);
        setOpenSubmit(false);
    }

    const dataPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(categories.length / dataPerPage);

    const currentData = categories.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

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
                    <h2 className="text-lg font-semibold">หมวดหมู่</h2>
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition flex cursor-pointer">
                        <Plus className="pr-2" /> เพิ่มหมวดหมู่
                    </button>
                </div>
            </div>
            <div className="bg-white border border-gray-200 mt-5">
                <div className="p-4 lg:px-8 ">
                    <div className="overflow-x-auto ">
                        <table className="table-fixed w-full min-w-max divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <td className="text-lg font-semibold pt-5 pb-5">ลำดับ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">ชื่อ</td>
                                    <td className="text-lg font-semibold pt-5 pb-5">จัดการ</td>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 mt-6" >
                                        <td className="pt-5 pb-5 pr-5">{index + ((currentPage - 1) * dataPerPage + 1)}</td>
                                        <td className="pt-5 pb-5 pr-5">{item.name}</td>
                                        <td className="pt-5 pb-5 pr-5 flex items-center justify-between">
                                            <button className="text-blue-500 hover:text-blue-700 flex cursor-pointer" onClick={() => handleReaed(item.category_id, item.name)}> <Pencil className="pr-2" />แก้ไข</button>
                                            <button className="text-red-500 hover:text-red-700 ml-4 flex cursor-pointer" onClick={() => handleReaedDelete(item.category_id, item.name)}> <Trash2 className="pr-2" />Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="sm:hidden px-4 py-3 sm:px-6">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, categories.length)}</span> of <span className="font-medium">{categories.length}</span> results
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
                                    Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, categories.length)}</span> of <span className="font-medium">{categories.length}</span> results
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
                                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">เพิ่มหมวดหมู่</h2>

                                        <section aria-labelledby="options-heading" className="mt-10">

                                            <form onSubmit={handleSubmit}>
                                                <fieldset aria-label="Choose a size" className="mt-10">
                                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                                        ชื่อหมวดหมู่
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="กรุณากรอกชื่อหมวดหมู่"
                                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                        required />

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
                                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">เพิ่มหมวดหมู่</h2>

                                        <section aria-labelledby="options-heading" className="mt-10">

                                            <form onSubmit={handleUpadte}>
                                                <fieldset aria-label="Choose a size" className="mt-10">
                                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                                        ชื่อหมวดหมู่
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="กรุณากรอกชื่อหมวดหมู่"
                                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                                        required />

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
        </>
    );
};

export default FormCategory;
