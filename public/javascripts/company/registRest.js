function get24hoursValue(event) {
    const openForm = document.getElementById('openTime');
    const closedForm = document.getElementById('closedTime');
    const tomorrowForm = document.getElementById('tomorrow');
    if (event.target.checked) {
        openForm.disabled = true;
        closedForm.disabled = true;
        tomorrowForm.disabled = true;
    } else {
        openForm.disabled = false;
        closedForm.disabled = false;
        tomorrowForm.disabled = false;
    }
}

function getNoBreakValue(event) {
    const startForm = document.getElementById('breakStart');
    const endForm = document.getElementById('breakEnd');
    if (event.target.checked) {
       startForm.disabled = true;
       endForm.disabled = true;
    } else {
        startForm.disabled = false;
        endForm.disabled = false;
    }
}

function addMenu(){
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('menuBox').innerHTML;
    document.getElementById('field').appendChild(div);
}
function removeMenu(obj){
    document.getElementById('field').removeChild(obj.parentNode);
}