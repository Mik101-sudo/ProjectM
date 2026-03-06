/* ============================================
   MANDFAR GROUP — CANVAS PARTICLE SYSTEM
   ============================================ */

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  init() {
    const count = Math.min(Math.floor(this.w * this.h / 12000), 120);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(y = null) {
    return {
      x: Math.random() * this.w,
      y: y !== null ? y : Math.random() * this.h,
      size: Math.random() * 2.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.1,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.6 ? [0, 175, 102] : Math.random() > 0.5 ? [0, 59, 73] : [255, 255, 255],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i], p2 = this.particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0,175,102,${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.drawConnections();

    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      const pulsedOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      const pulsedSize = p.size * (0.9 + 0.1 * Math.sin(p.pulse));

      if (p.y < -10 || p.x < -10 || p.x > this.w + 10) {
        this.particles[i] = this.createParticle(this.h + 10);
        return;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, pulsedSize, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${pulsedOpacity})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (canvas) new ParticleSystem(canvas);
});
