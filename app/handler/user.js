const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
        const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
        const ValidationError = require(APP_ERROR_PATH + 'validation');

        class UserHandler {
            constructor() {
                this._validator = require('validator');
            }

            static get USER_VALIDATION_SCHEME() {
                return {
                    'firstName': {
                        notEmpty: true,
                        isLength: {
                            options: [{min: 2, max: 15}],
                            errorMessage: 'First getName must be between 2 and 15 chars long'
                        },
                        errorMessage: 'Invalid First Name'
                    },
                    'lastName': {
                        notEmpty: true,
                        isLength: {
                            options: [{min: 2, max: 15}],
                            errorMessage: 'Lastname must be between 2 and 15 chars long'
                        },
                        errorMessage: 'Invalid First Name'
                    },
                    'email': {
                        isEmail: {
                            errorMessage: 'Invalid Email'
                        },
                        errorMessage: "Invalid email provided"
                    },
                    'password': {
                        notEmpty: true,
                        isLength: {
                            options: [{min: 6, max: 35}],
                            errorMessage: 'Password must be between 6 and 35 chars long'
                        },
                        errorMessage: 'Invalid Password Format'
                    }

                };
            }

            createNewUser(req, callback) {
                let data = req.body;
                let validator = this._validator;
                req.checkBody(UserHandler.USER_VALIDATION_SCHEME);
                req.getValidationResult()
                    .then(function (result) {
                        if (!result.isEmpty()) {
                            let errorMessages = result.array().map(function (elem) {
                                return elem.msg;
                            });
                            throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                        }
                        return new UserModel({
                            firstName: validator.trim(data.firstName),
                            lastName: validator.trim(data.lastName),
                            email: validator.trim(data.email),
                            password: validator.trim(data.password),
                            role:validator.trim(data.role)
                        });
                    })
                    .then((user) => {
                        return new Promise(function (resolve, reject) {
                            UserModel.find({email: user.email}, function (err, docs) {
                                if (docs.length) {
                                    reject(new AlreadyExistsError("User already exists"));
                                } else {
                                    resolve(user);
                                }
                            });
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

        }

        module.exports = UserHandler;
