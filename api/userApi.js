const express = require('express')
const router = express.Router()
const passport = require('passport')


//USER CONTROLLER
const { userRegister, userLogin, emailVerification } = require('../controllers/user')

//EMPLOYEE CONTROLLER
const { addEmployee, updateEmployee, deleteEmployee,
    getEmployee } = require('../controllers/employee')

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

//CHALLENGE CONTROLLER 
const { addChallenge, updateChallenge, deleteChallenge, 
    getChallenges, getChallengeById } = require('../controllers/challenge/challenges')

//IDEA CONTROLLER  
const {addIdea, updateIdea, deleteIdea, getIdeas, getIdeaById } = require('../controllers/idea/idea')




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

// CHALLENGE ROUTES
router.get('/challenge/:challengeId', passport.authenticate('jwt', { session: false }), getChallengeById)
router.get('/challenge', passport.authenticate('jwt', { session: false }), getChallenges)
router.post('/challenge', passport.authenticate('jwt', { session: false }), addChallenge)
router.put('/challenge/:challengeId', passport.authenticate('jwt', { session: false }), updateChallenge)
router.delete('/challenge/:challengeId', passport.authenticate('jwt', { session: false }), deleteChallenge)


// IDEA ROUTES
router.get('/idea/:ideaId', passport.authenticate('jwt', { session: false }), getIdeaById)
router.get('/idea', passport.authenticate('jwt', { session: false }), getIdeas)
router.post('/idea', passport.authenticate('jwt', { session: false }), addIdea)
router.put('/idea/:ideaId', passport.authenticate('jwt', { session: false }), updateIdea)
router.delete('/idea/:ideaId', passport.authenticate('jwt', { session: false }), deleteIdea)



module.exports = router