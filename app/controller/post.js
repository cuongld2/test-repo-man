const axios = require("axios");
        const BaseController = require(APP_CONTROLLER_PATH + 'base');
        const PostHandler = require(APP_HANDLER_PATH + 'post');
        class PostController extends BaseController {
            constructor() {
                super();
                this._postHandler = new PostHandler();
                this._passport = require('passport');
            }

            getAll(req, res, next) {
                axios.post("http://localhost:3001/verify", {
            },
            {
                headers: {
                Authorization: req.headers.authorization
            }
                })
                .catch(function(error){
                    req.status('401').json('Token is invalid');
                })
            .then((response) => {
            console.log(response);
            this._postHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
            });
            }

            create(reqCreate, resCreate, next) {

        axios.post("http://localhost:3001/verify", {
            },
            {
                headers: {
                Authorization: reqCreate.headers.authorization
            }
                })
                .catch(function(error){
                    resCreate.status('401').json('Token is invalid');
                })
            .then((response) => {
            console.log(response);
            axios.post("http://localhost:3004/authorize", {
            },
            {
                headers: {
                Authorization: reqCreate.headers.authorization
            }
                })
                .catch(function(error){
                    resCreate.status('403').json('User does not have permission to create blog post');
                }).then((response)=>{
                    console.log(response);
                    this._postHandler.createNewPost(reqCreate, this._responseManager.getDefaultResponseHandler(resCreate));
                })
            });
            }

        }

        module.exports = PostController;
