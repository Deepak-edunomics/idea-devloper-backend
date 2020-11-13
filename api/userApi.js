const express = require('express')
const router = express.Router()
const passport = require('passport')


//USER CONTROLLER
const { userRegister, userLogin, emailVerification } = require('../controllers/user')

//EMPLOYEE CONTROLLER
const { addEmployee, updateEmployee, deleteEmployee, getEmployee } = require('../controllers/employee')

//ROLE CONTROLLER
const {setPermission, getPermission} = require('../controllers/permission')


// WORKSPACE CONTROLLER
const { addWorkspace, getWorkspace,
    updateWorkspace, deleteWorkspace,
    getWorkspaceById } = require('../controllers/workspace/workspace');


//WORKFLOW CONTROLLER
const { addWorkflow, getWorkflow, updateWorkflow,
    deleteWorkflow, getWorkflowById } = require('../controllers/workspace/workflow')


//STAGE CONTROLLER
const { addStage, getStage, deleteStage,
    getStageById } = require('../controllers/workspace/stage')

//GROUP CONTROLLER  
const { addGroup, getGroup } = require('../controllers/workflow/group'); 




//USER ROUTES 
router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/emailVerification', emailVerification)


//EMPLOYEE ROUTES 
router.get('/employee', passport.authenticate('jwt', { session: false }), getEmployee)
router.post('/employee', passport.authenticate('jwt', { session: false }), addEmployee)
router.put('/employee/:employeeId', passport.authenticate('jwt', { session: false }) ,updateEmployee)
router.delete('/employee/:employeeId', passport.authenticate('jwt', { session: false }), deleteEmployee)

// PERMISSION ROUTES
router.get('/permission', passport.authenticate('jwt', { session: false }), getPermission)
router.post('/permission', passport.authenticate('jwt', { session: false }), setPermission)


//GROUP ROUTES 
router.get('/group',  passport.authenticate('jwt', { session: false }), getGroup)
router.post('/group',  passport.authenticate('jwt', { session: false }), addGroup);


// WORKSPACE ROUTES
router.get('/workspace',  passport.authenticate('jwt', { session: false }), getWorkspace)
router.get('/workspace/:workspaceId',  passport.authenticate('jwt', { session: false }), getWorkspaceById)
router.post('/workspace',  passport.authenticate('jwt', { session: false }), addWorkspace);
router.put('/workspace/:workspaceId',  passport.authenticate('jwt', { session: false }), updateWorkspace)
router.delete('/workspace/:workspaceId',  passport.authenticate('jwt', { session: false }), deleteWorkspace)


//WORKFLOW ROUTES
router.get('/workflow',  passport.authenticate('jwt', { session: false }), getWorkflow)
router.get('/workflow/:workflowId',  passport.authenticate('jwt', { session: false }), getWorkflowById)
router.post('/workflow',  passport.authenticate('jwt', { session: false }), addWorkflow);
router.put('/workflow/:workflowId',  passport.authenticate('jwt', { session: false }), updateWorkflow)
router.delete('/workflow/:workflowId',  passport.authenticate('jwt', { session: false }), deleteWorkflow)


//STAGE ROUTES
router.get('/stage/:workflowId', passport.authenticate('jwt', { session: false }), getStage)
router.get('/stage/:stageId', passport.authenticate('jwt', { session: false }), getStageById)
router.post('/stage', passport.authenticate('jwt', { session: false }), addStage)
router.delete('/stage/stageId', passport.authenticate('jwt', { session: false }), deleteStage)




module.exports = router