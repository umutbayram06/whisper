import express from "express";
import authenticateWithJWT from "../middlewares/authenticateWithJWT.js";
import User from "../models/User.js";

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
//Unauthenticated method for getting user profile image
const getUserProfileImage = async(req,res) =>{
    const { id } = req.params;
    try{

        const user = await User.findById(id).select("profileImage privacySettings");
        if(!user.privacySettings.showProfileImage) return res.status(200).json({_id:user._id,profileImage:"data:image/png;base64,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"})
        res.status(200).json({_id:user._id,profileImage:user.profileImage})

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
//When showAboutSection:false returns .
//Unauthenticated method for getting about section using id parameter
const getUserAbout = async (req,res) => {
    const {id} = req.params
    try{
        const user = await User.findById(id).select('about privacySettings')
        if(!user.privacySettings.showAboutSection) return res.status(200).json({_id:user._id,about:"."})
        res.status(200).json({_id:user._id,about:user.about})
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
        //If more information about the blocked users are needed it can be added into .populate()
        const response = await User.findOne(_id).select('blockedUsers').populate('blockedUsers', 'username ');
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

//PrivacySettings

const getPrivacySettings = async (req,res) => {
    const {_id} = req.user;

    try{
        const response = await User.findById(_id).select("privacySettings");
        res.status(200).json(response);
    }catch(error){
        console.error(error);
        res.status(500).json(error);
    }
}
//Takes boolean values in json body showProfileImage, showAboutSection
//Also can change settings individually
const updatePrivacySettings = async (req,res) => {

    const {showProfileImage, showAboutSection } = req.body;
    const {_id} = req.user;

    try{
        const user = await User.findById(_id);
        if(!user) return res.status(404).json("User does not exist");

        if (showProfileImage !== undefined) {
            user.privacySettings.showProfileImage = showProfileImage;
        }
      
        if (showAboutSection !== undefined) {
           user.privacySettings.showAboutSection = showAboutSection;
        }

        const response = await user.save();
        res.status(200).json(response);
    }catch(error){
        console.error(error);
        res.status(500).json(error);
    }

}

//Routes
router.get("/image",authenticateWithJWT,getProfileImage) 
router.get("/image/other/:id",getUserProfileImage) 
router.patch("/image",authenticateWithJWT,updateProfileImage) 

router.get("/about",authenticateWithJWT,getAbout) 
router.get("/about/other/:id",getUserAbout) 
router.patch("/about",authenticateWithJWT,updateAbout) 

router.get("/status",authenticateWithJWT,getStatus) 
router.get("/status/other/:id",getUserStatus) 
router.patch("/status",authenticateWithJWT,updateStatus)

router.get("/block",authenticateWithJWT,getBlockedUsers)
router.patch("/block/:id",authenticateWithJWT,blockUser)  
router.patch("/unblock/:id",authenticateWithJWT,unblockUser)  

router.get("/settings",authenticateWithJWT,getPrivacySettings)
router.patch("/settings",authenticateWithJWT,updatePrivacySettings)

export default router;