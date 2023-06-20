import { db } from './';
import { User } from '@/models';
import bcrypt from 'bcryptjs';


export const checkUserEmailPassword = async( email: string = '', password: string= '' ) => {

    await db.connect;
    const user = await User.findOne({ email }).lean();
    await db.disconnect;

    if ( !user ) {
        return null;
    }

    if ( !bcrypt.compareSync( password, user.password! ) ) {
        return null;
    }

    const { role, name, _id } = user;

    return {
        id: _id,
        email: email.toLocaleLowerCase(),
        role,
        name,
    }

}

// Esta función crea o verifica el usuario de OAuth
export const oAuthDbUser = async ( oAuthEmail: string, oAuthName: string ) => {

    db.connect();
    const user = await User.findOne({ email: oAuthEmail });
    
    if ( user ) {
        db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
    await newUser.save();
    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };


}