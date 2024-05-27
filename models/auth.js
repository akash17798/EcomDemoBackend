const jimp = require('jimp');
const fs = require('fs');
const db = require("../utils/databse");

module.exports = {

  //Registration
  doSignUp: (registerData) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return new Promise(async (resolve, reject) => {
      if (!emailRegex.test(registerData?.user_email)) {
        return resolve({
          status: 400,
          message: "Please Enter valid email address...",
        });
      }

      if (
        registerData?.user_mobile.length != 10 ||
        !registerData?.user_mobile?.match(/^\d{10}$/g)
      ) {
        return resolve({
          status: 400,
          message: "Please Enter valid mobile number...",
        });
      }

      const userExistWithEmailId = await db.execute(
        `SELECT * FROM users WHERE user_email = '${registerData.user_email.toLowerCase()}'`,
        [registerData.user_email]
      );
      if (userExistWithEmailId[0].length != 0) {
        resolve({ status: 400, message: "Email is already registered..." });
        return;
      }

      const userExistWithMobile = await db.execute(
        `SELECT * FROM users WHERE user_mobile = '${registerData.user_mobile}'`,
        [registerData.user_mobile]
      );
      if (userExistWithMobile[0].length != 0) {
        resolve({
          status: 400,
          message: "Mobile Number is already registered...",
        });
        return;
      }

      if (registerData?.user_password.length < 6) {
        return resolve({
          status: 400,
          message: "Your password length is less than 6...",
        });
      }

      if (registerData?.user_password != registerData?.user_confirm_password) {
        return resolve({
          status: 400,
          message: "Passwords you entered are not same...",
        });
      }

      await db
        .execute(
          `INSERT INTO users (user_name,user_email,user_mobile,user_password,user_confirm_password,user_profile) VALUES ('${registerData.user_name}', '${registerData.user_email.toLowerCase()}','${registerData.user_mobile}','${registerData.user_password}','${registerData.user_confirm_password}','https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg')`,[
            (registerData.user_name,
            registerData.user_email,
            registerData.user_mobile,
            registerData.user_password,
            registerData.user_confirm_password)
          ]
        )
        .then(() => {
          return resolve({
            status: 200,
            message: "You are registered successfully...",
          });
        })
        .catch((err) => {
          console.log(err);
          return resolve({
            status: 400,
            message: "Server down or network issue...",
          });
        });
    });
  },

  //Login
  doSignIn : (loginData) => {

    return new Promise(async(resolve, reject) => {

      if(!Object.hasOwn(loginData,'user_email') || !Object.hasOwn(loginData,'user_password')){
        resolve({status : 500, message : "please enter valid field name"})
        return;
      }


      const validateUser = await db.execute(`SELECT * FROM users WHERE user_email = '${loginData?.user_email}' AND user_password = '${loginData?.user_password}'`,[loginData?.user_email, loginData?.user_password])
      if(validateUser[0].length == 0){
          return resolve({status : 400, message : "user With above credentials are not exist..."})
      }
      return resolve({data : validateUser[0][0], message : 'you are logged-in successfully...'})
    })
  },

  //Update User

  doUpdateUser : (userDetails) => {
    return new Promise(async(resolve, reject) => {
      if(!Object.hasOwn(userDetails,'user_email') || !Object.hasOwn(userDetails,'user_mobile') || !Object.hasOwn(userDetails,'user_name') || !Object.hasOwn(userDetails,'user_profile') || !Object.hasOwn(userDetails,'user_id')){
        resolve({status : 500, message : "please enter valid field name"})
        return;
      }
      const userData = await db.execute(`UPDATE users SET user_email = '${userDetails.user_email}', user_mobile = '${userDetails.user_mobile}',user_profile = '${userDetails.user_profile}', user_name = '${userDetails.user_name}' WHERE user_id = '${userDetails.user_id}'`,[userDetails])
      console.log(typeof userData[0].affectedRows);
      if(userData[0].affectedRows != 0){
        const validateUser = await db.execute(`SELECT * FROM users WHERE user_id = '${userDetails?.user_id}' `,[userDetails])
        resolve({status : 200,data : validateUser[0][0],  message : "Your Profile is updated successfully..."})
        return;
      } 
      resolve({status : 400, message : "Please enter valid user ID"})
    })
  }
};
