
const infowindow = new kakao.maps.InfoWindow({zIndex:1});
let init = 0;
const closedMarkerImageSrc = "/images/closed.png";  // 마커이미지의 주소. 스프라이트 이미지
const holidayMarkerImageSrc = "/images/holiday.png";
const opendMarkerImageSrc = "/images/open.png";
const listEl = document.getElementById('placesList');
const menuEl = document.getElementById('slideNav');
let selectedPlace;
let companyTotal;
let currentBounds;
let swLat;
let swLng;
let neLat;
let neLng;

let closedRestaurantMarkers = [];  // 오늘 마감 식당 마커를 가지고 있을 배열
let closedCafeMarkers = [];  // 오늘 마감 휴게음식점 마커를 가지고 있을 배열
let closedHospitalMarkers = [];  // 오늘 마감 병원 마커를 가지고 있을 배열
let todayClosedRestaurantMarkers = [];  // 오늘 휴무 식당 마커를 가지고 있을 배열
let todayClosedCafeMarkers = [];  // 오늘 휴무 휴게음식점 마커를 가지고 있을 배열
let todayClosedHospitalMarkers = [];   // 오늘 휴무 병원 마커를 가지고 있을 배열
let openedRestaurantMarkers = [];  // 영업중인 식당 마커를 가지고 있을 배열
let openedCafeMarkers = [];  // 영업중인 휴게음식점 마커를 가지고 있을 배열
let openedHospitalMarkers = [];  // 영업중인 병원 마커를 가지고 있을 배열

let closedRestaurant = []; // 오늘 마감 식당 객체를 가지고 있을 배열
let closedCafe = []; // 오늘 마감 휴게음식점 객체를 가지고 있을 배열
let closedHospital = []; // 오늘 마감 병원 객체를 가지고 있을 배열
let todayClosedRestaurant = []; // 오늘 휴무 식당 객체를 가지고 있을 배열
let todayClosedCafe = []; // 오늘 휴무 휴게음식점 객체를 가지고 있을 배열
let todayClosedHospital = []; // 오늘 휴무 병원 객체를 가지고 있을 배열
let openedRestaurant = []; // 영업중인 식당 객체를 가지고 있을 배열
let openedCafe = []; // 영업중인 휴게음식점 객체를 가지고 있을 배열
let openedHospital = []; // 영업중인 병원 객체를 가지고 있을 배열


function setCenter() {            
    // 이동할 위도 경도 위치를 생성합니다 
    navigator.geolocation.getCurrentPosition((position) => {
        const moveLatLon = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(moveLatLon);
      });
}


const mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    }; 

// 지도를 생성합니다   
const map = new kakao.maps.Map(mapContainer, mapOption); 
if(init === 0){
    setCenter();
    init++;
}


// 지도가 이동으로 인해 지도영역이 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록
kakao.maps.event.addListener(map, 'dragend', function() {             
    
    // 지도 영역정보
    currentBounds = map.getBounds();
    
    // 영역정보의 남서쪽 정보
    swLat = currentBounds.getSouthWest().getLat();
    swLng = currentBounds.getSouthWest().getLng();
    
    // 영역정보의 북동쪽 정보
    neLat = currentBounds.getNorthEast().getLat();
    neLng = currentBounds.getNorthEast().getLng();

    const inputdata = {'swLat' : swLat, 'swLng' : swLng, 'neLat' : neLat, 'neLng' : neLng};
    sendBoundAjax('/setbound-ajax', inputdata)
});

// 지도가 확대, 축소로 인해 지도영역이 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록
kakao.maps.event.addListener(map, 'zoom_changed', function() {             
    
    // 지도 영역정보
    currentBounds = map.getBounds();
    
    // 영역정보의 남서쪽 정보
    swLat = currentBounds.getSouthWest().getLat();
    swLng = currentBounds.getSouthWest().getLng();
    
    // 영역정보의 북동쪽 정보
    neLat = currentBounds.getNorthEast().getLat();
    neLng = currentBounds.getNorthEast().getLng();

    const inputdata = {'swLat' : swLat, 'swLng' : swLng, 'neLat' : neLat, 'neLng' : neLng};
    sendBoundAjax('/setbound-ajax', inputdata)
});

//send함수 '/setbound-ajax'주소에 inputdata 전송
function sendBoundAjax(url, data) {

    let ajaxData = data;
    ajaxData = JSON.stringify(ajaxData);
    
    //data에 inputdata를 json형식으로 넣고 이를 xmlhttprequest를 통해 post방식으로 전송
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(ajaxData);
    
    xhr.addEventListener('load', function () {
        const result =  JSON.parse(xhr.responseText);
        closedRestaurant = result.closedRestaurantTotal;
        for(let i = 0; i < closedRestaurant.length; i++){
            if(MyPlaces.includes(`${closedRestaurant[i].compId}`)){
                closedRestaurant[i].isMyPlace = true;
            }
        }
        closedCafe = result.closedCafeTotal;
        for(let i = 0; i < closedCafe.length; i++){
            if(MyPlaces.includes(`${closedCafe[i].compId}`)){
                closedCafe[i].isMyPlace = true;
            }
        }
        closedHospital = result.closedHospitalTotal;
        for(let i = 0; i < closedHospital.length; i++){
            if(MyPlaces.includes(`${closedHospital[i].compId}`)){
                closedHospital[i].isMyPlace = true;
            }
        }
        todayClosedRestaurant = result.todayClosedRestaurant;
        for(let i = 0; i < todayClosedRestaurant.length; i++){
            if(MyPlaces.includes(`${todayClosedRestaurant[i].compId}`)){
                todayClosedRestaurant[i].isMyPlace = true;
            }
        }
        todayClosedCafe = result.todayClosedCafe;
        for(let i = 0; i < todayClosedCafe.length; i++){
            if(MyPlaces.includes(`${todayClosedCafe[i].compId}`)){
                todayClosedCafe[i].isMyPlace = true;
            }
        }
        todayClosedHospital = result.todayClosedHospital;
        for(let i = 0; i < todayClosedHospital.length; i++){
            if(MyPlaces.includes(`${todayClosedHospital[i].compId}`)){
                todayClosedHospital[i].isMyPlace = true;
            }
        }
        openedRestaurant = result.openedRestaurant;
        for(let i = 0; i < openedRestaurant.length; i++){
            if(MyPlaces.includes(`${openedRestaurant[i].compId}`)){
                openedRestaurant[i].isMyPlace = true;
            }
        }
        openedCafe = result.openedCafe;
        for(let i = 0; i < openedCafe.length; i++){
            if(MyPlaces.includes(`${openedCafe[i].compId}`)){
                openedCafe[i].isMyPlace = true;
            }
        }
        openedHospital = result.openedHospital;
        for(let i = 0; i < openedHospital.length; i++){
            if(MyPlaces.includes(`${openedHospital[i].compId}`)){
                openedHospital[i].isMyPlace = true;
            }
        }
        companyTotal = closedCafe.concat(openedCafe, todayClosedCafe, closedRestaurant, openedRestaurant, todayClosedRestaurant, closedHospital, openedHospital, todayClosedHospital);
        
        removeAllChildNods(listEl);
        removeMarker();
        createClosedRestaurantMarkers(); 
        setClosedRestaurantMarkers(map);
        createClosedCafeMarkers();
        setClosedCafeMarkers(map);
        createClosedHospitalMarkers();
        setClosedHospitalMarkers(map);
        createTodayClosedRestaurantMarkers();
        setTodayClosedRestaurantMarkers(map);
        createTodayClosedCafeMarkers();
        setTodayClosedCafeMarkers(map);
        createTodayClosedHospitalMarkers();
        setTodayClosedHospitalMarkers(map);
        createOpenedRestaurantMarkers();
        setOpenedRestaurantMarkers(map);
        createOpenedCafeMarkers();
        setOpenedCafeMarkers(map);
        createOpenedHospitalMarkers();
        setOpenedHospitalMarkers(map);
    });
}


function createMarkerImage(src, size, options) {
    var markerImage = new kakao.maps.MarkerImage(src, size, options);
    return markerImage;            
}

// 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수
function createMarker(position, image) {
    var marker = new kakao.maps.Marker({
        position: position,
        image: image
    });
    
    return marker;  
}   

function createInfowindowEvent(itemEl, marker, place) {
    kakao.maps.event.addListener(marker, 'click', function() {
        if(selectedPlace){
            closeOverlay()
        }
        overlay = setOverlay(place, marker);
        selectedPlace = place;
        overlay.setMap(map);
    });

    itemEl.onclick =  function () {
        if(selectedPlace){
            closeOverlay()
        }
        overlay = setOverlay(place, marker);
        selectedPlace = place;
        overlay.setMap(map);
    };
}

function closeOverlay() {
    overlay.setMap(null);     
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeMarker() {
    for ( var i = 0; i < closedRestaurantMarkers.length; i++ ) {
        closedRestaurantMarkers[i].setMap(null);
    }   
    for ( var i = 0; i < closedCafeMarkers.length; i++ ) {
        closedCafeMarkers[i].setMap(null);
    } 
    for ( var i = 0; i < closedHospitalMarkers.length; i++ ) {
        closedHospitalMarkers[i].setMap(null);
    } 
    for ( var i = 0; i < todayClosedRestaurantMarkers.length; i++ ) {
        todayClosedRestaurantMarkers[i].setMap(null);
    }
    for ( var i = 0; i < todayClosedCafeMarkers.length; i++ ) {
        todayClosedCafeMarkers[i].setMap(null);
    }
    for ( var i = 0; i < todayClosedHospitalMarkers.length; i++ ) {
        todayClosedHospitalMarkers[i].setMap(null);
    }
    for ( var i = 0; i < openedRestaurantMarkers.length; i++ ) {
        openedRestaurantMarkers[i].setMap(null);
    }
    for ( var i = 0; i < openedCafeMarkers.length; i++ ) {
        openedCafeMarkers[i].setMap(null);
    }
    for ( var i = 0; i < openedHospitalMarkers.length; i++ ) {
        openedHospitalMarkers[i].setMap(null);
    }
    closedRestaurantMarkers = [];
    closedCafeMarkers = [];
    closedHospitalMarkers = [];
    todayClosedRestaurantMarkers = [];
    todayClosedCafeMarkers = [];
    todayClosedHospitalMarkers = [];
    openedRestaurantMarkers = [];
    openedCafeMarkers = [];
    openedHospitalMarkers = [];
}

// 오늘 마감 식당 마커를 생성하고 오늘 마감 식당 마커 배열에 추가하는 함수
function createClosedRestaurantMarkers() {
    const fragment = document.createDocumentFragment();
    
    for (var i = 0; i < closedRestaurant.length; i++) {  
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {  
                spriteOrigin: new kakao.maps.Point(0, 45),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };     

        let itemEl_CR = getClosedRestarantItem(closedRestaurant[i]);
        
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(closedMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(closedRestaurant[i].latitude), parseFloat(closedRestaurant[i].longitude)), markerImage);  
        
        // 생성된 마커를 마커 배열에 추가
        closedRestaurantMarkers.push(marker);

        createInfowindowEvent(itemEl_CR, marker, closedRestaurant[i]);

        fragment.appendChild(itemEl_CR);
    }     
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
}

// 오늘 마감 휴게음식점 마커를 생성하고 오늘 마감 휴게음식점 마커 배열에 추가하는 함수
function createClosedCafeMarkers() {
    const fragment = document.createDocumentFragment();
    for (var i = 0; i < closedCafe.length; i++) {
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(0, 2),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };  
            
        let itemEl_CC = getClosedCafeItem(closedCafe[i]);
     
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(closedMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(closedCafe[i].latitude), parseFloat(closedCafe[i].longitude)), markerImage);  

        // 생성된 마커를 마커 배열에 추가
        closedCafeMarkers.push(marker);    

        createInfowindowEvent(itemEl_CC, marker, closedCafe[i]);

        fragment.appendChild(itemEl_CC);
    }    
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;    
}

// 오늘 마감 병원 마커를 생성하고 오늘 마감 병원 마커 배열에 추가하는 함수
function createClosedHospitalMarkers() {
    const fragment = document.createDocumentFragment();
    for (var i = 0; i < closedHospital.length; i++) {
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(0, 87),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };    
            
        let itemEl_CH = getClosedHospitalItem(closedHospital[i]);
     
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(closedMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(closedHospital[i].latitude), parseFloat(closedHospital[i].longitude)), markerImage);  

        // 생성된 마커를 마커 배열에 추가
        closedHospitalMarkers.push(marker);  
        
        createInfowindowEvent(itemEl_CH, marker, closedHospital[i]);

        fragment.appendChild(itemEl_CH);
    }   
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;             
}

// 오늘 휴무 식당 마커를 생성하고 오늘 휴무 식당 마커 배열에 추가하는 함수
function createTodayClosedRestaurantMarkers() {
    const fragment = document.createDocumentFragment();
    
    for (var i = 0; i < todayClosedRestaurant.length; i++) {  
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {  
                spriteOrigin: new kakao.maps.Point(0, 45),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };   
            
        let itemEl_TCR = getTodayClosedRestarantItem(todayClosedRestaurant[i]);
        
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(holidayMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(todayClosedRestaurant[i].latitude), parseFloat(todayClosedRestaurant[i].longitude)), markerImage);  
        
        // 생성된 마커를 마커 배열에 추가
        todayClosedRestaurantMarkers.push(marker);

        createInfowindowEvent(itemEl_TCR, marker, todayClosedRestaurant[i]);

        fragment.appendChild(itemEl_TCR);
    }  
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;   
}

// 오늘 휴무 휴게음식점 마커를 생성하고 오늘 휴무 휴게음식점 마커 배열에 추가하는 함수
function createTodayClosedCafeMarkers() {
    const fragment = document.createDocumentFragment();

    for (var i = 0; i < todayClosedCafe.length; i++) {
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(0, 2),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };       

        let itemEl_TCC = getTodayClosedCafeItem(todayClosedCafe[i]);
     
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(holidayMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(todayClosedCafe[i].latitude), parseFloat(todayClosedCafe[i].longitude)), markerImage);  

        // 생성된 마커를 마커 배열에 추가
        todayClosedCafeMarkers.push(marker);  
        
        createInfowindowEvent(itemEl_TCC, marker, todayClosedCafe[i]);

        fragment.appendChild(itemEl_TCC);
    }  
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;      
}

// 오늘 휴무 병원 마커를 생성하고 오늘 휴무 병원 마커 배열에 추가하는 함수
function createTodayClosedHospitalMarkers() {
    const fragment = document.createDocumentFragment();

    for (var i = 0; i < todayClosedHospital.length; i++) {
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(0, 87),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };      
            
        let itemEl_TCH = getTodayClosedHospitalItem(todayClosedHospital[i]);
     
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(holidayMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(todayClosedHospital[i].latitude), parseFloat(todayClosedHospital[i].longitude)), markerImage);  

        // 생성된 마커를 마커 배열에 추가
        todayClosedHospitalMarkers.push(marker);  
        
        createInfowindowEvent(itemEl_TCH, marker, todayClosedHospital[i]);

        fragment.appendChild(itemEl_TCH);
    }     
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;           
}

// 영업중 식당 마커를 생성하고 영업중 식당 마커 배열에 추가하는 함수
function createOpenedRestaurantMarkers() {
    const fragment = document.createDocumentFragment();
    
    for (var i = 0; i < openedRestaurant.length; i++) {  
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {  
                spriteOrigin: new kakao.maps.Point(0, 45),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };     
        
        const itemEl_OR = getOpenedRestarantItem(openedRestaurant[i]);
        
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(opendMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(openedRestaurant[i].latitude), parseFloat(openedRestaurant[i].longitude)), markerImage);  
        
        // 생성된 마커를 마커 배열에 추가
        openedRestaurantMarkers.push(marker);

        createInfowindowEvent(itemEl_OR, marker, openedRestaurant[i]);

        fragment.appendChild(itemEl_OR);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
}     

// 영업중 휴게음식점 마커를 생성하고 영업중 휴게음식점 마커 배열에 추가하는 함수
function createOpenedCafeMarkers() {
    const fragment = document.createDocumentFragment();

    for (var i = 0; i < openedCafe.length; i++) {
        
        
        var imageSize = new kakao.maps.Size(35, 44),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(0, 2),    
                spriteSize: new kakao.maps.Size(36, 133)  
            };       

        let itemEl_OC = getOpenedCafeItem(openedCafe[i]);
        
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(opendMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(openedCafe[i].latitude), parseFloat(openedCafe[i].longitude)), markerImage);  

        // 생성된 마커를 마커 배열에 추가
        openedCafeMarkers.push(marker);    

        createInfowindowEvent(itemEl_OC, marker, openedCafe[i]);

        fragment.appendChild(itemEl_OC);
    }     
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
}

// 영업중 병원 마커를 생성하고 영업중 병원 마커 배열에 추가하는 함수
function createOpenedHospitalMarkers() {
    const fragment = document.createDocumentFragment();

    for (var i = 0; i < openedHospital.length; i++) {
        
        var imageSize = new kakao.maps.Size(35, 80),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(0, 87),    
                spriteSize: new kakao.maps.Size(36, 133)
            };     
            
        let itemEl_OH = getOpenedHospitalItem(openedHospital[i]);
     
        // 마커이미지와 마커를 생성
        var markerImage = createMarkerImage(opendMarkerImageSrc, imageSize, imageOptions),    
            marker = createMarker(new kakao.maps.LatLng(parseFloat(openedHospital[i].latitude), parseFloat(openedHospital[i].longitude)), markerImage);  

        // 생성된 마커를 마커 배열에 추가
        openedHospitalMarkers.push(marker);    
        
        createInfowindowEvent(itemEl_OH, marker, openedHospital[i]);

        fragment.appendChild(itemEl_OH);
    }         
    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;       
}

// 오늘 마감 식당 마커들의 지도 표시 여부를 설정하는 함수
function setClosedRestaurantMarkers(map) {        
    for (var i = 0; i < closedRestaurantMarkers.length; i++) {  
        closedRestaurantMarkers[i].setMap(map);
    }        
}

// 오늘 마감 휴게음식점 마커들의 지도 표시 여부를 설정하는 함수
function setClosedCafeMarkers(map) {        
    for (var i = 0; i < closedCafeMarkers.length; i++) {  
        closedCafeMarkers[i].setMap(map);
    }        
}

// 오늘 마감 병원 마커들의 지도 표시 여부를 설정하는 함수
function setClosedHospitalMarkers(map) {        
    for (var i = 0; i < closedHospitalMarkers.length; i++) {  
        closedHospitalMarkers[i].setMap(map);
    }        
}

// 오늘 휴무 식당 마커들의 지도 표시 여부를 설정하는 함수
function setTodayClosedRestaurantMarkers(map) {        
    for (var i = 0; i < todayClosedRestaurantMarkers.length; i++) {  
        todayClosedRestaurantMarkers[i].setMap(map);
    }        
}

// 오늘 휴무 휴게음식점 마커들의 지도 표시 여부를 설정하는 함수
function setTodayClosedCafeMarkers(map) {        
    for (var i = 0; i < todayClosedCafeMarkers.length; i++) {  
        todayClosedCafeMarkers[i].setMap(map);
    }        
}

// 오늘 휴무 병원 마커들의 지도 표시 여부를 설정하는 함수
function setTodayClosedHospitalMarkers(map) {        
    for (var i = 0; i < todayClosedHospitalMarkers.length; i++) {  
        todayClosedHospitalMarkers[i].setMap(map);
    }        
}

// 영업중 식당 마커들의 지도 표시 여부를 설정하는 함수
function setOpenedRestaurantMarkers(map) {        
    for (var i = 0; i < openedRestaurantMarkers.length; i++) {  
        openedRestaurantMarkers[i].setMap(map);
    }        
}

// 영업중 휴게음식점 마커들의 지도 표시 여부를 설정하는 함수
function setOpenedCafeMarkers(map) {        
    for (var i = 0; i < openedCafeMarkers.length; i++) {  
        openedCafeMarkers[i].setMap(map);
    }        
}

// 영업중 병원 마커들의 지도 표시 여부를 설정하는 함수
function setOpenedHospitalMarkers(map) {        
    for (var i = 0; i < openedHospitalMarkers.length; i++) {  
        openedHospitalMarkers[i].setMap(map);
    }        
}

function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

// 오늘 마감 식당 결과 리스트 객체
function getClosedRestarantItem(place) {

    let closeTime = Math.floor((place.restClosed)/100);
    if(closeTime >= 24){
        closeTime -= 24;
        closeTime = '익일 ' + closeTime;
    }

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';

    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '   <div class="openInfo"><div><span id="time">' +  Math.floor((place.restOpen)/100) + ':'+ ((place.restOpen)%100 == 0 ? '00' : (place.restOpen)%100)   + '</span>'+
        '   <span id="time"> ~ ' +  closeTime  + ':'+ ((place.restClosed)%100 == 0 ? '00' : (place.restClosed)%100) + '</span></div> '; 

    itemStr += '  <div class="type"><p id="marker-img-cr"></p>마감 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}


// 오늘 마감 휴게음식점 결과 리스트 객체
function getClosedCafeItem(place) {

    let closeTime = Math.floor((place.cafeClosed)/100);
    if(closeTime > 24){
        closeTime -= 24;
        closeTime = '익일 ' + closeTime;
    }

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';
    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '    <div class="openInfo"><div><span id="time">' +  Math.floor((place.cafeOpen)/100) + ':'+ ((place.cafeOpen)%100 == 0 ? '00' : (place.cafeOpen)%100)  + '</span>'+
        '   <span id="time"> ~ ' +  closeTime + ':'+ ((place.cafeClosed)%100 == 0 ? '00' : (place.cafeClosed)%100)  + '</span></div> '; 

    itemStr += '  <div class="type"><p id="marker-img-cc"></p> 마감 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 오늘 마감 병원 결과 리스트 객체
function getClosedHospitalItem(place) {

    let closeTime = Math.floor((place.hospitalClosed)/100);
    if(closeTime > 24){
        closeTime -= 24;
        closeTime = '익일 ' + closeTime;
    }

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';
    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '    <div class="openInfo"><div><span id="time">' +  Math.floor((place.hospitalOpen)/100) + ':'+ ((place.hospitalOpen)%100 == 0 ? '00' : (place.hospitalOpen)%100)  + '</span>'+
        '   <span id="time"> ~ ' +  closeTime + ':'+ ((place.hospitalClosed)%100 == 0 ? '00' : (place.hospitalClosed)%100)  + '</span></div>'; 

    itemStr += '  <div class="type"><p id="marker-img-ch"></p> 마감 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 오늘 휴무 식당 결과 리스트 객체
function getTodayClosedRestarantItem(place) {

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';

    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '    <div class="openInfo"> <span id="time"> 휴무 </span>'

    itemStr += '  <div class="type"><p id="marker-img-tcr"></p> 오늘 휴무 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 오늘 휴무 휴게음식점 결과 리스트 객체
function getTodayClosedCafeItem(place) {

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';
    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '    <div class="openInfo"> <span id="time"> 휴무 </span>'

    itemStr += '  <div class="type"><p id="marker-img-tcc"></p> 오늘 휴무 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}


// 오늘 휴무 병원 결과 리스트 객체
function getTodayClosedHospitalItem(place) {

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';
    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '    <div class="openInfo"> <span id="time"> 휴무 </span>'

    itemStr += '  <div class="type"><p id="marker-img-tch"></p> 오늘 휴무 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}


// 영업중 식당 결과 리스트 객체
function getOpenedRestarantItem(place) {

    let closeTime = Math.floor((place.restClosed)/100);
    if(closeTime > 24){
        closeTime -= 24;
        closeTime = '익일 ' + closeTime;
    }

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let openInfo;
    if(place.restClosed == 4000){
        openInfo = '<span>24시간 영업</span>';
    }else{
        openInfo = '    <span>' +  Math.floor((place.restOpen)/100) + ':'+ ((place.restOpen)%100 == 0 ? '00' : (place.restOpen)%100)   + '</span>'+
        '   <span> ~ ' +  closeTime  + ':'+ ((place.restClosed)%100 == 0 ? '00' : (place.restClosed)%100) + '</span>'; 
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';

    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '<div class="openInfo"><div id="time">' + openInfo +'</div>';

    itemStr += '  <div class="type"><p id="marker-img-or"></p> 영업중 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 영업중 휴게음식점 결과 리스트 객체
function getOpenedCafeItem(place) {

    let closeTime = Math.floor((place.cafeClosed)/100);
    if(closeTime > 24){
        closeTime -= 24;
        closeTime = '익일 ' + closeTime;
    }

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let openInfo;
    if(place.cafeClosed == 4000){
        openInfo = '<span>24시간 영업</span>';
    }else{
        openInfo =  '    <span>' +  Math.floor((place.cafeOpen)/100) + ':'+ ((place.cafeOpen)%100 == 0 ? '00' : (place.cafeOpen)%100)  + '</span>'+
        '   <span> ~ ' +  closeTime + ':'+ ((place.cafeClosed)%100 == 0 ? '00' : (place.cafeClosed)%100)  + '</span>'; 
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';
    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '<div class="openInfo"><div id="time">' + openInfo + '</div>';
    itemStr += '  <div class="type"><p id="marker-img-oc"></p> 영업중 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 영업중 병원 결과 리스트 객체
function getOpenedHospitalItem(place) {

    let closeTime = Math.floor((place.hospitalClosed)/100);
    if(closeTime > 24){
        closeTime -= 24;
        closeTime = '익일 ' + closeTime;
    }

    let heart='';

    if(isLogin  == 'true' && place.isMyPlace == false){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-regular fa-heart"></i></i></span>`;
    }else if(isLogin  == 'true' && place.isMyPlace == true){
        heart = `<span class="heart-${place.compId}" onclick="setMyPlace(${place.compId})"><i class="fa-solid fa-heart"></i></i></span>`;
    }

    let openInfo;
    if(place.hospitalClosed == 4000){
        openInfo = '<span>24시간 영업</span>';
    }else{
        openInfo = '    <span>' +  Math.floor((place.hospitalOpen)/100) + ':'+ ((place.hospitalOpen)%100 == 0 ? '00' : (place.hospitalOpen)%100)  + '</span>'+
        '   <span> ~ ' +  closeTime + ':'+ ((place.hospitalClosed)%100 == 0 ? '00' : (place.hospitalClosed)%100)  + '</span>'; 
    }

    let el = document.createElement('li'),
    itemStr = `<div class="img"> <img src=${place.image} /> </div>`;
    itemStr += '<div class="info">' +
        '   <h4>' + place.compName + heart +'</h4>';
    itemStr += '    <span>' + place.address + '</span> <br /><br />';
    itemStr += '<div class="openInfo"><div id="time">' + openInfo + '</div>';

    itemStr += '  <div class="type"><p id="marker-img-oh"></p> 영업중 </div></div>' +
        '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}
