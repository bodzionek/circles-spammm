if (document.readyState !== "loading") {
  const spammer = new CirclesSpammm("container");
  spammer.start();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    const spammer = new CirclesSpammm("container");
    spammer.start();
  });
}

const circleColors = [
  "#0D47A1",
  "#01579B",
  "#00695C",
  "#1B5E20",
  "#33691E",
  "#827717",
  "#F57F17",
  "#FF6F00",
  "#E65100",
  "#BF360C",
  "#B71C1C",
  "#880E4F",
  "#4A148C",
  "#311B92",
  "#1A237E",
];

class CirclesSpammm {
  constructor(containerId, options = null) {
    if (!containerId) {
      throw new Error("containerId required!");
    }
    this.id = options?.id || "tunnel";
    this.frame = 0;
    this.container = document.getElementById(containerId);
    this.ctx = null;
    this.canvas = null;
    this.speed = options?.speed || 1;
    this.circlesCurrent = 0;
    this.circlesMax = options?.maxCircles || 30;
    this.fps = options?.fps || 60;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
    this.width = 0;
    this.height = 0;
    this.spawnDelay = 30;
    this.x = 0;
    this.y = 0;
    this.mx = 0;
    this.my = 0;
  }

  start() {
    document.onmousemove = (event) => this.handleMousePosUpdate(event, this);
    this.prepareCanvas();
    this.drawCircles();
  }

  prepareCanvas() {
    const dpr = window.devicePixelRatio;
    const containerRect = this.container.getBoundingClientRect();
    this.width = containerRect.width;
    this.height = containerRect.height;
    this.x = Math.floor(this.width / 2);
    this.y = Math.floor(this.height / 2);
    const canvas = document.createElement("canvas");
    canvas.id = this.id;
    canvas.height = containerRect.height * dpr;
    canvas.width = containerRect.width * dpr;
    canvas.style.height = `${containerRect.height}px`;
    canvas.style.width = `${containerRect.width}px`;
    this.container.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.scale(dpr, dpr);
    this.colorShift = 0;
  }

  drawCircles() {
    requestAnimationFrame(() => this.drawCircles());
    this.updateSpawnPosition();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.frame += 1;
    if (this.frame >= this.spawnDelay && this.frame % this.spawnDelay === 0) {
      if (this.circlesCurrent < this.circlesMax) {
        this.circlesCurrent += 1;
      } else {
        this.colorShift += 1;
      }
    }
    for (let i = 0; i <= this.circlesCurrent; i++) {
      this.drawCircle(i);
    }
  }

  updateSpawnPosition() {
    const maxSpeed = 0.5;
    const dx = (this.mx - this.x) / 200;
    const dy = (this.my - this.y) / 200;
    const cx = dx < 0 ? Math.max(dx, -maxSpeed) : Math.min(dx, maxSpeed);
    const cy = dy < 0 ? Math.max(dy, -maxSpeed) : Math.min(dy, maxSpeed);
    this.x += cx;
    this.y += cy;
  }

  drawCircle(index) {
    let radiusModifier =
      this.frame < this.spawnDelay ? this.frame : this.frame % this.spawnDelay;
    let circleRadius =
      (this.circlesCurrent - index) * this.spawnDelay +
      radiusModifier * this.speed;
    if (circleRadius < 0) return;
    this.ctx.save();
    this.ctx.beginPath();
    if (index === 0 && this.circlesCurrent === this.circlesMax) {
      this.ctx.globalAlpha = 1 - radiusModifier / this.spawnDelay;
    }
    this.ctx.fillStyle = this.getColorForIndex(index + this.colorShift);
    this.ctx.arc(this.x, this.y, circleRadius, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
    if (circleRadius > 11) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = "#000000";
      this.ctx.arc(
        this.x,
        this.y,
        circleRadius - 10,
        0,
        Math.PI * 2,
        true
      );
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.restore();
    }
  }

  getColorForIndex(index) {
    return index >= circleColors.length
      ? circleColors[index % circleColors.length]
      : circleColors[index];
  }

  handleMousePosUpdate(event, that) {
    that.mx = event.x;
    that.my = event.y;
  }
}

// class Tunnel {
//   constructor(
//     width,
//     height,
//     step = 5,
//     maxCircles = 10,
//     fps = 60,
//     id = "tunnel"
//   ) {
//     this.id = id;
//     this.height = height || window.innerHeight;
//     this.width = width || window.innerWidth;
//     this.iteration = 0;
//     this.intervalTime = 40;
//     this.maxCircles = maxCircles;
//     this.step = step;
//     this.circlesArr = [];
//     this.colorsArr = colorsArr;
//     this.canvasContext;
//     this.drawInterval;
//     this.stopInterval;
//     this.finishingTimeout;
//     this.lastCircleIndex = 1;
//     this.isAnimationFinishing = false;
//     this.fpsInterval = 1000 / fps;
//     this.then = Date.now();
//     this.startTime = this.then;
//   }

//   start() {
//     this.drawBoard();
//     this.spawnCircle();
//     this.drawCircles();
//     this.nextIteration();
//   }

//   resume() {
//     console.log("Resuming animation!");
//     this.isAnimationFinishing = false;
//     if (this.finishingTimeout) {
//       clearTimeout(this.finishingTimeout);
//     }

//     if (!this.drawInterval) {
//       console.log("Starting new animation");
//       this.iteration = 0;
//       this.lastCircleIndex = 1;
//       this.circlesArr = [];
//       this.spawnCircle();
//       this.drawCircles();
//       this.drawInterval = setInterval(() => {
//         this.nextIteration();
//       }, this.intervalTime);
//     }
//   }

//   stop() {
//     console.log("Stopping animation!");
//     this.isAnimationFinishing = true;
//     this.finishingTimeout = setTimeout(() => {
//       if (this.isAnimationFinishing) {
//         clearInterval(this.drawInterval);
//         this.drawInterval = null;
//         console.log("Animation finished!");
//       }
//     }, 1.5 * this.maxCircles * this.step * this.intervalTime);
//   }

//   drawBoard() {
//     const dpr = window.devicePixelRatio;
//     this.board = document.createElement("canvas");
//     this.board.id = this.id;
//     this.board.height = this.height * dpr;
//     this.board.width = this.width * dpr;
//     const container = document.getElementById("container");
//     container.appendChild(this.board);
//     let canvas = document.getElementById(this.id);
//     canvas.addEventListener("click", () => this.handleDrawingClick());
//     this.canvasContext = canvas.getContext("2d");
//     this.canvasContext.scale(dpr, dpr);
//     container.style.width = `${this.width}px`;
//     container.style.height = `${this.height}px`;
//     this.board.style.width = `${this.width}px`;
//     this.board.style.height = `${this.height}px`;
//   }

//   handleDrawingClick() {
//     if (this.isAnimationFinishing) {
//       this.resume();
//     } else {
//       this.stop();
//     }
//   }

//   spawnCircle(index = 0) {
//     let color = this.isAnimationFinishing
//       ? "#000000"
//       : this.getColorForIndex(index);
//     let circle = {
//       index: this.circlesArr.length,
//       radius: 1,
//       color,
//     };
//     this.circlesArr.push(circle);
//   }

//   getColorForIndex(index) {
//     return index >= this.colorsArr.length
//       ? this.colorsArr[index % this.colorsArr.length]
//       : this.colorsArr[index];
//   }

//   drawCircles() {
//     for (let i = 0; i < this.circlesArr.length; i++) {
//       let circle = this.circlesArr[i];
//       this.drawCircle(circle.radius, circle.color);
//     }
//   }

//   drawCircle(radius, color) {
//     let cc = this.canvasContext;
//     let w = Math.floor(this.width / 2);
//     let h = Math.floor(this.height / 2);

//     cc.beginPath();
//     cc.shadowBlur = 10;
//     cc.shadowColor = shadowColor;
//     cc.globalAlpha = 0.5;
//     cc.fillStyle = color;
//     cc.arc(w, h, radius, 0, Math.PI * 2, true);
//     cc.fill();
//   }

//   nextIteration() {
//     requestAnimationFrame(() => this.nextIteration());
//     const now = Date.now();
//     const elapsed = now - this.then;

//     if (elapsed > this.fpsInterval) {
//       console.log(this.circlesArr);
//       this.then = now - (elapsed % this.fpsInterval);

//       this.iteration += 1;
//       if (this.circlesArr.length > this.maxCircles) {
//         this.circlesArr = this.circlesArr.splice(1);
//       }
//       for (let i = 0; i < this.circlesArr.length; i++) {
//         let circle = this.circlesArr[i];
//         circle.radius = circle.radius + 1;
//       }
//       if (this.iteration % this.step === 0) {
//         this.spawnCircle(this.lastCircleIndex);
//         this.lastCircleIndex += 1;
//       }
//       this.drawCircles();
//     }
//   }
// }
