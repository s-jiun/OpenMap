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

function addMenu(){
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('menuBox').innerHTML;
    document.getElementById('field').appendChild(div);
    console.log(menuCount.value);
}
function removeMenu(obj){
    document.getElementById('field').removeChild(obj.parentNode);
    console.log(menuCount.value);
}