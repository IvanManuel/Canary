import { db, ISLAND_CONSTANTS } from '@/database'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Job } from '../../../models';
import { IJob } from '@/interfaces';

type Data = 
|    { message: string }
|    IJob[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getJobs( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const getJobs = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { island = 'all' } = req.query;

    let condition = {};

    if( island !== 'all' && ISLAND_CONSTANTS.validIslands.includes(`${island}`) ) {
        condition = { island };
    }

    await db.connect();

    const jobs = await Job.find(condition)
                                    .select('title shortDescription longDescription images city island slug createdAt cellPhone email _id')
                                    .lean();

    await db.disconnect();

    const updatedJobs = jobs.map( job => {
        job.images = job.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/jobs/${ image }`
        });
        return job;
    })

    return res.status(200).json( updatedJobs )
}
