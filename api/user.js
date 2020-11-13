const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const express = require('express');

const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
router.use("/blog", require("../controllers/blog"));
router.use("/help", require("../controllers/help"));
const user = require('../controllers/user/users');
const challenge = require('../controllers/challenge/challenge');
const role = require('../controllers/workflow/rolePermission');
const cps = require('../controllers/workflow//challengePipeline');
const ips = require('../controllers/workflow/ideaPipeline');


















router.post('/register', user.register);
const userAuth = Router.use((req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).send({ msg: "Token not provided!" });
    jwt.verify(token, process.env.SALT, {
        algorithm: process.env.algorithm

    }, function(err, decoded) {
        if (err) {
            let errordata = {
                message: err.message,
                expiredAt: err.expiredAt
            };
            console.log(errordata);
            return res.status(401).json({
                message: 'Unauthorized Access'
            });
        }
        req.decoded = decoded;
        console.log(decoded);
        next();
    });
});

router.post('/otp/verify', userAuth, user.otpVerify);
router.post('/otp/regenerate', userAuth, user.regenerateOtp);
router.post('/user/login', user.login);
router.post('/user/register', userAuth, user.addUser);
router.put('/password/first', userAuth, user.passwordChangeFirstTime);
router.put('/password/change', userAuth, user.changePassword);
router.post('/password/forgot', user.forgotPassword);
router.put('/password/reset', user.resetPassword);
router.put('/user/edit/:id', userAuth, user.editUserByAdmin);
router.put('/user', userAuth, user.editDetails);
router.delete('/user/delete/:id', userAuth, user.deleteUser);
router.get('/user', userAuth, user.getDetails);
router.get('/user/all', userAuth, user.getAllUser);
router.get('/user/:id', userAuth, user.getDetailsById);

router.post('/challenge/register', userAuth, upload.single('bgImage'), challenge.registerChallenge);
router.put('/challenge/:chId', userAuth, challenge.editChallenge);
router.get('/challenge', userAuth, challenge.getChallenges);
router.delete('/challenge/:chId', userAuth, challenge.deleteChallenge);


router.post('/permission/role', userAuth, role.addPermission);
router.put('/permission/role/:id', userAuth, role.editPermission);
router.get('/permission/role', userAuth, role.getPermission);
router.delete('/permission/role/:id', userAuth, role.deletePermission);
router.get('/permission/user', userAuth, role.getMyPermission);





































// router.get('/workspace', userAuth, workspace.getWorkspace);
// router.delete('/workspace/:id', userAuth, workspace.deleteWorkspace);
// router.put('/workspace/:id', userAuth, workspace.editWorkspace);

router.post('/pipeline/challenge', userAuth, cps.addData);
router.get('/pipeline/challenge', userAuth, cps.getData);
router.put('/pipeline/challenge/:id', userAuth, cps.editData);
router.delete('/pipeline/challenge/:id', userAuth, cps.deleteData);

router.post('/pipeline/idea', userAuth, ips.addData);
router.get('/pipeline/idea', userAuth, ips.getData);
router.put('/pipeline/idea/:id', userAuth, ips.editData);
router.delete('/pipeline/idea/:id', userAuth, ips.deleteData);



module.exports = router;