import { initialData } from "@/seed/seed";
import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import { QuantitySelector, SizeSelector } from "@/components";

interface Props {
  params: {
    slug: string
  }
}


export default function({params}: Props) {


  const {slug} = params;
  const product = initialData.products.find(product => product.slug === slug);


  if (!product) {
    notFound()
  }


  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* slideShow */}

      <div className="col-span-1 md:col-span-2">

      </div>


      {/* detalles */}
      <div className="col-span-1 px-5">
        <h1 className={`${ titleFont.className} antialiased font-bold text-xl `}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">{product.price}</p>

        {/* Selector de Tallas */}
        <SizeSelector 
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}
        />


        {/* Selector de cantidad */}
        <QuantitySelector
          quantity={2}
        />

        {/* Button */}
        <button className="btn-primary my-5">
          Agregar al carrito
        </button>

        {/* Description */}
        <h3 className="font-bold text-sm">
          Descripción
        </h3>
        <p className="font-light">
          {product.description}
        </p>
      </div>




    </div>
  );
}
