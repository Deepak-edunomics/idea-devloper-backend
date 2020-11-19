const WorkFlow = require('../../models/Workflow')


module.exports = {
    addWorkflow: async (req, res, next) => {
        try {
            const { workflowName, workspaceId } = req.body
            const workflow = await new WorkFlow({
                workflowName,
                workspace: workspaceId
            })
            await workflow.save()
            return res.status(201).json({
                success: true,
                message: "Successfully created new workflow",
                result: workflow
            })
        }
        catch (err) {
            console.log("Error in adding workflow", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in adding workflow ${err.message}`,
                error: error.message
            })
        }
    },
    updateWorkflow: async (req, res, next) => {
        try {
            const { workflowId } = req.params
            const {workflowName} = req.body
            const workflow = await WorkFlow.findById(workflowId)
            if (!workflow) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid workspace Id",
                })
            }
            workflow.workflowName = workflowName
            await workflow.save()
            return res.status(200).json({
                success: true,
                message: "workflow update successfully",
                result: workflow
            })
        }
        catch (err) {
            console.log("Error in updating workflow", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in updating workflow ${err.message}`,
                error: error.message
            })
            
        }
    },
    getWorkflow: async (req, res, next) => {
        try {
            const { workspaceId } = req.params
            const workflows = await WorkFlow.find({ workspace: workspaceId })
            if (workflows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Error in getting workflow",
                })
            }
            return res.status(200).json({
                success: true,
                message: `${workflows.length} workflows found`,
                result: workflows
            })
        }
        catch (err) {
            console.log("Error in get workflow", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in get workflow ${err.message}`,
                error: error.message
            })
        }
    },
    getWorkflowById: async (req, res, next) => {
        try {
            const { workflowId } = req.params;
            const workflow = await WorkFlow.findById(workflowId)
            if (!workflow) {
                return res.status(404).json({
                    success: false,
                    message: "No workflow found"
                })
            }
            return res.status(200).json({
                success: true,
                message: 'workflow found',
                result: workflow
            })
        }
        catch (err) {
            console.log("Error in get workflowById", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in get workflowById ${err.message}`,
                error: error.message
            })
        }
    },
    deleteWorkflow: async (req, res, next) => {
        try {
            const { workflowId } = req.params;
            const workflow = await WorkFlow.findByIdAndRemove(workflowId)
            if (!workflow) {
                return res.status(404).json({
                    success: false,
                    message: "Workflow not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Successfully Deleted",
                result: workflow
            })
        }
        catch (err) {
            console.log("Error in delete workflow", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in delete workflow ${err.message}`,
                error: error.message
            })
            
        }
    }
}