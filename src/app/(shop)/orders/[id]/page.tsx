/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */

import Image from "next/image";
import Link from "next/link";

import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";


const productInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
]

interface Props {
  params: {
    id: string;
  }
}



export default function({params}: Props) {
  const {id} = params;

  //TODO: Verificar si la orden existe, redirect


  return (
    <div className="fle justify-center items-center mb-72 px-10 sm:px-0">
      
      <div className="flex flex-col w-[1000px]">
        <Title title={` Orden #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* carrito */}
          <div className="flex flex-col mt-5">
            <div className={
              clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-red-500': false,
                  'bg-green-700': true,
                }
              )
            }>
              <IoCardOutline size={30} />
              {/* <span className="mx-2">Pendiente de pago</span> */}
              <span className="mx-2">Pagado</span>

            </div>

            {/* items de carrito */}
            {
              productInCart.map(product => (
                <div key={product.slug} className="flex mb-5">
                  <Image
                    src={ `/products/${product.images[0]}` }
                    alt={product.title}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px',
                    }}
                    className="mr-5 rounded"
                  />

                  <div>
                    <p>{product.title}</p>
                    <p>{product.price} x 3</p>
                    <p className="font-bold">Subtotal: $ {product.price * 3}</p>

                    <button className="underline mt-3">Remover</button>

                  </div>
                </div>
              ))
            }
          </div>

          {/* resumen de la compra */}
          <div className="bg-white rounded-xl shadow-xl p-7">


            <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Cesar Torres</p>
              <p>Av. Siempre viva 123</p>
              <p>Col. Centro</p>
              <p>Alcaldia Cuauhtemoc</p>
              <p>Ciudad de Mexico</p>
              <p>CP 123123</p>
              <p>0987654321</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"/>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>Nro. Productos</span>
              <span className="text-right">3 articulos</span>


              <span>Subtotal</span>
              <span className="text-right">$ 100</span>

              <span>Impuesto (10%)</span>
              <span className="text-right">$ 100</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">3 articulos</span>
            </div>


            <div className="mt-5 mb-2 w-full">

              <div className={
                clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    'bg-red-500': false,
                    'bg-green-700': true,
                  }
                )
              }>
                <IoCardOutline size={30} />
                {/* <span className="mx-2">Pendiente de pago</span> */}
                <span className="mx-2">Pagado</span>

              </div>

            </div>


          </div>


        </div>



      </div>

    </div>
  );
}
