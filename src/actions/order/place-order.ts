'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}


export const placerOrder = async (produtIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id;

    // console.log({produtIds, address, userId});
    // verificar sesion de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    }

    // Obtener la información de los productos
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: produtIds.map( p => p.productId )
            }
        }
    })
    // console.log({products});

    // calcular los montos
    const itemsInOrder = produtIds.reduce( (count, p) => count + p.quantity, 0);
    // console.log({itemsInOrder});

    // Los totales de tax, subtotal, total
    const { subTotal, tax, total } = produtIds.reduce ( (totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find( product => product.id === item.productId );

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;
        
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;


        return totals;

    }, {subTotal: 0, tax: 0, total: 0});
    // console.log({subTotal, tax, total});

    // Crear la transación de base de datos
    try {
        const prismaTx = await prisma.$transaction( async(tx) => {

            // Actualizar el stock de los productos
            const updateProductsPromises = products.map( product => {
                // acumular los valores
                const productQuantity = produtIds.filter( 
                    p => p.productId === product.id
                    ).reduce( (acc, item) => item.quantity + acc, 0);
    
                if(productQuantity === 0) {
                    throw new Error(`${product.id} No tiene cantidad defininda`);
                }
    
                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQuantity - NO HACER
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            });
    
            const updateProducts = await Promise.all( updateProductsPromises );
    
            // verificar valores negativos en las existencias = no hay stock
            updateProducts.forEach( product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} No tiene stock suficiente`);
                }
            });
    
            // crear la orden - encabezado - detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
    
                    OrderItem: {
                        createMany: {
                            data: produtIds.map( p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find( product => product.id === p.productId )?.price ?? 0
                            }))
                        }
                    }
                }
            });
            // validar si el price es cero, entonces 
    
            // crear la direccion de la orden
            const {country, ...restAddress} = address;
            const orderAdress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            });
    
            return {
                updateProducts: updateProducts,
                order: order,
                orderAdress: orderAdress,
            }
    
        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx,
        }
    
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }
    
}