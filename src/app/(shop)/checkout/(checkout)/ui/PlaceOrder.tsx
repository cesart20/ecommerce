/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { placerOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from "clsx";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react"




export const PlaceOrder = () => {

    const navigate = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);


    const address = useAddressStore((state) => state.address);
    const { subTotals, tax, total, itemsInCart } = useCartStore( state => state.getSumaryInformation() );
    const cart = useCartStore( state => state.cart );
    const clearCart = useCartStore( state => state.clearCart );



    useEffect(() => {
       setLoaded(true);
       if( itemsInCart === 0 ) {
        redirect('/empty');
       }
    }, [])

    const onPlacerOrder = async () => {
        setIsPlacingOrder(true);

        const productsToOrder = cart.map( product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }));

        console.log({address, productsToOrder});
        
        
        //server action
        const resp = await placerOrder(productsToOrder, address);
        // console.log({resp});

        if(!resp.ok) {
          setIsPlacingOrder(false);
          setErrorMessage(resp.message!);
          return;
        }

        // si sale bien
        clearCart();
        setIsPlacingOrder(false);
        navigate.replace('/orders/' + (resp.order!.id));
    }
    



    if ( !loaded ) {
        return <p>Cargando...</p>
    }


  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                { address.firstName } { address.lastName }
              </p>
              <p>{ address.address }</p>
              <p>{ address.address2 }</p>
              <p>{ address.postalCode }</p>
              <p>
                { address.city }, { address.country }
              </p>
              <p>{ address.phone }</p>
            </div>

            {/* Divider */ }
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">

                <span>No. Productos</span>
                <span className="text-right">
                    { itemsInCart === 1 ? `${ itemsInCart } artículo` : `${ itemsInCart } artículos` }
                </span>
                
                <span>Subtotal</span>
                <span className="text-right">
                    { currencyFormat( subTotals ) }
                </span>
                
                <span>Impuestos (15%)</span>
                <span className="text-right">
                    { currencyFormat( tax ) }
                </span>
                
                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">
                    { currencyFormat( total ) }
                </span>
            </div>

            <div className="mt-5 mb-2 w-full">

              <p className="mb-5">
                {/* Disclaimer */ }
                <span className="text-xs">
                  Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                </span>
              </p>


              <p className="text-red-500 mb-5">{ errorMessage }</p>

              <button
                onClick={ onPlacerOrder }
                className={
                  clsx({
                        'btn-primary': !isPlacingOrder,
                        'btn-disable': isPlacingOrder
                    })
                }
                // href="/orders/123"
                >
                Pagar orden
              </button>
            </div>


          </div>

  )
}
