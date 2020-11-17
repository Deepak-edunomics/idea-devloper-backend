const Idea = require('../../models/idea')

module.exports = {
    addIdea: async (req, res, next) => {
        try {
            let errors = {}
            const { _id, organization } = req.user
            const { title, description, challengeLinks,
                benefitSectors, attachement, hide } = req.body

            const idea = await Idea.findOne({ title })
            if (idea) {
                errors.title = "Given title already exist"
                return res.status(403).json({
                    errors
                })
            }
            const newIdea = await new Idea({
                title,
                description,
                challengeLinks,
                benefitSectors,
                attachement,
                organization,
                hide,
                createdBy: _id
            })
            await newIdea.save()
            return res.status(201).json({
                success: true,
                message: 'New idea created successfully',
                result: newIdea
            })
        }
        catch (err) {
            console.log("Error in addIdea", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in addIdea ${err.message}`
            })
        }
    },
    updateIdea: async (req, res, next) => {
        try {
            let errors = {};
            const { ideadId } = req.params;
            const { title, description, challengeLinks,
                benefitSectors, attachement, hide } = req.body
            const idea = await Idea.findById(ideadId)
            if (!idea) {
                errors.title = "No idea found with given Id"
                return res.status(404).json(errors)
            }
            if (title) {
                idea.title = title
            }
            if (description) {
                idea.description = description
            }
            if (challengeLinks) {
                idea.challengeLinks = challengeLinks
            }
            if (benefitSectors) {
                idea.benefitSectors = benefitSectors
            }
            if (attachement) {
                idea.attachement = attachement
            }
            if (hide) {
                idea.hide = hide
            }
            await idea.save()
            return res.status(200).json({
                success: true,
                message: "Idea updated successfully",
                result: idea
            })
        }
        catch (err) {
            console.log("Error in updateIdea", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in updateIdea ${err.message}`
            })

        }
    },
    deleteIdea : async (req, res, next) => {
        try {
            let errors = {}
            const { ideadId} = req.params
            const idea = await Idea.findByIdAndRemove(ideaId)
            if (!idea) {
                errors.title = "No idea found"
                return res.status(404).json(errors)
            }
            return res.status(200).json({
                success: true,
                message: "idea Deleted successfully",
                result: idea
            })
        }
        catch (err) {
            console.log("Error in deleteIdea", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in deleteIdea ${err.message}`
            })

        }
    },
    getIdeas: async (req, res, next) => {
        try {
            let errors = {};
            const { organization } = req.user
            const ideas = await Idea.find({ organization })
            if (ideas.length === 0) {
                errors.title = "No ideas found in given organization"
                return res.status(404).json(errors)
            }
            return res.status(200).json({
                success: true,
                result: ideas
            })
        }
        catch (err) {
            console.log("Error in getIdea", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getIdea ${err.message}`
            })

        }
    },
    getIdeaById: async (req, res, next) => {
        try {
            let errors = {}
            const { ideaId } = req.params
            const idea = await Idea.findById(ideaId)
            if (!idea) {
                errors.title = "No idea found with given Id"
                return res.status(404).json(errors)
            }
            return res.status(200).json({
                success: true,
                result: idea
            })
        }
        catch (err) {
            console.log("Error in getIdeaById", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getIdeaById ${err.message}`
            })


        }

    }

}