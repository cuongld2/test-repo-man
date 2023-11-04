const BaseController = require(APP_CONTROLLER_PATH + 'base');
        const AuthHandler = require(APP_HANDLER_PATH + 'auth');

        class AuthController extends BaseController {
            constructor() {
                super();
                this._authHandler = new AuthHandler();
                this._passport = require('passport');
            }

            // Request token by credentials
            create(req, res, next) {
                let responseManager = this._responseManager;
                let that = this;
                this.authenticate(req, res, next, (user) => {
                    that._authHandler.issueNewToken(req, user, responseManager.getDefaultResponseHandler(res));
                });
            }

            authenticate(req, res, next, callback) {
                let responseManager = this._responseManager;
                this._passport.authenticate('credentials-auth', function (err, user) {
                    if (err) {
                        responseManager.respondWithError(res, err.status || 401, err.message || "");
                    } else {
                        callback(user);
                    }
                })(req, res, next);
            }

            authorize(req, res, next){
                let responseManager = this._responseManager;
                let that = this;
                this._passport.authenticate('jwt-rs-auth', {
                    onVerified: function (token, user) {
                        if(user.role!=="WRITE"){
                            res.status(403).json("Does not have permission to create a new blog");
                        }else{
                            res.status(200).json("Able to create a new blog");
                        }
                    },
                    onFailure: function (error) {
                        responseManager.respondWithError(res, error.status || 401, error.message);
                    }
                })(req, res, next);
            }

            authen(req, res, next) {
                let responseManager = this._responseManager;
                this._passport.authenticate('jwt-rs-auth', {
                    onVerified: function () {
                        res.status(200).json("Token is valid")
                    },
                    onFailure: function (error) {
                        responseManager.respondWithError(res, error.status || 401, error.message);
                    }
                })(req, res, next);
            }
        }

        module.exports = AuthController;
