function getConfig(section) {
    var config = {
        redis : {
            redisHost : "127.0.0.1",
            redisPort : "6379",
            redisOpt  : {
            }
        },
        socketIO: {
            sockerServer : "192.168.1.17",
            listenPort   : "8889"
        },
        debug : true,
        mysql   : {
            host : "localhost",
            port : "3306",
            user : "root",
            psw  : "root",
            db   : ""
        }
    };
    return (section && config.hasOwnProperty(section)) ? config[section] : config;
}

exports.getConfig = getConfig;
