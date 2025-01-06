import User from '../models/userModel.js';
import asyncHandler from '../utils/asyncHanlder.js';
import generateToken from '../utils/generateToken.js'
import Account from '../models/accountModel.js'

export const registerUser = asyncHandler(async (req, res) => {
   const { userName, firstName, lastName, password } = req.body;

   console.log("Userinfo:- ", userName, firstName, lastName, password);

   const isUserExist = await User.findOne({userName});

   console.log("userInfo", isUserExist);

   if(isUserExist){
    console.log("User already exists");
    return res.status(200).json({
        message: "User already exits!!",
        success : false
    })
   }

   const token = await generateToken(userName);

   const newUser = new User({
     userName,
     firstName,
     lastName,
     password,
     accountToken: token,
   });

   await newUser.save();

   const account = new Account({
    userName,
    balance: (Math.random() * 10000 + 1)
   });

   await account.save();

   const getSomeRandomUser = await User.aggregate([
    {$sample: { size: 10 }},
    {
      $lookup: {
        from: "accounts",
        localField: "userName",
        foreignField: "userName",
        as: "accountDets"
      }
    }
   ]);

   res.cookie("authToken", token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     path: "/"
   });

   return res.status(200).json({
    message: "User created successfully",
    success: true,
    userData: newUser,
    accountData: account,
    randomUser: getSomeRandomUser
   });
});

export const signinUser = asyncHandler(async (req, res) => {
    const {userName, password} = req.body;

    const newUser = await User.findOne({userName});

    if(!newUser){
        console.log("User doesn't exist");
        return res.status(400).json({
            message: "User doesn't exist",
            success: true
        });
    }

    if(newUser.password != password){
        console.log("Invalid credentials");
        return res.status(401).json({
            message: "Invalid credentials",
            success: true
        })
    }

    const accountDets = await Account.findOne({userName});

    const getSomeRandomUser = await User.aggregate([
      {
        $sample: {
          size: 10,
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "userName",
          foreignField: "userName",
          as: "accountDets"
        }
      }
    ]);

    const token = await generateToken(userName);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/" 
    });



   return res.status(200).json({
        message: "user logged in successfully",
        success: true,
        userDets: newUser,
        accountDets,
        randomUser: getSomeRandomUser
    });
});

export const logoutUser = asyncHandler(async(req, res) => {
    const token = req.cookies.authToken;

    if(token){
        res.clearCookie("authToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path : "/"
        });
        return res.status(200).json({
            message: "Logout successfully",
            success: true
        });
    }

    return res.status(404).json({
        message: "Something went wrong while loggin out! Try again",
        success: false
    });
});

export const transferMoney = asyncHandler(async(req, res) => {
   const { sendTo, sendFrom, amount } = req.body;

   if (!sendTo || !sendFrom || !Number(amount)){
    console.log("Credentials isn't valid");
    return res.status(403).json({
      message: "Invalid Credentials",
      success: false
    });
   }

   const sendToUser = await Account.find({userName: sendTo});
   const sendFromUser = await Account.find({userName: sendFrom});
   const amountInNumber = Number(amount);

   sendToUser[0].balance += amountInNumber;
   sendFromUser[0].balance -= amountInNumber;

   console.log("sendToUser dets:- ", sendToUser);
   console.log("sendFromdets:- ", sendFromUser);

   await sendToUser[0].save();
   await sendFromUser[0].save();


     return res.status(200).json({
       message: "Done",
       success: true,
       sendToUser,
       sendFromUser
     });
});

export const findUser = asyncHandler(async(req, res) => {
   const {findUsername} = req.body;
   console.log("findUsername:- ", findUsername);
  if(!findUsername){
    console.log("No username found");
    return res.status(404).json({
      message: "Username not found!!",
      success: false
    });
    
  }
    const foundUser = await User.findOne({userName: findUsername});
    const foundAccount = await Account.findOne({userName: findUsername});
    if(!foundUser){
      console.log("No user foun with this username");
      return res.status(404).json({
        message: "No user found with this username",
        success: false
      })
    }
    return res.status(200).json({
      message: "User found successfully",
      success: true,
      userInfo: foundUser,
      accountInfo: foundAccount
    });
  
})