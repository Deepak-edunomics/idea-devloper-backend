const Challenge = require('../../models/challenge')

module.exports = {
    addChallenge: async (req, res, next) => {
        try {
            let errors = {}
            const { _id, organization } = req.user
            const { title, description, startDate, endDate,
                categories, groups, tags, image, attachement,hide } = req.body
            
            const challenge = await Challenge.findOne({ title })
            if (challenge) {
                errors.title = "Given title already exist"
                return res.status(403).json({
                    errors
                })
            }
            const newChallenge = await new Challenge({
                title,
                description,
                startDate,
                endDate,
                categories,
                groups,
                tags,
                image,
                attachement,
                organization,
                hide,
                createdBy: _id
            })
            await newChallenge.save()
            return res.status(201).json({
                success: true,
                message: 'New Challenge created successfully',
                result: newChallenge
            })
        }
        catch (err) {
            console.log("Error in addChallenge", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in addChallenge ${err.message}`
            })
        }
    },
    updateChallenge: async (req, res, next) => {
        try {
            let errors = {};
            const { challengeId } = req.params;
            const { title, description, startDate,
                endDate, categories, hide, groups, tags, image, attachement } = req.body
            const challenge = await Challenge.findById(challengeId)
            if (!challenge) {
                errors.title = "No challenge found with given Id"
                return res.status(404).json(errors)
            }
            if (title) {
                challenge.title = title
            }
            if (description) {
                challenge.description = description
            }
            if (startDate) {
                challenge.startDate = startDate
            }
            if (endDate) {
                challenge.endDate = endDate
            }
            if (categories) {
                challenge.categories = categories
            }
            if (groups) {
                challenge.groups = groups
            }
            if (tags) {
                challenge.tags = tags
            }
            if (image) {
                challenge.image = image
            }
            if (attachement) {
                challenge.attachement = attachement
            }
            if (hide) {
                challenge.hide = hide
            }
            await challenge.save()
            return res.status(200).json({
                success: true,
                message: "Challenge updated successfully",
                result: challenge
            })

        }
        catch (err) {
            console.log("Error in updateChallenge", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in updateChallenge ${err.message}`
            })
            
        }
        
    },
    deleteChallenge: async (req, res, next) => {
        try {
            let errors = {}
            const { challengeId } = req.params
            const challenge = await Challenge.findByIdAndRemove(challengeId)
            if (!challenge) {
                errors.title = "No challenge found"
                return res.status(404).json(errors)
            }
            return res.status(200).json({
                success: true,
                message: "Challenge Deleted successfully",
                result: challenge
            })
        }
        catch (err) {
            console.log("Error in deleteChallenge", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in deleteChallenge ${err.message}`
            })
            
        }
    },
    getChallenges: async (req, res, next) => {
        try {
            let errors = {};
            const { organization } = req.user
            const challenges = await Challenge.find({ organization })
            if (challenges.length === 0) {
                errors.title = "No challanges found in given organization"
                return res.status(404).json(errors)
            }
            return res.status(200).json({
                success: true,
                result: challenges
            })
        }
        catch (err) {
            console.log("Error in getChallenges", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getChallenges ${err.message}`
            })
            
        }
    },
    getChallengeById: async (req, res, next) => {
        try {
            let errors = {}
            const { challengeId } = req.params
            const challenge = await Challenge.findById(challengeId)
            if (!challenge) {
                errors.title = "No challenge found with given Id"
                return res.status(404).json(errors)
            }
            return res.status(200).json({
                success: true,
                result: challenge
            })
        }
        catch (err) {
            console.log("Error in getChallengeById", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getChallengeById ${err.message}`
            })

            
        }
        
    }

}