var JSONUrl = 'https://api.myjson.com/bins/2gfjd';

var settings;
var outpElement, finalValue;
var animInterval, animDelay = 1;

function init() {
    outpElement = document.getElementById('persona');
    $.get(JSONUrl, function(data, textStatus, jqXHR){
        settings = data;
        console.log(data);
        updateTable();
        textAnim();
    });
}

function stopButton() {
    var personId = getPersonId();
    settings.nums[personId]++;
    saveJson();
    finalValue = settings.classe[personId];
    slowTextAnim();
}

function clearTable() {
    var i;
    for (i = 0; i < settings.classe.length; i++) {
        settings.nums[i] = 0;
    }
    saveJson();
    updateTable();
}

function saveJson() {
    $.ajax({
        url: JSONUrl,
        type: "PUT",
        data: JSON.stringify(settings),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $("#stopButton").toggleClass('btn-success btn-danger');
            console.log(data);
            console.log(textStatus);
        }
    });
}

function rand(max) {
    return Math.floor(max * Math.random());
}

function getPersonId() {
    var wsum = 0, i;
    for (i = 0; i < settings.classe.length; i++) {
        wsum += 1 / Math.pow(2, settings.nums[i]);
    }
    
    var x = rand(wsum);
    var cw = 0;
    for (i = 0; i < settings.classe.length; i++) {
        cw += 1 / Math.pow(2, settings.nums[i]);
        if (x < cw) {
            return i;
        }
    }
    
    return 0;
}

function textAnim() {
    animInterval = setInterval(function(){ outpElement.innerHTML = settings.classe[rand(settings.classe.length)]}, animDelay);
}

function slowTextAnim() {
    clearInterval(animInterval);
    setTimeout(slowCycle, animDelay);
}

function slowCycle() {
    if (animDelay > 1000) {
        outpElement.innerHTML = finalValue;
        clearTimeout(animInterval);
        $("#stopButton").toggleClass('btn-success btn-danger');
        updateTable();
    }
    else {
        outpElement.innerHTML = settings.classe[rand(settings.classe.length)];
        animDelay *= 1.1;
        setTimeout(slowCycle, animDelay);
    }
}

function updateTable() {
    var table = document.getElementById('numTable');
    table.innerHTML = "<thead><tr><th>#</th><th>Nome e Cognome</th><th>N° Volte Interrogato</th></tr></thead>";
    var i;
    for (i = 0; i < settings.classe.length; i++) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(i));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(settings.classe[i]));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(settings.nums[i]));
        tr.appendChild(td);
        table.appendChild(tr);
    }
}
