import jwt from 'jsonwebtoken';


const generateToken = async (userName) => {
   const token = jwt.sign({userName}, process.env.JWT_SECRET,{ expiresIn: "1h"});
   return token;
};

export default generateToken;
