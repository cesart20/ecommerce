'use client'

import { QuantitySelector, SizeSelector } from "@/components"
import { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store"
import { useState } from "react"
import CartPage from '../../../cart/page';


interface Props {
    product: Product
}


export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore( state => state.addProductToCart );

  const [size, setSize] = useState<Size|undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);


  const addToCart = () => {
    setPosted(true);

    if ( !size ) return;

    // console.log({ size, quantity, product });
    const CartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      size,
      image: product.images[0],
    }

    addProductToCart(CartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
    
      
  }


  return (
    <>
    
      {
        posted && !size && (
            <span className="text-red-500 mt-2 fade-in">
                Debe seleccionar una talla*
            </span>
        )
      }
  
      {/* Selector de Tallas */ }
      <SizeSelector
        selectedSize={ size }
        availableSizes={ product.sizes }
        onSizeChanged={ setSize }
      />


      {/* Selector de Cantidad */ }
      <QuantitySelector 
        quantity={ quantity }
        onQuantityChanged={ setQuantity }
      />


      {/* Button */ }
      <button onClick={ addToCart } className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  )
}
