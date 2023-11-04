const router = require('express').Router();
        const AuthController = require(APP_CONTROLLER_PATH + 'auth');
        let authController = new AuthController();

        router.post('/authorize', authController.authorize);

        module.exports = router;
