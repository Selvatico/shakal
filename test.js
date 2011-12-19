var util = require('util');


var config = {
    singleType:{
        penek:{count:40},
        hourse:{count:2},
        rum:{count:4},
        beast:{count:4},
        hungry:{count:1},
        teleport:{count:1},
        para:{count:2},
        fort:{count:2},
        healFort:{count:1},
        ice:{count:6},
        trap:{count:3},
        gun:{count:2}
    }};

console.log(util.inspect(config, true, 10, true));