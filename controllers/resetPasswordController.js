// const path = require("path");
// const User = require("../models/userModel");
// const ResetPassword = require("../models/resetPasswordModel");
// const bcrypt = require("bcrypt");
// const Sib = require("sib-api-v3-sdk");
// const { v4: uuidv4 } = require("uuid");
// const saltRounds = 10;

// const hashPassword = async (password) => {
//   return await bcrypt.hash(password, saltRounds);
// };

// exports.forgotPasswordPage = async (req, res, next) => {
//   try {
//     res
//       .status(200)
//       .sendFile(
//         path.join(__dirname, "../", "public", "views", "forgotPassword.html")
//       );
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.sendMail = async (req, res, next) => {
//   try {
//     const email = req.body.email;
//     const requestId = uuidv4();

//     const recepientEmail = await User.findOne({ where: { email: email } });

//     if (!recepientEmail) {
//       return res
//         .status(404)
//         .json({ message: "Please provide the registered email!" });
//     }

//     const resetRequest = await ResetPassword.create({
//       id: requestId,
//       isActive: true,
//       userId: recepientEmail.dataValues.id,
//     });

//     const client = Sib.ApiClient.instance;
//     const apiKey = client.authentications["api-key"];
//     apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
//     const transEmailApi = new Sib.TransactionalEmailsApi();
//     const sender = {
//       email: "simranbhandari036@gmail.com",
//       name: "Simran",
//     };
//     const receivers = [
//       {
//         email: email,
//       },
//     ];
//     const emailResponse = await transEmailApi.sendTransacEmail({
//       sender,
//       To: receivers,
//       subject: "Reset Password Link",
//       textContent: `http://localhost:3000/password/resetPasswordPage/${requestId}`,
//       //htmlContent: `<h3>Hi! We recieved the request from you for reset password. Here is the link below >>></h3>
//       //<a href="http://localhost:3000/password/resetPasswordPage/${requestId}"> Click Here</a>`,
      
//     });
//     return res.status(200).json({
//       message:
//         "Link for reset password is successfully sent to your Email Id!",
//     });
//   } catch (error) {
//     console.log("error");
//     return res.status(409).json({ message: "resetting password failed" });
//   }
// };

// exports.resetPasswordPage = async (req, res, next) => {
//   try {
//     res
//       .status(200)
//       .sendFile(
//         path.join(__dirname, "../", "public", "views", "resetPassword.html")
//       );
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.updatePassword = async (req, res, next) => {
//   try {
//     const requestId = req.headers.referer.split("/");
//     const password = req.body.password;
//     const checkResetRequest = await ResetPassword.findAll({
//       where: { id: requestId[requestId.length - 1], isActive: true },
//     });
//     if (checkResetRequest[0]) {
//       const userId = checkResetRequest[0].dataValues.userId;
//       const result = await ResetPassword.update(
//         { isActive: false },
//         { where: { id: requestId } }
//       );
//       const newPassword = await hashPassword(password);
//       const user = await User.update(
//         { password: newPassword },
//         { where: { id: userId } }
//       );
//       return res
//         .status(200)
//         .json({ message: "Successfully changed password!" });
//     } else {
//       return res
//         .status(409)
//         .json({ message: "Link is already Used Once, Request for new Link!" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(409).json({ message: "Failed to change password!" });
//   }
// };

const path = require("path");
const { v4: uuid } = require("uuid");
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config();

const FPR = require('../models/forgotpasswordrequests');
const User = require('../models/userModel');

exports.forgotPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "forgotPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

exports.sendMail = async (req, res, next) => {
  try {
    const validEmail = await User.findOne({ where: { email: req.body.email } });
    if (!validEmail) {
      return res.status(400).json({ message: 'Invalid Email' });
    }
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY_P;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: 'simranbhandari036@gmail.com',
      name: 'Simran',
    };
    const receivers = [{ email: req.body.email }];
    const sendUuid = uuid();
    await FPR.create({ uuid: sendUuid, userId: validEmail.id, isActive: true });
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Reset Your Password',
      textContent: `http://localhost:3000/password/resetPasswordPage/${sendUuid}`,
    });
    return res.status(200).json({ message: 'Reset password link has been sent to your email address!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Failed to send reset password link.' });
  }
};

// exports.resetPasswordPage = async (req, res, next) => {
//     try {
//       res
//         .status(200)
//         .sendFile(
//           path.join(__dirname, "../", "public", "views", "resetPassword.html")
//         );
//     } catch (error) {
//       console.log(error);
//     }
//   };

exports.resetPasswordPage = async (req, res, next) => {
  console.log("Reset Password Initiated");
  const reqId = req.params.requestId;
  console.log('reqId-----------------', reqId);
  const dbuuid = await FPR.findAll({where:{uuid:reqId}});
  console.log('dbuuid------------------', dbuuid);
  if(dbuuid.length === 0){
    res.status(500).send('Bad Request, try again');
  }
  if(dbuuid[0].isActive === false){
    res.status(500).send('Bad Request, try again');
  }
  res.status(200).send(`

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Reset Password</title>
    
    <style>
            body{
    
    background-size: cover;
    color: black;
    font-family: Sans-Serif;
    }
    * {
    box-sizing: border-box;
  }
  .wrapper {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 25px;
        border-radius: 0.8rem;
        box-sizing: border-box;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
      
      .wrapper h1 {
        font-size: 30px;
      }
      
      .wrapper h3 {
        font-size: 15px;
        font-weight: 400;
      }
      
      .wrapper .field {
        height: 40px;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
      
      .wrapper input[type=password] {
        width: 250px;
        height: 30px;
        outline: none;
        border: none;
        border-radius: 0.3rem;
        padding-left: 35px;
      }
      
      .wrapper span {
        position: absolute;
        color: black;
        padding: 4px;
      }
      
      .wrapper button {
        padding: 2px;
        width: 290px;
        height: 35px;
        border: none;
        border-radius: 0.3rem;
        color: white;
        background-color: black;
        margin-top: 10px;
      }
      .wrapper button:hover {
  background-color: grey;
  color: white;
  border-color: white;
}

      .link1 a {
        text-decoration: none;
        color: #007dff;
      }
    </style>
    <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
  />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
      <script>
        function formsubmitted(e){
            e.preventDefault();
            console.log('called')
        }
    </script>
  </head>
  <body>
    <div class="wrapper">
        <h2><i class="fa fa-lock fa-4x resetPassword"></i></h2>
      <h1>New Password</h1>
      <h3>Enter your new password here.</h3>
      <form class="inputs" action="/password/resetPassword/${dbuuid[0].id}" method="get">
        <div class="field">
          <span class="material-icons">edit</span>
          <input name="newpassword" type="password" placeholder="Enter New password" required>
        </div>
        <button type="submit">Reset Password</button>
    </form>
      <div class="link1">
        <p>Back To <a href="/">Signin.</a></p>
      </div>
    </div>
  </body>
</html>`);

  res.end();
}



exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.params); 
    const {newpassword} = req.query;
    const {resetpasswordid} = req.params;
    console.log(newpassword);
    console.log(resetpasswordid);
    const resetpasswordrequest = await FPR.findOne({ where : { id: resetpasswordid }});
    if (resetpasswordrequest) {
        const user = await User.findOne({where: { id : resetpasswordrequest.userId}});
        if(user) {
            //encrypt the password

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, async function(err, salt) {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                const hash = await bcrypt.hash(newpassword, salt);
                // Store hash in your password DB.
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                await user.update({ password: hash });
                res.redirect(('/'))
                //res.status(201).json({message: 'Successfuly update the new password'})
            });
        } else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
    } else {
        return res.status(404).json({ error: 'No reset password request exists', success: false});
    }
} catch(error){
    return res.status(403).json({ error, success: false } )
}

}

// exports.updatePassword = async (req, res, next) => {
//   try {
//     const { uuid, newPassword } = req.body;
//     const resetRequest = await FPR.findOne({ where: { uuid, isActive: true } });
//     if (!resetRequest) {
//       return res.status(400).json({ message: 'Invalid or expired reset link' });
//     }
//     const userId = resetRequest.userId;
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await User.update({ password: hashedPassword }, { where: { id: userId } });
//     await FPR.update({ isActive: false }, { where: { uuid } });
//     return res.status(200).json({ message: 'Password has been successfully updated!' });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Failed to reset password.' });
//   }
// };


// exports.updatePassword = async (req, res) => {
//   try {
//     const npassword = req.body.password;
//     const { requestId } = req.params;
//     console.log(npassword); 
//     console.log(requestId); //undefined
//     const resetpasswordrequest = await FPR.findOne({ where : { id: requestId }});
//     const user = await User.findOne({where: { id : resetpasswordrequest.userId}});
//     if(user) {
//       //encrypt the password
//       const saltRounds = 10;
//       bcrypt.genSalt(saltRounds, function(err, salt) {
//         if(err){
//           console.log(err);
//           throw new Error(err);
//         }
//         bcrypt.hash(npassword, salt, function(err, hash) {
//           // Store hash in your password DB.
//           if(err){
//             console.log(err);
//             throw new Error(err);
//           }
//           user.update({ password: hash }).then(() => {
//             res.status(201).json({message: 'Successfully updated the new password'})
//           })
//         });
//       });
//     } else{
//       return res.status(404).json({ error: 'No user exists', success: false})
//     }
//   } catch(error){
//     return res.status(403).json({ error, success: false } )
//   }
// }
// const saltRounds = 10;
// const hashPassword = async (password) => {
//   return await bcrypt.hash(password, saltRounds);
// };


// exports.updatePassword = async (req, res, next) => {
//   try {
//     const requestId = req.headers.referer.split("/");
//     console.log(requestId)
//     const password = req.body.password;
//     console.log(password)
//     const checkResetRequest = await ResetPassword.findAll({
//       where: { id: requestId[requestId.length - 1], isActive: true },
//     });
//     if (checkResetRequest[0]) {
//       const userId = checkResetRequest[0].dataValues.userId;
//       const result = await ResetPassword.update(
//         { isActive: false },
//         { where: { id: requestId } }
//       );
//       const newPassword = await hashPassword(password);
//       const user = await User.update(
//         { password: newPassword },
//         { where: { id: userId } }
//       );
//       return res
//         .status(200)
//         .json({ message: "Successfully changed password!" });
//     } else {
//       return res
//         .status(409)
//         .json({ message: "Link is already Used Once, Request for new Link!" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(409).json({ message: "Failed to change password!" });
//   }
// };

