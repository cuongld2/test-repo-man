const router = require('express').Router();
        const AuthController = require(APP_CONTROLLER_PATH + 'auth');
        let authController = new AuthController();

        router.post('/', authController.create);
        router.post('/verify', authController.authen);

        module.exports = router;
