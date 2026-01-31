/* Cyber Samurai JS
   - particles + subtle smoke trails
   - small UX helpers
*/

// Elements
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

// resize handling
window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
});

// particle system
const particles = [];
const particleCount = Math.round((w * h) / 90000) + 60; // density scales with screen
const colors = ['rgba(255,45,75,0.12)','rgba(255,107,134,0.08)','rgba(180,30,60,0.06)'];

function rand(min,max){ return Math.random()*(max-min)+min; }

class P {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = rand(0,w);
    this.y = rand(0,h);
    this.r = rand(0.6,3.2);
    this.vx = rand(-0.2,0.6);
    this.vy = rand(-0.15,0.15);
    this.life = rand(400,1400);
    this.age = 0;
    this.c = colors[Math.floor(Math.random()*colors.length)];
  }
  step(){
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    if(this.age > this.life || this.x < -50 || this.x > w+50 || this.y < -50 || this.y > h+50) this.reset();
  }
  draw(){
    ctx.beginPath();
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r*6);
    g.addColorStop(0, this.c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.arc(this.x, this.y, this.r*6, 0, Math.PI*2);
    ctx.fill();
  }
}

// smoke overlay (thin noise lines)
function drawGridLines(){
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = 'rgba(255,45,75,0.06)';
  for(let i=0;i<Math.ceil(h/120);i++){
    ctx.beginPath();
    ctx.moveTo(0, i*120 + ((Date.now()/500) % 120));
    ctx.lineTo(w, i*120 + ((Date.now()/500) % 120) - 40);
    ctx.stroke();
  }
  ctx.restore();
}

// create particles
for(let i=0;i<particleCount;i++) particles.push(new P());

// main loop
function loop(){
  ctx.clearRect(0,0,w,h);

  // background vignette
  const vg = ctx.createLinearGradient(0,0,0,h);
  vg.addColorStop(0, 'rgba(0,0,0,0.05)');
  vg.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vg;
  ctx.fillRect(0,0,w,h);

  // draw particles (back)
  particles.forEach(p => { p.step(); p.draw(); });

  // overlay lines
  drawGridLines();

  // subtle top gloss
  ctx.fillStyle = 'rgba(255,255,255,0.01)';
  ctx.fillRect(0,0,w,80);

  requestAnimationFrame(loop);
}

loop();

// small UI polish: button ripple on click
document.querySelectorAll('.btn').forEach(b=>{
  b.addEventListener('click', e=>{
    // visual pop
    b.style.transform = 'translateY(-4px) scale(1.01)';
    setTimeout(()=> b.style.transform = '', 220);
  });
});

// year in footer
document.getElementById('year').textContent = new Date().getFullYear();
