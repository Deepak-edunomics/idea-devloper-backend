const express = require('express');
const mongoose = require('mongoose');
const Users = require('../../models/user');
const Roles = require('../../models/permission');
const WorkSpaces = require('../../models/workspace');
const IPs = require('../../models/workflows/ideaPipeline');

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
        IPs.find({ $or: [{ title: req.body.title }, { rank: req.body.rank }] })
            .then(success4 => {
                if (success4.length >= 1) {
                    return res.status(409).json({
                        success: 'false',
                        message: 'title or same rank already exists'
                    })
                } else {
                    const ips = new IPs({
                        title: req.body.title,
                        organization: req.decoded.organization,
                        rank: req.body.rank
                    });
                    if (req.body.comment != null) {
                        ips.comment = req.body.comment;
                    }
                    if (req.body.like != null) {
                        ips.like = req.body.like;
                    }
                    if (req.body.upvote != null) {
                        ips.upvote = req.body.upvote;
                    }
                    if (req.body.downvote != null) {
                        ips.downvote = req.body.downvote;
                    }
                    if (req.body.rating != null) {
                        ips.rating = req.body.rating;
                    }
                    if (req.body.impact != null) {
                        ips.impact = req.body.impact;
                    }
                    if (req.body.effort != null) {
                        ips.effort = req.body.effort;
                    }
                    ips.save()
                        .then(success1 => {
                            return res.status(201).json({
                                success: 'true',
                                message: 'idea pipeline details added succesfully',
                                data: ips
                            })
                        })
                        .catch(err1 => {
                            console.log("///////////////////////////////////////////////////////////////////");
                            console.log(err1);
                            console.log("///////////////////////////////////////////////////////////////////");
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
        IPs.find({ organization: organization }).sort('rank')
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
        IPs.findById(id)
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
        IPs.findById(id)
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
                        IPs.find({ organization: organization, rank: { $gt: rank } })
                            .then(success2 => {
                                success2.forEach(ele => {
                                    ele.rank = ele.rank - 1;
                                    ele.save()
                                })

                            })
                            .then(success5 => {
                                IPs.findByIdAndDelete(id)
                                    .then(success3 => {
                                        IPs.find({ organization: organization }).sort('rank')
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