var util = require('util');
var fs = require('fs')
    , express = require('./node_modules/express');

exports.boot = function (app) {
    bootApplication(app);
};

// App settings and middleware

function bootApplication(app) {
    app.use(express.logger(':method :url :status'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret:'keyboard cat' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    // Example 500 page
    app.use(function (err, req, res, next) {
        res.render('500');
    });

    // Example 404 page via simple Connect middleware
    app.use(function (req, res) {
        res.render('404');
    });

    // Setup ejs views as default, with .html as the extension
    app.set('views', __dirname + '/views');
    app.register('.html', require('ejs'));
    app.set('view engine', 'html');

    // Some dynamic view helpers
    app.dynamicHelpers({
        request:function (req) {
            return req;
        },

        hasMessages:function (req) {
            if (!req.session) return false;
            return Object.keys(req.session.flash || {}).length;
        },

        messages:function (req) {
            return function () {
                var msgs = req.flash();
                return Object.keys(msgs).reduce(function (arr, type) {
                    return arr.concat(msgs[type]);
                }, []);
            }
        }
    });

    //MAIN APPLICATION LOGIC
    var container = require("./classes/game.container").createContainer;
    container.on("loadEnd", function (game) {
        util.log("Container loaded");
        container.createGame("jakal", false, null);
    });
    container.on("gameCreated", function (game) {
        util.log("Game created");
        game.initBoard();
        //console.log("Created game", util.inspect(game, true, 10, true));
    });
    container.loadGamesClasses(app);


}

// Bootstrap controllers

function bootControllers(app) {
    fs.readdir(__dirname + '/controllers', function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            bootController(app, file);
        });
    });
}


function bootController(app, file) {
    var name = file.replace('.js', '')
        , actions = require('./controllers/' + name)
        , plural = name + 's' // realistically we would use an inflection lib
        , prefix = '/' + plural;

    // Special case for "app"
    if (name == 'app') prefix = '/';

}
