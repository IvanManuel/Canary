import { db } from '@/database';
import { Job } from '@/models';
import { IJob } from '@/interfaces';


export const getJobById = async( _id: string ): Promise<IJob | null> => {

    await db.connect();
    const job = await Job.findOne({ _id }).lean();
    await db.disconnect();

    if( !job ){
        return null;
    }

    // TODO:
    // un procesamiento de las imagenes cuando la subamos al servidor
    job.images = job.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }/jobs/${ image }`
    })

    return JSON.parse( JSON.stringify( job ));

}

interface JobId {
    _id: string;
}

export const getAllJobIds = async(): Promise<JobId[]> => {
    await db.connect();
    const ids = await Job.find().select('_id').lean();
    await db.disconnect();

    return JSON.parse( JSON.stringify( ids ));
}

export const getJobsByTerm = async ( term: string): Promise<IJob[]> => {

    term = term.toString().toLowerCase();

    await db.connect();
    const jobs = await Job.find({
        $text: { $search: term }
    })
    .select('title images shortDescription cellPhone email island city slug _id')
    .lean();

    await db.disconnect();
    
    const updatedJobs = jobs.map( job => {
        job.images = job.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/jobs/${ image }`
        });

        return job;
    })

    return updatedJobs;
}

export const getAllJobs = async(): Promise<IJob[]> => {

    await db.connect();
    const jobs = await Job.find().lean();
    await db.disconnect();

    const updatedJobs = jobs.map( job => {
        job.images = job.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/jobs/${ image }`
        });
        return job;
    })

    return JSON.parse( JSON.stringify( updatedJobs ));

}