const bars = document.querySelectorAll('.telemetry span');

setInterval(() => {
  const randomBar =
    bars[Math.floor(Math.random() * bars.length)];
  
  randomBar.classList.add('active');

  setTimeout(() => {
    randomBar.classList.remove('active');
  }, 1800);

}, 800);