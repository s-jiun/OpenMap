//heart를 눌렀을 때 실행되는 함수
function setMyPlace(compId) {
    const inputdata = compId;
    sendMyPlaceAjax('/myplace-ajax', inputdata)
}

//send함수 '/myplace-ajax'주소에 inputdata를 전송
function sendMyPlaceAjax(url, data) {
    const section = document.querySelector(`.heart-${data}`);

    let ajaxData = {'compId' : data};;
    ajaxData = JSON.stringify(ajaxData);
    
    //data에 inputdata를 json형식으로 넣고 이를 xmlhttprequest를 통해 post방식으로 전송
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(ajaxData);
    
    //서버에서 결과가 도착하면 그것을 result div에 입력
    xhr.addEventListener('load', function () {

        if(section.innerHTML == '<i class="fa-regular fa-heart"></i>'){
            section.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }else{
            section.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    });
}