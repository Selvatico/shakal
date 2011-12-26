var GameController = function () {
    this.init.apply(this, arguments);
};

GameController.prototype = {
    socket  : null,
    myColor : null,
    myStatus: "MOVE",
    step : 1,
    selectedTile : null,
    myShip : null,
    shipNotAllowed : [],
    init:function (data) {
        for (var i in data) {
            this[i] = data[i];
        }
    },
    _sendSocket : function(event, data) {
        //this.socket.emit(event, data);
        data.action = event;
        this.socket.send(JSON.stringify(data));
    },
    _sendSocketEvent : function (event, data) {
        this.socket.emit(event, data);
    },
    _inArray : function(search, array) {

    },
    _checkMove : function (x, y) {
        var _self = this, selected = x.toString() + "-" + y.toString();
        switch (_self.selectedTile) {
            case "ship" :
                var currentIndex = jQuery.inArray(_self.myShip.current, _self.myShip.alowed);
                var newIndex     = jQuery.inArray(selected, _self.myShip.alowed);
                console.log(currentIndex, newIndex);
                return (newIndex != -1 && (newIndex == (currentIndex-1) || newIndex == (currentIndex+1)));
                break;

            case "pirate":

                break;


        }
    },
    _moveTile  : function () {

    },
    _fillBoard : function (data) {
        if (data.board) {
            for (var p = 0; p < 13; p++) {
                $.each(data.board[p], function (i, val) {
                    var id = val.x.toString() + "_" + val.y.toString();
                    var imgName = val.name;
                    if (val.directions) {
                        imgName += "-" + val.directions.join("-");
                    }
                    var imgHtml = '<img class="tile" src="/img/' + imgName + '.png"  alt="">';
                    $("#field_" + id).html(imgHtml);
                })
            }
        }
    },
    _initShips : function (data) {
        var _self  = this;
        if (data.ships) {
            $.each(data.ships, function (i, ship) {
                //found my ship
                if (_self.myColor == ship.color) {
                    _self.myShip = ship;
                }
                var id = ship.x.toString() + "_" + ship.y.toString();
                var imgHtml = '<img class="ship" tile="ship" player="' + ship.color + '" src="/img/ship.png"  alt="">';
                $("#field_" + id).html(imgHtml);
            });
        }
    },
    _initPirates: function (data) {

    },
    _moveShip : function (newX, newY) {

    },
    join:function () {
        var _self = this;
        $.post("/main/creategame", {aa:1},
            function (data) {
                if (data.id) {
                    console.log("CREATED ID", data.id);
                    _self._sendSocket("joinGame", {gameName: "JAKAL", gameId : data.id})
                }
            });
    },
    joinedAction : function(data) {
        console.log("joined data", data);
        this.myColor = data.color;
        this._fillBoard(data);
        this._initPirates(data);
        this._initShips(data);
    }

};

var socketGame = null;
var socketUrl  = 'http://localhost:3000';
var jakalControl = new GameController({a:1});
$(document).ready(function () {
    var html = "";
    var addHtml = "";
    var id = "";
    for (var i = 0; i < 13; i++) {
        addHtml = '<tr style="width: 50px;">';
        for (var n = 0; n < 13; n ++) {
            id = i.toString() + "_" + n.toString();
            addHtml += '<td id="field_' + id + '" style="width: 50px;height: 50px;">' + i.toString() + "-" + n.toString() + '</td>'
        }
        addHtml += "</tr>";
        html += addHtml;
    }
    html = '<table border="1" >' + html + '</table>';
    $("#deckHolder").html(html);


    if (socketGame == null) {
        socketGame = io.connect(socketUrl);
    }

    socketGame.on('connect', function () {
        jakalControl.socket = socketGame;
        console.log("connected");
        jakalControl.join();
        //jakalControl.connectAction();
    });

    socketGame.on("disconnect", function () {
        //jakalControl.disconnectAction();
    });

    socketGame.on('message', function (data) {
        if (data) {
            data = JSON.parse(data);
            if (data && data.action) {
                var actionName = data.action + "Action";
                if (typeof jakalControl[actionName] == "function") {
                    jakalControl[actionName](data);
                }
            }
        }
    });

    $(".ship").live("click", function () {
        if ($(this).attr("player") == jakalControl.myColor && jakalControl.myStatus == "MOVE") {
            if ($(this).parent("td").hasClass("selectedItem")) {
                $(this).parent("td").removeClass("selectedItem");
                jakalControl.selectedTile = null;
                jakalControl.step = 1;
            } else {
                $(this).parent("td").addClass("selectedItem");
                jakalControl.selectedTile = "ship";
                jakalControl.step = 2;
            }
        }
        return false;
    });
    $(".tile").live("click", function () {
        if (jakalControl.step == 2) {
            var XY = $(this).parent("td").attr("id").replace("field_", "").split("_");
            if (jakalControl._checkMove(XY[0],XY[1])){
                alert(1);
            }

        }
    });





});

