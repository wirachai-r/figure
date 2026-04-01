import React from 'react'
import { ShoppingCart } from 'lucide-react';
import useFigureStore from "../../store/figure-store";
import { numberFormat } from '../../utils/number';
import { Link } from "react-router-dom";

const ProductShop = ({ item }) => {
    const actionAddtoCart = useFigureStore((state) => state.actionAddtoCart);
    return (

        <div className="group">
            <Link to={"/shop/" + item.product_id}>
                <div>
                    {
                        item.images && item.images.length > 0 && item.images[0].image_id != null
                            ? <img src={`http://localhost:3001/img/${item.images[0].image_name}`} className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8" />
                            : <div className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-8/8 text-center items-center flex justify-center"> No image</div>
                    }

                    <h3 className="mt-2 text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-700">
                        {item.description.length > 20 ? `${item.description.substring(0, 20)}...` : item.description}
                    </p>
                </div>
            </Link>
            <div className="flex justify-between">
                <div className='text-sm pt-2 text-blue-400'>{numberFormat(item.price)} บาท</div>
                <button className='pr-5 cursor-pointer' onClick={() => actionAddtoCart(item)}><ShoppingCart className='hover:text-blue-400' /></button>
            </div>
        </div>
    )
}

export default ProductShop