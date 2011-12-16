var JakalCards = function () {
    this.init.apply(this, arguments);
};

JakalCards.prototype = {
    config:{
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
            ice : {count : 6},
            trap : {count : 3},
            gun : {count:2}
        },
        multiTypes : {
            coins : {
                coins_1 : {count : 5},
                coins_2 : {count : 5},
                coins_3 : {count : 3},
                coins_4 : {count : 2},
                coins_5 : {count : 1}
            },
            labirints:{
                jungle:{count:4, needMove:2},
                desert:{count:4, needMove:3},
                slue:{count:2, needMove:4},
                rocks:{count:1, needMove:5}
            }
        }

    },
    init : function () {

    },
    shuffleCards : function (theArray) {
        var len = theArray.length;
        var i = len;
        while (i--) {
            var p = parseInt(Math.random() * len);
            var t = theArray[i];
            theArray[i] = theArray[p];
            theArray[p] = t;
        }
    }
};

exports.getCards = function () {
    return new JakalCards();
};