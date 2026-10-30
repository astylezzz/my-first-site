const yes = document.querySelector('#yes');
const no = document.querySelector('#no');
const result = document.querySelector('#result');

// Координаты меняются сразу: курсор не успеет догнать кнопку по пути.
function escape(pointerX, pointerY) {
  const gap = 14;
  const width = yes.offsetWidth;
  const height = yes.offsetHeight;
  const maxX = Math.max(gap, window.innerWidth - width - gap);
  const maxY = Math.max(gap, window.innerHeight - height - gap);
  const old = yes.getBoundingClientRect();
  const noRect = no.getBoundingClientRect();
  let best = { x: gap, y: gap, score: -Infinity };

  // Выбираем случайную далёкую точку, не перекрывая кнопку «Нет».
  for (let i = 0; i < 40; i++) {
    const x = gap + Math.random() * (maxX - gap);
    const y = gap + Math.random() * (maxY - gap);
    if (x < noRect.right + 10 && x + width > noRect.left - 10 &&
        y < noRect.bottom + 10 && y + height > noRect.top - 10) continue;
    const distance = Math.hypot(x + width / 2 - pointerX, y + height / 2 - pointerY);
    const travel = Math.hypot(x - old.left, y - old.top);
    const score = distance + travel * 0.4;
    if (score > best.score) best = { x, y, score };
  }
  yes.style.left = `${best.x}px`;
  yes.style.top = `${best.y}px`;
}

document.addEventListener('pointermove', (event) => {
  const rect = yes.getBoundingClientRect();
  if (event.clientX > rect.left - 55 && event.clientX < rect.right + 55 &&
      event.clientY > rect.top - 55 && event.clientY < rect.bottom + 55) {
    escape(event.clientX, event.clientY);
  }
});

for (const name of ['pointerenter', 'pointerdown', 'click', 'contextmenu']) {
  yes.addEventListener(name, (event) => {
    event.preventDefault();
    escape(event.clientX, event.clientY);
  });
}
yes.addEventListener('focus', () => yes.blur());
window.addEventListener('resize', () => escape(window.innerWidth / 2, window.innerHeight / 2));

no.addEventListener('click', () => {
  result.textContent = 'КВЕСТ ВЫПОЛНЕН. Роберт — легенда. +25 MMR, +100 уважения семьи. 🤝';
  no.innerHTML = 'ЛЕГЕНДА ПОДТВЕРЖДЕНА <span>✓</span>';
});
