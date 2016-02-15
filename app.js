var JSONUrl = 'https://jsonblob.com/api/jsonBlob/56c20effe4b01190df4f22a1';

var settings, classe;
var outpElement, classeSelector, classeSelectorList, finalValue;
var personId;
var animInterval, animDelay = 1, endAnim = false;

function init() {
    outpElement = document.getElementById('persona');
    classeSelector = document.getElementById('classSel');
    classeSelectorList = document.getElementById('classSelList');
    $.get(JSONUrl, function(data, textStatus, jqXHR){
        settings = data;
        console.log(data);
        classe = data.currentClass;
        enumClassi();
        updateTable();
        textAnim();
    });
}

function enumClassi() {
    var i;
    for (i = 0; i < settings.class.length; i++) {
        classeSelectorList.innerHTML += "<li><a href=\"#\" onclick=\"updateClass(" + i + ")\">" + settings.class[i].id + "</a></li>";
    }
    classeSelector.innerHTML = settings.class[classe].id + "<span class=\"caret\"></span>";
}

function updateClass(i) {
    classe = i;
    classeSelector.innerHTML = settings.class[classe].id + "<span class=\"caret\"></span>";
    updateTable();
    settings.currentClass = classe;
    saveJson(false);
}

function stopButton() {
    if (!endAnim) {
        personId = getPersonId();
        settings.class[classe].nums[personId]++;
        saveJson(true);
        finalValue = settings.class[classe].nomi[personId];
        slowTextAnim();
    }
    else {
        document.getElementById("stopButton").innerHTML = "STOP";
        animDelay = 1.0;
        clearTimeout(animInterval);
        endAnim = false;
        textAnim();
    }
}

function clearTable() {
    var i;
    for (i = 0; i < settings.class[classe].nomi.length; i++) {
        settings.class[classe].nums[i] = 0;
    }
    saveJson(false);
    updateTable();
}

function undo() {
    settings.class[classe].nums[personId]--;
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
    for (i = 0; i < settings.class[classe].nomi.length; i++) {
        wsum += (1.0 / Math.pow(2.0, settings.class[classe].nums[i])) * 500.0;
    }
    
    var x = 1.0 + wsum * Math.random();
    var cw = 0;
    for (i = 0; i < settings.class[classe].nomi.length; i++) {
        cw += (1.0 / Math.pow(2.0, settings.class[classe].nums[i])) * 500.0;
        if (x < cw) {
            return i;
        }
    }
    
    return 0;
}

function textAnim() {
    animInterval = setInterval(function(){ outpElement.innerHTML =
        settings.class[classe].nomi[Math.floor(settings.class[classe].nomi.length * Math.random())]}, animDelay);
}

function slowTextAnim() {
    clearInterval(animInterval);
    setTimeout(slowCycle, animDelay);
}

function slowCycle() {
    if (animDelay > 800) {
        outpElement.innerHTML = finalValue;
        clearTimeout(animInterval);
        $("#stopButton").toggleClass('btn-success btn-danger');
        document.getElementById("stopButton").innerHTML = "Ricomincia";
        updateTable();
        endAnim = true;
    }
    else {
        outpElement.innerHTML = settings.class[classe].nomi[Math.floor(settings.class[classe].nomi.length * Math.random())];
        animDelay *= 1.1;
        setTimeout(slowCycle, animDelay);
    }
}

function updateTable() {
    var table = document.getElementById('numTable');
    table.innerHTML = "<thead><tr><th>#</th><th>Nome e Cognome</th><th>N° Volte Interrogato</th></tr></thead>";
    var i;
    for (i = 0; i < settings.class[classe].nomi.length; i++) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(i + 1));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(settings.class[classe].nomi[i]));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(settings.class[classe].nums[i]));
        tr.appendChild(td);
        table.appendChild(tr);
    }
}
