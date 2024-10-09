'use server'

import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import {z} from 'zod';

cloudinary.config(process.env.CLOUDINARY_URL ?? '' );

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
    //images: z.array(z.string()),
})

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData);

    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success) {
        console.log(productParsed.error)
        return {
            ok: false,
        }
    }

    const product = productParsed.data;
    product.slug = product.slug.toLocaleLowerCase().replace(/ /g, '').trim();
    const {id, ...rest} = product;

    try {
        const prismaTx = await prisma.$transaction( async (tx) => {
            let product: Product;
    
            const tagsArray = rest.tags.split(',').map((tag) => tag.trim().toLowerCase());
    
    
            if(id) {
                //Actualizar
                product = await prisma.product.update({
                    where: {id}, 
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                });
    
               
                
    
            } else {
                // crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }
    
            // Proceso de carga y guardado de images
            // recorrer las imagenes y guardarlas en cloudinary
            if (formData.getAll('images')) {
                // [hhtps://url.jpg, https://url2.jpg] es lo que se espera
                const images = await uploadImages(formData.getAll('images') as File[]);
                if(!images) {
                    throw new Error('Error al cargar las imagenes');
                }

                await prisma.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id,
                    }))
                });
                
            }
    
            return {
                product
            }
        })

        //todo: revalidate path
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${product.slug}`);
        revalidatePath(`products/${product.slug}`);


        return {
            ok: true,
            product: prismaTx.product
        }
    
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Revisar los logs, no se pudo actualizar/crear el producto'
        }
    }

}

const uploadImages = async (images: File[]) => {
    try {

        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');
                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(r => r.secure_url);
            } catch (error) {
                console.log(error);
                return null;
            }
        });

        const upladedImages = await Promise.all(uploadPromises);
        return upladedImages;

        
    } catch (error) {
        console.log(error);
        return null;
        
    }
}