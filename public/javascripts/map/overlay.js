function setOverlay(place, marker){   // 커스텀 오버레이 생성 함수

    if(place.type == 'cr'){
        let closeTime = Math.floor((place.restClosed)/100);
        if(closeTime > 24){
            closeTime -= 24;
            closeTime = '익일 ' + closeTime;
        }

        let breakTime = ' 없음';{
            if(place.breakStart){
                breakTime = Math.floor((place.breakStart)/100) + ':'+ ((place.breakStart)%100 == 0 ? '00' : (place.breakStart)%100) +
                '            </span>' + 
                '            <span> ~ ' + 
                        Math.floor((place.breakEnd)/100)  + ':'+ ((place.breakEnd)%100 == 0 ? '00' : (place.breakEnd)%100) +
                '            </span>'
            }
        }
    
        itemStr = '<div class="wrap">' + 
    '    <div class="info">' + 
    '        <div class="title">' 
                + place.compName + 
    '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
    '        </div>' + 
    '        <div class="body">' + 
    '            <div class="img">' +
    `                <img src=${place.image} />` +
    '           </div><br />' + 
    '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                    place.restType +
    '            </div>' +
    '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                    place.address +
    '            </div>' + 
    '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                    (place.tel ? place.tel : '-') +
    '            </div>' + 
    '            <div class="openInfo"><div class="desc"><span><i class="fa-solid fa-clock"></i>' + 
            Math.floor((place.restOpen)/100) + ':'+ ((place.restOpen)%100 == 0 ? '00' : (place.restOpen)%100) +
    '            </span>' + 
    '            <span> ~ ' + 
            closeTime  + ':'+ ((place.restClosed)%100 == 0 ? '00' : (place.restClosed)%100) +
    '            </span></div>' + 
    '            <span class="desc" style="color: #fe8201;"> 마감 </span></div>' + 
    '            <div class="desc"><span><i class="fa-solid fa-check"></i> 휴게시간   ' + breakTime +
    '            </div>' + 
    '            <div class="desc"><i class="fa-solid fa-utensils"></i><button class="menu">메뉴판 보기</a></div>' + 
    '        </div>' + 
    '    </div>' +    
    '</div>';
    }else if(place.type == 'cc'){

        let closeTime = Math.floor((place.cafeClosed)/100);
        if(closeTime > 24){
            closeTime -= 24;
            closeTime = '익일 ' + closeTime;
        }

        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.cafeType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-') +
        '            </div>' + 
        '            <div class="openInfo"><div class="desc"><span><i class="fa-solid fa-clock"></i>' + 
            Math.floor((place.cafeOpen)/100)+ ':'+ ((place.cafeOpen)%100 == 0 ? '00' : (place.cafeOpen)%100) +
'            </span>' + 
'            <span> ~ ' + 
            closeTime  + ':'+ ((place.cafeClosed)%100 == 0 ? '00' : (place.cafeClosed)%100) +
'            </span></div>' + 
        '            <span class="desc" style="color: #fe8201;"> 마감 </span></div>' + 
        '            <div class="desc"><i class="fa-solid fa-utensils"></i><button class="menu">메뉴판 보기</button></div>' + 
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'ch'){

        let closeTime = Math.floor((place.hospitalClosed)/100);
        if(closeTime > 24){
            closeTime -= 24;
            closeTime = '익일 ' + closeTime;
        }

        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.HospType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-') +
        '            </div>' + 
        '            <div class="openInfo"><div class="desc"><span><i class="fa-solid fa-clock"></i>' + 
        Math.floor((place.hospitalOpen)/100) + ':'+ ((place.hospitalOpen)%100 == 0 ? '00' : (place.hospitalOpen)%100) +
'            </span>' + 
'            <span> ~ ' + 
        closeTime + ':'+ ((place.hospitalClosed)%100 == 0 ? '00' : (place.hospitalClosed)%100) +
'            </span></div>' + 
        '            <span class="desc" style="color: #fe8201;"> 마감 </span></div>' +
        '            <div class="desc"><i class="fa-solid fa-check"></i>' + 
                        place.content +
        '            </div>' +
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'tcr'){

        let breakTime = ' 없음';{
            if(place.breakStart){
                breakTime = Math.floor((place.breakStart)/100) + ':'+ ((place.breakStart)%100 == 0 ? '00' : (place.breakStart)%100) +
                '            </span>' + 
                '            <span> ~ ' + 
                        Math.floor((place.breakEnd)/100)  + ':'+ ((place.breakEnd)%100 == 0 ? '00' : (place.breakEnd)%100) +
                '            </span>'
            }
        }

        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.restType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-') +
        '            </div>' +
        '            <span class="desc" style="color: #5A6EC4;"><i class="fa-solid fa-clock"></i> 오늘 휴무 </span>' + 
        '            <div class="desc"><span><i class="fa-solid fa-check"></i> 휴게시간   ' + breakTime +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-utensils"></i><button class="menu">메뉴판 보기</button></div>' + 
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'tcc'){
        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.cafeType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-') +
        '            </div>' +
        '            <span class="desc" style="color: #5A6EC4;"><i class="fa-solid fa-clock"></i> 오늘 휴무 </span>' + 
        '            <div class="desc"><i class="fa-solid fa-utensils"></i><button class="menu">메뉴판 보기</button></div>' + 
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'tch'){
        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.HospType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-') +
        '            </div>' +
        '            <span class="desc" style="color: #5A6EC4;"><i class="fa-solid fa-clock"></i> 오늘 휴무 </span>' +
        '            <div class="desc"><i class="fa-solid fa-check"></i>' + 
                        place.content +
        '            </div>' +
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'or'){

        let closeTime = Math.floor((place.restClosed)/100);
        if(closeTime > 24){
            closeTime -= 24;
            closeTime = '익일 ' + closeTime;
        }

        let breakTime = ' 없음';{
            if(place.breakStart){
                breakTime = Math.floor((place.breakStart)/100) + ':'+ ((place.breakStart)%100 == 0 ? '00' : (place.breakStart)%100) +
                '            </span>' + 
                '            <span> ~ ' + 
                        Math.floor((place.breakEnd)/100)  + ':'+ ((place.breakEnd)%100 == 0 ? '00' : (place.breakEnd)%100) +
                '            </span>'
            }
        }

        let openInfo;
        if(place.restClosed == 4000){
            openInfo = '<span>24시간 영업</span>';
        }else{
            openInfo = '            <span>' + 
            Math.floor((place.restOpen)/100) + ':'+ ((place.restOpen)%100 == 0 ? '00' : (place.restOpen)%100) +
'            </span>' + 
'            <span> ~ ' + 
            closeTime  + ':'+ ((place.restClosed)%100 == 0 ? '00' : (place.restClosed)%100) +
'            </span>'
        }

        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.restType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-')+
        '            </div><div class="openInfo"><div class="desc"><i class="fa-solid fa-clock"></i>' + openInfo + '</div>'+ 
        '            <span class="desc" style="color: #69d3de;"> 영업중 </span></div>' + 
        '            <div class="desc"><span><i class="fa-solid fa-check"></i> 휴게시간   ' + breakTime +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-utensils"></i><button class="menu">메뉴판 보기</button></div>' + 
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'oc'){

        let closeTime = Math.floor((place.cafeClosed)/100);
        if(closeTime > 24){
            closeTime -= 24;
            closeTime = '익일 ' + closeTime;
        }

        let openInfo;
        if(place.cafeClosed == 4000){
            openInfo = '<span>24시간 영업</span>';
        }else{
            openInfo = '            <span>' + 
            Math.floor((place.cafeOpen)/100) + ':'+ ((place.cafeOpen)%100 == 0 ? '00' : (place.cafeOpen)%100) +
'            </span>' + 
'            <span> ~ ' + 
            closeTime  + ':'+ ((place.cafeClosed)%100 == 0 ? '00' : (place.cafeClosed)%100) +
'            </span>'
        }

        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div><br />' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.cafeType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-')+
        '            </div><div class="openInfo"><div class="desc"><i class="fa-solid fa-clock"></i>' + openInfo + '</div>' +
        '            <span class="desc" style="color: #69d3de;"> 영업중 </span></div>' + 
        '            <div class="desc"><i class="fa-solid fa-utensils"></i><button class="menu">메뉴판 보기</button></div>' + 
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }else if(place.type == 'oh'){

        let closeTime = Math.floor((place.hospitalClosed)/100);
        if(closeTime > 24){
            closeTime -= 24;
            closeTime = '익일 ' + closeTime;
        }

        let openInfo;
        if(place.hospitalClosed == 4000){
            openInfo = '<span>24시간 영업</span>';
        }else{
            openInfo = '            <span>' + 
            Math.floor((place.hospitalOpen)/100) + ':'+ ((place.hospitalOpen)%100 == 0 ? '00' : (place.hospitalOpen)%100) +
'            </span>' + 
'            <span> ~ ' + 
            closeTime  + ':'+ ((place.hospitalClosed)%100 == 0 ? '00' : (place.hospitalClosed)%100) +
'            </span>'
        }

        itemStr = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title">' 
                    + place.compName + 
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        `                <img src=${place.image} />` +
        '           </div>' + 
        '            <div class="desc"><i class="fa-solid fa-circle-info"></i>' + 
                        place.HospType +
        '            </div>' +
        '            <div class="desc"><i class="fa-solid fa-location-dot"></i>' + 
                        place.address +
        '            </div>' + 
        '            <div class="desc"><i class="fa-solid fa-phone"></i>' + 
                        (place.tel ? place.tel : '-') +
        '            </div><div class="openInfo"><div class="desc"><i class="fa-solid fa-clock"></i>' + openInfo + '</div>' +
        '            <span class="desc" style="color: #69d3de;"> 영업중 </span></div>' +
        '            <div class="desc"><i class="fa-solid fa-check"></i>' + 
                        place.content +
        '            </div>' +
        '        </div>' + 
        '    </div>' +    
        '</div>';
    }

    const overlayContent = new kakao.maps.CustomOverlay({
        content: itemStr,
        map: map,
        position: marker.getPosition()       
    });

    return overlayContent;
}