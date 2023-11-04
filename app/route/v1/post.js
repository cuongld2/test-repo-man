const router = require('express').Router();
        const PostController = require(APP_CONTROLLER_PATH + 'post');
        let postController = new PostController();

        router.get('/',postController.getAll);
        router.post('/', postController.create);

        module.exports = router;
