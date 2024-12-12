import request from 'supertest';
import {app,server} from './server.js';
import mongoose from 'mongoose';
import authenticateWithJWT from './middlewares/authenticateWithJWT.js';
import jwtkn from "jsonwebtoken";

const jwt = [];

afterAll(async () => {
    // Disconnect from MongoDB after tests
    await mongoose.disconnect();
  
    // Close the server after tests
    server.close();
  });

//Tests for authRoutes
describe("/auth", () =>{

    //Register
    describe("/register Given a username, email and password ", () =>{

        test.each([
            [{ username:"user",email:"user@user.com",password:"1.Aaaaaa" },0],
            [{ username:"test",email:"test@user.com",password:"testT.4778" },1],
        ])("should respond with a jwt token and status 200", async (userData,index)=>{
            const res = await request(app).post("/auth/register")
                                                            .send(
                                                                    userData
                                                                );
                                                                
            jwt[index] = res.body.token;
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            

        });

        test.each([
            // Test different invalid email and password combinations
            ['valid email and password with no special character', { username: 'user2', email: 'user@user.com', password: '1Aaaaaa' }, 500],
            ['valid email and password with no upper case character', { username: 'user2', email: 'user@user.com', password: '1.aaaaaa' }, 500],
            ['valid email and password with no number', { username: 'user2', email: 'user@user.com', password: 'A.aaaaaa' }, 500],
            ['existing user input', { username: 'user', email: 'user@user.com', password: 'A.aaaaaa' }, 500],              
          ])("with %s should respond with a message and status correct fail status", async (description, userData, expectedStatusCode)=>{
            const res = await request(app).post("/auth/register")
                                                            .send(
                                                                    userData
                                                                );
            expect(res.statusCode).toBe(expectedStatusCode);
            expect(res.body.message).toBeDefined();
        });

        

        test("if user exists should respond with status 500", async ()=>{
            const res = await request(app).post("/auth/register")
                                                            .send(
                                                                    { username:"user", 
                                                                        email:"user@user.com", 
                                                                        password:"1.Aaaaaa" }
                                                                );
            expect(res.statusCode).toBe(500);
        });
        
    });

    //Login
    describe("/login Given a username and password ", () =>{

        test.each([
            [{username:"userr",password:"1.Aaaaaa"},500],
            [{username:"user",password:"1.Aaaaa"},500],
        ])("fail should respond with status 500 and correct message", async (userData,expectedStatusCode)=>{
            const res = await request(app).post("/auth/login")
                                                            .send(
                                                                    userData
                                                                );
            expect(res.statusCode).toBe(expectedStatusCode);
            expect(res.body.message).toBe("Wrong credentials !");
        });

        test("success should respond with a jwt token and status 200", async ()=>{
            const res = await request(app).post("/auth/login")
                                                            .send(
                                                                    { username:"user", 
                                                                        password:"1.Aaaaaa" }
                                                                );
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            jwt[0] = res.body.token;
        });

    });

    //Change username
    describe("/change-username Given a jwt token ",() =>{
        test.each([
            ["if new username and current username are the same respond with status 500 and return message",{},"New username not given !",500],
            ["if new username is laready in use respond with status 500 and return message",{newUsername:"user"},"Somebody have already taken this username. Try a different one !",500],
            ["İf username is valid respond with status 200",{newUsername:"tests"},"",200],
        ])("%s", async (testDesc,userData,message,expectedStatusCode)=>{
            const res = await request(app).patch("/auth/change-username").set("Authorization", `Bearer ${jwt[1]}`)
                                                                            .send(userData)
            expect(res.statusCode).toBe(expectedStatusCode);
            if(expectedStatusCode!=200) expect(res.body.message).toBe(message);
        });
    });
    //Change password
    /*
    
    });
    */

});

// Tests for profilerRoutes
describe("/profile", () => {

    // Get Username
    describe("/username Given a valid jwt token", () => {
      test("should return the username and status 200", async () => {
        const res = await request(app).get("/profile/username")
                                      .set("Authorization", `Bearer ${jwt[0]}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBeDefined();
      });
    });
    // Block Users
    describe("/block Given a valid jwt token", () => {
        test("should return a list of blocked users", async () => {
          const res = await request(app).get("/profile/block")
                                        .set("Authorization", `Bearer ${jwt[0]}`);
          expect(res.statusCode).toBe(200);
          expect(res.body.blockedUsers).toBeDefined();
        });
    
        test.each([[0,1],[1,0]])("should block a user successfully", async (index0,index1) => {
          const userIdToBlock = jwtkn.verify(jwt[index0], process.env.JWT_SECRET).userID;
          const res = await request(app).patch(`/profile/block/${userIdToBlock}`)
                                        .set("Authorization", `Bearer ${jwt[index1]}`);
          expect(res.statusCode).toBe(200);
          expect(res.body.blockedUsers).toContainEqual(userIdToBlock );
        });
    
        test("should unblock a user successfully", async () => {
          const userIdToUnblock = jwtkn.verify(jwt[0], process.env.JWT_SECRET).userID; // Replace with a valid user ID
          const res = await request(app).patch(`/profile/unblock/${userIdToUnblock}`)
                                        .set("Authorization", `Bearer ${jwt[1]}`);
          expect(res.statusCode).toBe(200);
          expect(res.body.blockedUsers).not.toContainEqual(expect.objectContaining({userIdToUnblock }));
        });
      });

    // Privacy Settings
    describe("/privacySettings Given a valid jwt token", () => {
        test("should return privacy settings and status 200", async () => {
          const res = await request(app).get("/profile/privacySettings")
                                        .set("Authorization", `Bearer ${jwt[0]}`);
          expect(res.statusCode).toBe(200);
          expect(res.body.privacySettings).toBeDefined();
        });
    
        test("should update privacy settings and return success message", async () => {
          const res = await request(app)
            .put("/profile/privacySettings")
            .set("Authorization", `Bearer ${jwt[0]}`)
            .send({ showProfileImage: false, showAboutSection: false });
    
          expect(res.statusCode).toBe(200);
          expect(res.body.message).toBe("Privacy Settings Updated Successfully !");
        });
    
        test("should return error if privacy settings are missing", async () => {
          const res = await request(app)
            .put("/profile/privacySettings")
            .set("Authorization", `Bearer ${jwt[0]}`)
            .send({});
    
          expect(res.statusCode).toBe(500);
          expect(res.body.message).toBe("Bad request !");
        });
      });
  
    // Get Profile Image
    describe("/image Given a valid jwt token", () => {
      test("should return the profile image and status 200", async () => {
        const res = await request(app).get("/profile/image")
                                      .set("Authorization", `Bearer ${jwt[0]}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.profileImage).toBeDefined();
      });
    });
  
    // Get Profile Image (Unauthenticated)
    describe("/image/other/:id Given a user id", () => {
      test("should return the profile image for the user and status 200", async () => {
        const userId = jwtkn.verify(jwt[0], process.env.JWT_SECRET).userID;
        const res = await request(app).get(`/profile/image/other/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.profileImage).toBeDefined();
      });

      test("should return default profile image if privacy setting is false", async () => {
        const userId = jwtkn.verify(jwt[1], process.env.JWT_SECRET).userID;
        const res = await request(app).get(`/profile/image/other/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.profileImage).toBe("defaultUserImage.png");
      });
    });
  
    // Update Profile Image
    describe("/image Given a valid jwt token and a file upload", () => {
      test("should upload a new profile image and return filename", async () => {
        const filePath = 'C:/Users/user/Desktop/whisper-app/whisper-backend/uploads/defaultUserImage.png'; // Adjust with a valid file path for testing
        const res = await request(app)
          .post("/profile/image")
          .set("Authorization", `Bearer ${jwt[0]}`)
          .attach("file", filePath);
  
        expect(res.statusCode).toBe(200);
        expect(res.body.filename).toBeDefined();
      });
  
      test("should return error if file is not provided", async () => {
        const res = await request(app)
          .post("/profile/image")
          .set("Authorization", `Bearer ${jwt[0]}`);
  
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("File could not be uploaded !");
      });
    });
  
    // Get About Section
    describe("/about Given a valid jwt token", () => {
      test("should return the about section and status 200", async () => {
        const res = await request(app).get("/profile/about")
                                      .set("Authorization", `Bearer ${jwt[0]}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.about).toBeDefined();
      });
    });
  
    // Get About Section (Unauthenticated)
    describe("/about/other/:id Given a user id", () => {
      test("should return the about section for the user and status 200", async () => {
        const userId = jwtkn.verify(jwt[0], process.env.JWT_SECRET).userID;
        const res = await request(app).get(`/profile/about/other/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.about).toBeDefined();
      });
    });
  
    // Update About Section
    describe("/about Given a valid jwt token", () => {
      test("should update the about section and return a success message", async () => {
        const newAbout = { about: "This is a new about section" };
        const res = await request(app)
          .patch("/profile/about")
          .set("Authorization", `Bearer ${jwt[0]}`)
          .send(newAbout);
  
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("About Section Updated Successfully !");
      });
  
    });
  
    // Get Status
    describe("/status Given a valid jwt token", () => {
      test("should return the user status and status 200", async () => {
        const res = await request(app).get("/profile/status")
                                      .set("Authorization", `Bearer ${jwt[0]}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeDefined();
      });
    });
  
    // Get Status (Unauthenticated)
    describe("/status/other/:id Given a user id", () => {
      test("should return the status for the user and status 200", async () => {
        const userId = jwtkn.verify(jwt[0], process.env.JWT_SECRET).userID;
        const res = await request(app).get(`/profile/status/other/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeDefined();
      });
    });
  
    // Update Status
    describe("/status Given a valid jwt token", () => {
      test("should update the status and return the new status", async () => {
        const res = await request(app)
          .patch("/profile/status")
          .set("Authorization", `Bearer ${jwt[0]}`)
          .send({ status: "Offline" });
  
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Offline");
      });
  
    });
});  
describe("/auth", () =>{
    //Delete
    describe("/delete-account Given a jwt token ",() =>{
        test.each([[0],[1]])("user should be deleted and server responde with a message and status 200", async (index)=>{
            const res = await request(app).delete("/auth/delete-account").set("Authorization", `Bearer ${jwt[index]}`)
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("User account successfully deleted");
        });  
    });
});
