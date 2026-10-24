/**
 * Floating Rose & Marigold Petal Shower
 * HTML5 Canvas Particle System with realistic fluttering physics
 */

class PetalShower {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.numPetals = 28;
    this.animId = null;
    this.isEnabled = true;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.colors = [
      { r: 220, g: 80, b: 100, alpha: 0.8 }, // Rose Red
      { r: 245, g: 140, b: 160, alpha: 0.8 }, // Rose Pink
      { r: 255, g: 153, b: 51, alpha: 0.85 }, // Marigold Orange
      { r: 255, g: 204, b: 51, alpha: 0.85 }, // Golden Marigold
      { r: 255, g: 250, b: 240, alpha: 0.75 } // White Jasmine Petal
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    for (let i = 0; i < this.numPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createPetal(randomY = false) {
    const colorObj = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20 - Math.random() * 40,
      size: 10 + Math.random() * 14,
      speedY: 1.0 + Math.random() * 1.8,
      speedX: (Math.random() - 0.5) * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      flipSpeed: 0.02 + Math.random() * 0.03,
      flipAngle: Math.random() * Math.PI,
      swayOffset: Math.random() * Math.PI * 2,
      color: colorObj
    };
  }

  update() {
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.swayOffset + p.y * 0.015) * 1.2 + p.speedX;
      p.rotation += p.rotSpeed;
      p.flipAngle += p.flipSpeed;

      // Reset when falling out of viewport
      if (p.y > this.height + 30 || p.x < -40 || p.x > this.width + 40) {
        this.petals[i] = this.createPetal(false);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.scale(1, Math.cos(p.flipAngle));

      const { r, g, b, alpha } = p.color;
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

      // Delicate organic curved petal shape
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.9, p.size * 0.7, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.7, -p.size * 0.8, -p.size * 0.5, 0, 0);
      this.ctx.fill();

      // Subtle center vein highlight
      this.ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 2);
      this.ctx.lineTo(0, p.size * 0.85);
      this.ctx.stroke();

      this.ctx.restore();
    }
  }

  animate() {
    if (!this.isEnabled) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.isEnabled = true;
    this.animate();
  }

  stop() {
    this.isEnabled = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  toggle() {
    if (this.isEnabled) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

window.PetalShower = PetalShower;
