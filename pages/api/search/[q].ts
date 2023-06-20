import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
|   { message: string }
|   IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return searchProducts(req, res);
    
        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }

}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    let { q = '' } = req.query;

    if ( q.length === 0 ){
        res.status(400).json({
            message: 'Debe de específicar el query de búsqueda'
        })
    }

    q = q.toString().toLowerCase();

    await db.connect();
    const product = await Product.find({
        $text: { $search: q }
    })
    .select('title images price description inStock slug -_id')
    .lean();

    await db.disconnect();

    res.status(200).json(product);

}
