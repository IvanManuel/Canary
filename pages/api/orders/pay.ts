import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { isAxiosError } from 'axios';
import { IPaypall } from '@/interfaces';
import { db } from '@/database';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method ) {
        case 'POST':
            return payOrder(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
    
}

const getPaypallBearerToken = async(): Promise<string | null> => {
    const PAYPALL_CLIENT = process.env.NEXT_PUBLIC_PAYPALL_CLIENT_ID;
    const PAYPALL_SECRET = process.env.PAYPALL_SECRET;

    const base64Token = Buffer.from(`${ PAYPALL_CLIENT }:${ PAYPALL_SECRET }`, 'utf-8').toString('base64');
    const body= new URLSearchParams('grant_type=client_credentials');

    try {

        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers:{
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        console.log('URL', process.env.PAYPAL_OAUTH_URL)

        return data.access_token;

    } catch (error) {
        if ( axios.isAxiosError( error ) ) {
            console.log('ERROR1', error);
        }else {
            console.log( 'ERROR2', error );
        }
        return null;
    }

}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    //TODO: validar sesion del usuario
    //TODO: Validar mongoID

    const paypallBearerToken = await getPaypallBearerToken();

    if ( !paypallBearerToken ){
        return res.status(400).json({ message: 'No se pudo confirmar el token de paypall'})
    }

    const { transactionId = '', orderId = '' } = req.body;

    const { data } = await axios.get<IPaypall.PaypallOrderStatusResponse>( `${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
        headers: {
            'Authorization': `Bearer ${ paypallBearerToken }`
        }
    });

    if( data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'Orden no reconocida'})
    }

    await db.connect();
    const dbOrder = await Order.findById( orderId );

    if( !dbOrder ){
        await db.disconnect();
        return res.status(404).json({ message: 'Orden no existe en nuestra base de datos'})
    }

    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de Paypall y nuestra orden no son iguales'});
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();

        res.status(200).json({ message: 'Orden pagada' });
}
