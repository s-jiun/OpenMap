const modal = document.querySelector('.modal');

const body = document.querySelector('body');
const menu = document.querySelector('.menu');
const content = document.querySelector('.modal_body');

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.toggle('show');

    if (!modal.classList.contains('show')) {
      body.style.overflow = 'auto';
    }
  }
});

//이벤트를 동적 바인딩합니다
$(document).on('click', '.menu', function(e) {
    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }

    const inputdata = selectedPlace.compId;
    sendMenuAjax('/menu-ajax', inputdata)
});

//send함수 '/menuajax'주소에 inputdata를 보냅니다
function sendMenuAjax(url, data) {

    let ajaxData = { 'id': data };
    ajaxData = JSON.stringify(ajaxData);
    
    //data에 inputdata를 json형식으로 넣고 이를 xmlhttprequest를 통해 post방식으로 보냅니다
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(ajaxData);
    
    //서버에서 결과가 도착하면 그것을 div에 입력합니다
    xhr.addEventListener('load', function () {
        const result =  JSON.parse(xhr.responseText);
        let menuInfo = '<h2 class="title">메뉴</h2>';
        for(let i = 0; i < result.length; i++){
            menuInfo += `<div class="content"><span>${result[i].menuName}</span> <span id="price">${result[i].price}</span></div>`
        }
        content.innerHTML = menuInfo;
        console.log(result);
    });
}