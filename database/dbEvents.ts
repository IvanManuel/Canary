import { db } from '@/database';
import { Event } from '@/models';
import { IEvent } from '@/interfaces';

export const getEventBySlug = async( slug: string ): Promise<IEvent | null> => {

    await db.connect();

     const event = await Event.findOne({ slug }).lean();

    await db.disconnect();

    if( !event ){
        return null;
    }

    // TODO:
    // un procesamiento de las imagenes cuando la subamos al servidor
    event.images = event.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }/events/${ image }`
    })

    return JSON.parse( JSON.stringify( event ));

}

interface EventSlug {
    slug: string;
}

export const getAllEventSlugs = async(): Promise<EventSlug[]> => {
    await db.connect();
    const slugs = await Event.find().select('slug -_id').lean();

    await db.disconnect();
    return slugs;
}

export const getEventsByTerm = async ( term: string): Promise<IEvent[]> => {

    term = term.toString().toLowerCase();

    await db.connect();
    const events = await Event.find({
        $text: { $search: term }
    })
    .select('title images shortDescription cellPhone email island city slug -_id')
    .lean();

    await db.disconnect();
    
    const updatedEvents = events.map( event => {
        event.images = event.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/events/${ image }`
        });

        return event;
    })

    return updatedEvents;
}

export const getAllEvents = async(): Promise<IEvent[]> => {

    await db.connect();
    const events = await Event.find().lean();
    await db.disconnect();

    const updatedEvents = events.map( event => {
        event.images = event.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/events/${ image }`
        });
        return event;
    })

    return JSON.parse( JSON.stringify( updatedEvents ));

}