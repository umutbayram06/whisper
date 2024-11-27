import express from "express";
import authenticateWithJWT from "../middlewares/authenticateWithJWT.js";
import User from "../models/User.js";

/*
getProfileImage
updateProfileImage
getAbout
updateAbout
getStatus
updatestatus

*/

const router = express.Router();

//Profile Image
//Just takes JWT token from header authorization:{JWT Token}
const getProfileImage = async(req,res) =>{
    const { _id } = req.user;
    try{

        const response = await User.findOne(_id).select("profileImage");
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }
}

//Takes a json with image: {profileImage converted to base64}
const updateProfileImage = async(req,res) =>{
    const {profileImage} = req.body
    const { _id } = req.user;
    try{

        const response = await User.findByIdAndUpdate(
            _id,
            { profileImage: profileImage },
            { new: true }
          );
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }
    
}

//About
//Just takes JWT token from header authorization:{JWT Token}
const getAbout = async(req,res) =>{
    const { _id } = req.user;
    try{

        const response = await User.findOne(_id).select("about");
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }
}
//Takes json about:{about}
const updateAbout = async(req,res) =>{
    const {about} = req.body
    const { _id } = req.user;
    try{

        const response = await User.findByIdAndUpdate(
            _id,
            { about: about },
            { new: true }
          );
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }
}

//Status
//Just takes JWT token from header authorization:{JWT Token}
const getStatus = async(req,res) =>{
    const { _id } = req.user;
    try{

        const response = await User.findOne(_id).select("status");
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }
}
//Get status of users without authentication
const getUserStatus = async(req,res) =>{
    const { id } = req.params;
    try{

        const response = await User.findById(id).select("status");
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }

}
//Takes json status:{status}
const updateStatus = async(req,res) =>{
    const {status} = req.body
    const { _id } = req.user;
    try{

        const response = await User.findByIdAndUpdate(
            _id,
            { status: status },
            { runValidators: true,
                new: true }
          );
        res.status(200).json(response)

    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }
}

//Block
//Returns blocked users id, status, profile image in blockedUsers[]
const getBlockedUsers = async (req,res) => {

    const {_id} = req.user;

    try{
        const response = await User.findOne(_id).select('blockedUsers').populate('blockedUsers', 'username email profileImage');
        res.status(200).json(response)
    }catch(error){
        console.log(error)
        res.status(400).json(error)
    }

    
}
const blockUser = async (req,res) => {

    //User id to be blocked taken from the parameters
    const {id} = req.params;
    const {_id} = req.user;
    try{

        const response = await User.findByIdAndUpdate(
            _id,
            { $addToSet: { blockedUsers: id } },
            { new: true }
        );

        res.status(200).json(response)

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while blocking the user" });
    }
}
//Unblocks a user
const unblockUser = async (req,res) => {
    //User id to be blocked taken from the parameters
    const {id} = req.params;
    const {_id} = req.user;
    try{

        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { blockedUsers: id } },
            { new: true }
        );

        res.status(200).json(response)

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while blocking the user" });
    }
    
}

//Routes
router.get("/profileImage",authenticateWithJWT,getProfileImage) 
router.patch("/profileImage",authenticateWithJWT,updateProfileImage) 

router.get("/about",authenticateWithJWT,getAbout) 
router.patch("/about",authenticateWithJWT,updateAbout) 

router.get("/status",authenticateWithJWT,getStatus) 
router.get("/status/:id",getUserStatus) 
router.patch("/status",authenticateWithJWT,updateStatus)

router.get("/block",authenticateWithJWT,getBlockedUsers)
router.patch("/block/:id",authenticateWithJWT,blockUser)  
router.patch("/unblock/:id",authenticateWithJWT,unblockUser)  

export default router;