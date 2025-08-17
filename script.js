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

