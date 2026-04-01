import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadFiles, removeFiles } from "../../api/product";
import useFigureStore from "../../store/figure-store";

const Updatefile = ({ form, setForm }) => {
    const token = useFigureStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(false);

    const getProduct = useFigureStore((state) => state.getProduct)
    const products = useFigureStore((state) => state.products)

    useEffect(() => {
        getProduct(token)
    }, [])

    const handleOnChangeSS = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsLoading(true);

        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`File ${file.name} is not an image`);
                return false;
            }
            return true;
        });

        const formData = new FormData();

        // เพิ่มเฉพาะไฟล์รูปภาพลงใน formData
        validFiles.forEach((file) => {
            formData.append('images', file);  // 'images' ต้องตรงกับ multer.array('images') ฝั่งเซิร์ฟเวอร์
        });

        // console.log(formData);

        try {
            const res = await uploadFiles(token, form.id, formData);
            console.log(res.data);
            toast.success(`Upload images success!!!`);

            // อัปเดตรูปภาพที่ถูกอัปโหลดลงใน form.image
            setForm((prevForm) => ({
                ...prevForm,
                image: [...(prevForm.image || []), ...res.data.images] // รวมภาพใหม่กับของเดิม
            }));

            getCategory(token);
        } catch (err) {
            console.log(err);
        }
        getProduct(token)
    };

    const handleDelete = async (imageName) => {
        // กรองเฉพาะรูปที่มีชื่อไม่ตรงกับ imageName ที่ลบ
        const updatedImages = form.image.filter((item) => {
            // ถ้ารูปคือไฟล์ที่เพิ่มเข้ามาจากเครื่อง (ไม่มี image_name) ให้ใช้ item.name

            return item.image_name ? item.image_name !== imageName : item.name !== imageName;
        });

        console.log(imageName)

        try {
            const res = await removeFiles(token, form.id, imageName);
            console.log(res.data);
            toast.success(`Remove images success!!!`);
        } catch (err) {
            console.log(err);
        }

        // อัปเดต state ใหม่หลังจากการลบ
        setForm({
            ...form,
            image: updatedImages, // Update the form images after delete
        });
        getProduct(token)
    };

    return (
        <>
            <div>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleOnChangeSS}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    multiple
                />
            </div>
            <div>
                {form.image && form.image.length > 0 && form.image.map((item, index) => (
                    <div key={index} className="relative inline-block mr-2 mb-2 rounded-lg">
                        {/* ตรวจสอบว่า item เป็น instance ของ File หรือไม่ */}
                        {item && (item instanceof File) ? (
                            <img
                                src={URL.createObjectURL(item)} // ใช้ URL.createObjectURL ถ้าเป็นไฟล์ที่ยังไม่ได้อัปโหลด
                                alt={item.name || "Image"} // ใช้ alt เป็นชื่อไฟล์หรือข้อความ "Image" ถ้าไม่มี
                                className="w-70 p-5 rounded-lg"
                            />
                        ) : (
                            item.image_name ? (
                                <img
                                    src={`http://localhost:3001/img/${item.image_name}`} // ใช้ URL ของเซิร์ฟเวอร์
                                    alt={item.image_name || "Image"}
                                    className="w-70 p-5 rounded-lg aspect-square"
                                />
                            ) : (
                                <></>
                            )
                        )}

                        {/* แสดงปุ่ม X เฉพาะเมื่อมีภาพ (ทั้งจากไฟล์หรือจากเซิร์ฟเวอร์) */}
                        {item && (item instanceof File || item.image_name) && (
                            <span
                                onClick={() => handleDelete(item.image_name || item.name)} // Click to trigger delete function
                                className="absolute top-0 right-0 bg-red-500 p-1 rounded-md cursor-pointer mt-7 mr-7"
                            >
                                X
                            </span>
                        )}
                    </div>
                ))}

            </div>
        </>
    );
};

export default Updatefile;
