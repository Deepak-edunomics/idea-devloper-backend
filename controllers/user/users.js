const express = require('express');
const mongoose = require('mongoose');
const Users = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dot = require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const Otps = require('../../models/otpverification');
const shortId = require('shortid');
const Roles = require('../../models/permission');
var nodemailer = require('nodemailer');
const mongodb = require('mongodb');
exports.register = (req, res, next) => {
    var email = req.body.email;
    var org = req.body.organization;

    Users.find({ $or: [{ email: email }, { organization: org }] })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user.email == email) {
                    return res.status(403).json({
                        success: 'false',
                        message: 'Email already exists!'
                    })
                } else {
                    return res.status(403).json({
                        success: 'false',
                        message: 'Organization already exists!'
                    })
                }
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            success: 'false',
                            message: 'Some error occurred'
                        })
                        return 1;
                    } else {
                        const user = new Users({

                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            organization: req.body.organization,
                            password: hash,
                            role: 'super-admin'
                        });
                        user.save()
                            .then()
                            .catch(err1 => {
                                return res.status(500).json({
                                    success: 'false',
                                    message: 'Some error occurred. Fields not set properly'
                                })
                            })
                        const roles = new Roles({
                            email: req.body.email,
                            role: 'super-admin',
                            createWs: 'true',
                            createCllg: 'true',
                            createIdea: 'true',
                            viewWs: 'true',
                            editWs: 'true',
                            deleteWs: 'true',
                            viewCllg: 'true',
                            editCllg: 'true',
                            deleteCllg: 'true',
                            pipelineCllg: 'true',
                            viewIdea: 'true',
                            editIdea: 'true',
                            deleteIdea: 'true',
                            pipelineIdea: 'true',
                            organization: req.body.organization
                        })
                        roles.save()
                            .then(success => {
                                console.log("Role assign");
                            })
                            .catch(err => {})
                        var otp = new Otps({
                            _id: new mongoose.Types.ObjectId(),
                            userId: user._id,
                            otp: shortId.generate()
                        })
                        otp.save()
                            .then(success1 => {
                                const token = jwt.sign({
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
                                    organization: user.organization,
                                    role: user.role,
                                    userId: user._id
                                }, process.env.SALT, {
                                    expiresIn: "12h"
                                });
                                const msg = {
                                    to: user.email,
                                    from: 'hemant@edunomics.in',
                                    subject: 'Accout verification for Idea Deployer',
                                    text: 'Your verification code for registration is ' + otp.otp,
                                };
                                sgMail
                                    .send(msg)
                                    .then(() => {}, error => {
                                        console.error(error);

                                        if (error.response) {
                                            console.error(error.response.body)
                                        }
                                    });

                                return res.status(200).json({
                                    success: 'true',
                                    message: 'An otp has been sent to email id',
                                    token: token,
                                    user: {
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        organization: user.organization,
                                        role: user.role,
                                        _id: user._id,
                                        isVerified: user.isVerified
                                    }
                                })

                            })
                            .catch(err2 => {
                                console.log(err2);
                                return res.status(500).json({
                                    success: 'false',
                                    message: 'some error occurred'
                                })
                            })

                    }
                })
            }
        })
        .catch(err => {
            console.log('error: ', err);
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })


}

exports.otpVerify = (req, res, next) => {
    const userId = req.decoded.userId;
    const otp = req.body.otp;
    Otps.find({ userId: mongodb.ObjectID(userId) })
        .then(success1 => {

            if (success1.length < 1) {
                return res.status(400).json({
                    success: 'false',
                    message: 'otp expired'
                })
            } else {
                let len = success1.length;
                if (success1[len - 1].otp == otp) {
                    Users.findById(userId)
                        .then(success2 => {
                            success2.isVerified = true;
                            success2.save()
                                .then(success3 => {
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'Account verified',
                                        user: {
                                            firstName: success2.firstName,
                                            lastName: success2.lastName,
                                            role: success2.role,
                                            isVerified: success2.isVerified,
                                            organization: success2.organization,
                                            email: success2.email,
                                            _id: success2._id
                                        }
                                    })
                                })
                                .catch(err1 => {
                                    return res.status(500).json({
                                        success: 'false',
                                        message: 'Some error occurred.'
                                    })
                                })
                        })
                        .catch(err3 => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred..'
                            })
                        })
                } else {
                    return res.status(403).json({
                        success: 'false',
                        message: 'otp invalid. please use latest otp'
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred....'
            })
        })
}

exports.regenerateOtp = (req, res, next) => {
    const email = req.email;
    Users.find({ email: email })
        .then(success1 => {
            if (success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'email id does not exists'
                })
            } else {
                var _userId = success1[0]._id;

                var otp = new Otps({
                    _id: new mongoose.Types.ObjectId(),
                    userId: _userId,
                    otp: shortId.generate()
                })
                otp.save()
                    .then(success3 => {
                        const token = jwt.sign({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            organization: user.organization,
                            role: user.role,
                            userId: user._id
                        }, process.env.SALT, {
                            expiresIn: "12h"
                        });
                        const msg = {
                            to: success1[0].email,
                            from: 'hemant@edunomics.in',
                            subject: 'Accout verification for Idea Deployer',
                            text: 'Your verification code for registration is ' + otp.otp,
                        };
                        sgMail
                            .send(msg)
                            .then(() => {}, error => {
                                console.error(error);
                                if (error.response) {
                                    console.error(error.response.body)
                                }
                            });

                        return res.status(200).json({
                            success: 'true',
                            message: 'An otp has been sent to email id',
                            token: token,
                            user: {
                                _id: success1[0]._id,
                                firstName: success1[0].firstName,
                                lastName: success1[0].lastName,
                                organization: success1[0].organization,
                                role: success1[0].role,
                                email: success1[0].email,
                                isVerified: success1[0].isVerified
                            }
                        })
                    })
                    .catch(err2 => {
                        console.log(err2);
                        return res.status(500).json({
                            success: 'false',
                            message: 'some error occurred'
                        })
                    })

            }
        })
        .catch(err4 => {
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })
        })
}


exports.login = (req, res, next) => {

    Users.find({ email: req.body.email })
        .then(user => {
            console.log(user);
            if (user.length < 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'Email not found'
                })
                return 1;
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        success: 'false',
                        message: 'Auth failed!'
                    });
                }
                if (result) {
                    if (user[0].isVerified == true) {
                        let token = jwt.sign({
                            firstName: user[0].firstName,
                            lastName: user[0].lastName,
                            email: user[0].email,
                            organization: user[0].organization,
                            role: user[0].role,
                            userId: user[0]._id
                        }, process.env.SALT, {
                            expiresIn: "12h"
                        });
                        res.status(200).json({
                            success: 'true',
                            message: 'Auth Successful',
                            token: token,
                            user: {
                                firstName: user[0].firstName,
                                lastName: user[0].lastName,
                                role: user[0].role,
                                isVerified: user[0].isVerified,
                                organization: user[0].organization,
                                email: user[0].email,
                                _id: user[0]._id
                            }

                        })
                        return 1;

                    } else {
                        if (user[0].role != 'super-admin') {
                            let token = jwt.sign({
                                firstName: user[0].firstName,
                                lastName: user[0].lastName,
                                email: user[0].email,
                                organization: user[0].organization,
                                role: user[0].role,
                                userId: user[0]._id
                            }, process.env.SALT, {
                                expiresIn: "12h"
                            });
                            return res.status(200).json({
                                success: 'true',
                                message: 'change your password',
                                token: token,
                                user: {
                                    firstName: user[0].firstName,
                                    lastName: user[0].lastName,
                                    role: user[0].role,
                                    isVerified: user[0].isVerified,
                                    organization: user[0].organization,
                                    email: user[0].email,
                                    _id: user[0]._id
                                }
                            })
                        } else {
                            var otp = new Otps({
                                _id: new mongoose.Types.ObjectId(),
                                userId: user[0]._id,
                                otp: shortId.generate()
                            })
                            otp.save()
                                .then(success1 => {
                                    let token = jwt.sign({
                                        firstName: user[0].firstName,
                                        lastName: user[0].lastName,
                                        email: user[0].email,
                                        organization: user[0].organization,
                                        role: user[0].role,
                                        userId: user[0]._id
                                    }, process.env.SALT, {
                                        expiresIn: "12h"
                                    });
                                    const msg = {
                                        to: user[0].email,
                                        from: 'hemant@edunomics.in',
                                        subject: 'Accout verification for Idea Deployer',
                                        text: 'Your verification code for registration is ' + otp.otp,
                                    };
                                    sgMail
                                        .send(msg)
                                        .then(() => {}, error => {
                                            console.error(error);

                                            if (error.response) {
                                                console.error(error.response.body)
                                            }
                                        });
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'Account unverified. An otp has been sent to email id',
                                        token: token,
                                        user: {
                                            firstName: user[0].firstName,
                                            lastName: user[0].lastName,
                                            role: user[0].role,
                                            isVerified: user[0].isVerified,
                                            organization: user[0].organization,
                                            email: user[0].email,
                                            _id: user[0]._id
                                        }
                                    })

                                })
                                .catch(err2 => {
                                    console.log(err2);
                                    return res.status(500).json({
                                        success: 'false',
                                        message: 'some error occurred'
                                    })
                                })

                        }

                    }

                } else {
                    res.status(401).json({
                        success: 'false',
                        message: 'Auth failed.'
                    });
                    return 1;
                }

            })

        })
        .catch(err => {
            console.log('error: ', err);
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}

exports.addUser = (req, res, next) => {
    const userId = req.decoded.userId;
    Users.findById(userId)
        .then(result1 => {
            if (result1 == null || result1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not valid'
                })
            } else {
                Users.find({ email: req.body.email, organization: req.decoded.organization })
                    .then(result2 => {
                        if (result2.length >= 1) {
                            return res.status(401).json({
                                success: 'false',
                                message: 'Email Id already added to your organization'
                            })
                        } else {
                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                if (err) {
                                    res.status(500).json({
                                        success: 'false',
                                        message: 'Some error occurred'
                                    })
                                    return 1;
                                } else {
                                    const user = new Users({

                                        _id: new mongoose.Types.ObjectId(),
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        email: req.body.email,
                                        organization: req.decoded.organization,
                                        password: hash,
                                        role: req.body.role
                                    });
                                    user.save()
                                        .then(userAdd => {
                                            return res.status(200).json({
                                                success: 'true',
                                                message: 'User created',
                                                user: {
                                                    _id: userAdd._id,
                                                    email: userAdd.email,
                                                    firstName: userAdd.firstName,
                                                    lastName: userAdd.lastName,
                                                    organization: userAdd.organization,
                                                    role: userAdd.role,
                                                    isVerified: userAdd.isVerified
                                                }

                                            })
                                        })
                                        .catch(err1 => {
                                            return res.status(500).json({
                                                success: 'false',
                                                message: 'Some error occurred. Fields not set properly'
                                            })
                                        })
                                }
                            })
                        }
                    })

            }
        })
        .catch(err5 => {
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })

        })
}

exports.passwordChangeFirstTime = (req, res, next) => {
    const password = req.body.password;
    const userId = req.decoded.userId;
    Users.findById(userId)
        .then(success1 => {
            if (success1 == null || success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not found'
                })
            } else {
                if (success1.isVerified != false) {
                    return res.status(401).json({
                        success: 'false',
                        message: 'password already changed'
                    })
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        } else {
                            success1.password = hash;
                            success1.isVerified = true;
                            success1.save()
                                .then(success2 => {
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'password changed successfuly',
                                        user: {
                                            _id: success1._id,
                                            email: success1.email,
                                            firstName: success1.firstName,
                                            lastName: success1.lastName,
                                            organization: success1.organization,
                                            role: success1.role,
                                            isVerified: success1.isVerified
                                        }

                                    })
                                })
                                .catch(err1 => {
                                    return res.status(500).json({
                                        success: 'false',
                                        message: 'some error occurred'
                                    })
                                })
                        }
                    })
                }
            }
        })
        .catch(err3 => {
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })
        })
}

exports.changePassword = (req, res, next) => {
    const userId = req.decoded.userId;
    console.log(userId);
    const email = req.decoded.email;
    const organization = req.decoded.organization;
    Users.findById(userId)
        .then(result1 => {
            if (result1 == null || result1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'invalid user'
                })
            } else {
                bcrypt.compare(req.body.currPassword, result1.password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            success: 'false',
                            message: 'invalid password!'
                        });
                    }
                    if (result) {
                        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                            if (err) {
                                res.status(500).json({
                                    success: 'false',
                                    message: 'Some error occurred'
                                })
                                return 1;
                            } else {
                                result1.password = hash;
                                result1.save()
                                    .then(success2 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'password changed successfuly',
                                            user: {
                                                _id: result1._id,
                                                email: result1.email,
                                                firstName: result1.firstName,
                                                lastName: result1.lastName,
                                                organization: result1.organization,
                                                role: result1.role,
                                                isVerified: result1.isVerified
                                            }

                                        })
                                    })
                                    .catch(err1 => {
                                        return res.status(500).json({
                                            success: 'false',
                                            message: 'some error occurred'
                                        })
                                    })
                            }
                        })


                    } else {
                        res.status(401).json({
                            success: 'false',
                            message: 'Auth failed.'
                        });
                        return 1;
                    }

                })
            }
        })
        .catch(err3 => {
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })
        })
}

exports.getAllUser = (req, res, next) => {
    const role = req.decoded.role;
    const organization = req.decoded.organization;
    if (role == 'super-admin') {
        Users.find({ organization: organization })
            .then(success1 => {
                console.log(success1);
                if (success1.length < 1) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'no user found'
                    })
                } else {
                    return res.status(200).json({
                        success: 'true',
                        message: 'users found',
                        user: success1
                    })
                }
            })
    } else {
        return res.status(401).json({
            success: 'false',
            message: 'unauthorized access'
        })
    }

}

exports.editUserByAdmin = (req, res, next) => {
    const id = req.decoded.userId;
    const organization = req.decoded.organization;
    const empId = req.params.id;
    Users.findById(id)
        .then(success1 => {
            if (success1 == null || success1.length < 1) { // if admin-id doesnt exists
                return res.status(404).json({
                    success: 'false',
                    message: 'admin does not exists'
                })
            } else {
                if (success1.role != 'super-admin') { // if admin id exists but is not super-admin
                    return res.status(401).json({
                        success: 'false',
                        message: 'unauthorized access'
                    })
                } else { // if admin id exists and is super admin
                    Users.findById(empId)
                        .then(success2 => {
                            if (success2 == null || success2.length < 1) { // if employee id doesnt exists
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'employee doesnt exists'
                                })
                            } else {
                                if (success1.organization != success2.organization) {
                                    return res.status(403).json({
                                        success: 'false',
                                        message: 'unauthorized access'
                                    })
                                } else {
                                    if (req.body.firstName != null) {
                                        success2.firstName = req.body.firstName;
                                    }
                                    if (req.body.lastName != null) {
                                        success2.lastName = req.body.lastName;
                                    }
                                    if (req.body.role != null) {
                                        success2.role = req.body.role;
                                    }
                                    if (req.body.email != null) {
                                        success2.email = req.body.email;
                                    }
                                    success2.save()
                                        .then(success3 => {
                                            return res.status(200).json({
                                                success: 'true',
                                                message: 'details updated successfully',
                                                user: {
                                                    email: success2.email,
                                                    firstName: success2.firstName,
                                                    lastName: success2.lastName,
                                                    role: success2.role,
                                                    isVerified: success2.isVerified,
                                                    _id: success2._id
                                                }
                                            })
                                        })
                                        .catch(err1 => {
                                            console.log("..................................................");
                                            console.log(err1);
                                            console.log("..................................................");
                                            return res.status(500).json({
                                                success: 'false',
                                                message: 'some error occurred'
                                            })
                                        })
                                }
                            }
                        })
                        .catch(err2 => {
                            console.log("..................................................");
                            console.log(err2);
                            console.log("..................................................");
                            return res.status(500).json({
                                success: 'false',
                                message: 'some error occurred'
                            })
                        })
                }
            }
        })
        .catch(err3 => {
            console.log("..................................................");
            console.log(err3);
            console.log("..................................................");
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })
        })
}

exports.editDetails = (req, res, next) => {
    const userId = req.decoded.userId;
    Users.findById(userId)
        .then(success1 => {
            if (success1 == null || success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not found'
                })
            } else {
                if (req.body.firstName != null) {
                    success1.firstName = req.body.firstName;
                }
                if (req.body.lastName != null) {
                    success1.lastName = req.body.lastName;
                }
                if (req.body.email != null) {
                    success1.email = req.body.email;
                }
                success1.save()
                    .then(success2 => {
                        return res.status(200).json({
                            success: 'true',
                            message: 'details updated successfully'
                        })
                    })
                    .catch(err1 => {
                        return res.status(500).json({
                            success: 'false..',
                            message: 'some error occurred',
                            user: {
                                firstName: success1.firstName,
                                lastName: success1.lastName,
                                email: success1.email,
                                role: success1.role,
                                isVerified: success1.isVerified,
                                _id: success1._id
                            }
                        })
                    })
            }
        })
        .catch(err2 => {
            console.log(err2);
            return res.status(500).json({
                success: 'false...',
                message: 'some error occurred'
            })
        })
}

exports.deleteUser = (req, res, next) => {
    const id = req.decoded.userId;
    const organization = req.decoded.organization;
    const empId = req.params.id;
    Users.findById(id)
        .then(success1 => {
            if (success1 == null || success1.length < 1) { // if admin-id doesnt exists
                return res.status(404).json({
                    success: 'false',
                    message: 'admin does not exists'
                })
            } else {
                if (success1.role != 'super-admin') { // if admin id exists but is not super-admin
                    return res.status(401).json({
                        success: 'false',
                        message: 'unauthorized access'
                    })
                } else { // if admin id exists and is super admin
                    Users.findById(empId)
                        .then(success2 => {
                            if (success2 == null || success2.length < 1) { // if employee id doesnt exists
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'employee doesnt exists'
                                })
                            } else {
                                if (success1.organization != success2.organization) {
                                    return res.status(403).json({
                                        success: 'false',
                                        message: 'unauthorized access'
                                    })
                                } else {
                                    Users.findByIdAndDelete(empId)
                                        .then(success3 => {
                                            return res.status(200).json({
                                                success: 'true',
                                                message: 'user deleted successfully'
                                            })
                                        })
                                }
                            }
                        })
                        .catch(err2 => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'some error occurred'
                            })
                        })
                }
            }
        })
        .catch(err3 => {
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })
        })
}

exports.getDetails = (req, res, next) => {
    const userId = req.decoded.userId;
    Users.findById(userId)
        .then(success => {
            console.log(success);

            if (success == null || success.length < 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
                return 1;
            } else {
                res.status(200).json({
                    success: 'true',
                    message: 'User found',
                    user: success
                })
                return 1;
            }
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}

exports.getDetailsById = (req, res, next) => {
    const userId = req.params.id;
    console.log(userId, req.decoded.organization);
    if (req.decoded.role != 'super-admin') {
        return res.status(401).json({
            success: 'false',
            message: 'unauthorized access'
        })
    } else {
        Users.find({ _id: userId, organization: req.decoded.organization })
            .then(success => {
                console.log(success);

                if (success.length < 1 || success == null) {
                    res.status(404).json({
                        success: 'false',
                        message: 'User not found..'
                    })
                    return 1;
                } else {
                    res.status(200).json({
                        success: 'true',
                        message: 'User found',
                        user: {
                            _id: success[0]._id,
                            email: success[0].email,
                            role: success[0].role,
                            organization: success[0].organization,
                            firstName: success[0].firstName,
                            lastName: success[0].lastName
                        }
                    })
                    return 1;
                }
            })
            .catch(err => {
                console.log(err);

                res.status(500).json({
                    success: 'false',
                    message: 'Some error occurred'
                })
                return 1;
            })
    }

}


exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;
    Users.findOne({ email: email })
        .then(result1 => {
            if (result1 == null || result1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'invalid user'
                })
            } else {
                var otp = new Otps({
                    _id: new mongoose.Types.ObjectId(),
                    userId: result1._id,
                    otp: shortId.generate()
                })
                otp.save()
                    .then(success1 => {
                        const msg = {
                            to: result1.email,
                            from: 'hemant@edunomics.in',
                            subject: 'Accout verification for Idea Deployer',
                            text: 'Your otp is-: ' + otp.otp,
                        };
                        sgMail
                            .send(msg)
                            .then(() => {}, error => {
                                console.error(error);

                                if (error.response) {
                                    console.error(error.response.body)
                                }
                            });

                        return res.status(200).json({
                            success: 'true',
                            message: 'An otp has been sent to email id',
                            user: {
                                email: result1.email,
                                firstName: result1.firstName,
                                lastName: result1.lastName,
                                organization: result1.organization,
                                role: result1.role,
                                _id: result1._id,
                                isVerified: result1.isVerified
                            }
                        })

                    })
            }
        })
        .catch(err3 => {
            return res.status(500).json({
                success: 'false',
                message: 'some error occurred'
            })
        })
}


exports.resetPassword = (req, res, next) => {
    const userId = req.body.userId;
    const otp = req.body.otp;
    Otps.findOne({ userId: userId })
        .then(result1 => {
            if (result1 == null || result1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'invalid user'
                })
            } else {
                if (result1.otp == otp) {
                    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        if (err) {
                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        } else {
                            result1.password = hash;
                            Users.updateOne({ _id: userId }, { password: result1.password })
                                .then(success2 => {
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'password changed successfuly',
                                        user: {
                                            _id: result1._id,
                                            email: result1.email,
                                            firstName: result1.firstName,
                                            lastName: result1.lastName,
                                            organization: result1.organization,
                                            role: result1.role,
                                            isVerified: result1.isVerified
                                        }

                                    })
                                })
                        }
                    })
                } else {

                }
            }
        })
}