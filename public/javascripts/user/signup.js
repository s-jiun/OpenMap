let isOwner = false;

function renderSignForm() {
  return `
<h3>SIGN UP</h3>
<form id="sign-form" onSubmit="onSubmit(); return false;">
  <div class="input-name">
      <p>이름</p>
      <input type="text" name="username">
  </div>
  <div class="input-id">
    <p>아이디</p>
    <div style="display: flex; flex-direction: row; align-items: center;">
      <input type="text" name="userid" id="userid">
      <div class="confirm">
        <input type="button" onclick="idCheck()" value="중복확인">
      </div>
    </div>
  </div>
  <div style="display: flex; flex-direction: row; align-item: center;">
    <div class="input-password">
        <p>비밀번호</p>
        <input type="password" name="password">
    </div>
    <div class="input-rpassword">
      <p>비밀번호 재입력</p>
      <input type="password" name="r_password">
    </div>
  </div>
  <div class="input-email">
    <p>이메일</p>
    <input type="email" name="email">
  </div>
  <div class="input-checkbox">
      <input type="checkbox" name="agree">
      <label for="agree">개인정보 수집에 동의합니다</label>
  </div>
  <div class="btn-area">
    <button type="submit">회원가입</button>
  </div>
</form>
  `
}


function onSignUpTypeClick(type) { // 화면에 업주인지 아닌지 버튼 이벤트
  const result = renderSignForm();

  document.getElementById("signup-form").innerHTML = result; // 업주인지 아닌지 클릭했을 때 
  if (type === "owner") {
    isOwner = true;
  }
}

function onSubmit() {
  const formValue = document.getElementById("sign-form").elements;

  const data = {
    userid: formValue.userid.value,
    username: formValue.username.value,
    password: formValue.password.value,
    email: formValue.email.value,
    isOwner: isOwner,
  }

  let ajaxData = data;
    ajaxData = JSON.stringify(ajaxData);
    
    //data에 inputdata를 json형식으로 넣고 이를 xmlhttprequest를 통해 post방식으로 보냅니다
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/users/sign_up');
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(ajaxData);
    
    //서버에서 결과가 도착하면 그것을 div에 입력합니다
    try {
      xhr.addEventListener('load', function () {
        const result =  JSON.parse(xhr.responseText);
        
        if (result.status === 'success') {
          if (result.data.isOwner) {
            // 업주
            document.querySelector('#popup-wrapper').style.display = 'flex';
          } else {
            // 일반 사용자
            alert("회원가입 성공");
            location.href = "/";
          }
        } else {
          alert(result.message);
        }
      });
      
    } catch (error) {
      alert(error);
    }
}

function applySupplier() {
  window.location.href='/compRegist';
}