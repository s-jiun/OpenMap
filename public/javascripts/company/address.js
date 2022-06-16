function goPopup() {
  var pop = window.open(
    "/compRegist/registComp/popup/jusoPopup",
    "pop",
    "width=570,height=420, scrollbars=yes, resizable=yes"
  );
}
function jusoCallBack(
  roadFullAddr,
  roadAddrPart1,
  addrDetail,
  roadAddrPart2,
  engAddr,
  jibunAddr,
  zipNo,
  admCd,
  rnMgtSn,
  bdMgtSn,
  detBdNmList,
  bdNm,
  bdKdcd,
  siNm,
  sggNm,
  emdNm,
  liNm,
  rn,
  udrtYn,
  buldMnnm,
  buldSlno,
  mtYn,
  lnbrMnnm,
  lnbrSlno,
  emdNo
) {
  // 팝업페이지에서 주소입력한 정보를 받아서, 현 페이지에 정보를 등록합니다
  //document.form.roadAddrPart1.value = roadAddrPart1;
  //document.form.addrDetail.value = addrDetail;
  //document.form.zipNo.value = zipNo;
  document.getElementById("addr").value = roadAddrPart1 + ", " + addrDetail;
}
