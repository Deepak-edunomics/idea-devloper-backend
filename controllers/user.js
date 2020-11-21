const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//Models
const User = require('../models/user')
const Permission = require('../models/permission')


//Config
const key = require('../config/key')
const sendEmail = require('../config/nodemailer')


//For email
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');


//Validation
const validateUserRegister = require('../validation/user/userRegister')
const validateUserLogin = require('../validation/user/userLogin')
const validateEmailVerification = require('../validation/user/emailVerification')


module.exports = {
    userRegister: async (req, res, next) => {
        try {
            console.log("req.body",req.body)
            const { errors, isValid } = validateUserRegister(req.body);
            if (!isValid) {
                return res.status(400).json(errors)
            }
            const { firstName, lastName, organization, email, password } = req.body;
            const user = await User.findOne({ email })
            if (user) {
                errors.email = "Email already exist"
                return res.status(400).json(errors)
            }
            let hashedPassword = await bcrypt.hash(password, 10)
            const generateOTP = () => {
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                return OTP;
            }
            const otp = generateOTP()
            const newUser = await new User({
                firstName,
                lastName,
                organization,
                email,
                password: hashedPassword,
                otp,
                role: 'super-admin',
                isVerified: false
            })
            await newUser.save()
            await sendEmail(newUser.email, otp, "account-verification")
            // const msg = {
            //     to: newUser.email,
            //     from: 'hemant@edunomics.in',
            //     subject: 'Accout verification for Idea Deployer',
            //     text: 'Your verification code for registration is ' + otp
            // };
            // const emailResponse = await sgMail.send(msg)
            const { _id, role, isVerified } = newUser
            const payload = {
                _id, firstName, lastName, organization, role, email, isVerified
            }
            const permission = await new Permission({
                organization,
                role: 'super-admin',
                user: _id,
                createWs: true,
                viewWs: true, 
                editWs: true,
                deleteWs:true,
                createCllg: true,
                viewCllg: true,
                editCllg: true,
                deleteCllg: true,
                createPipelineCllg: true, 
                viewPipelineCllg: true,
                editPipelineCllg: true,
                deletePipelineCllg: true,
                createIdea: true,
                viewIdea: true,
                editIdea: true,
                deleteIdea: true,
                createPipelineIdea: true,
                viewPipelineIdea: true,
                editPipelineIdea: true,
                deletePipelineIdea: true,
            })
            await permission.save()
            const helper = async () => {
                newUser.otp = ""
                await newUser.save()
            }
            setTimeout( ()=> {
                helper()
            }, 900000)
            jwt.sign(
                payload,
                key.secretKey,
                { expiresIn: 14400 },
                (err, token) => {
                    res.json({
                        success: true,
                        message: "User created successfully, for email verification an otp has been sent to your email",
                        token: 'Bearer ' + token,
                        result: payload
                    });
                }
            );
        }
        catch (err) {
            console.log("Error in userRegister", err.message)
            return res.status(400).json({
                success:false,
                message: `Error in userRegister ${err.message}`
            })
        }
    },
    userLogin: async (req, res, next) => {
        try {
            const { errors, isValid } = validateUserLogin(req.body);
            if (!isValid) {
                return res.status(400).json(errors)
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                errors.email = "Email doesnt not exist"
                return res.status(400).json(errors)
            }
            if (!user.isVerified) {
                errors.email = "You havent verified your email yet"
                return res.status(400).json(errors)
            }
            const isCorrect = await bcrypt.compare(password, user.password)
            if (!isCorrect) {
                errors.password = 'Invalid Credentials';
                return res.status(404).json(errors);
            }
            const { _id, firstName, lastName, organization, role , isVerified} = user
            const payload = {
                _id, firstName, lastName, organization, role, email: user.email, isVerified
            }
            jwt.sign(
                payload,
                key.secretKey,
                { expiresIn: 14400 },
                (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token,
                        message: "Logged in successfully",
                        result: payload
                    });
                }
            );

        }
        catch (err) {
            console.log("Error in userLogin", err.message)
            return res.status(400).json({ message: `Error in userLogin ${err.message}` })
        }

    },
    emailVerification: async (req, res, next) => {
        try {
            const { errors, isValid } = validateEmailVerification(req.body);
            if (!isValid) {
                return res.status(400).json(errors)
            }
            const { email, otp } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                errors.email = "Invalid Email"
                return res.status(400).json(errors)
            }
            if (user.otp !== otp) {
                errors.otp = "Invalid otp"
                return res.status(200).json(errors)
            }
            user.otp = ""
            user.isVerified = true
            await user.save()
            const { _id, role, isVerified, organization, firstName, lastName, } = user
            const payload = {
                _id, firstName, lastName, organization, role, email, isVerified
            }
            jwt.sign(
                payload,
                key.secretKey,
                { expiresIn: 14400 },
                (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token,
                        message: "Email verified successfully",
                        result: payload
                    });
                }
            );
        }
        catch (err) {
            console.log("Error in emailVerification", err.message)
            return res.status(400).json({ message: `Error in emailVerification ${err.message}` })
        }
    },
    forgotPassword: async (req, res, next) => {
        let errors = {}
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            errors.email= "User not found"
            return res.status(404).json(errors)
        }
        const generateOTP = () => {
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return OTP;
        }
        const otp = generateOTP()
        // const msg = {
        //     to: user.email,
        //     from: 'hemant@edunomics.in',
        //     subject: 'Forgot password for Idea Deployer',
        //     text: 'Your verification code for forgot password is ' + otp
        // };
        // await sgMail.send(msg)
        const emailResponse = await sendEmail(email, otp, "forgot-password")
        user.otp = otp
        await user.save()
        const helper = async () => {
            user.otp = ""
            await user.save()
        }
        setTimeout(() => {
            helper()
        }, 300000)
        return res.status(200).json({
            success: true,
            message: "An otp has been sent to you email"
        })
    },
    postOTP: async (req, res, next) => {
        let errors = {}
        const {email,otp, newPassword } = req.body
        const user = await User.findOne({ email})
        if (!user) {
            errors.email = "Invalid email"
            return res.status(404).json(errors)
        }
        if (user.otp !== otp) {
            errors.otp = "Invalid OTP"
            return res.status(400).json(errors)
        }
        let hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        const { _id, firstName, lastName, organization, role, isVerified } = user
        const payload = {
            _id, firstName, lastName, organization, role, email: user.email, isVerified
        }
        jwt.sign(
            payload,
            key.secretKey,
            { expiresIn: 14400 },
            (err, token) => {
              res.json({
                    success: true,
                    message: "Password updated successfully",
                    token: 'Bearer ' + token,
                    result: payload
                });
            }
        );
    },
    updatePassword: async (req, res, next) => {
        let errors = {}
        const { _id } = req.user
        const {oldPassword, newPassword } = req.body
        const user = await User.findById(_id)
        if (!user) {
            errors.oldPassword = "User not found"
            return res.status(404).json(errors)
        }
        const isCorrect = await bcrypt.compare(oldPassword, user.password)
        if (!isCorrect) {
            errors.oldPassword = 'Invalid old Password';
            return res.status(404).json(errors);
        }
        let hashedPassword;
        hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        await user.save()
        res.status(200).json({
            success: true,
            message: "Successfully updated password",
        })
    }
}
