const express = require('express');
const mongoose = require('mongoose');
const Users = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const Roles = require('../../models/permission');


exports.addPermission = (req, res, next) => {
    const userRole = req.decoded.role;
    console.log(".....................................................................");
    console.log(userRole);
    console.log(".....................................................................");
    const organization = req.decoded.organization;
    const role = req.body.role;
    if (userRole == 'super-admin') {
        Roles.find({ role: role, organization: organization })
            .then(success1 => {
                if (success1.length >= 1) {
                    return res.status(401).json({
                        success: 'false',
                        message: 'permission for same role is already defined'
                    })
                } else {
                    const roles = new Roles({...req.body, organization: organization })
                    roles.save()
                        .then(success2 => {
                            return res.status(201).json({
                                success: 'true',
                                message: 'role permission added',
                                permission: roles
                            })
                        })
                        .catch(err1 => {
                            console.log(err1);
                            return res.status(500).json({
                                success: 'false',
                                message: 'some error occurred'
                            })
                        })
                }
            })
            .catch(err2 => {
                console.log(err2);
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occured'
                })
            })
    } else {
        return res.status(403).json({
            success: 'false',
            message: 'permission denied'
        })
    }

}

exports.editPermission = (req, res, next) => {
    const id = req.params.id;
    const userRole = req.decoded.role;
    const organization = req.decoded.organization;
    const role = req.body.role;
    if (userRole == 'super-admin') {
        Roles.findById(id)
            .then(success1 => {
                if (success1 == null || success1.length <= 1) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'role doesn\'t exists'
                    })
                } else {
                    if (success1.organization != organization) {
                        return res.status(401).json({
                            success: 'false',
                            message: 'unauthorized access'
                        })
                    } else {
                        if (req.body.role != null) {
                            success1.role = req.body.role
                        }
                        if (req.body.createWs != null) {
                            success1.createWs = req.body.createWs
                        }
                        if (req.body.viewWs != null) {
                            success1.viewWs = req.body.viewWs
                        }
                        if (req.body.editWs != null) {
                            success1.editWs = req.body.editWs
                        }
                        if (req.body.deleteWs != null) {
                            success1.deleteWs = req.body.deleteWs
                        }
                        if (req.body.createCllg != null) {
                            success1.createCllg = req.body.createCllg
                        }
                        if (req.body.viewCllg != null) {
                            success1.viewCllg = req.body.viewCllg
                        }
                        if (req.body.editCllg != null) {
                            success1.editCllg = req.body.editCllg
                        }
                        if (req.body.deleteCllg != null) {
                            success1.deleteCllg = req.body.deleteCllg
                        }
                        if (req.body.pipelineCllg != null) {
                            success1.pipelineCllg = req.body.pipelineCllg
                        }
                        if (req.body.createIdea != null) {
                            success1.createIdea = req.body.createIdea
                        }
                        if (req.body.viewIdea != null) {
                            success1.viewIdea = req.body.viewIdea
                        }
                        if (req.body.editIdea != null) {
                            success1.editIdea = req.body.editIdea
                        }
                        if (req.body.deleteIdea != null) {
                            success1.deleteIdea = req.body.deleteIdea
                        }
                        if (req.body.pipelineIdea != null) {
                            success1.pipelineIdea = req.body.pipelineIdea
                        }
                        success1.save()
                            .then(success2 => {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'role permission updated',
                                    permission: success1
                                })
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
            .catch(err4 => {
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occurred'
                })
            })
    } else {
        return res.status(403).json({
            success: 'false',
            message: 'permission denied'
        })
    }

}

exports.getPermission = (req, res, next) => {
    const userRole = req.decoded.role;
    const organization = req.decoded.organization;
    if (userRole == 'super-admin') {
        Roles.find({ organization: organization })
            .then(success1 => {
                if (success1.length < 1) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'no roles permission found'
                    })
                } else {
                    return res.status(200).json({
                        success: 'true',
                        message: 'role permission found',
                        permission: success1
                    })
                }
            })
            .catch(err1 => {
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occurred'
                })
            })
    } else {
        return res.status(403).json({
            success: 'false',
            message: 'permission denied'
        })
    }
}

exports.deletePermission = (req, res, next) => {
    const id = req.params.id;
    const userRole = req.decoded.role;
    const organization = req.decoded.organization;
    const role = req.body.role;
    if (userRole == 'super-admin') {
        Roles.findById(id)
            .then(success1 => {
                if (success1 == null || success1.length <= 1) {
                    return res.status(404).json({
                        success: 'false',
                        message: 'role doesn\'t exists'
                    })
                } else {
                    if (success1.organization != organization) {
                        return res.status(401).json({
                            success: 'false',
                            message: 'unauthorized access'
                        })
                    } else {
                        Roles.findByIdAndDelete(id)
                            .then(success2 => {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'role successfully deleted'
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
            .catch(err4 => {
                return res.status(500).json({
                    success: 'false',
                    message: 'some error occurred'
                })
            })
    } else {
        return res.status(403).json({
            success: 'false',
            message: 'permission denied'
        })
    }

}

exports.getMyPermission = (req, res, next) => {
    const role = req.decoded.role;
    const organization = req.decoded.organization;
    Roles.find({ role: role, organization: organization })
        .then(success1 => {
            if (success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'role permission not found'
                })
            } else {
                return res.status(200).json({
                    success: 'true',
                    message: 'permission found',
                    permission: success1[0]
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