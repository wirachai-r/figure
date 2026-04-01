import { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductShop from "../shop/ProductShop";

const NewProduct = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        handleGetProduct()
    }, [])

    const handleGetProduct = () => {
        listProductBy("p.created_at", "desc", 12)
            .then((res) => {
                //console.log(res.data)
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-20">สินค้าใหม่</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6 xl:gap-x-8">
                {
                    data.map((item, index) =>
                        <ProductShop key={index} item={item} />
                    )
                }
            </div>
        </>
    )
}

export default NewProduct