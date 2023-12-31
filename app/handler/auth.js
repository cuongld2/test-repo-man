const RevokedToken = require(APP_MODEL_PATH + 'auth/revoked-token').RevokedTokenModel;
        const NotFoundError = require(APP_ERROR_PATH + 'invalid-payload');
        const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
        let crypto = require('crypto');
        const SHA_HASH_LENGTH = 64;
        const ForbiddenError = require(APP_ERROR_PATH + 'forbidden');

        class AuthHandler extends BaseAutoBindedClass {
            constructor() {
                super();
                this._jwtTokenHandler = require('jsonwebtoken');
                this._authManager = require(APP_MANAGER_PATH + 'auth');
            }

            issueNewToken(req, user, callback) {
                let that = this;
                if (user) {
                    let userToken = that._authManager.signToken("jwt-rs-auth", that._provideTokenPayload(user), that._provideTokenOptions());
                    callback.onSuccess(userToken);
                }
                else {
                    callback.onError(new NotFoundError("User not found"));
                }
            }

            _hashToken(token) {
                return crypto.createHash('sha256').update(token).digest('hex');
            }

            checkIfHashedTokenMatches(token, hashed) {
                let hashedValid = this._hashToken(token);
                return hashedValid === hashed;
            }


            _provideTokenPayload(user) {
                return {
                    id: user.id,
                    scope: 'default',
                    role: user.role
                };
            }

            _provideTokenOptions() {
                let config = global.config;
                return {
                    expiresIn: "10 days",
                    audience: config.jwtOptions.audience,
                    issuer: config.jwtOptions.issuer,
                    algorithm: config.jwtOptions.algorithm
                };
            }


        }

        module.exports = AuthHandler;
