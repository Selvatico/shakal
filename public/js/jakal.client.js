$(document).ready(function () {
    var html = "";
    var addHtml = "";
    var id = "";
    for (var i = 0; i < 12; i++) {
        addHtml = '<tr style="width: 50px;">';
        for (var n = 0; n < 12; n ++) {
            id = i.toString() + "_" + n.toString();
            addHtml += '<td id="field_' + id + '" style="width: 50px;height: 50px;">' + i.toString() + "-" + n.toString() + '</td>'
        }
        addHtml += "</tr>";
        html += addHtml;
    }
    html = '<table border="1" >' + html + '</table>';
    $("#deckHolder").html(html);

});


function loadGameObject()
{

}

function createGame()
{
    $.post("/main/creategame", {aa:1},
        function (data) {
            if (data.id) {
                $.post("/main/desk", { id:data.id},
                    function (data) {
                        console.log(data);
                        if (data.closedBoard) {
                            for (var p = 0; p < 12; p++) {
                                $.each(data.closedBoard[p], function (i, val) {
                                    var id = val.x.toString() + "_" + val.y.toString();
                                    $("#field_" + id).html(val.name);
                                })
                            }
                        }
                    });
            }
        });
}
