const express = require('express');
const mongoose = require('mongoose');
const Users = require('../../models/user');
const Roles = require('../../models/permission');
const WorkSpaces = require('../../models/workspace');
const CPs = require('../../models/workflows/challengePipeline');

exports.addData = (req, res, next) => {
    const role = req.decoded.role;
    const userId = req.decoded.userId;
    const organization = req.decoded.organization;
    if (role != 'super-admin') {
        return res.status(401).json({
            success: 'false',
            message: 'unauthorized access'
        })
    } else {
        CPs.find({ $or: [{ title: req.body.title }, { rank: req.body.rank }] })
            .then(success4 => {
                if (success4.length >= 1) {
                    return res.status(409).json({
                        success: 'false',
                        message: 'title or same rank already exists'
                    })
                } else {
                    const cps = new CPs({
                        title: req.body.title,
                        organization: req.decoded.organization,
                        rank: req.body.rank
                    });
                    if (req.body.comment != null) {
                        cps.comment = req.body.comment;
                    }
                    if (req.body.like != null) {
                        cps.like = req.body.like;
                    }
                    if (req.body.upvote != null) {
                        cps.upvote = req.body.upvote;
                    }
                    if (req.body.downvote != null) {
                        cps.downvote = req.body.downvote;
                    }
                    if (req.body.idea != null) {
                        cps.idea = req.body.idea;
                    }
                    if (req.body.rating != null) {
                        cps.rating = req.body.rating;
                    }
                    if (req.body.impact != null) {
                        cps.impact = req.body.impact;
                    }
                    if (req.body.effort != null) {
                        cps.effort = req.body.effort;
                    }
                    cps.save()
                        .then(success1 => {
                            return res.status(201).json({
                                success: 'true',
                                message: 'challenge pipeline details added succesfully',
                                data: cps
                            })
                        })
                        .catch(err1 => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'some error occurred..'
                            })
                        })
                }
            })
            .catch(err4 => {
                console.log(err4);
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occurred.'
                })
            })
    }
}

exports.getData = (req, res, next) => {
    const role = req.decoded.role;
    const organization = req.decoded.organization;
    if (role != 'super-admin') {
        return res.status(401).json({
            success: 'false',
            message: 'unauthorized access'
        })
    } else {
        CPs.find({ organization: organization }).sort('rank')
            .then(success1 => {
                if (success1.length < 1) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'data not found'
                    })
                } else {
                    return res.status(200).json({
                        success: 'true',
                        message: 'data found',
                        data: success1
                    })
                }
            })
            .catch(err1 => {
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occurred'
                })
            })
    }
}

exports.editData = (req, res, next) => {
    const role = req.decoded.role;
    const userId = req.decoded.userId;
    const organization = req.decoded.organization;
    const id = req.params.id;
    if (role != 'super-admin') {
        return res.status(401).json({
            success: 'false',
            message: 'unauthorized access'
        })
    } else {
        CPs.findById(id)
            .then(success1 => {
                if (success1 == null) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'data not found'
                    })
                } else {
                    if (success1.organization != organization) {
                        return res.status(401).json({
                            success: 'false',
                            message: 'unauthorized access'
                        })
                    } else {
                        if (req.body.title != null) {
                            success1.title = req.body.title;
                        }
                        if (req.body.comment != null) {
                            success1.comment = req.body.comment;
                        }
                        if (req.body.like != null) {
                            success1.like = req.body.like;
                        }
                        if (req.body.upvote != null) {
                            success1.upvote = req.body.upvote;
                        }
                        if (req.body.downvote != null) {
                            success1.downvote = req.body.downvote;
                        }
                        if (req.body.idea != null) {
                            success1.idea = req.body.idea;
                        }
                        if (req.body.impact != null) {
                            success1.impact = req.body.impact;
                        }
                        if (req.body.effort != null) {
                            success1.effort = req.body.effort;
                        }
                        if (req.body.rating != null) {
                            success1.rating = req.body.rating;
                        }
                        success1.save()
                            .then(success2 => {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'data updated',
                                    data: success1
                                })
                            })
                            .catch(err1 => {
                                return res.status(500).json({
                                    success: 'false',
                                    message: 'some error occurred'
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

exports.deleteData = (req, res, next) => {
    const role = req.decoded.role;
    const organization = req.decoded.organization;
    const userId = req.decoded.userId;
    const id = req.params.id;
    if (role != 'super-admin') {
        return res.status(401).json({
            success: 'false',
            message: 'unauthorized access'
        })
    } else {
        CPs.findById(id)
            .then(success1 => {
                if (success1 == null) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'data not found'
                    })
                } else {
                    if (success1.organization != organization) {
                        return res.status(401).json({
                            success: 'false',
                            message: 'unauthorized access'
                        })
                    } else {
                        const rank = success1.rank;
                        CPs.find({ organization: organization, rank: { $gt: rank } })
                            .then(success2 => {
                                success2.forEach(ele => {
                                    ele.rank = ele.rank - 1;
                                    ele.save()
                                })

                            })
                            .then(success5 => {
                                CPs.findByIdAndDelete(id)
                                    .then(success3 => {
                                        CPs.find({ organization: organization }).sort('rank')
                                            .then(success4 => {
                                                return res.status(200).json({
                                                    success: 'true',
                                                    message: 'deleted successfully',
                                                    data: success4
                                                })
                                            })
                                            .catch(err1 => {
                                                return res.status(500).json({
                                                    success: 'false',
                                                    message: 'some error occurred'
                                                })
                                            })
                                    })
                                    .catch(err2 => {
                                        console.log((err2));
                                        return res.status(500).json({
                                            success: 'false'
                                        })
                                    })

                            })
                            .catch(err3 => {
                                return res.status(500).json({
                                    success: 'false',
                                    message: 'some error occurred'
                                })
                            })
                    }
                }
            })
            .catch(err4 => {
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occurred'
                })
            })
    }
}