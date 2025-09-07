const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
] ; 

var today = new Date() ;

today.setHours(0, 0, 0, 0) ; 






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




// 달력 표시 함수 
document.addEventListener('DOMContentLoaded', function() {
  
  let calendarEl = document.getElementById('fullCalendar');
  let calendar = new FullCalendar.Calendar(calendarEl, {
    

    
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
      let viewType = info.view.type ;
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
        calendar.setOption('selectConstraint', {start : today}) ; 
        
        const timeGridSlots = document.querySelectorAll('.fc-timegrid-slot') ; 
        for (const slot of timeGridSlots) {
          const slotTime = slot.getAttribute('data-time') ; 
          const slicedTime = slotTime.slice(0, 2) + slotTime.slice(3, 5); 
          if(parseInt(slicedTime)  < parseInt(getHourMinute(today))){
            slot.classList.add('fc-past-time') ; 
          }
        }

      }

    }, 

    



    // 달력에 표시할 이벤트 데이터 <- 추가하는 메서드 구현해야함 
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
        slotMinTime : '00:00:00',
        slotMaxTime : '24:00:00', 
        slotDuration :  '00:30:00',
      },
      timeGridDay : {

      },
      
    },

    dateClick : function(info) {
      const clickedDate = info.date ;
      const view = info.view.type ; 

        // 날짜 클릭했을때 그 날짜로 이동
      if(view === "dayGridMonth"){
        calendar.gotoDate(clickedDate) ;
        calendar.changeView('timeGridDay') ; 
        
      }

      

    },

    // 드래그했을때 동작 정의
    select : function(info) {
      if(info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay'){
        let title = prompt('이벤트 이름 :') ;
        if(title) {
          this.addEvent({
            title : title,
            start : info.start,
            end : info.end
          }) ;
        }
        this.unselect() ;
      }
    




    }


  }); 
  
  calendar.render(); // 달력 렌더링
});





// 해야하는거 : 일단 기능위주로 해야할거같음 



 // 예약 관리가 주 목적인만큼, 해당날짜 클릭했을때 예약 추가되는거 기능추가
  // -> 이거의 경우는 timeGridWeek, timeGridDay에서 시간을 드래그해서 추가되게하는걸로 해야할듯 
 
  
 // 디퐅트 스케줄을 추가하고 그게 유지 되야함(예를들어 시간표를 입력했을때 그게 매주 유지되도록 : 기간도 정할 수 있으면 좋을듯)
 // 누군가 예약을 할 수 있도록 사용자와 관리자가 분리되야할듯   




// 한 거 : 달력에서 날짜 누르면 그 날짜로 이동함 -> 그 날짜에서 지나간 시간도 회색처리함

// 고쳐야할것 : weekview에서 회색(지나간시간)이 오른쪽 아직 지나지않은 날도 침범함 고쳐야ㅐ함


// 해달 날짜에서 시간+분을 가져오는 메서드 
 // 12:03이면 리턴값 1203
function getHourMinute(targetDate) {
  const hours = ('0' + targetDate.getHours()).slice(-2) ;
  const minutes = ('0' + targetDate.getMinutes()).slice(-2) ;
  return hours + minutes ; 
} 



