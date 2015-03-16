  var husl = HUSL;
  var Dust = (function() {
      // Constant properties 
      var Type = {
          Dust: "Dust",
          Water: "Water",
          Brick: "Brick",
          Erase: "Erase",
          Tap: "Tap",
          Air: "Air",
      };
      var width = 100;
      var height = 100;
      var interval = 1000 / (40 /* fps */ );
      var frame = 1;
      var color = 0;
      var Selection = Type.Dust;
      var MouseX = 0;
      var MouseY = 0;
      var particles = [];
      var Grid = new Array(100);
      for (var y = 0; y < 100; y++) Grid[y] = new Array(100);
      for (var x = 0; x < 100; x++) {
          for (var y = 0; y < 100; y++) {
              Grid[x][y] = 0;
          }
      }
      var mouseIsDown = false;
      var canvas = document.getElementById('display');
      //##############
      var force = 5;
      var source = 100;
      var sources = [];
      sources.push([250, 250]);
      var omx, omy;
      var mx, my;
      var res;
      var displaySize = 500;
      var fieldRes;
      var canvas;
      var DisplayFunc;

      function prepareFrame(field) {
          if ((omx >= 0 && omx < displaySize && omy >= 0 && omy < displaySize) && mouseIsDown && Selection == Type.Air) {
              var dx = mx - omx;
              var dy = my - omy;
              var length = (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0;
           
              if (length < 1) length = 1;
              for (var i = 0; i < length; i++) {
                  var x = (((omx + dx * (i / length)) / displaySize) * field.width()) | 0
                  var y = (((omy + dy * (i / length)) / displaySize) * field.height()) | 0;
                  field.setVelocity(x, y, dx, dy);
                  field.setDensity(x, y, 50);
              }
              omx = mx;
              omy = my;
          }
          for (var i = 0; i < sources.length; i++) {
              var x = ((sources[i][0] / displaySize) * field.width()) | 0;
              var y = ((sources[i][1] / displaySize) * field.height()) | 0;
         
              field.setDensity(x, y, 30);
          }
      }

      function updatePressure() {
          field.update();
      }
      // window.onload = function() {
      var field = new FluidField(canvas);
      //  document.getElementById("iterations").value = 10;
      res = 100;
      field.setUICallback(prepareFrame);
      fieldRes = res;
      field.setResolution(res, res);

      function getTopLeftOfElement(element) {
          var top = 0;
          var left = 0;
          do {
              top += element.offsetTop;
              left += element.offsetLeft;
          } while (element = element.offsetParent);
          return {
              left: left,
              top: top
          };
      }
      
     
      // canvas.style.cursor = "none";
      function getMousePos(canvas, evt) {
          var rect = canvas.getBoundingClientRect();
          return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
          };
      }
      canvas.addEventListener('mousemove', function(evt) {
          var mousePos = getMousePos(canvas, evt);
          MouseX = Math.min(Math.round(mousePos.x / 5), 99);
          MouseY = Math.min(Math.round(mousePos.y / 5), 99);
          var o = getTopLeftOfElement(canvas);
          mx = event.clientX - o.left;
          my = event.clientY - o.top;
          if (mouseIsDown && (Selection != Type.Air)) {
              if (Selection == Type.Erase) {
                  if (Grid[MouseX][MouseY] != 0) Grid[MouseX][MouseY].remove();
              } else if (Grid[MouseX][MouseY] == 0) new ptc(MouseX, MouseY, Selection);
          }
      }, false);
      canvas.onmousedown = function(e) {
          e.preventDefault();
          mouseIsDown = true;
          var o = getTopLeftOfElement(canvas);
          omx = mx = event.clientX - o.left;
          omy = my = event.clientY - o.top;
      }
      canvas.onmouseup = function(e) {
          mouseIsDown = false;
      }
      window.addEventListener("keydown", onKeyDown, false);

      function KeyEvent(keyCode) {
          switch (keyCode) {
              case 81: //q
                  Selection = Type.Dust;
                  break;
              case 87: //w
                  Selection = Type.Water;
                  break;
              case 82: //r
                  Selection = Type.Brick;
                  break;
              case 69: //e
                  Selection = Type.Erase;
                  break;
              case 84: //e
                  Selection = Type.Tap;
                  break;
              case 65: //a
                  Selection = Type.Air;
                  break;
          }
      }

      function onKeyDown(event) {
          var keyCode = event.keyCode;
          // console.log(keyCode);
          KeyEvent(keyCode);
      }

      function ptc(x, y, type) {
          if (Grid[x][y] != 0) return;
          this.x = x;
          this.y = y;
          Grid[x][y] = this;
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
              case Type.Tap: //d
                  h = 12;
                  s = 60;
                  l = 99;
                  break;
          }
          this.color = husl.p.toRGB(Math.round(h), s, l);
          particles.push(this);
      };
      ptc.prototype = {
          remove: function() {
              var i = particles.indexOf(this);
              if (i > -1) particles.splice(i, 1);
              Grid[this.x][this.y] = 0;
          },
          tick: function(dir) {
              var dy = 0;
              var dx = 0;
              switch (this.type) {
                  case Type.Dust: //d
                      dx = 0;
                      dy = 1;
                      break;
                  case Type.Water: //d
                      dx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
                      dy = 1; //(Math.random() > .5 ? 0 : 1);;
                      this.color = husl.p.toRGB(205, 360, Math.floor((Math.random() * 40) + 20));
                      break;
                  case Type.Brick: //d
                      dx = 0;
                      dy = 0;
                      return;
                      break;
                  case Type.Tap: //d
                      dx = 0;
                      dy = 0;
                      this.Tap();
                      return;
                      break;
              }
              if ((this.x + dx) < 0 || ((this.x + dx) > 99)) {
                  this.remove();
                  return;
              }
              if ((this.y + dy) < 0 || ((this.y + dy) > 99)) dy = 0;
              if (this.Move(0, dy) && this.type == Type.Water && Math.random() > .2) dx = 0; // water spread
              if (!this.Move(dx, 0)) this.Move(-dx, 0);
              if (this.type == Type.Dust && (this.y + dy < 100) && Grid[this.x][this.y + dy].type == Type.Water) {
                  temp = Grid[this.x][this.y + dy];
                  Grid[this.x][this.y + dy] = this;
                  Grid[this.x][this.y] = temp;
                  temp.y -= dy;
                  this.y += dy;
              }
              return;
          },
          Move: function(dx, dy) {
              if ((this.x + dx) < 0 || ((this.x + dx) > 99)) {
                  this.remove();
                  return (1);
              }
              if (Grid[this.x + dx][this.y + dy] == 0) {
                  Grid[this.x + dx][this.y + dy] = this;
                  Grid[this.x][this.y] = 0;
                  this.x += dx;
                  this.y += dy;
                  return (1);
              }
              return (0);
          },
          Tap: function() {
              if (Math.random() < .6) return;
              if (this.y < 98 && Grid[this.x][this.y + 1] == 0) new ptc(this.x, this.y + 1, Type.Water);
              else if (this.x < 98 && Grid[this.x + 1][this.y] == 0) new ptc(this.x + 1, this.y, Type.Water);
              else if (this.x > 1 && Grid[this.x - 1][this.y] == 0) new ptc(this.x - 1, this.y, Type.Water);
              else if (this.y > 1 && Grid[this.x][this.y - 1] == 0) new ptc(this.x, this.y - 1, Type.Water);
          }
      };

      function init() {
          // for (var x = 0; x < 100; x++) {
          //     for (var y = 0; y < 100; y++) { //spawn n fish and add them to list
          //         new ptc(x,y*x%100, Type.Tap); // Math.random() * 360, 360, 50)
          //     }
          // }
          // // var x = 50; //deprecated
          // // var y = 50;
          // // for (var i = 0; i < 100; i++) { //spawn n fish and add them to list
          // //     x = Math.floor(Math.random() * (width - 60)) + 30;
          // //     y = Math.floor(Math.random() * (height - 60)) + 30;
          // //     new ptc(x, y, Type.Dust); // Math.random() * 360, 360, 50)
          // // }
          // // return;
      }

      function Dust(equation, canvas) {
          // init();
          this.canvas = canvas;
          this.scale = 5 //canvas.getAttribute('width') / width;
          this.context = canvas.getContext('2d');
          this.imageData = this.context.createImageData(width * this.scale, height * this.scale);
          this.then = +Date.now();
          this.paused = false;
          field.setDisplayFunction(this.displayVelocity);
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
              var Size = 0;
              // if(ptc.type==Type.Water && x>0 && x<98)
              //  Size = Math.floor(Math.random()*2);
              for (var sx = -Size; sx < 5 + Size; sx++) {
                  for (var sy = -Size; sy < 5 + Size; sy++) {
                      var i = (((y * this.scale + (sy)) * width * this.scale) + (x * this.scale + (sx))) * 4;
                      this.imageData.data[i] = R; // % 255;
                      this.imageData.data[i + 1] = G; // % 255;
                      this.imageData.data[i + 2] = B; // % 255;
                      this.imageData.data[i + 3] = 255;
                  }
              }
          },
          displayVelocity: function(field) {
              context = canvas.getContext('2d');
              context.save();
              context.lineWidth = .5;
              scale = 5
              context.strokeStyle = "rgb(255,255,255)";
              var vectorScale = 7;
              context.beginPath();
              // console.log(field.getXVelocity(50, 50) + field.getYVelocity(50, 50));
              for (var x = 0; x < field.width(); x++) {
                  for (var y = 0; y < field.height(); y++) {
                      context.moveTo(x * scale + 0.5 * scale, y * scale + 0.5 * scale);
                      if (Math.abs(field.getXVelocity(x, y) * field.getYVelocity(x, y)) > .005) context.lineTo((x + 0.5 + vectorScale * field.getXVelocity(x, y)) * scale, (y + 0.5 + vectorScale * field.getYVelocity(x, y)) * scale);
                  }
              }
              context.stroke();
              context.restore();
          },
          drawFrame: function() {
              this.context.fillRect(0, 0, 500, 500);
              this.context.fillStyle = husl.p.toHex(40, 60, 2); ////t'#0010'+offset.toString(16);
              this.context.fill();
              updatePressure();
              this.imageData = this.context.getImageData(0, 0, 500, 500);
              for (var i = 0; i < particles.length; i++) {
                  particles[i].tick();
                  if (particles[i]) this.drawParticle(particles[i]);
              }
              this.context.putImageData(this.imageData, 0, 0);
              document.getElementById('SelectionDisplay').innerHTML = 'Selection: ' + Selection + ' ------------- Particles: ' + particles.length;
          }
      };
      var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
              window.setTimeout(callback, 0);
          };
      return Dust;
  })();