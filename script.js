const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
] ; 

var today = new Date() ;

today.setHours(0, 0, 0, 0) ; 
















// 없앨까생각중 
const pie = document.getElementById('pie');
const pieSlice = document.getElementById('pie-slice');
const percentText = document.getElementById('percent-text');

let clickCount = 0;
let startAngle = 0;
let endAngle = 0;
let startHour = null;
let endHour = null;

// 각도를 시간으로 변환 (0시가 위, 시계방향)
function angleToHour(angle) {
  let hour = Math.round((angle % 360) / 15); // 360/24 = 15도
  if (hour === 24) hour = 0;
  return hour;
}

// 시간 범위 텍스트 표시
function showSelectedTime() {
  if (startHour !== null && endHour !== null) {
    percentText.textContent = `${startHour}:00 ~ ${endHour}:00`;
  } else {
    percentText.textContent = '선택: 없음';
  }
}

// 원호 그리기 함수
function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(rad)),
    y: cy + (r * Math.sin(rad))
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  let arc = endAngle - startAngle;
  if (arc < 0) arc += 360;
  const largeArcFlag = arc > 180 ? "1" : "0";
  const sweepFlag = "1";
  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", r, r, 0, largeArcFlag, sweepFlag, end.x, end.y,
    "Z"
  ].join(" ");
}

pie.addEventListener('click', function(e) {
  const rect = pie.getBoundingClientRect();
  const x = e.clientX - rect.left - 100;
  const y = e.clientY - rect.top - 100;
  let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
  if (angle < 0) angle += 360;

  if (clickCount === 0) {
    startAngle = angle;
    endAngle = angle;
    startHour = angleToHour(startAngle);
    endHour = null;
    clickCount = 1;
    pieSlice.setAttribute('d', ''); // 초기화
    showSelectedTime();
  } else {
    endAngle = angle;
    endHour = angleToHour(endAngle);
    clickCount = 0;
    // 원호 그리기
    pieSlice.setAttribute('d', describeArc(100, 100, 90, startAngle, endAngle));
    showSelectedTime();
  }
});

// 연도, 몇월인지 표시 

 // h1 표시된 날짜를 받아와서 calendarDate객체를 생성(달력을 만들기위함)
const dateContent = document.querySelector('#currentYearMonth').textContent ; 
const splitDate = dateContent.split('.') ; 
let calendarDate = new Date(splitDate) ; 

  // 각각의 버튼을 누르면 달 바꾸기(따로 updateUI 함수를 만들어 관리할수도 있음)
const prevBtn = document.querySelector('#prevMonth') ; 
const nextBtn = document.querySelector('#nextMonth') ;  

updateOuterUI() ; 

prevBtn.addEventListener('click', () => {
  calendarDate.setMonth(calendarDate.getMonth()-1) ; 
  updateOuterUI() ;
})


nextBtn.addEventListener('click', () => {
  calendarDate.setMonth(calendarDate.getMonth()+1) ; 
  updateOuterUI() ; 
})

function updateOuterUI(){
  let year = calendarDate.getFullYear(), month = calendarDate.getMonth() + 1;
    // 포매팅
  if(month <= 9) month = '0' + month ; 
  const h1Content = year+'.'+month ; 
  document.querySelector('#currentYearMonth').textContent = h1Content ; 

  const monthName = document.querySelector('#monthName') ;
  const monthIdx = calendarDate.getMonth() ;
  monthName.textContent = monthNames[monthIdx] ;
}


/// <-- 이 위에까지 걍 없어도 될거같음 





// 달력표시함수 라이브러리로 해야할거 같음!!!!!!!!!!!!!!!!!!!!!!!!!!!

document.addEventListener('DOMContentLoaded', function() {
  
  var calendarEl = document.getElementById('fullCalendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    

    
    initialView: 'dayGridMonth', // 초기 뷰 설정 (월 단위)
    height : 800, // 달력 높이 설정
  
    headerToolbar: {
      left : 'prev,next today', 
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false, hour12: false }, // 시간 표시는 00:00 ~ 24:00 

    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
    },          // timeGridWeek 에 사용될 시간표시 

    editable: true,     // 드래그, 크기 조절 가능
    selectable: true,   // 날짜 범위 선택 가능

    datesSet : function(info) { // 날짜 선택범위 조절하는 메서드
      var viewType = info.view.type ;
      if (viewType === 'dayGridMonth') {
        today.setHours(0, 0, 0, 0) ; 
        calendar.setOption('selectConstraint', {start : today}) ; 
      }

      else if (viewType === 'timeGridWeek'){
        today = new Date() ;
        calendar.setOption('selectConstraint', {start : today}) ; 
      }

      else if (viewType === 'timeGridDay'){
        today = new Date() ;
        calendar.setOption('selectConstraint', {tart : today}) ; 
      }

    }, 

    



    // 달력에 표시할 이벤트 데이터 (예시)
    events: [
      {
        title: '내 이벤트 1',
        start: '2025-08-27'
      },
      {
        title: '내 이벤트 2',
        start: '2025-08-28T10:00:00',
        end: '2025-08-28T18:00:00'
      }
    ],
    views : {
      dayGridMonth : {
        

      },
      timeGridWeek : {
        slotMinTime : '06:00:00',
        slotMaxTime : '24:00:00', 
        slotDuration :  '00:30:00',
      },
      timeGridDay : {

      },
      
    }
  });
  
  calendar.render(); // 달력 렌더링
});

// 해야하는 거 일단 month view에서 과거 날짜들은 모두 배경색 gray 처리 <-- week랑 day도 동일 





