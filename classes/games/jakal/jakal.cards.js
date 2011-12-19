var util = require('util');

var JakalCards = function () {
    this.init.apply(this, arguments);
};

//@todo add additional gun process
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
                slue:  {count:2, needMove:4},
                rocks: {count:1, needMove:5}
            },
            arrows : {
                oneArrow:{count:3, directions:["left", "right", "top", "bot"], multi:false},
                oneCross:{
                    count:3,
                    directions:["left-bot", "right-bot", "left-top", "right-top"],
                    multi:false
                },
                twoCross:{
                    count:3,
                    directions:[
                        ["left-top", "right-bot"],
                        ["right-top", "left-bot"]
                    ],
                    multi:true
                },
                twoSquare:{
                    count:3,
                    directions:[
                        ["left", "right"],
                        ["top", "bot"]
                    ],
                    multi:true
                },
                fourCross : {
                    count : 3,
                    directions : [["left-bot", "right-bot", "left-top", "right-top"]],
                    multi : true
                },
                squareCross : {
                    count : 3,
                    directions : [["left", "right", "top", "bottom"]],
                    multi : true
                },
                threeWay  : {
                    count : 3,
                    directions : [
                        ["top", "left", "right-bot"],
                        ["bot", "right", "left-top"]
                    ]
                }
            }
        }

    },
    init : function () {

    },
    shuffleCards : function (theArray, iteration) {
        var len = theArray.length;
        for (var it = 0; it < iteration; it++) {
            var i = len;
            while (i--) {
                var p = parseInt(Math.random() * len);
                var t = theArray[i];
                theArray[i] = theArray[p];
                theArray[p] = t;
            }
        }
        return theArray;
    },

    createSingleCards : function () {
        var _self = this, goNext = true, cards  = [];
        while (goNext) {
            goNext = false;
            for (var n in _self.config.singleType) {
                if (_self.config.singleType[n].count > 0) {
                    goNext = true;
                    _self.config.singleType[n].count --;
                    cards.push({name : n, type : "single", status : "closed", countPirates : 0});
                }
            }
        }
        cards = _self.shuffleCards(cards, 2);
        console.log("SINGLE",util.inspect(cards, true, 10, true));
        return cards;
    },
    createMultiCards : function () {
        var _self = this, goNext = true, cards = [];
        while (goNext) {
            goNext = false;
            for (var n in _self.config.multiTypes) {
                for (var p in _self.config.multiTypes[n]) {
                    if (_self.config.multiTypes[n][p].count > 0) {
                        var element = _self.config.multiTypes[n][p];
                        switch (n) {
                            case "labirints" :
                                cards.push(
                                    {name:n, type:"multi", status:"closed", countPirates:0,
                                        needMove:element.needMove
                                    });
                                break;
                            case "arrows" :
                                if (element.directions.length > 1) {
                                    element.directions = _self.shuffleCards(element.directions, 1);
                                }
                                cards.push(
                                    {name:n, type:"multi", status:"closed",
                                        countPirates:0, directions:element.directions[0]
                                    });
                                break;

                            default :
                                cards.push({name:n, type:"multi", status:"closed", countPirates:0});
                                break;
                        }
                        goNext = true;
                    }
                }
            }
        }
        cards = _self.shuffleCards(cards, 2);
        console.log("MULTI",util.inspect(cards, true, 10, true));
        return cards;
    },
    createPlayGround : function () {
        var _self = this;
        //load single types cards
        var singleCards = _self.createSingleCards();
        var multiCards  = _self.createMultiCards();

        var newArr = null;
        var cardMassive = [];
        for (var k = 0; k < 13; k++) {
            cardMassive = [];
            for (var r = 0; r < 13; r++) {
                if (singleCards.length > 0) {
                    //add for this points sea card
                    if (k == 0 || k == 12 || r == 0 || r == 12
                        || (k == 1 && r == 1) || (k == 1 && r == 11) || (k == 11 && r == 1) || (k == 11 && r == 11)) {
                        cardMassive.push({name:"sea", type:"simple", status:"open", countShips:0});
                    } else if (singleCards.length > 0 && r % 2 == 0) {
                        cardMassive.push(singleCards.pop());
                    } else if (multiCards.length > 0) {
                        cardMassive.push(multiCards.pop());
                    }
                }
            }
        }
        //console.log("FINAL MASSIVE",util.inspect(cardMassive, true, 10, true));

    }
};

exports.getCards = function () {
    return new JakalCards();
};