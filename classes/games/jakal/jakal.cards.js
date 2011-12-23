var util = require('util');

var JakalCards = function () {
    this.config = {
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
            trap:{count:3}
        },
        multiTypes:{
            coins:{
                coins_1:{count:5},
                coins_2:{count:5},
                coins_3:{count:3},
                coins_4:{count:2},
                coins_5:{count:1}
            },
            labirints:{
                jungle:{count:4, needMove:2},
                desert:{count:4, needMove:3},
                slue:{count:2, needMove:4},
                rocks:{count:1, needMove:5}
            },
            guns : {
                gun : {count:2, directions:["left", "right", "top", "bot"], multi:false}
            },
            arrows:{
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
                fourCross:{
                    count:3,
                    directions:[
                        ["left-bot", "right-bot", "left-top", "right-top"]
                    ],
                    multi:true
                },
                squareCross:{
                    count:3,
                    directions:[
                        ["left", "right", "top", "bottom"]
                    ],
                    multi:true
                },
                threeWay:{
                    count:3,
                    directions:[
                        ["top", "left", "right-bot"],
                        ["bot", "right", "left-top"]
                    ]
                }
            }
        }

    };
    this.init.apply(this, arguments);
};

//@todo add additional gun process
JakalCards.prototype = {
    init:function () {

    },
    /**
     * Method for shuffle cards arrays
     * @param theArray
     * @param iteration
     */
    shuffleCards:function (theArray, iteration) {
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
    /**
     * Interate via all single cards add to array
     * and shuffle them with random order
     */
    createSingleCards:function () {
        var _self = this, goNext = true, cards = [];
        while (goNext) {
            goNext = false;
            for (var n in _self.config.singleType) {
                if (_self.config.singleType[n].count > 0) {
                    goNext = true;
                    _self.config.singleType[n].count--;
                    cards.push({name:n, type:"single", status:"closed", countPirates:0});
                }
            }
        }
        cards = _self.shuffleCards(cards, 2);
        //console.log("SINGLE", util.inspect(cards, true, 10, true));
        //console.log("SINGLE", cards);
        return cards;
    },
    /**
     * Interate via all multi cards add to array
     * and shuffle them with random order
     */
    createMultiCards:function () {
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
                                    {name:p, type:"multi", status:"closed", countPirates:0,
                                        needMove:element.needMove
                                    });
                                break;
                            case "arrows" :
                                if (element.directions.length > 1) {
                                    element.directions = _self.shuffleCards(element.directions, 1);
                                }
                                cards.push(
                                    {name:p, type:"multi", status:"closed",
                                        countPirates:0, directions:element.directions[0]
                                    });
                                break;

                            default :
                                cards.push({name:p, type:"multi", status:"closed", countPirates:0});
                                break;
                        }
                        goNext = true;
                        _self.config.multiTypes[n][p].count--;
                    }
                }
            }
        }
        cards = _self.shuffleCards(cards, 2);
        return cards;
    },
    /**
     * Check if given corrdinates is coordinates of the sea
     * @param k int x - axis coordinat
     * @param r int y - axis coordinat
     */
    checkSeaCard : function (k, r) {
        return ((k == 0 || k == 11
            || r == 0 || r == 11
            || (k == 1 && r == 1) || (k == 1 && r == 10)
            || (k == 10 && r == 1) || (k == 10 && r == 10)))
    },
    /**
     * Check if move allowed by card rules
     * @param needle
     * @param haystack
     */
    moveAllowed : function (needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle) return true;
        }
        return false;
    },
    /**
     * Accumulate methods for creating single and multi types cards
     * and push them in random order to gaming desk
     */
    createPlayGround:function () {
        var _self = this, singleCards = _self.createSingleCards(), multiCards = _self.createMultiCards();
        var newArr = [], cardMassive = [], popElement = null;

        for (var k = 0; k < 12; k++) {
            cardMassive = [];
            for (var r = 0; r < 12; r++) {
                if (singleCards.length > 0) {
                    if (_self.checkSeaCard(k, r)) {
                        cardMassive.push({name:"sea", type:"simple", status:"open", countShips:0, x : k, y : r});
                    } else if (singleCards.length > 0 && r % 2 == 0) {
                        popElement = singleCards.pop();
                        popElement.x = k; popElement.y = r;
                        cardMassive.push(popElement);
                    } else if (multiCards.length > 0) {
                        popElement = multiCards.pop();
                        popElement.x = k; popElement.y = r;
                        cardMassive.push(popElement);
                    }
                }
            }
            newArr.push(cardMassive);
        }
        return newArr;
    },
    /**
     * Calculate allowed moves from each card
     * @param card
     * @return obj card Card with calculated moves
     */
    caclulateMoves : function (card) {
        var _self = this;
       if (card.name) {
           var moves   = [], allowed = [], x = card.x, y = card.y;
           switch (card.name) {
               case "sea" :

                   break;
               case "penek" :
               case "rum" :
               case "teleport" :
               case "fort" :
               case "healFort" :
               case "trap" :
                   moves = [
                       [x - 1, y + 1], //left-top
                       [x, y + 1], //top
                       [x + 1, y + 1], //right-top
                       [x - 1, y],//left
                       [x - 1, y - 1],//left-bot
                       [x, y - 1],//bot
                       [x + 1, y - 1],//bot-right
                       [x + 1, y]//right
                   ];
                   break;
               case "hourse" :
                   moves = [
                          [x - 1, y + 2], //top-left
                          [x + 1, y + 2], //top-right
                          [x - 2, y + 1], //left-top
                          [x - 2, y - 1], //left-bot
                          [x - 1, y - 2], //bot-left
                          [x + 1, y - 2], //bot-right
                          [x + 2, y + 1], //right-top
                          [x + 2, y - 1] //right-bot
                      ];
                   break;
           }
       }
        if (moves.length > 0) {
            moves.forEach(function (moveArr, i) {
                if (!_self.checkSeaCard(moveArr[0], moveArr[1])) {
                    allowed.push(moveArr);
                }
            });
            card.allowedMoves = allowed;
        } else {
            card.allowedMoves = [];
        }
        return card;
    }
};

exports.getCards = function () {
    return new JakalCards();
};