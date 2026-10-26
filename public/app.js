const $=s=>document.querySelector(s);
const places=[
 {id:'lunch1',name:'솔향기',query:'철원 솔향기',note:'일정표의 식당명 기준 검색입니다. 같은 이름의 장소가 있을 수 있으니 예약 장소를 확인하세요.'},
 {id:'soi',name:'소이산 모노레일',query:'철원 소이산 모노레일',note:'철원역사문화공원 일대 · 탑승 장소는 예약 안내를 확인하세요.'},
 {id:'goseok',name:'고석정',query:'철원 고석정',note:'고석정 탐방 · 물윗길과 꽃밭은 각각 별도 장소입니다.'},
 {id:'water',name:'한탄강 물윗길',query:'철원 한탄강 물윗길 태봉대교 매표소',note:'지도는 태봉대교 매표소 기준입니다. 실제 단체 집결 지점은 확인이 필요합니다.'},
 {id:'flower',name:'고석정 꽃밭',query:'철원 고석정 꽃밭 태봉로 1769',note:'강원특별자치도 철원군 동송읍 태봉로 1769'},
 {id:'hotel',name:'숙소',query:'',note:'포천 숙소의 정확한 주소를 장소 설정에서 입력해 주세요.'},
 {id:'dinner',name:'황금오리 숯불닭갈비',query:'포천 황금오리 숯불닭갈비',note:'일정표의 식당명 기준 검색입니다. 예약한 지점을 확인하세요.'},
 {id:'breakfast',name:'옛날전통된장',query:'포천 옛날전통된장',note:'일정표의 식당명 기준 검색입니다. 예약 장소를 확인하세요.'},
 {id:'lake',name:'산정호수 둘레길',query:'포천 산정호수',note:'경기도 포천시 영북면 산정호수로 402 일대 · 플로깅 집결 지점은 현장 안내를 확인하세요.'},
 {id:'lunch2',name:'산비탈손두부',query:'포천 산비탈손두부',note:'일정표의 식당명 기준 검색입니다. 예약 장소를 확인하세요.'},
 {id:'cafe',name:'분임토의 카페',query:'',note:'카페 이름 또는 주소를 장소 설정에서 입력해 주세요.'}
];
const schedule=[[
 ['11:00','12:00','오리엔테이션 · 오찬','함께 모여 워크숍을 시작합니다. 인원 체크 및 서명','식사','lunch1'],
 ['12:00','14:00','소이산 모노레일','철원의 가을 풍경을 만나는 시간','탐방','soi'],
 ['14:30','17:30','분임 토의 · 고석정 탐방','물윗길 트레킹, 고석정 꽃밭 · 세부 순서와 집결 장소는 현장 안내 확인','소통·탐방','goseok','water','flower'],
 ['17:30','18:00','숙소 이동 · 석식','철원 → 포천 이동 및 황금오리 숯불닭갈비 석식 · 일정표상 동일 시간대','이동·식사','hotel','dinner'],
 ['19:30','이후','자유시간 · 레크리에이션','동료들과 편안하게 이야기를 나누는 저녁','자유시간','hotel']
],[
 ['07:00','09:00','조식','따뜻한 아침 식사로 둘째 날을 시작합니다.','식사','breakfast'],
 ['09:00','11:00','플로깅 · 산정호수 둘레길','호수를 따라 걷고, 함께 주변을 정리하는 시간','야외활동','lake'],
 ['12:00','13:00','오찬','산비탈손두부에서 함께하는 점심','식사','lunch2'],
 ['13:00','14:00','분임토의 · 해산','카페에서 워크숍을 마무리합니다. 인원 체크 및 서명','소통','cafe']
]];
let day=0,region=0,selected='soi',weatherResults={};
function readSaved(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
let overrides=readSaved('autumn-places',{});if(!overrides||typeof overrides!=='object')overrides={};
const getPlace=id=>{const p=places.find(p=>p.id===id);return {...p,query:typeof overrides[id]==='string'?overrides[id]:p.query}};
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
function toast(text){$('#toast').textContent=text;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2800)}
function renderSchedule(){
 $('#day-title').textContent=day===0?'철원에서 만나는 가을':'포천의 아침, 함께하는 마무리';$('#count').textContent=`${schedule[day].length}개의 일정`;
 document.querySelectorAll('.day-tabs button').forEach((b,i)=>{b.classList.toggle('active',i===day);b.setAttribute('aria-selected',String(i===day))});
 $('#timeline').replaceChildren();
 schedule[day].forEach(([start,end,title,desc,type,...ids])=>{const row=el('article',undefined,'event');const time=el('div',start,'time');time.append(el('small',end==='이후'?end:`— ${end}`));row.append(time);const card=el('div',undefined,'event-card');const head=el('div',undefined,'event-head');head.append(el('strong',title),el('span',type,'tag '+(type.includes('식사')?'food':type.includes('소통')?'meeting':'')));card.append(head,el('p',desc));ids.forEach((id,i)=>{const p=getPlace(id),b=el('button',`⌖ ${p.name}${p.query?'':' · 장소 확인 필요'}`,'place-button');b.type='button';b.append(el('span','↗'));b.addEventListener('click',()=>focusPlace(id,true));card.append(b);if(i<ids.length-1)card.append(el('span','　'));});row.append(card);$('#timeline').append(row)});
}
function focusPlace(id,scroll=false){selected=id;const p=getPlace(id);$('#map-title').textContent=p.name;$('#map-note').textContent=(overrides[id]&&p.query)?`설정한 장소: ${p.query}`:p.note;const query=p.query||'포천시';$('#map-frame').src=`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed&hl=ko`;$('#google-open').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;const url=`https://map.naver.com/p/search/${encodeURIComponent(query)}`;$('#naver').href=url;$('#naver-open').href=url;$('#naver-place-title').textContent=p.query?p.name:'장소 확인 필요';$('#naver-open').textContent=p.query?'네이버 지도 열기 ↗':'포천 지도 열기 ↗';$('#naver').textContent=p.query?'네이버 지도 ↗':'포천 지도 ↗';if(p.query){$('#destination').value=id;updateDirections()}if(scroll&&matchMedia('(max-width:650px)').matches)$('#map').scrollIntoView({behavior:'smooth',block:'start'});}
let currentPosition=null,locationRequest=0;
function routeOptions(){['origin','destination'].forEach(key=>{const select=$('#'+key),old=select.value;select.replaceChildren();if(key==='origin'){const option=el('option','⌖ 현재 위치');option.value='current';select.append(option)}places.filter(p=>getPlace(p.id).query).forEach(p=>{const option=el('option',p.name);option.value=p.id;select.append(option)});if([...select.options].some(o=>o.value===old))select.value=old;else if(key==='origin')select.value='soi';});}
function updateDirections(){const current=$('#origin').value==='current',a=current?currentPosition:getPlace($('#origin').value)?.query,b=getPlace($('#destination').value);$('#directions').href='https://map.naver.com/p/directions/-/-/-/car';const link=$('#google-directions');link.setAttribute('aria-disabled',String(!a));if(a)link.href=`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a)}&destination=${encodeURIComponent(b.query)}&travelmode=driving`;else link.removeAttribute('href');$('#copy-origin').disabled=current&&!currentPosition;$('#location-status').hidden=!current;$('#location-retry').hidden=!current;}
function requestCurrentLocation(){const request=++locationRequest;currentPosition=null;$('#location-status').textContent='현재 위치를 확인하고 있습니다…';$('#location-retry').disabled=true;updateDirections();function fail(message){if(request!==locationRequest)return;$('#location-status').textContent=message;$('#location-retry').disabled=false;updateDirections()}if(!navigator.geolocation){fail('이 브라우저에서는 현재 위치를 사용할 수 없습니다. 다른 출발지를 선택해 주세요.');return}navigator.geolocation.getCurrentPosition(position=>{if(request!==locationRequest)return;const {latitude,longitude}=position.coords;if(!Number.isFinite(latitude)||!Number.isFinite(longitude)){fail('현재 위치를 확인하지 못했습니다. 다시 시도해 주세요.');return}currentPosition=`${latitude},${longitude}`;$('#location-status').textContent='현재 위치를 출발지로 설정했습니다. 네이버 길찾기에서는 출발지의 ‘현재 위치’를 선택해 주세요.';$('#location-retry').disabled=false;updateDirections()},error=>{fail(error.code===1?'위치 권한이 허용되지 않았습니다. 브라우저에서 위치 권한을 허용한 후 다시 시도하거나 다른 출발지를 선택해 주세요.':error.code===3?'위치 확인 시간이 초과되었습니다. 다시 시도해 주세요.':'현재 위치를 확인하지 못했습니다. 위치 설정을 확인하거나 다른 출발지를 선택해 주세요.')},{enableHighAccuracy:true,timeout:15000,maximumAge:0});}
$('#location-retry').onclick=requestCurrentLocation;
$('#google-directions').onclick=e=>{if($('#google-directions').getAttribute('aria-disabled')==='true'){e.preventDefault();toast('현재 위치를 먼저 확인해 주세요.')}};
async function copyRoutePlace(key){const current=key==='origin'&&$('#origin').value==='current';const query=current?currentPosition:getPlace($('#'+key).value).query;if(!query){toast('현재 위치를 먼저 확인해 주세요.');return}try{await navigator.clipboard.writeText(query);toast(current?'현재 위치 좌표를 복사했습니다.':`${key==='origin'?'출발지':'도착지'}를 복사했습니다: ${query}`)}catch{toast('복사하지 못했습니다. 선택한 장소명을 직접 입력해 주세요.')}}
$('#copy-origin').onclick=()=>copyRoutePlace('origin');$('#copy-destination').onclick=()=>copyRoutePlace('destination');
$('#day1').onclick=()=>{day=0;renderSchedule()};$('#day2').onclick=()=>{day=1;renderSchedule()};$('#print').onclick=()=>window.print();$('#origin').onchange=()=>{if($('#origin').value==='current')requestCurrentLocation();else{++locationRequest;currentPosition=null;updateDirections()}};$('#destination').onchange=()=>focusPlace($('#destination').value);
$('#settings').onclick=()=>{const fields=$('#place-fields');fields.replaceChildren();places.forEach(p=>{const label=el('label',p.name);const input=el('input');input.name=p.id;input.value=getPlace(p.id).query;input.placeholder='장소명 또는 정확한 주소';input.maxLength=180;label.append(input);fields.append(label)});$('#settings-dialog').showModal()};$('#close-dialog').onclick=()=>$('#settings-dialog').close();
$('#settings-form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.target);const next=Object.fromEntries([...data].map(([k,v])=>[k,v.trim()]));try{localStorage.setItem('autumn-places',JSON.stringify(next));overrides=next;routeOptions();renderSchedule();focusPlace(selected);$('#settings-dialog').close();toast('장소 설정을 저장했습니다.')}catch{toast('저장 공간을 사용할 수 없습니다. 브라우저 설정을 확인해 주세요.')}};
const checked=readSaved('autumn-checks',{});document.querySelectorAll('[data-check]').forEach(input=>{input.checked=!!checked?.[input.dataset.check];input.onchange=()=>{const values={};document.querySelectorAll('[data-check]').forEach(n=>values[n.dataset.check]=n.checked);try{localStorage.setItem('autumn-checks',JSON.stringify(values))}catch{toast('이 브라우저에서는 체크 항목을 저장할 수 없습니다.')}}});
function weatherLabel(code){if(code===0)return ['☀','맑음'];if(code<=3)return ['⛅','구름 많음'];if(code<=48)return ['☁','안개'];if(code<=67)return ['☂','비'];if(code<=77)return ['❄','눈'];if(code<=82)return ['☂','소나기'];if(code<=86)return ['❄','눈'];return ['ϟ','뇌우']}
function renderWeather(){const box=$('#weather-content');box.replaceChildren();const result=weatherResults[region];$('#weather-time').textContent='';if(!result){box.append(el('div','행사일 날씨를 불러오는 중입니다…','weather-message'));return}if(result.error){box.append(el('div','날씨를 불러오지 못했습니다. 잠시 후 새로고침을 눌러 주세요.','weather-message'));const link=el('a','기상청 날씨 확인 ↗','place-button');link.href='https://www.weather.go.kr/w/index.do';link.target='_blank';link.rel='noopener';box.append(link);return}
 ['2026-10-29','2026-10-30'].forEach((date,i)=>{const idx=result.daily.time.indexOf(date);const row=el('div',undefined,'weather-day');const label=el('div',`10.${29+i} ${i?'금':'목'}요일`);label.append(el('small',`${i+1}일차 · ${region?'포천':'철원'}`));row.append(label);if(idx<0||result.daily.weather_code[idx]==null||result.daily.temperature_2m_max[idx]==null||result.daily.temperature_2m_min[idx]==null){row.append(el('span','예보 준비 중','muted'))}else{const [icon,description]=weatherLabel(result.daily.weather_code[idx]);row.append(el('span',icon,'weather-icon'));const temp=el('div',`${Math.round(result.daily.temperature_2m_max[idx])}°`,'weather-temp');temp.append(el('span',`${Math.round(result.daily.temperature_2m_min[idx])}°`,'low'));temp.append(el('small',`${description} · 강수 ${result.daily.precipitation_probability_max[idx]??'—'}%`));row.append(temp)}box.append(row)});$('#weather-time').textContent=`${result.updated} 조회`;$('#weather-tip').textContent='지역 대표 지점의 예보입니다. 야외 활동 전 최신 날씨를 다시 확인하세요.';}
let loadingWeather=false;
async function loadWeather(){if(loadingWeather)return;loadingWeather=true;$('#refresh').disabled=true;weatherResults={};renderWeather();try{await Promise.all([{lat:38.15,lon:127.31},{lat:38.07,lon:127.32}].map(async(p,i)=>{try{const response=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=16`,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('weather');const data=await response.json();if(!data.daily?.time)throw Error('format');weatherResults[i]={...data,updated:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Seoul'})};}catch{weatherResults[i]={error:true}}renderWeather()}))}finally{loadingWeather=false;$('#refresh').disabled=false}}
document.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{region=Number(b.dataset.region);document.querySelectorAll('[data-region]').forEach(n=>n.classList.toggle('selected',n===b));renderWeather()});$('#refresh').onclick=loadWeather;
renderSchedule();routeOptions();$('#origin').value='soi';focusPlace('goseok');loadWeather();


