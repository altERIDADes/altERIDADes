// altERIDAD — matrix background effect
// Incluir en cualquier página con: <script src="matrix.js"></script>
// El canvas se crea automáticamente, no hace falta añadirlo al HTML.

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|=+-*%$#@!?;:';
  const fontSize = 13;
  let cols, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }

  function getContentBounds() {
    const contentWidth = Math.min(860, window.innerWidth);
    const left = (window.innerWidth - contentWidth) / 2;
    const right = left + contentWidth;
    return { left, right };
  }

  function draw() {
    const { left, right } = getContentBounds();

    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;

      if (x >= left - fontSize && x <= right) {
        drops[i]++;
        continue;
      }

      const char = chars[Math.floor(Math.random() * chars.length)];
      const y = drops[i] * fontSize;

      if (Math.random() > 0.95) {
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = '#1e4a1e';
        ctx.shadowBlur = 0;
      }

      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      ctx.fillText(char, x, y);
      ctx.shadowBlur = 0;

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 55);
})();
