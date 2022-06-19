// 장소 검색 객체를 생성
const ps = new kakao.maps.services.Places(); 

// 키워드로 장소를 검색
function searchPlaces() {

    let keyword = document.getElementById('keyword').value;

    // 장소검색 객체를 통해 키워드로 장소검색을 요청
    ps.keywordSearch(keyword, placesSearchCB);
}

// 키워드 검색 완료 시 호출되는 콜백함수 
function placesSearchCB (data, status, pagination) {

    const fragment = document.createDocumentFragment();
    // 검색 결과 목록에 추가된 항목들을 제거
    removeAllChildNods(listEl);
    removeMarker();

    let count = 0;

    if (status === kakao.maps.services.Status.OK) {

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가
        const bounds = new kakao.maps.LatLngBounds();

        for (var i=0; i<data.length; i++) {   
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }    

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정
        map.setBounds(bounds);
        companyTotal = closedCafe.concat(openedCafe, todayClosedCafe, closedRestaurant, openedRestaurant, todayClosedRestaurant, closedHospital, openedHospital, todayClosedHospital);

        for(let j=0; j<data.length; j++){
            for(let i=0; i < companyTotal.length; i++){
                if(companyTotal[i].compName == data[j].place_name){
                    if(companyTotal[i].type == 'cr'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {  
                            spriteOrigin: new kakao.maps.Point(0, 45),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        }; 
                        let itemEl_CR = getClosedRestarantItem(companyTotal[i]);
                        
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(closedMarkerImageSrc, imageSize, imageOptions);    
                        marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
    
                        // 생성된 마커를 마커 배열에 추가
                        closedRestaurantMarkers.push(marker);
                        createInfowindowEvent(itemEl_CR, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_CR);
    
                        setClosedRestaurantMarkers(map);
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                        count++;
                    }else if(companyTotal[i].type == 'cc'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {   
                            spriteOrigin: new kakao.maps.Point(0, 2),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        }; 
                        let itemEl_CC = getClosedCafeItem(companyTotal[i]);
         
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(closedMarkerImageSrc, imageSize, imageOptions);    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                
                        // 생성된 마커를 마커 배열에 추가
                        closedCafeMarkers.push(marker);    
                        createInfowindowEvent(itemEl_CC, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_CC);
    
                        setClosedCafeMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'ch'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {   
                            spriteOrigin: new kakao.maps.Point(0, 87),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        };  
                        let itemEl_CH = getClosedHospitalItem(companyTotal[i]);
         
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(closedMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                
                        // 생성된 마커를 마커 배열에 추가
                        closedHospitalMarkers.push(marker);  
                        createInfowindowEvent(itemEl_CH, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_CH);
    
                        setClosedHospitalMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'tcr'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {  
                            spriteOrigin: new kakao.maps.Point(0, 45),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        }; 
                        let itemEl_TCR = getTodayClosedRestarantItem(companyTotal[i]);
            
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(holidayMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                        
                        // 생성된 마커를 마커 배열에 추가
                        todayClosedRestaurantMarkers.push(marker);
                        createInfowindowEvent(itemEl_TCR, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_TCR);
    
                        setTodayClosedRestaurantMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'tcc'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {   
                            spriteOrigin: new kakao.maps.Point(0, 2),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        };  
                        let itemEl_TCC = getTodayClosedCafeItem(companyTotal[i]);
         
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(holidayMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                
                        // 생성된 마커를 마커 배열에 추가
                        todayClosedCafeMarkers.push(marker);   
                        createInfowindowEvent(itemEl_TCC, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_TCC);
    
                        setTodayClosedCafeMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'tch'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {   
                            spriteOrigin: new kakao.maps.Point(0, 87),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        };  
                        let itemEl_TCH = getTodayClosedHospitalItem(companyTotal[i]);
         
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(holidayMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                
                        // 생성된 마커를 마커 배열에 추가
                        todayClosedHospitalMarkers.push(marker);  
                        createInfowindowEvent(itemEl_TCH, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_TCH);
    
                        setTodayClosedHospitalMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'or'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {  
                            spriteOrigin: new kakao.maps.Point(0, 45),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        };  
                        let itemEl_OR = getOpenedRestarantItem(companyTotal[i]);
            
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(opendMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                        
                        // 생성된 마커를 마커 배열에 추가
                        openedRestaurantMarkers.push(marker);
                        createInfowindowEvent(itemEl_OR, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_OR);
    
                        setOpenedRestaurantMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'oc'){
                        var imageSize = new kakao.maps.Size(35, 44),
                        imageOptions = {   
                            spriteOrigin: new kakao.maps.Point(0, 2),    
                            spriteSize: new kakao.maps.Size(36, 133)  
                        };    
                        let itemEl_OC = getOpenedCafeItem(companyTotal[i]);
            
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(opendMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                
                        // 생성된 마커를 마커 배열에 추가
                        openedCafeMarkers.push(marker);    
                        createInfowindowEvent(itemEl_OC, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_OC);
    
                        setOpenedCafeMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }else if(companyTotal[i].type == 'oh'){
                        var imageSize = new kakao.maps.Size(35, 80),
                        imageOptions = {   
                            spriteOrigin: new kakao.maps.Point(0, 87),    
                            spriteSize: new kakao.maps.Size(36, 133)
                        };    
                        let itemEl_OH = getOpenedHospitalItem(companyTotal[i]);
         
                        // 마커이미지와 마커를 생성
                        var markerImage = createMarkerImage(opendMarkerImageSrc, imageSize, imageOptions),    
                            marker = createMarker(new kakao.maps.LatLng(parseFloat(companyTotal[i].latitude), parseFloat(companyTotal[i].longitude)), markerImage);  
                
                        // 생성된 마커를 마커 배열에 추가
                        openedHospitalMarkers.push(marker);    
                        createInfowindowEvent(itemEl_OH, marker, companyTotal[i]);
                        fragment.appendChild(itemEl_OH);
    
                        setOpenedHospitalMarkers(map);
                        count++;
                        // 검색결과 항목들을 검색결과 목록 Element에 추가
                        listEl.appendChild(fragment);
                    }
                }
            }
        }
        menuEl.scrollTop = 0;
        if(count == 0){
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
        }
        // 페이지 번호를 표출
        displayPagination(pagination);
    } 
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}