const express = require('express');
const router = express.Router();
const validation = require('./validation');
const userController = require('../controllers/userController');

router.get('/users/sign_up', userController.signUp);
router.post('/users', userController.create);
router.get('/users/sign_in', validation.validateUsers, userController.signInForm);
router.post('/users/sign_in', userController.signIn);
router.get('/users/sign_out', userController.signOut);
router.get('/users/account', userController.show);
router.get("/users/upgrade", userController.upgradeForm);
router.get("/users/downgrade", userController.downgradeForm);
router.post('/users/:id/upgrade', userController.upgrade);
router.post('/users/:id/downgrade', userController.downgrade);

module.exports = router;