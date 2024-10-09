'use client'

import { useEffect, useState } from "react"
import { titleFont } from "@/config/fonts"
import { getStockBySlug } from "@/actions"


interface Props {
    slug: string
}



export const StockLabel = ({slug}: Props) => {

    const [Stock, setStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getStock = async () => {
            const inStock = await getStockBySlug( slug )
            
            setStock(inStock);
            setIsLoading(false);
            
        }
        getStock();
    }, [slug])

    



  return (

    <>
    {
        isLoading ? (
            
            <h1 className={ ` ${ titleFont.className } antialiased font-bold text-lg bg-gray-200 animate-pulse` }>
                &nbsp;
            </h1>
        ) :
        (
            <h1 className={ ` ${ titleFont.className } antialiased font-bold text-lg` }>
                Stock: { Stock }
            </h1>
        )
    }
        

        
    </>

    
  )
}
