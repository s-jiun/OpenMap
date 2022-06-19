function idCheck(){
    var userId = document.getElementById("userid").value;

    if (!userId) {
        alert("아이디를 입력하세요");
        return;
    }

    const data = {
        userid: userId
      }
    
      let ajaxData = data;
        ajaxData = JSON.stringify(ajaxData);
        
        //data에 inputdata를 json형식으로 넣고 이를 xmlhttprequest를 통해 post방식으로 보냅니다
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/users/checkid');
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(ajaxData);
        
        xhr.addEventListener('load', function () {
            const result =  JSON.parse(xhr.responseText);
            console.log(result);
            alert(result.message);
          });
      
}