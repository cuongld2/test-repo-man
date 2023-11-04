const router = require('express').Router();
        const UserController = require(APP_CONTROLLER_PATH + 'user');
        let userController = new UserController();

        router.post('/', userController.create);

        module.exports = router;
