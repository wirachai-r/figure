import { useEffect, useState } from "react";

import { listProductBy } from "../../api/product";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Autoplay, Navigation } from "swiper/modules";

const ContentCarousel = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        handleGetProduct()
    }, [])

    const handleGetProduct = () => {
        listProductBy("p.sold", "desc", 6)
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
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper lg:h-160 object-cover object-center rounded-md">
                {data?.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img src={`http://localhost:3001/img/${item.images[0].image_name}`} className="w-full" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default ContentCarousel