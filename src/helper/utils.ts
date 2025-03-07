const bcrypt = require('bcrypt');
const saltRounds = 10;


export const hashPasswordHelper = async (plainPassword: string) => {
    try{
        return await bcrypt.hash(plainPassword, saltRounds);
    }catch(err){
        throw err;
    }
}

export const comparePasswordHelper = async (plainPassword: string, hashedPassword: string) => {
    try{
        return  bcrypt.compare(plainPassword, hashedPassword);
    }catch(err){
        throw err;
    }
}