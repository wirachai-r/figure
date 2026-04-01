import React, { useEffect, useState } from 'react'
import useFigureStore from "../../store/figure-store";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { numberFormat } from '../../utils/number';

const SearchShop = () => {
    const getProduct = useFigureStore((state) => state.getProduct)
    const products = useFigureStore((state) => state.products)
    const actionSearchFilters = useFigureStore((state) => state.actionSearchFilters)
    const getCategory = useFigureStore((state) => state.getCategory)
    const categories = useFigureStore((state) => state.categories)

    const [text, setText] = useState('')
    const [categorySelected, setCategorySelected] = useState([]);

    const [price, setPrice] = useState([0, 30000]);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        getCategory()
    }, [])

    // console.log(products)

    useEffect(() => {
        const delay = setTimeout(() => {

            if (text.trim()) {
                actionSearchFilters({ query: text })
            } else {
                getProduct()
            }

        }, 300)

        return () => clearTimeout(delay)

    }, [text, actionSearchFilters, getProduct])

    const handleCheck = (e) => {

        // console.log(e.target.value);

        const inCheck = e.target.value; // ค่าที่เรา ติ๊ก
        const inState = [...categorySelected]; // [1,2,3] arr ว่าง
        const findCheck = inState.indexOf(inCheck); // ถ้าไม่เจอ จะ return -1

        if (findCheck === -1) {
            inState.push(inCheck);
        } else {
            inState.splice(findCheck, 1);
        }
        setCategorySelected(inState);

        if (inState.length > 0) {
            actionSearchFilters({ category: inState });
        } else {
            getProduct();
        }
    };

    useEffect(() => {
        actionSearchFilters({ price });
    }, [ok]);

    const handlePrice = (value) => {

        // console.log(value);

        setPrice(value);

        setTimeout(() => {
            setOk(!ok);
        }, 300);
    };

    return (
        <>
            <h3 className="space-y-4 pb-6 font-medium text-gray-900 text-xl">ค้นหาสินค้า</h3>
            <div className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                <input
                    type="text"
                    onChange={(e) => setText(e.target.value)}
                    placeholder='ค้นหาสินค้า...'
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400 sm:text-sm/6"
                />
            </div>
            <h3 className="space-y-4 pb-6 font-medium text-gray-900 text-xl mt-5">หมวดหมู่สินค้า</h3>
            <div className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                {
                    categories.map((item) =>
                        <div className='flex gap-2' key={item.category_id}>
                            <input
                                onChange={handleCheck}
                                value={item.category_id}
                                type="checkbox"
                                className="text-red-600 focus:ring-red-500"
                            />
                            <label>{item.name}</label>
                        </div>
                    )
                }
            </div>
            <h3 className="space-y-4 pb-6 font-medium text-gray-900 text-xl mt-5">ค้นหาราคา</h3>
            <div className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                <div className="flex justify-between">
                    <span>Min : {numberFormat(price[0])}</span>
                    <span>Max : {numberFormat(price[1])}</span>
                </div>

                <Slider
                    onChange={handlePrice}
                    range
                    min={0}
                    max={50000}

                    defaultValue={[0, 30000]}
                />
            </div>
        </>
    )
}

export default SearchShop