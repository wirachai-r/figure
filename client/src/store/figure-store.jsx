import { create } from "zustand";
import axios from "axios";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/category";
import { listProduct, searchFilters } from "../api/product";
import _ from "lodash";

const figureStore = (set, get) => ({
    user: null,
    token: null,
    categories: [],
    products: [],
    carts: [],
    logout: () => {
        set({
            user: null,
            token: null,
            categories: [],
            products: [],
            carts: [],
        });
    },
    actionAddtoCart: (product) => {

        const carts = get().carts;
        const updateCart = [...carts, { ...product, count: 1 }];
        // Step Uniqe
        const uniqe = _.unionWith(updateCart, _.isEqual);
        set({ carts: uniqe });
        // console.log(uniqe)
        // console.log(updateCart)
    },
    actionUpdateQuantity: (productId, newQuantity) => {
        //console.log('Update Clickkkkk', productId, newQuantity)
        set((state) => ({
            carts: state.carts.map((item) =>
                item.product_id === productId
                    ? { ...item, count: Math.max(1, newQuantity) }
                    : item
            ),
        }));
    },
    actionRemoveProduct: (productId) => {
        // console.log('remove jaaaaa', productId)
        set((state) => ({
            carts: state.carts.filter((item) => item.product_id !== productId),
        }));
    },
    getTotalPrice: () => {
        return get().carts.reduce((total, item) => {
            return total + item.price * item.count;
        }, 0);
    },
    actionLogin: async (formData) => {
        const res = await axios.post("http://localhost:3001/api/login", formData);
        set({
            user: res.data.payload,
            token: res.data.token,
        });
        return res;
    },
    getCategory: async (token) => {
        try {
            const res = await listCategory(token)
            set({
                categories: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getProduct: async (token, count) => {
        try {
            const res = await listProduct(token, count);
            set({ products: res.data });
        } catch (err) {
            console.log(err);
        }
    },
    actionSearchFilters: async (arg) => {
        try {
            const res = await searchFilters(arg);
            set({ products: res.data });
        } catch (err) {
            console.log(err);
        }
    },
    clearCart: () => set({ carts: [] }),
});

const usePersist = {
    name: "figure-store",
    storage: createJSONStorage(() => localStorage),
};

const useFigureStore = create(persist(figureStore, usePersist));

export default useFigureStore;