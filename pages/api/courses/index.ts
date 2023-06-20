import { db, ISLAND_CONSTANTS } from '@/database'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Course } from '../../../models';
import { ICourse } from '@/interfaces';

type Data = 
|    { message: string }
|    ICourse[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getCourses( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const getCourses = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { island = 'all' } = req.query;

    let condition = {};

    if( island !== 'all' && ISLAND_CONSTANTS.validIslands.includes(`${island}`) ) {
        condition = { island };
    }

    await db.connect();

    const courses = await Course.find(condition)
                                    .select('title shortDescription longDescription images city island slug createdAt cellPhone email _id')
                                    .lean();

    await db.disconnect();

    const updatedCourses = courses.map( course => {
        course.images = course.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/courses/${ image }`
        });
        return course;
    })

    return res.status(200).json( updatedCourses )
}
