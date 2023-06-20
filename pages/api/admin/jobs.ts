
import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL || '');

import { db } from '@/database';
import { IJob } from '@/interfaces';
import { Job } from '@/models';

type Data = 
| { message: string }
| IJob[]
| IJob

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getJobs(req, res);

        case 'PUT':
            return updateJob(req, res);
        
        case 'POST':
            return createJob(req, res);
    
        default:
            res.status(400).json({ message: 'Bad request' });
    }
    
    
}

const getJobs = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const jobs = await Job.find()
        .sort({ title: 'asc' })
        .lean();

    await db.disconnect();

    //TODO tenemos que actualizar las imágenes
    const updatedJobs = jobs.map( job => {
        job.images = job.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/jobs/${ image }`
        });
        return job;
    })

    res.status(200).json( updatedJobs );

}


const updateJob = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IJob;

    if( !isValidObjectId( _id )){
        return res.status(404).json({ message: 'El id del producto no es válido' });
    }

    if( images.length < 2 ){
        return res.status(401).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    //TODO posiblemente tendremos un localhost:3000/products/nombreimagen.jpg

    try {
        
        await db.connect();
        const job = await Job.findById(_id);
        if( !job ){
            await db.disconnect();
            return res.status(402).json({ message: 'No existe producto con ese ID' });
        }

        //TODO eliminar fotos en Cloudinary, con este código el usuario puede molestar hay que darle cabeza
        //para mejorarlo, este es un ejemplo de url de imagen de cloudinary https://res.cloudinary.com/dcflggloz/image/upload/v1684576446/plakbh1you0dtzreccdl.webp
        job.images.forEach( async( image ) => {
            if( !images.includes(image) ){
                //Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        })


        await job.updateOne( req.body );
        await db.disconnect();

        //console.log({product})
        return res.status(200).json( job );

    } catch (error) {
        console.log({error})
        await db.disconnect();
        return res.status(403).json({ message: 'Revisar la consola del servidor' });
    }

}


const createJob = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IJob;

    if( images.length < 2 ){
        return res.status(405).json({ message: 'El producto necesita al menos 2 imágenes' })
    }

    //TODO posiblemente tendremos un localhost:3000/products/nombreimage.jpg

    try {

        await db.connect();

        const jobInDB = await Job.findOne({ slug: req.body.slug });
        //Deberíamos hacer las validaciones para las entradas para evitar nombres repetidos, slugs, etc.
        if( jobInDB ){
            await db.disconnect();
            return res.status(407).json({ message: 'Ya existe un producto con ese slug' })
        }

        const job = new Job( req.body );
        await job.save();
        await db.disconnect();

        res.status(201).json( job );
        
    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(406).json({ message: 'Revisar logs del servidor' })
    }

}

