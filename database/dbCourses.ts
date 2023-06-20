import { db } from '@/database';
import { Course } from '@/models';
import { ICourse } from '@/interfaces';

export const getCourseBySlug = async( slug: string ): Promise<ICourse | null> => {

    await db.connect();

     const course = await Course.findOne({ slug }).lean();

    await db.disconnect();

    if( !course ){
        return null;
    }

    // TODO:
    // un procesamiento de las imagenes cuando la subamos al servidor
    course.images = course.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }/courses/${ image }`
    })

    return JSON.parse( JSON.stringify( course ));

}

interface CourseSlug {
    slug: string;
}

export const getAllCourseSlugs = async(): Promise<CourseSlug[]> => {
    await db.connect();
    const slugs = await Course.find().select('slug -_id').lean();

    await db.disconnect();
    return slugs;
}

export const getCoursesByTerm = async ( term: string): Promise<ICourse[]> => {

    term = term.toString().toLowerCase();

    await db.connect();
    const courses = await Course.find({
        $text: { $search: term }
    })
    .select('title images shortDescription cellPhone email island city slug -_id')
    .lean();

    await db.disconnect();
    
    const updatedCourses = courses.map( course => {
        course.images = course.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/courses/${ image }`
        });

        return course;
    })

    return updatedCourses;
}

export const getAllCourses = async(): Promise<ICourse[]> => {

    await db.connect();
    const courses = await Course.find().lean();
    await db.disconnect();

    const updatedCourses = courses.map( course => {
        course.images = course.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/courses/${ image }`
        });
        return course;
    })

    return JSON.parse( JSON.stringify( updatedCourses ));

}