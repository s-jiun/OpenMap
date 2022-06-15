function goNext() {
    const form = document.getElementById('compRegistForm')
    const nameForm = document.getElementById('name');
    const compNumForm = document.getElementById('compNum');
    const openDateForm = document.getElementById('openDate');
    const typeForm = document.getElementById('compType');
    const compNameForm = document.getElementById('compName');
    const addrForm = document.getElementById('addr');
    if(nameForm.disabled===false){
        alert("사업자 등록정보를 확인해주세요.");
    }
    else if(typeForm.value == ""){
        alert("업체 종류를 선택해주세요.");
    }
    else if(compNameForm.value == ""){
        alert("업체 이름을 입력해주세요.");
    }
    else if(addrForm.value == ""){
        alert("업체의 주소를 입력해주세요.");
    }
    else{
        nameForm.disabled = false;
        compNumForm.disabled = false;
        openDateForm.disabled = false;
        form.submit();
    }
}
