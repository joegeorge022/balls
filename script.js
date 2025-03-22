const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
canvas.style.backgroundColor = 'black';
window.addEventListener('resize', resizeCanvas);

const colors = [
  "#87CEEB", "#FF69B4", "#98FB98", "#FFD700", "#00FFFF",
  "#FF6347", "#7B68EE", "#32CD32", "#FF4500", "#40E0D0",
  "#9370DB", "#F0E68C", "#00FA9A", "#DC143C", "#00BFFF",
  "#FF8C00", "#8A2BE2", "#ADFF2F", "#FF1493", "#1E90FF",
  "#FFA500", "#6A5ACD", "#228B22", "#FF00FF", "#A0522D"
];

function Circle(x, y, radius, dx, dy, color, isStatic = false) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.dx = dx;
  this.dy = dy;
  this.color = color || colors[Math.floor(Math.random() * colors.length)];
  this.isStatic = isStatic;
  this.shrinking = false;

  this.draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.lineWidth = 4;

    if (this.isStatic) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'white';
      ctx.strokeStyle = this.color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };

  this.update = () => {
    if (!this.isStatic) {
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx *= -1;
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy *= -1;
      this.x += this.dx;
      this.y += this.dy;

      if (this.shrinking) {
        this.radius -= 0.5;
        if (this.radius <= 0) return false;
      }
    }
    this.draw();
    return true;
  };

  this.setPosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  this.isCollidingWith = (other) => {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSumSq = (this.radius + other.radius) ** 2;
    return distanceSq < radiusSumSq;
  };
}

let circles = [];
let disappearedCount = 0;

for (let i = 0; i < 25; i++) {
  const r = 15;
  const x = Math.random() * (canvas.width - r * 2) + r;
  const y = Math.random() * (canvas.height - r * 2) + r;
  const dx = (Math.random() - 0.5) * 6;
  const dy = (Math.random() - 0.5) * 6;
  circles.push(new Circle(x, y, r, dx, dy));
}

const whiteCircle = new Circle(
  Math.random() * (canvas.width - 30) + 15,
  Math.random() * (canvas.height - 30) + 15,
  15, 0, 0, 'white', true
);
circles.push(whiteCircle);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(1, '#ff69b4');
    ctx.fillStyle = gradient;
    ctx.font = '20px Arial';
    ctx.fillText(`Ball Count: ${25 - disappearedCount}`, canvas.width - 250, 90);
  
    circles = circles.filter(circle => {
      if (circle !== whiteCircle && whiteCircle.isCollidingWith(circle) && !circle.shrinking) {
        circle.shrinking = true;
        disappearedCount++;
      }
      return circle.update();
    });
  
    if (25 - disappearedCount <= 0) {
      showPopup();
    }
}
  

animate();

function handleMove(x, y) {
  whiteCircle.setPosition(x, y);
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  handleMove(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
});
const popup = document.getElementById("popup");

function showPopup() {
  popup.style.display = "block";
}

function resetGame() {
  popup.style.display = "none";
  disappearedCount = 0;

  circles = [];
  for (let i = 0; i < 25; i++) {
    const r = 15;
    const x = Math.random() * (canvas.width - r * 2) + r;
    const y = Math.random() * (canvas.height - r * 2) + r;
    const dx = (Math.random() - 0.5) * 6;
    const dy = (Math.random() - 0.5) * 6;
    circles.push(new Circle(x, y, r, dx, dy));
  }

  const whiteX = Math.random() * (canvas.width - 30) + 15;
  const whiteY = Math.random() * (canvas.height - 30) + 15;
  whiteCircle.setPosition(whiteX, whiteY);
  circles.push(whiteCircle);
}
