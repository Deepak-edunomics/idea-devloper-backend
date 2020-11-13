const bcrypt = require('bcryptjs')


//Model
const Permission = require('../models/permission')



module.exports = {
    setPermission: async (req, res, next) => {
        try {
            let errors = {}
            const {organization} = req.user
            const { role, createWs,
                viewWs, editWs, deleteWs, createCllg, viewCllg, editCllg, deleteCllg, createPipelineCllg,
                viewPipelineCllg,
                editPipelineCllg,
                deletePipelineCllg,
                createIdea,
                viewIdea,
                editIdea,
                deleteIdea,
                createPipelineIdea,
                viewPipelineIdea,
                editPipelineIdea,
                deletePipelineIdea,
                } = req.body;
            const permission = await Permission.findOne({ role })
            if (permission && permission.organization === organization) {
                
                return res.status(403).json({
                    success: false,
                    message: "Given role is already exist",
                })
            }
            const newRole = await new Permission({
                role,
                createWs,
                viewWs,
                editWs,
                deleteWs,
                createCllg,
                viewCllg,
                editCllg,
                deleteCllg,
                createPipelineCllg,
                viewPipelineCllg,
                editPipelineCllg,
                deletePipelineCllg,
                createIdea,
                viewIdea,
                editIdea,
                deleteIdea,
                createPipelineIdea,
                viewPipelineIdea,
                editPipelineIdea,
                deletePipelineIdea,
                organization
            })
            await newRole.save()
            return res.status(200).json({
                success: true,
                message: "New role has been created",
                result: newRole
            })
        }
        catch (err) {
            console.log("Error in setPermission", err.message)
            return res.status(400).json({ message: `Error in setPermission ${err.message}` })
        }
    },
    getPermission: async (req, res, next) => {
        try {
            const { organization } = req.user
            const permissions = await Permission.find({ organization })
            if (permissions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No roles found in given organization"
                })
            }
            return res.status(200).json({
                success: true,
                result: permissions
            })
        }
        catch (err) {
            console.log("Error in getPermission", err.message)
            return res.status(400).json({ message: `Error in getPermission ${err.message}` })
        }
    }
}