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

function angleToHour(angle) {
  let hour = Math.round((angle % 360) / 15);
  if (hour === 24) hour = 0;
  return hour;
}

function showSelectedTime() {
  const percentText = document.getElementById('percent-text');
  if (startHour !== null && endHour !== null) {
    percentText.textContent = `${startHour}:00 ~ ${endHour}:00`;
  } else if (startHour !== null) {
    percentText.textContent = `${startHour}:00 ~ `;
  } else {
    percentText.textContent = '선택: 없음';
  }
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
  }

  if (clickCount === 0) {
    // 초기화 또는 3번째 클릭 이후
    startHour = hour;
    endHour = null;
    clickCount = 1;
    showSelectedTime();
    if (startHour >= 7 && startHour <= 22) {
      document.getElementById('input-hour').value = startHour;
    }
  } 

  if (startHour >= 7 && startHour <= 22) {
      document.getElementById('input-hour').value = startHour;
  }
  
  else {
    endAngle = angle;
    endHour = angleToHour(endAngle);
    clickCount = 0;
    // 원호 그리기
    pieSlice.setAttribute('d', describeArc(100, 100, 90, startAngle, endAngle));
    showSelectedTime();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('table-body');

  const headerNames = ['요일/시간', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const headerRow = document.createElement('tr');
  headerNames.forEach((txt, idx) => {
    const th = document.createElement('th');
    th.innerText = txt;
    if (idx === 0) th.style.borderRight = '2px solid black';
    headerRow.appendChild(th);
  });
  tbody.appendChild(headerRow);

  for (let i = 0; i < 16; i++) {
    const hour = (7 + i).toString().padStart(2, '0') + ':00';
    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.style.borderRight = '2px solid black';
    th.innerText = hour;
    tr.appendChild(th);

    for (let j = 1; j <= 7; j++) {
      const td = document.createElement('td');
      td.id = `${i + 1}-${j}`;
      td.innerText = '';
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
});


document.getElementById('submit-plan').addEventListener('click', function() {
  const hour = parseInt(document.getElementById('input-hour').value, 10);
  const day = document.getElementById('input-day').value;
  const plan = document.getElementById('input-plan').value;

  const row = hour - 6;
  const col = day;
  const cell = document.getElementById(`${row}-${col}`);

  if (cell) cell.innerText = plan;
  else alert('테이블 셀을 찾을 수 없습니다.');
});
