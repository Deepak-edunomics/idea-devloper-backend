const WorkSpace = require('../../models/workspace');

module.exports = {
    addWorkspace: async (req, res, next) => {
        try {
            const { userId, role } = req.decoded
            if (role !== "super-admin") {
                return res.status(405).json({
                    success: false,
                    message: `${role} does not allow to create workspace`
                })
            }
            const { title, description, moderators, challengeType, ideaMembers, challengeMembers } = req.body;
            const isExist = await WorkSpace.findOne({ title })
            if (isExist) {
                return res.status(409).json({
                    success: false,
                    message: "Title already exist"
                })
            }
            const workspace = await new WorkSpace({
                title,
                description,
                moderators,
                challengeType,
                ideaMembers,
                challengeMembers,
                createdBy: userId
            })
            await workspace.save()
            return res.status(201).json({
                success: true,
                message: "New Workspace created successfully",
                result: workspace
            })
        }
        catch (err) {
            console.log("Error in adding workspace", err.message)
            return res.status(400).json({
                success: false,
                message: `Erro in adding workspace ${err.message}`
            })
        }
    },
    updateWorkspace: async (req, res, next) => {
        try {
            const { role } = req.decoded
            const {workspaceId} = req.params
            if (role !== "super-admin") {
                return res.status(405).json({
                    success: false,
                    message: `${role} does not allow to update workspace`
                })
            }
            const { title, description, moderators, challengeType, ideaMembers, challengeMembers } = req.body;
            const workspace = await WorkSpace.findById(workspaceId)
            if (!workspace) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid workspaceId"
                })
            }
            if (title) {
                workspace.title = title
            }
            if (description) {
                workspace.description = description
            }
            if (moderators) {
                workspace.moderators = moderators
            }
            if (challengeType) {
                workspace.challengeType = challengeType
            }
            if (ideaMembers) {
                workspace.challengeMembers = challengeMembers
            }
            await workspace.save()
            return res.status(200).json({
                success: true,
                message: "Workspace updated successfully",
                result: workspace
            })
        }
        catch (err) {
            console.log("Error in updating workspace", err.message)
            return res.status(400).json({
                success: false,
                message: `Erro in updating workspace ${err.message}`
            })
        }
    },
    getWorkspace: async (req, res, next) => {
        try {
            const { userId } = req.decoded
            const workspaces = await WorkSpace.find({ createdBy: userId })
            if (workspaces.length === 0) {
                return res.status(404).json({
                    success: true,
                    message: "No Workspace found",
                    result: workspaces
                })
            }
            return res.status(200).json({
                success: true,
                message: `${workspaces.length} workspace found`,
                result: workspaces
            })
        }
        catch (err) {
            console.log("Error in getting all workspace", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getting all workspace ${err.message}`
            })
        }
    },
    getWorkspaceById: async (req, res, next) => {
        try {
            const {workspaceId} = req.params
            const workspace = await WorkSpace.findById(workspaceId)
            if (!workspace) {
                return res.status(404).json({
                    success: true,
                    message: "No Workspace found",
                })
            }
            return res.status(200).json({
                success: true,
                message: `workspace found`,
                result: workspace
            })
        }
        catch (err) {
            console.log("Error in getting all workspace", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getting all workspace ${err.message}`
            })
        }
    },
    deleteWorkspace: async (req, res, next) => {
        try {
            const { workspaceId } = req.params
            const { userId } = req.decoded
            const workspace = await WorkSpace.findOne({ createdBy: userId })
            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid request"
                })
            }
            const deletedWorkspace = await WorkSpace.findByIdAndRemove(workspaceId)
            if (!deletedWorkspace) {
                return res.status(404).json({
                    success: false,
                    message: "workspace not found"
                })
            }
            await res.status(200).json({
                success: true,
                message: "Workspace deleted successfully",
                result: deletedWorkspace
            })
        }
        catch (err) {
            console.log("Error in delete workspace", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in delete workspace ${err.message}`
            })
        }
    }

}










// exports.addWorkspace = (req, res, next) => {
//     const organization = req.decoded.organization;
//     const role = req.decoded.role;
//     const id = req.decoded.userId;
//     Roles.find({ organization: organization, role: role })
//         .then(success1 => {
//             if (success1.length < 1) {
//                 return res.status(404).json({
//                     success: 'false',
//                     message: 'role permission not found'
//                 })
//             } else {
//                 if (success1[0].createWs == false) {
//                     console.log(success1[0].workspace);

//                     return res.status(401).json({
//                         success: 'false',
//                         message: 'unauthorized access'
//                     })
//                 } else {
//                     Users.findById(id)
//                         .then(success2 => {
//                             if (success2 == null || success2.length < 1) {
//                                 return res.status(404).json({
//                                     success: 'false',
//                                     message: 'user not found'
//                                 })
//                             } else {
//                                 WorkSpaces.find({ title: req.body.title })
//                                     .then(success5 => {
//                                         if (success5.length >= 1) {
//                                             return res.status(409).json({
//                                                 success: 'false',
//                                                 message: 'title already exists'
//                                             })
//                                         } else {
//                                             const workspace = new WorkSpaces({
//                                                 title: req.body.title,
//                                                 description: req.body.description,
//                                                 challengeType: req.body.challengetype,
//                                                 moderator: req.body.moderator,
//                                                 createdBy: id,
//                                                 organization: req.decoded.organization
//                                             })
//                                             workspace.save()
//                                                 .then(success3 => {
//                                                     return res.status(201).json({
//                                                         success: 'true',
//                                                         message: 'workspace created',
//                                                         workspace: success3
//                                                     })
//                                                 })
//                                                 .catch(err1 => {
//                                                     console.log("..............................................................");
//                                                     console.log(err1);
//                                                     console.log("..............................................................");
//                                                     return res.status(500).json({
//                                                         success: 'false',
//                                                         message: 'some error occurred.'
//                                                     })
//                                                 })
//                                             console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
//                                         }
//                                     })
//                                     .catch(err5 => {
//                                         console.log(err5);

//                                         return res.status(500).json({
//                                             success: 'false',
//                                             message: 'some error occurred'
//                                         })
//                                     })

//                             }
//                         })
//                         .catch(err2 => {
//                             console.log(err2);
//                             return res.status(500).json({
//                                 success: 'false',
//                                 message: 'some error occurred..'
//                             })
//                         })

//                 }
//             }
//         })
//         .catch(err4 => {
//             console.log(err4);
//             return res.status(500).json({
//                 success: 'false',
//                 message: 'some error occurred...'
//             })
//         })
// }

// exports.getWorkspace = (req, res, next) => {
//     const organization = req.decoded.organization;
//     const role = req.decoded.role;
//     const id = req.decoded.userId;
//     Roles.find({ organization: organization, role: role })
//         .then(success1 => {

//             if (success1.length < 1) {
//                 return res.status(404).json({
//                     success: 'false',
//                     message: 'role permission not found'
//                 })
//             } else {

//                 if (success1[0].viewWs == false) {
//                     console.log(success1[0].workspace);

//                     return res.status(401).json({
//                         success: 'false',
//                         message: 'unauthorized access'
//                     })
//                 } else {
//                     WorkSpaces.find({ organization: organization })
//                         .then(success2 => {
//                             if (success2.length < 1 || success2 == null) {
//                                 return res.status(404).json({
//                                     success: 'false',
//                                     message: 'workspaces not found'
//                                 })
//                             } else {
//                                 return res.status(200).json({
//                                     success: 'true',
//                                     message: 'workspaces found',
//                                     workspace: success2
//                                 })
//                             }
//                         })
//                         .catch(err1 => {
//                             return res.status(500).json({
//                                 success: 'false',
//                                 message: 'some error occurred'
//                             })
//                         })
//                 }
//             }
//         })
//         .catch(err2 => {
//             return res.status(500).json({
//                 success: 'false',
//                 message: 'some error occurred'
//             })
//         })

// }

// exports.deleteWorkspace = (req, res, next) => {
//     const organization = req.decoded.organization;
//     const role = req.decoded.role;
//     const id = req.decoded.userId;
//     const wsId = req.params.id;
//     Roles.find({ organization: organization, role: role })
//         .then(success1 => {

//             if (success1.length < 1) {
//                 return res.status(404).json({
//                     success: 'false',
//                     message: 'role permission not found'
//                 })
//             } else {

//                 if (success1[0].deleteWs == false) {
//                     console.log(success1[0].workspace);

//                     return res.status(401).json({
//                         success: 'false',
//                         message: 'unauthorized access'
//                     })
//                 } else {
//                     WorkSpaces.find({ organization: organization, _id: wsId })
//                         .then(success2 => {
//                             if (success2.length < 1 || success2 == null) {
//                                 return res.status(404).json({
//                                     success: 'false',
//                                     message: 'workspaces not found'
//                                 })
//                             } else {
//                                 WorkSpaces.findByIdAndDelete(wsId)
//                                     .then(success3 => {
//                                         return res.status(200).json({
//                                             success: 'true',
//                                             message: 'workspace successfully deleted'
//                                         })
//                                     })
//                                     .catch(err4 => {
//                                         return res.status(500).json({
//                                             success: 'false',
//                                             message: 'some error occurred'
//                                         })
//                                     })
//                             }
//                         })
//                         .catch(err1 => {
//                             return res.status(500).json({
//                                 success: 'false',
//                                 message: 'some error occurred'
//                             })
//                         })
//                 }
//             }
//         })
//         .catch(err2 => {
//             return res.status(500).json({
//                 success: 'false',
//                 message: 'some error occurred'
//             })
//         })

// }

// exports.editWorkspace = (req, res, next) => {
//     const organization = req.decoded.organization;
//     const role = req.decoded.role;
//     const id = req.decoded.userId;
//     const wsId = req.params.id;
//     Roles.find({ organization: organization, role: role })
//         .then(success1 => {

//             if (success1.length < 1) {
//                 return res.status(404).json({
//                     success: 'false',
//                     message: 'role permission not found'
//                 })
//             } else {

//                 if (success1[0].editWs == false) {
//                     console.log(success1[0].workspace);

//                     return res.status(401).json({
//                         success: 'false',
//                         message: 'unauthorized access'
//                     })
//                 } else {
//                     WorkSpaces.find({ _id: wsId })
//                         .then(success2 => {
//                             if (success2.length < 1 || success2 == null) {
//                                 return res.status(404).json({
//                                     success: 'false',
//                                     message: 'workspaces not found'
//                                 })
//                             } else {
//                                 success2[0].challengesMember = req.body.challengesMember;
//                                 success2[0].ideaMember = req.body.ideaMember;
//                                 success2[0].save()
//                                     .then(success3 => {
//                                         return res.status(200).json({
//                                             success: 'true',
//                                             message: 'workspace successfully updated',
//                                             workspace: success3
//                                         })
//                                     })
//                             }
//                         })
//                         .catch(err1 => {
//                             return res.status(500).json({
//                                 success: 'false',
//                                 message: 'some error occurred'
//                             })
//                         })
//                 }
//             }
//         })
//         .catch(err2 => {
//             return res.status(500).json({
//                 success: 'false',
//                 message: 'some error occurred'
//             })
//         })

// }