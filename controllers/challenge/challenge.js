const express = require("express");
const mongoose = require("mongoose");
const Users = require("../../models/user");
const Challenge = require("../../models/challenge");

exports.registerChallenge = (req, res, next) => {
    const email = req.decoded.email;
    const userId = req.decoded.userId;
    console.log(req.decoded.file);
    Users.findById(userId)
        .exec()
        .then((result1) => {
            if (result1 == null) {
                return res.status(404).json({
                    success: "false",
                    message: "user not found",
                });
            } else {
                const ch = new Challenge({
                    _id: new mongoose.Types.ObjectId(),
                    title: req.body.title,
                    desc: req.body.description,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    category: req.body.category,
                    hide: req.body.hidden,
                    tags: req.body.tags,
                    createdBy: userId,

                });
                if (req.decoded.file != null) {
                    ch.bgImage = req.decoded.file.path
                }
                ch.save()
                    .then((result2) => {
                        return res.status(201).json({
                            success: "true",
                            message: "challenge successfully created",
                        });
                    })
                    .catch((err1) => {
                        console.log(err1);

                        return res.status(400).json({
                            success: "false",
                            message: "All fields not set properly",
                        });
                    });
            }
        })
        .catch((err2) => {
            return res.status(500).json({
                success: "false",
                message: "Some error occurred",
            });
        });
};

exports.editChallenge = (req, res, next) => {
    const email = req.decoded.email;
    const userId = req.decoded.userId;
    const chId = req.params.chId;
    Challenge.findById(chId)
        .exec()
        .then((result) => {
            if (result == null) {
                return res.status(404).json({
                    success: "false",
                    message: "challenge not found",
                });
            } else {
                if (result.createdBy == userId) {
                    if (req.body.title != null) {
                        result.title = req.body.title;
                    }
                    if (req.body.description != null) {
                        result.desc = req.body.description;
                    }
                    if (req.body.startDate != null) {
                        result.startDate = req.body.startDate;
                    }
                    if (req.body.endDate != null) {
                        result.endDate = req.body.endDate;
                    }
                    if (req.body.tags != null) {
                        result.tags = req.body.tags;
                    }
                    if (req.body.category != null) {
                        result.category = req.body.category;
                    }
                    if (req.body.hide != null) {
                        result.hide = req.body.hide;
                    }

                    result
                        .save()
                        .then((result2) => {
                            return res.status(200).json({
                                success: "true",
                                message: "challenge successfully updated",
                            });
                        })
                        .catch((err1) => {
                            return res.status(500).json({
                                success: "false",
                                message: "Some error occurred",
                            });
                        });
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'unauthorized access'
                    })
                }
            }
        })
        .catch((err2) => {
            return res.status(500).json({
                success: "false",
                message: "Some error occurred",
            });
        });
};


exports.deleteChallenge = (req, res, next) => {
    const userId = req.decoded.userId;
    const chId = req.params.chId;
    Users.findById(userId)
        .then((success) => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: "User Not found",
                });
            } else {
                console.log(success);
                Challenge.findById(chId)
                    .then((result) => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: "false",
                                message: "Challenge not found",
                            });
                        } else {
                            console.log(".............................................................");
                            console.log(result.createdBy);
                            console.log(userId);
                            console.log(".............................................................");
                            if (result.createdBy == userId) {
                                Challenge.findByIdAndDelete(chId)
                                    .then((result1) => {
                                        return res.status(200).json({
                                            success: "true",
                                            message: "Challenge successfully deleted",
                                        });
                                    })
                                    .catch((error1) => {
                                        return res.status(500).json({
                                            success: "false",
                                            message: "Some error occurred",
                                        });
                                    });
                            } else {
                                return res.status(401).json({
                                    success: 'false',
                                    message: 'unauthorized access'
                                })
                            }

                        }
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            success: "false",
                            message: "Some error occurred",
                        });
                    });

            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: "false",
                message: "Some error has occurred",
            });
        });
};

exports.getChallenges = (req, res, next) => {
    const userId = req.decoded.userId;
    Users.findById(userId)
        .then((success) => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: "User Not found",
                });
            } else {
                Challenge.find()
                    .then(result1 => {
                        console.log('hiiii ', result1.length)
                        if (result1.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Challenge not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Challenge found',
                                challenge: result1
                            })
                        }
                    })
                    .catch(err1 => {
                        console.log(err1)
                        return res.status(500).json({
                            success: 'false',
                            message: 'Some error occurred'
                        })
                    })
            }
        })
        .catch(err2 => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}