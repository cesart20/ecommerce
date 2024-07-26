
import {create} from "zustand";
import { CartProduct } from "@/interfaces";
import { persist } from "zustand/middleware";



interface State {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSumaryInformation: () => {
        subTotals: number;
        tax: number;
        total: number;
        itemsInCart: number
    };

    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
    // clearCart: () => void;
}


export const useCartStore = create<State>()(


    persist(
        (set, get) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce( (total, item) => total + item.quantity, 0 );
            },

            getSumaryInformation: () => {
                const { cart } = get();
                
                const subTotals = cart.reduce(
                    (subTotal, product) => (product.quantity * product.price) + subTotal,
                0);

                const tax = subTotals * 0.15;
                const total = subTotals + tax;
                const itemsInCart = cart.reduce( (total, item) => total + item.quantity, 0 );
                
                return {
                    subTotals,
                    tax,
                    total,
                    itemsInCart
                }
            },
    
            addProductToCart: (product: CartProduct) => {
                const { cart } = get();
    
                // 1- Revisar si el producto ya existe en el carrito
                const productInCart = cart.some( 
                    (item) => (item.id === product.id && item.size === product.size)
                );
    
                if ( !productInCart ) {
                    set({ cart: [...cart, product] });
                    return;
                }
    
                // 2- Si el producto ya existe, actualizar la cantidad
                const updatedCartProducts = cart.map( item => {
                    if ( item.id === product.id && item.size === product.size ) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    }
    
                    return item;
                });
    
                set({ cart: updatedCartProducts });
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();
                const updatedCartProducts = cart.map( item => {
                    if ( item.id === product.id && item.size === product.size ) {
                        return {
                            ...item,
                            quantity
                        }
                    }
    
                    return item;
                });
    
                set({ cart: updatedCartProducts });
            },

            removeProduct: (product: CartProduct) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter( item => item.id !== product.id || item.size !== product.size );
                set({ cart: updatedCartProducts });
            }
        }), 
        {
            name: "shopping-cart",
        }
    )

    
    
)