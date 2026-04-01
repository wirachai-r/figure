import React, { useEffect, useState } from 'react'
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { numberFormat } from "../utils/number";
import useFigureStore from "../store/figure-store";
import { readProduct } from "../api/product";
import NotFound from '../pages/NotFound'

const features = [
    { name: 'Origin', description: 'Designed by Good Goods, Inc.' },
    { name: 'Material', description: 'Solid walnut base with rare earth magnets and powder coated steel card cover' },
    { name: 'Dimensions', description: '6.25" x 3.55" x 1.15"' },
    { name: 'Finish', description: 'Hand sanded and finished with natural oil' },
    { name: 'Includes', description: 'Wood card tray and 3 refill packs' },
    { name: 'Considerations', description: 'Made from natural materials. Grain and color vary with each item.' },
]

const ProductShop = () => {
    const { id } = useParams()
    const token = useFigureStore((state) => state.token);
    const actionAddtoCart = useFigureStore((state) => state.actionAddtoCart);

    const [form, setForm] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        fetchProduct(token, id)
    }, [])

    const fetchProduct = async (token, id) => {
        try {
            // code
            const res = await readProduct(token, id)

            setForm(res.data)
        } catch (err) {
            console.log('Err fetch data', err)
        }
    }
    console.log(form);
    // console.log(form?.[0]?.product_id);

    if (!form || form?.[0]?.product_id === null) {
        return <NotFound />;
    }

    return (
        <div className="bg-white min-h-screen">
            <Link to={-1}>
                <div className='flex pt-5 cursor-pointer hover:text-gray-600'>
                    <ChevronLeft /> ย้อนกลับ
                </div>
            </Link>
            {
                form?.map((item, index) =>
                    <div key={index} className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 px-4 py-8 sm:px-6 sm:py-8 lg:grid-cols-2 lg:px-8">
                        {item.images?.length <= 1 ? (
                            <div className="grid grid-cols-1 grid-rows-1 gap-4 sm:gap-6 lg:gap-8">

                                {item.images?.map((image, i) => (
                                    image && image.image_id != null
                                        ? <img key={i} src={`http://localhost:3001/img/${image.image_name}`} className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 w-full" />
                                        : <div key={i} className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 text-center items-center flex justify-center w-full"> No image</div>
                                ))}
                            </div>
                        ) :
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                {item.images?.map((image, i) => (
                                    image && image.image_id != null
                                        ? <img key={i} src={`http://localhost:3001/img/${image.image_name}`} className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 w-full" />
                                        : <div key={i} className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 text-center items-center flex justify-center w-full"> No image</div>
                                ))}
                            </div>
                        }

                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{item.name}</h2>
                            <p className="mt-4 text-gray-500">
                                {item.description}
                            </p>
                            <div className='mt-4 text-gray-800'>ขายไปแล้ว {numberFormat(item.sold)} ชิ้น</div>
                            <h3 className="mt-8 text-4xl font-medium text-blue-400">{numberFormat(item.price)} บาท</h3>
                            <button className="mt-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-full py-2 flex justify-center items-center" onClick={() => actionAddtoCart(item)}>
                                <ShoppingCart className='' /> เพิ่มตะกร้าสินค้า
                            </button>
                            <dl className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">

                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">ชื่อตัวละคร</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{item.character_name}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">สัดส่วนสินค้า</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{item.scale}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">ซีรีส์สินค้า</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{item.series}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">ผู้ผลิต</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{item.manufacturer}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )
            }
        </div>

    )
}

export default ProductShop