const BlogPostModel = require(APP_MODEL_PATH + 'post').BlogPostModel;
        const ValidationError = require(APP_ERROR_PATH + 'validation');
        const NotFoundError = require(APP_ERROR_PATH + 'not-found');
        const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');

        class BlogPostHandler extends BaseAutoBindedClass {
            constructor() {
                super();
                this._validator = require('validator');
            }

            static get BLOG_POST_VALIDATION_SCHEME() {
                return {
                    'title': {
                        notEmpty: true,
                        isLength: {
                            options: [{min: 10, max: 150}],
                            errorMessage: 'Post title must be between 2 and 150 chars long'
                        },
                        errorMessage: 'Invalid post title'
                    },
                    'content': {
                        notEmpty: true,
                        isLength: {
                            options: [{min: 50, max: 3000}],
                            errorMessage: 'Post content must be between 150 and 3000 chars long'
                        },
                        errorMessage: 'Invalid post content'
                    },
                    'authorId': {
                        isMongoId: {
                            errorMessage: 'Invalid Author Id'
                        },
                        errorMessage: "Invalid email provided"
                    }
                };
            }

            createNewPost(req, callback) {
                let data = req.body;
                let validator = this._validator;
                req.checkBody(BlogPostHandler.BLOG_POST_VALIDATION_SCHEME);
                req.getValidationResult()
                    .then(function (result) {
                        if (!result.isEmpty()) {
                            let errorMessages = result.array().map(function (elem) {
                                return elem.msg;
                            });
                            throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                        }
                        return new BlogPostModel({
                            title: validator.trim(data.title),
                            content: validator.trim(data.content),
                            authorId: data.authorId,
                        });
                    })
                    .then((user) => {
                        user.save();
                        return user;
                    })
                    .then((saved) => {
                        callback.onSuccess(saved);
                    })
                    .catch((error) => {
                        callback.onError(error);
                    });
            }

            getAllPosts(req, callback) {
                let data = req.body;
                new Promise(function (resolve, reject) {
                    BlogPostModel.find({}, function (err, posts) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            resolve(posts);
                        }
                    });
                })
                    .then((posts) => {
                        callback.onSuccess(posts);
                    })
                    .catch((error) => {
                        callback.onError(error);
                    });
            }
        }

        module.exports = BlogPostHandler;
