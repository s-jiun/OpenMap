const openForm = document.getElementsByName('openTime');
const closedForm = document.getElementsByName('closedTime');
function get24hoursValue(event) {
    if (event.target.checked) {
        for(var i=0; i<8; i++){
            openForm[i].disabled = true;
            closedForm[i].disabled = true;
        }
    } else {
        for(var i=0; i<8; i++){
            openForm[i].disabled = false;
            closedForm[i].disabled = false;
        }
    }
}

function getNoBreakValue(event) {
    if (event.target.checked) {
            openForm[8].disabled = true;
            closedForm[8].disabled = true;
    } else {
            openForm[8].disabled = false;
            closedForm[8].disabled = false;
    }
}

function addMenu(){
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('menuBox').innerHTML;
    document.getElementById('field').appendChild(div);
}

