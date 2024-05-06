const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async(req,res)=>{
    try {
        const {name,email,password,gender} = req.body;
        if(!name || !email || !password || !gender ){
            return res.status(400).json({message:"All feilds are required"});
        }
        // if(password !== confirmPassword){
        //     return res.status(400).json({message:"Password do not match"});
        // }
        const user = await userModel.findOne({email});
        if(user){
            return res.status(400).json({message:"Usef already exist"});
        }
        const hashPassword = await bcrypt.hash(password,10);

        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${email}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${email}`;

        const response = await userModel.create({
            name,
            email,
            password:hashPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });
        // console.log(response);
        return res.status(200).json({response});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error in registration"})
    }
};

const login =async(req,res)=>{
    try {
        const {email,password} = req.body;
        // console.log(req.body);
        if(!email || !password){
            return res.status(400).json({msg:"all field is required"});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400),json({msg:'user not found'});
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({msg:"incorrect password",success:false});
        }
        const tokenData = {
            userId: user._id
        };
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"30d"});
        return res.status(200).json({
            user:{
                name:user.name,
                email:user.email,
                gender:user.gender,
                profilePhoto:user.profilePhoto,
                id:user._id
          },
          token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error in login"})
    }
};

const getUser = async (req, res) => {
    try {
        const loggedUser = req.params;
        // const user = await userModel.findById(loggedUser);
        // console.log("user",user);

        const otherUsers = await userModel.find({ _id: { $ne: loggedUser} }).select("-password");

        return res.status(200).json(otherUsers || []);
    } catch (error) {
        console.error("Error in getUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// const getUser = async (req, res) => {
//     try {
//         // Extract user ID from JWT token
//         const token = req.headers.authorization.split(" ")[1];
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         const loggedUser = decodedToken.userId;
//         console.log("Logged user:", loggedUser);

//         const otherUsers = await userModel.find({ _id: { $ne: loggedUser } }).select("-password");
//         console.log("Other users:", otherUsers);

//         return res.status(200).json(otherUsers);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

module.exports = {register,login,getUser}