var JSONUrl = 'https://api.myjson.com/bins/2gfjd';

var settings;
var outpElement, finalValue;
var personId;
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
    personId = getPersonId();
    settings.nums[personId]++;
    saveJson(true);
    finalValue = settings.classe[personId];
    slowTextAnim();
}

function clearTable() {
    var i;
    for (i = 0; i < settings.classe.length; i++) {
        settings.nums[i] = 0;
    }
    saveJson(false);
    updateTable();
}

function undo() {
    settings.nums[personId]--;
    saveJson(false);
    updateTable();
}

function saveJson(toggleBtn) {
    $.ajax({
        url: JSONUrl,
        type: "PUT",
        data: JSON.stringify(settings),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            if (toggleBtn) $("#stopButton").toggleClass('btn-success btn-danger');
            console.log(data);
            console.log(textStatus);
        }
    });
}

function getPersonId() {
    var wsum = 0.0, i;
    for (i = 0; i < settings.classe.length; i++) {
        wsum += (1.0 / Math.pow(2.0, settings.nums[i])) * 500.0;
    }
    
    var x = 1.0 + wsum * Math.random();
    var cw = 0;
    for (i = 0; i < settings.classe.length; i++) {
        cw += (1.0 / Math.pow(2.0, settings.nums[i])) * 500.0;
        if (x < cw) {
            return i;
        }
    }
    
    return 0;
}

function textAnim() {
    animInterval = setInterval(function(){ outpElement.innerHTML = settings.classe[Math.floor(settings.classe.length * Math.random())]}, animDelay);
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
        outpElement.innerHTML = settings.classe[Math.floor(settings.classe.length * Math.random())];
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
        td.appendChild(document.createTextNode(i + 1));
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
