const Stage = require('../../models/stage')

module.exports = {
    addStage: async (req, res, next) => {
        try {
            
            const { stageName,ideationStage,workflowId } = req.body
            const stage = await new Stage({
                workflow: workflowId,
                stageName,
                ideationStage,
            })
            await stage.save()
            return res.status(200).json({
                success: true,
                message: "Succssfully created",
                result: stage
            })
        }
        catch (err) {
            console.log("Error in adding stage", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in adding stage ${err.message}`,
                error: error.message
            })
        }
    },
    updateStage: async (req, res, next) => {
        try {
            const {stageId} = req.params
            const { stageName, ideationStage} = req.body
            const stage = await Stage.findById(stageId)
            if (!stage) {
                return res.status(404).json({
                    message: "Stage not found",
                    success: false
                })
            }
            if (stageName) {
                stage.stageName = stageName
            }
            if (ideationStage) {
                stage.ideationStage = ideationStage
            }
            await stage.save()
            return res.status(200).json({
                success: true,
                message: "Succssfully created",
                result: stage
            })
        }
        catch (err) {
            console.log("Error in updating stage", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in updating stage ${err.message}`,
                error: error.message
            })
        }
    },
    getStage: async (req, res, next) => {
        try {
            const { workflowId } = req.params;
            const stages = await Stage.find({ workflow: workflowId})
            if (stages.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No stage found",
                })
            }
            return res.status(200).json({
                success: true,
                message: `${stages.length} stage found`,
                result: stages
            })
        }
        catch (err) {
            console.log("Error in get All stage", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in get All stage ${err.message}`,
                error: error.message
            })
        }
    },
    getStageById: async (req, res, next) => {
        try {
            const { stageId } = req.params;
            const stage = await Stage.findById(stageId)
            if (!stage) {
                return res.status(404).json({
                    success: false,
                    message: "Stage not found",
                })
            }
            return res.status(200).json({
                success: true,
                message: "Stage found",
                result: stage
            })
        }
        catch (err) {
            console.log("Error in get stage", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in get stage ${err.message}`,
                error: error.message
            })
            
        }
    },
    deleteStage: async (req, res, next) => {
        try {
            const { stageId } = req.params
            const stage = await Stage.findByIdAndRemove(stageId)
            if (!stage) {
                return res.status(404).json({
                    success: true,
                    message: "Stage Not Found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Successfully deleted",
                result: stage
            })
            
        }
        catch (err) {
            console.log("Error in deleting stage", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in deleting stage ${err.message}`,
                error: error.message
            })
        }
    }
}