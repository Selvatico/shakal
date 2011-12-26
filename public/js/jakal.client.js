var GameController = function () {
    this.init.apply(this, arguments);
};

GameController.prototype = {
    socket : null,
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
    _fillBoard : function (data) {
        if (data.board) {
            for (var p = 0; p < 13; p++) {
                $.each(data.board[p], function (i, val) {
                    var id = val.x.toString() + "_" + val.y.toString();
                    var imgName = val.name;
                    if (val.directions) {
                        console.log(val.directions, val.name);
                        imgName += "-" + val.directions.join("-");
                    }
                    var imgHtml = '<img src="/img/' + imgName + '.png" style="width:50px;height:50px;" alt="">';
                    $("#field_" + id).html(imgHtml);
                })
            }
        }
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
        //console.log(2222,data);
        this._fillBoard(data);
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
                } else {
                    //alert(actionName + " NOT DEFINED");
                }
            }
        }
    });


});


function createGame() {
    $.post("/main/creategame", {aa:1},
        function (data) {
            if (data.id) {
                fillDeck(data)
            }
        });
}

function fillDeck(data) {
    $.post("/main/desk", { id:data.id},
        function (data) {
            console.log(data);

        });
}
