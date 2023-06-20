import { db, ISLAND_CONSTANTS } from '@/database'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Event } from '../../../models';
import { IEvent } from '@/interfaces';

type Data = 
|    { message: string }
|    IEvent[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getEvents( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const getEvents = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { island = 'Islas Canarias' } = req.query;

    let condition = {};

    if( island !== 'Islas Canarias' && ISLAND_CONSTANTS.validIslands.includes(`${island}`) ) {
        condition = { island };
    }

    await db.connect();

    const events = await Event.find(condition)
                                    .select('title shortDescription longDescription images city island slug createdAt cellPhone email _id')
                                    .lean();

    await db.disconnect();

    const updatedEvents = events.map( event => {
        event.images = event.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/events/${ image }`
        });
        return event;
    })

    return res.status(200).json( updatedEvents )
}
