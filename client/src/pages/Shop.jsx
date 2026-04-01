import { useEffect, useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FunnelIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'

import ProductShop from '../components/shop/ProductShop'
import SearchShop from '../components/shop/SearchShop'

import useFigureStore from "../store/figure-store";

const Shop = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const getProduct = useFigureStore((state) => state.getProduct)
    const products = useFigureStore((state) => state.products)

    useEffect(() => {
        getProduct()
    }, [])

    const dataPerPage = 12;
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
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel
                            transition
                            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">ตัวกรอง</h2>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="size-6" />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="mt-4 border-t border-gray-200 p-5">
                                <SearchShop />
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                <div className="flex items-baseline justify-between border-b border-gray-200 pt-5 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">SHOP FIGURE</h1>

                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                            <span className="sr-only">Filters</span>
                            <FunnelIcon aria-hidden="true" className="size-5" />
                        </button>
                    </div>
                </div>

                <section aria-labelledby="products-heading" className="pt-6 pb-24">
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters */}
                        <div className="hidden lg:block">
                            <SearchShop />
                        </div>

                        {/* Product grid  h-screen overflow-y-auto*/}
                        <div className="lg:col-span-3 ">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {
                                    currentData.map((item, index) =>
                                        <ProductShop key={index} item={item} />
                                    )
                                }
                            </div>

                            <div className="sm:hidden px-4 py-3 sm:px-6 mt-10">
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * dataPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * dataPerPage, products.length)}</span> of <span className="font-medium">{products.length}</span> results
                                </p>
                            </div>

                            <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 sm:mt-15">
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

                    </div>


                </section>

            </div >
        </div >
    )
}

export default Shop