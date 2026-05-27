document.documentElement.classList.add("js");

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((element) => revealObserver.observe(element));

const canvas = document.querySelector(".site-canvas");
const context = canvas.getContext("2d");
const points = [];
const pointCount = 24;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedPoints() {
  points.length = 0;

  for (let index = 0; index < pointCount; index += 1) {
    points.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    });
  }
}

function draw() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.strokeStyle = "rgba(47, 111, 115, 0.22)";
  context.lineWidth = 1;

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20 || point.x > window.innerWidth + 20) {
      point.vx *= -1;
    }

    if (point.y < -20 || point.y > window.innerHeight + 20) {
      point.vy *= -1;
    }

    for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
      const next = points[nextIndex];
      const distance = Math.hypot(point.x - next.x, point.y - next.y);

      if (distance < 170) {
        context.globalAlpha = 1 - distance / 170;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }
  });

  context.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  seedPoints();
});

resizeCanvas();
seedPoints();
draw();
