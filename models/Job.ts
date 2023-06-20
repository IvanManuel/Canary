import mongoose, { Schema, model, Model } from 'mongoose';
import { IJob } from '@/interfaces/job';


const jobSchema = new Schema({

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

jobSchema.index({ title: 'text', tags: 'text' });

const Job: Model<IJob> = mongoose.models.Job || model('Job', jobSchema );

export default Job;