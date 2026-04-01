import React, { useState } from "react";
import { toast } from "react-toastify";
import useFigureStore from "../../store/figure-store";

const Uploadfile = ({ form, setForm }) => {
    const token = useFigureStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChangeS = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsLoading(true);

        // ✅ ตรวจสอบให้แน่ใจว่า form.image เป็น array
        let allFiles = Array.isArray(form.image) ? [...form.image] : [];

        // ✅ กรองเฉพาะไฟล์ที่เป็นรูปภาพ
        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`File ${file.name} is not an image`);
                return false;
            }
            return true;
        });

        // ✅ ใช้ setForm อย่างถูกต้อง
        setForm((prevForm) => ({
            ...prevForm,
            image: [...allFiles, ...validFiles], // รวมไฟล์เก่ากับไฟล์ใหม่
        }));

        setIsLoading(false);

        //console.log("Updated images:", [...allFiles, ...validFiles]);
    };

    //console.log(form)

    const handleDelete = (imageName) => {
        // Filter out the deleted image from the form.image array
        const updatedImages = form.image.filter((item) => item.name !== imageName);

        // Update form state with the new list of images
        setForm({
            ...form,
            image: updatedImages, // Update the form images after delete
        });
    };

    return (
        <>
            <div>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleOnChangeS}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    multiple
                />
            </div>
            <div>
                {form.image.map((item, index) => (
                    <div key={index} className="relative inline-block mr-2 mb-2 rounded-lg">
                        {item && (item instanceof File) ? (
                            <img
                                src={URL.createObjectURL(item)} // ใช้ URL.createObjectURL ถ้าเป็นไฟล์ที่ยังไม่ได้อัปโหลด
                                alt={item.name || "Image"} // ใช้ alt เป็นชื่อไฟล์หรือข้อความ "Image" ถ้าไม่มี
                                className="w-70 p-5 rounded-lg"
                            />
                        ) : (
                            <></>
                        )}
                        <span
                            onClick={() => handleDelete(item.name)} // Click to trigger delete function
                            className="absolute top-0 right-0 bg-red-500 p-1 rounded-md cursor-pointer mt-7 mr-7"
                        >
                            X
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Uploadfile;