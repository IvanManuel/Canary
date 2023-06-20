import mongoose, { Schema, model, Model } from 'mongoose';
import { ICourse } from '@/interfaces';


const courseSchema = new Schema({

    shortDescription: { type: String, required: true, default: '' },
    longDescription: { type: String, required: true, default: '' },
    images: [{ type: String }],
    view: { type: Number, default: 0 },
    cellPhone: { type: String, required: true, default: '' },
    email: { type: String, required: true, unique: true },
    island: {
        type: String,
        enum: {
            values: ['El Hierro','Fuerteventura','Gran Canaria','La Gomera','Lanzarote','La Palma','Tenerife'],
            message: '{value} no es una isla válida'
        },
        default: ''
    },
    city: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true, default: '' },

}, {
    timestamps: true
});

courseSchema.index({ title: 'text', tags: 'text' });

const Course: Model<ICourse> = mongoose.models.Course || model('Course', courseSchema );

export default Course;