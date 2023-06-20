import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '@/database';
import { IUser } from '@/interfaces';
import { User } from '@/models';


type Data = 
| { message: string }
|  IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUser(req, res);
    
        default:
            res.status(400).json({ message: 'Bad request' })
    }

}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json( users );

}


const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId = '', role = '' } = req.body;

    if( !isValidObjectId( userId ) ){
        return res.status(400).json({ message: 'No existe usuario con ese ID' })
    }

    const validRoles = [ 'admin', 'client', 'super-user', 'SEO' ];
    if ( !validRoles.includes(role) ){
        return res.status(400).json({ message: 'Rol no permitido: ' + validRoles.join(', ') })
    }

    await db.connect();
    const user = await User.findById( userId );
    if ( !user ){
        await db.disconnect();
        res.status(404).json({ message: 'Usuario no encontrado ' + userId });
    }

    user!.role = role; //TS arrojaba error de que user podiar venia vacío, tuve que colocar !
    await user!.save();

    await db.disconnect();

    return res.status(200).json({ message: 'Usuario actualizado'})

}

