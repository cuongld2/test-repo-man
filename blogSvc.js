require('./tracing.js');
        global.APP_ROOT_PATH = __dirname + '/app/';
        // Set other app paths
        require('./config/global-paths');
        // Set config variables
        global.config = require('./config');
        const express = require('express');
        const app = express();
        // Include dependencies
        const bodyParser = require('body-parser');
        const mongoose = require('mongoose');
	mongoose.set("strictQuery", true);
        const ValidationManager = require(APP_MANAGER_PATH + 'validation');
        const authManager = require(APP_MANAGER_PATH + 'auth');
        const validationManager = new ValidationManager();
        // Connect to DB
        mongoose.Promise = global.Promise;
        mongoose.connect(config.db.MONGO_CONNECT_URL);
        // Use json formatter middleware
        app.use(bodyParser.json());
        app.use(authManager.providePassport().initialize());
        // Set Up validation middleware
        app.use(validationManager.provideDefaultValidator());
        // Setup routes

        const ROUTE_V1_PATH = APP_ROOT_PATH + 'route/' + "v1/";
        app.use('/', require(ROUTE_V1_PATH + 'post'));

        app.listen(process.env.PORT, function(){
            console.log("App is running on", process.env.PORT);
        });
