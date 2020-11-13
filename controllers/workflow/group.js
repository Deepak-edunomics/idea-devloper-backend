const Group = require('../../models/group');


module.exports = {
    addGroup: async (req, res, next) => {
        try {
            const { groupName, users } = req.body;
            const group = await Group.findOne({ groupName })
            if (group) {
                return res.json({
                    success: false,
                    message: "Group name already exist"
                })
            }
            const newGroup = await new Group({
                groupName,
                users
            })
            await newGroup.save()
            const currGroup = await Group.findById(newGroup._id).populate('users')
            return res.status(201).json({
                success: true,
                message: "new group created successfully",
                result: currGroup
            })
        }
        catch (err) {
            console.log("Error in adding group", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in adding group ${err.message}`,
                error: error.message
            })
        }
    },
    getGroup: async (req, res, next) => {
        try {
            const group = await Group.find({}).populate('users')
            if (group.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No gorup found",
                })
            }
            return res.status(200).json({
                success: true,
                message: `${group.length} groups found`,
                result: group
            })
        }
        catch (err) {
            console.log("Error in adding group", err.message)
            return res.status(500).json({
                success: false,
                message: `Error in adding group ${err.message}`,
                error: error.message
            })
        }
    }
}






// exports.addGroup = (req, res, next) => {
//     const payLoad = req.body;

//     Group.find({ name: payLoad.name })
//         .then(success1 => {
//             if (success1.length >= 1) {
//                 return res.status(401).json({
//                     success: 'false',
//                     message: 'Group name already exists'
//                 })
//             } else {
//                 const group = new Group({ name: payLoad.name, users: payLoad.users })
//                 group.save()
//                     .then(success2 => {
//                         return res.status(201).json({
//                             success: 'true',
//                             message: 'Group added',
//                             data: group
//                         })
//                     })
//                     .catch(err1 => {
//                         console.log(err1);
//                         return res.status(500).json({
//                             success: 'false',
//                             message: 'some error occurred'
//                         })
//                     })
//             }
//         })
//         .catch(err2 => {
//             console.log(err2);
//             return res.status(500).json({
//                 success: 'false',
//                 message: 'some error occured'
//             })
//         })
// }