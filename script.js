const yes = document.querySelector('#yes');
const margin = 12;
let x = 0;
let y = 0;
let vx = 165;
let vy = 125;
let pointer = { x: -1000, y: -1000 };
let lastTime;

function bounds() {
  return {
    x: Math.max(margin, innerWidth - yes.offsetWidth - margin),
    y: Math.max(margin, innerHeight - yes.offsetHeight - margin)
  };
}

function draw() {
  yes.style.transform = `translate(${x}px, ${y}px)`;
}

function escape() {
  const max = bounds();
  // Из случайных точек выбираем самую далёкую от курсора.
  let distance = -1;
  for (let i = 0; i < 20; i++) {
    const nextX = margin + Math.random() * (max.x - margin);
    const nextY = margin + Math.random() * (max.y - margin);
    const nextDistance = Math.hypot(nextX + yes.offsetWidth / 2 - pointer.x, nextY + yes.offsetHeight / 2 - pointer.y);
    if (nextDistance > distance) {
      distance = nextDistance;
      x = nextX;
      y = nextY;
    }
  }
  vx = (Math.random() > .5 ? 1 : -1) * 165;
  vy = (Math.random() > .5 ? 1 : -1) * 125;
  draw();
}

function avoidPointer() {
  if (pointer.x > x - 60 && pointer.x < x + yes.offsetWidth + 60 &&
      pointer.y > y - 60 && pointer.y < y + yes.offsetHeight + 60) escape();
}

document.addEventListener('pointermove', event => {
  pointer = { x: event.clientX, y: event.clientY };
  avoidPointer();
});
document.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });
for (const name of ['pointerenter', 'pointerdown', 'click', 'contextmenu']) {
  yes.addEventListener(name, event => {
    event.preventDefault();
    pointer = { x: event.clientX, y: event.clientY };
    escape();
  });
}
yes.addEventListener('focus', () => yes.blur());
window.addEventListener('resize', escape);

// Постоянный полёт с отскоками от краёв, даже если мышь не двигается.
function fly(time) {
  const dt = lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, .04);
  lastTime = time;
  const max = bounds();
  x += vx * dt;
  y += vy * dt;
  if (x <= margin || x >= max.x) vx *= -1;
  if (y <= margin || y >= max.y) vy *= -1;
  x = Math.max(margin, Math.min(x, max.x));
  y = Math.max(margin, Math.min(y, max.y));
  avoidPointer();
  draw();
  requestAnimationFrame(fly);
}

x = bounds().x * .75;
y = bounds().y * .72;
yes.style.left = '0';
yes.style.top = '0';
draw();
requestAnimationFrame(fly);
