
import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL || '');

import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);
        
        case 'POST':
            return createProduct(req, res);
    
        default:
            res.status(400).json({ message: 'Bad request' });
    }
    
    
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

    await db.disconnect();

    //TODO tenemos que actualizar las imágenes
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/products/${ image }`
        });
        return product;
    })

    res.status(200).json( updatedProducts );

}


const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct;

    if( !isValidObjectId( _id )){
        return res.status(404).json({ message: 'El id del producto no es válido' });
    }

    if( images.length < 2 ){
        return res.status(401).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    //TODO posiblemente tendremos un localhost:3000/products/nombreimagen.jpg

    try {
        
        await db.connect();
        const product = await Product.findById(_id);
        if( !product ){
            await db.disconnect();
            return res.status(402).json({ message: 'No existe producto con ese ID' });
        }

        //TODO eliminar fotos en Cloudinary, con este código el usuario puede molestar hay que darle cabeza
        //para mejorarlo, este es un ejemplo de url de imagen de cloudinary https://res.cloudinary.com/dcflggloz/image/upload/v1684576446/plakbh1you0dtzreccdl.webp
        product.images.forEach( async( image ) => {
            if( !images.includes(image) ){
                //Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        })


        await product.updateOne( req.body );
        await db.disconnect();

        //console.log({product})
        return res.status(200).json( product );

    } catch (error) {
        console.log({error})
        await db.disconnect();
        return res.status(403).json({ message: 'Revisar la consola del servidor' });
    }

}


const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IProduct;

    if( images.length < 2 ){
        return res.status(405).json({ message: 'El producto necesita al menos 2 imágenes' })
    }

    //TODO posiblemente tendremos un localhost:3000/products/nombreimage.jpg

    try {

        await db.connect();

        const productInDB = await Product.findOne({ slug: req.body.slug });
        //Deberíamos hacer las validaciones para las entradas para evitar nombres repetidos, slugs, etc.
        if( productInDB ){
            await db.disconnect();
            return res.status(407).json({ message: 'Ya existe un producto con ese slug' })
        }

        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        res.status(201).json( product );
        
    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(406).json({ message: 'Revisar logs del servidor' })
    }

}

