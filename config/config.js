function getConfig(section) {
    var config = {
        redis : {
            redisHost : "127.0.0.1",
            redisPort : "6379",
            redisOpt  : {
            }
        },
        socketIO: {
            sockerServer : "localmeet.com",
            listenPort   : "8888"
        },
        debug : true,
        mysql   : {
            host : "localhost",
            port : "3306",
            user : "root",
            psw  : "root",
            db   : "weppo",
            lib  : "new"
        }
    };
    return (section && config.hasOwnProperty(section)) ? config[section] : config;
}

exports.getConfig = getConfig;
