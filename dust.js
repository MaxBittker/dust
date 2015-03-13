  var husl = HUSL;
  Type = {
      Dust: "Dust",
      Water: "Water",
      Brick: "Brick",
      Erase: "Erase",
  }
  var Dust = (function() {
      // Constant properties 
      var width = 100;
      var height = 100;
      var interval = 1000 / (25 /* fps */ );
      var frame = 1;
      var color = 0;
      var Selection = Type.Dust;
      var particles = [];
      Grid = new Array(100);
      for (var y = 0; y < 100; y++) Grid[y] = new Array(100);
      for (var x = 0; x < 100; x++) {
          for (var y = 0; y < 100; y++) {
              Grid[x][y] = 0;
          }
      }
      var mouseIsDown = false;
      var canvas = document.getElementById('display');

      function getMousePos(canvas, evt) {
          var rect = canvas.getBoundingClientRect();
          return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
          };
      }
      canvas.addEventListener('mousemove', function(evt) {
          if (!mouseIsDown) return;
          var mousePos = getMousePos(canvas, evt);
          var x = Math.min(Math.round(mousePos.x / 5), 99);
          var y = Math.min(Math.round(mousePos.y / 5), 99);
          if (Selection == Type.Erase) {
              var i = particles.indexOf(Grid[x][y]);
              if (i > -1) particles.splice(i, 1);
              Grid[x][y] = 0;
          } else if (Grid[x][y] == 0) {
              var tempptc = new ptc(x, y, Selection) //, color += .2, 360, 50);
              Grid[x][y] = tempptc;
              particles.push(tempptc);
          }
      }, false);
      canvas.onmousedown = function(e) {
          mouseIsDown = true;
      }
      canvas.onmouseup = function(e) {
          mouseIsDown = false;
      }
      window.addEventListener("keydown", onKeyDown, false);

      function KeyEvent(keyCode) {
          switch (keyCode) {
              case 81: //d
                  Selection = Type.Dust;
                  break;
              case 87: //s
                  Selection = Type.Water;
                  break;
              case 82: //a
                  Selection = Type.Brick;
                  break;
              case 69: //w
                  Selection = Type.Erase;
                  break;
          }
      }

      function onKeyDown(event) {
          var keyCode = event.keyCode;
          console.log(keyCode);
          KeyEvent(keyCode);
      }

      function ptc(x, y, type) { //, h, s, l) {
          this.x = x;
          this.y = y;
          this.type = type;
          switch (type) {
              case Type.Dust: //d
                  h = color += .2;
                  s = 360;
                  l = 50;
                  break;
              case Type.Water: //d
                  h = 205;
                  s = 360;
                  l = 100;
                  break;
              case Type.Brick: //d
                  h = 12;
                  s = 77;
                  l = 30;
                  break;
          }
          this.color = husl.p.toRGB(h, s, l);
      };
      ptc.prototype = {
          tick: function(dir) {
              switch (this.type) {
                  case Type.Dust: //d
                      dx = 0;
                      dy = 1;
                      break;
                  case Type.Water: //d
                      dx = (Math.random() > .5 ? -1 : 1);
                      dy = 1; //(Math.random() > .5 ? 0 : 1);;
                      this.color = husl.p.toRGB(205, 360, Math.floor((Math.random() * 40) + 20));
                      break;
                  case Type.Brick: //d
                      dx = 0;
                      dy = 0;
                      break;
              }
              if ((this.x + dx) < 0 || (this.x + dx) > 99) dx = 0;
              if ((this.y + dy) < 0 || (this.y + dy) > 98) dy = 0;
              if (Grid[this.x][this.y + dy] == 0) {
                  Grid[this.x][this.y + dy] = this;
                  Grid[this.x][this.y] = 0;
                  this.y += dy;
              }
              // console.log(this.y +dy, this.y);
              if (this.type == Type.Dust && Grid[this.x][this.y + dy].type == Type.Water) {
                  temp = Grid[this.x][this.y + dy];
                  Grid[this.x][this.y + dy] = this;
                  Grid[this.x][this.y] = temp;
                  temp.y -= dy;
                  this.y += dy;
              }
              if (Grid[this.x + dx][this.y] == 0) {
                  Grid[this.x + dx][this.y] = this;
                  Grid[this.x][this.y] = 0;
                  this.x += dx;
              }
              // if (Grid[this.x + dx][this.y + dy] == 0) {
              //     Grid[this.x + dx][this.y + dy] = this;
              //     Grid[this.x][this.y] = 0;
              //     this.y += dy;
              //     this.x += dx;
              // }
              return;
          }
      };

      function init() {
          var x = 50;
          var y = 50;
          for (var i = 0; i < 100; i++) { //spawn n fish and add them to list
              x = Math.floor(Math.random() * (width - 60)) + 30;
              y = Math.floor(Math.random() * (height - 60)) + 30;
              var tempptc = new ptc(x, y, Selection); // Math.random() * 360, 360, 50)
              Grid[x][y] = tempptc;
              particles.push(tempptc);
          }
          // return;
      }

      function Dust(equation, canvas) {
          init();
          this.canvas = canvas;
          this.scale = 5 //canvas.getAttribute('width') / width;
          this.context = canvas.getContext('2d');
          this.imageData = this.context.createImageData(width * this.scale, height * this.scale);
          this.then = +Date.now();
          this.paused = false;
          this.drawFrame();
      }
      Dust.prototype = {
          play: function() {
              this.paused = false;
              this.step();
          },
          pause: function() {
              this.paused = true;
          },
          step: function() {
              if (this.paused) return;
              requestAnimFrame(this.step.bind(this));
              var now = +Date.now();
              var delta = now - this.then;
              if (delta > interval) {
                  this.then = now;
                  this.drawFrame();
                  frame++;
              }
          },
          drawParticle: function(ptc) {
              var x = ptc.x;
              var y = ptc.y;
              var color = ptc.color;
              var R = Math.floor(color[0] * 255); // (color & 0xff0000) >>> 16;
              var G = Math.floor(color[1] * 255); //(color & 0x00ff00) >>> 8;
              var B = Math.floor(color[2] * 255); // (color & 0x0000ff) >>> 0;
              for (var sx = 0; sx < 5; sx++) {
                  for (var sy = 0; sy < 5; sy++) {
                      var i = (((y * this.scale + (sy - 1)) * width * this.scale) + (x * this.scale + (sx - 1))) * 4;
                      this.imageData.data[i] = R % 255;
                      this.imageData.data[i + 1] = G % 255;
                      this.imageData.data[i + 2] = B % 255;
                      this.imageData.data[i + 3] = 255;
                  }
              }
          },
          drawFrame: function() {
              this.context.fillRect(0, 0, 500, 500);
              this.context.fillStyle = husl.p.toHex(40, 60, 2); ////t'#0010'+offset.toString(16);
              this.context.fill();
              this.imageData = this.context.getImageData(0, 0, 500, 500);
              for (var i = 0; i < particles.length; i++) {
                  particles[i].tick();
                  // }
                  // for (var i = 0; i < particles.length; i++) {
                  this.drawParticle(particles[i]);
              }
              this.context.putImageData(this.imageData, 0, 0);
              document.getElementById('SelectionDisplay').innerHTML = 'Selection: '+Selection ;
      
          }
      };
      var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
              window.setTimeout(callback, 2000);
          };
      return Dust;
  })();