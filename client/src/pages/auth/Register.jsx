import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";

const registerSchema = z.object({
    username: z.string(),
    email: z.string().email({ message: "รูปแบบไม่ถูกต้อง" }),
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    password: z.string().min(8, { message: "Password ต้องมากกว่า 8 ตัวอักษร" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password ไม่ตรงกัน",
    path: ["confirmPassword"],
});


const Register = () => {
    const [passwordScore, setPasswordScore] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone_number: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // console.log(formData);
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();

        //Password and Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            return alert("Password and Confirm Password do not match");
        }

        console.log(formData);

        // Send to Back
        try {
            const res = await axios.post("http://localhost:3001/api/register", formData);

            console.log(res.data);
            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            const errMsg = err.response?.data?.message;
            toast.error(errMsg);
            console.log(err);
        }
    };

    const validatePassword = () => {
        let password = watch().password;
        return zxcvbn(password ? password : "").score;
    };
    useEffect(() => {
        setPasswordScore(validatePassword());
    }, [watch().password]);

    const onSubmit = async (data) => {
        console.log(data);
        // const passwordScore = zxcvbn(data.password).score;
        // console.log(passwordScore);
        // if (passwordScore < 3) {
        //   toast.warning("Password บ่ Strong!!!!!");
        //   return;
        // }
        // console.log("ok ลูกพี่");
        // Send to Back

        try {
            const res = await axios.post("http://localhost:3001/api/register", data);

            console.log(res.data);
            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            const errMsg = err.response?.data?.message;
            toast.error(errMsg);
            console.log(err);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Register your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                            ชื่อผู้ใช้
                        </label>
                        {/* <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            />
                        </div> */}
                        <div className="mt-2">
                            <input
                                type="text"
                                required
                                {...register("username")}
                                placeholder="กรุณากรอกชื่อผู้ใช้"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            />
                        </div>

                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            อีเมล
                        </label>
                        <div className="mt-2">
                            {/* <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            /> */}
                            <input
                                type="email"
                                required
                                {...register("email")}
                                placeholder="กรุณากรอกอีเมล"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            />

                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">
                                ชื่อ
                            </label>
                            <div className="mt-2">
                                {/* <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                /> */}
                                <input
                                    type="text"
                                    required
                                    {...register("first_name")}
                                    placeholder="กรุณากรอกชื่อ"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">
                                นามสกุล
                            </label>
                            <div className="mt-2">
                                {/* <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                /> */}
                                <input
                                    type="text"
                                    required
                                    {...register("last_name")}
                                    placeholder="กรุณากรอกนามสกุล"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone_number" className="block text-sm/6 font-medium text-gray-900">
                            เบอร์โทร
                        </label>
                        <div className="mt-2">
                            {/* <input
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                required
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            /> */}
                            <input
                                type="text"
                                required
                                {...register("phone_number")}
                                placeholder="กรุณากรอกเบอร์โทร"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                            รหัสผ่าน
                        </label>
                        <div className="mt-2">
                            {/* <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            /> */}
                            <input
                                type="password"
                                required
                                {...register("password")}
                                placeholder="กรุณากรอกรหัสผ่าน"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                        {watch().password?.length > 0 && (
                            <div className="flex mt-2">
                                {Array.from(Array(5).keys()).map((item, index) => (
                                    <span className="w-1/5 px-1" key={index}>
                                        <div
                                            className={`rounded h-2 ${passwordScore <= 2
                                                ? "bg-red-500"
                                                : passwordScore < 4
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                                }`}
                                        ></div>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                            ยืนยันรหัสผ่าน
                        </label>
                        <div className="mt-2">
                            {/* <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            /> */}
                            <input
                                type="password"
                                required
                                {...register("confirmPassword")}
                                placeholder="กรุณายืนยันรหัสผ่าน"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register