/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	  var husl = __webpack_require__(1);
	  var _ = __webpack_require__(4);
	  var FluidField = __webpack_require__(5);


	  // var Dust = (function() {
	  // Constant properties 
	  var Type = {
	      Dust: "Dust",
	      Water: "Water",
	      Brick: "Brick",
	      Erase: "Erase",
	      Tap: "Tap",
	      Air: "Air",
	      Fire: "Fire",
	      Glitch: "Glitch",
	      Powder: "Powder",
	      Nitro: "Nitro"
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
	  var Adjacent = [
	      [0, 1],
	      [-1, 0],
	      [1, 0],
	      [0, -1]
	  ];
	  var PortField;
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
	      if ((omx >= 0 && omx < displaySize && omy >= 0 && omy < displaySize) && mouseIsDown && Selection === Type.Air) {
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
	      mx = evt.clientX - o.left;
	      my = evt.clientY - o.top;
	      Cursor();
	  }, false);
	  canvas.onmousedown = function(e) {
	      e.preventDefault();
	      mouseIsDown = true;
	      var o = getTopLeftOfElement(canvas);
	      omx = mx = e.clientX - o.left;
	      omy = my = e.clientY - o.top;
	  }
	  canvas.onmouseup = function(e) {
	      mouseIsDown = false;
	  }

	  function Cursor() {
	      if (mouseIsDown && (Selection != Type.Air)) {
	          if (Selection === Type.Erase) {
	              if (Grid[MouseX][MouseY] != 0) Grid[MouseX][MouseY].remove();
	          } else if (Grid[MouseX][MouseY] === 0) new ptc(MouseX, MouseY, Selection);
	      }
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
	          case 84: //t
	              Selection = Type.Tap;
	              break;
	          case 65: //a
	              Selection = Type.Air;
	              break;
	          case 70: //f
	              Selection = Type.Fire;
	              break;
	          case 71: //g
	              Selection = Type.Glitch;
	              break;
	          case 88: //g
	              Selection = Type.Nitro;
	              break;
	          case 90: //g
	              Selection = Type.Powder;
	              break;
	      }
	  }

	  function onKeyDown(event) {
	      var keyCode = event.keyCode;
	      console.log(keyCode);
	      KeyEvent(keyCode);
	  }

	  function ptc(x, y, type) {
	      if (Grid[x][y] != 0) return;
	      this.x = x;
	      this.y = y;
	      Grid[x][y] = this;
	      this.type = type;
	      this.SpawnType = type;
	      this.life = 100;
	      this.flamable = 0;
	      switch (type) {
	          case Type.Dust: //d
	              h = color += .2;
	              s = 360;
	              l = 50;
	              d = 20;
	              this.flamable = 1;
	              break;
	          case Type.Water: //d
	              h = 205;
	              s = 360;
	              l = 100;
	              d = 20;
	              break;
	          case Type.Brick: //d
	              h = 12;
	              s = 77;
	              l = 30;
	              d = 0;
	              break;
	          case Type.Tap: //d
	              h = 12;
	              s = 60;
	              l = 99;
	              d = 0;
	          case Type.Fire: //d
	              h = 10;
	              s = 360;
	              l = 99;
	              d = 40;
	              this.life = (Math.random() * 50) | 0;
	              break;
	          case Type.Glitch: //d
	              h = Math.random() * 360 | 0;
	              s = 100;
	              l = Math.random() * 100 | 0;
	              d = 0;
	              break;
	          case Type.Powder: //d
	              h = 50;
	              s = 10;
	              l = 20;
	              d = 35;
	              this.life = 1;
	              this.flamable = 6;
	              break;
	          case Type.Nitro: //d
	              h = 130;
	              s = 100;
	              l = 50;
	              d = 15;
	              this.life = 1;
	              this.flamable = 10;
	              break;
	      }
	      this.D = d;
	      this.color = husl.p.toRGB(Math.round(h), s, l);
	      particles.push(this);
	  };
	  ptc.prototype = {
	      remove: function() {
	          var i = particles.indexOf(this);
	          if (i > -1) particles.splice(i, 1);
	          Grid[this.x][this.y] = 0;
	      },
	      wind: function(dx, dy) {
	          dx = Math.round((.7 * dx) + Math.random() * this.D * PortField.getXVelocity(this.x, this.y));
	          dy = Math.round((.7 * dy) + Math.random() * this.D * PortField.getYVelocity(this.x, this.y));
	          if (dx != 0) dx = (dx / Math.abs(dx)) | 0;
	          if (dy != 0) dy = (dy / Math.abs(dy)) | 0;
	          return ([dx, dy]);
	      },
	      tick: function(dir) {
	          var dy = 0;
	          var dx = 0;
	          var delta = [0, 0];
	          switch (this.type) {
	              case Type.Dust: //d
	                  delta = this.wind(0, 1);
	                  break;
	              case Type.Water: //d
	                  tdx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
	                  delta = this.wind(tdx, 1);
	                  this.color = husl.p.toRGB(205, 360, Math.floor((Math.random() * 40) + 30));
	                  break;
	              case Type.Powder: //d
	                  delta = this.wind(0, 1);
	                  break;
	              case Type.Nitro: //d
	                  tdx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
	                  delta = this.wind(tdx, 1);
	                  break;
	              case Type.Brick: //d
	                  return;
	                  break;
	              case Type.Tap: //d
	                  this.Tap();
	                  return;
	                  break;
	              case Type.Glitch: //d
	                  this.Glitch();
	                  return;
	                  break;
	              case Type.Fire: //d
	                  tdx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
	                  delta = this.wind(0, 0);
	                  this.color = husl.p.toRGB(Math.floor(Math.random() * 20) + 10, 360, Math.floor((Math.random() * 40) + 40));
	                  this.Burn();
	                  this.life -= 1;
	                  if (this.life < 0) {
	                      this.remove();
	                      return
	                  }
	                  break;
	          }
	          dx = delta[0];
	          dy = delta[1];
	          if ((this.x + dx) < 0 || (this.x + dx) > 99 || this.y + dy < 0) {
	              this.remove();
	              return;
	          }
	          if ((this.y + dy) > 99) dy = 0;
	          if (this.Move(0, dy) && (this.type === Type.Water || this.type === Type.Fire) && Math.random() > .2) dx = 0; // water spread
	          if (!this.Move(dx, 0)) this.Move(-dx, 0); //fix this later
	          if (this.type === Type.Dust && (this.y + dy < 100) && (this.y + dy > 0) && Grid[this.x][this.y + dy].type === Type.Water) {
	              temp = Grid[this.x][this.y + dy];
	              Grid[this.x][this.y + dy] = this;
	              Grid[this.x][this.y] = temp;
	              temp.y -= dy;
	              this.y += dy;
	          }
	          if (this.type === Type.Water && (this.y + dy < 100) && (this.y + dy > 0) && Grid[this.x][this.y + dy].type === Type.Nitro) {
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
	          if (Grid[this.x + dx][this.y + dy] === 0) {
	              Grid[this.x + dx][this.y + dy] = this;
	              Grid[this.x][this.y] = 0;
	              this.x += dx;
	              this.y += dy;
	              return (1);
	          }
	          return (0);
	      },
	      Burn: function() {
	          for (var i = 0; i < 4; i++) {
	              if (0 > this.x + Adjacent[i][0] || this.x + Adjacent[i][0] > 99 || 0 > this.y + Adjacent[i][1] || this.y + Adjacent[i][1] > 99) continue;
	              adj = Grid[this.x + Adjacent[i][0]][this.y + Adjacent[i][1]];
	              if (adj != 0 && adj.flamable > 0) adj.life -= 3;
	              if (adj.life < 0) {
	                  PortField.setVelocity(adj.x, adj.y, (Math.random() - .5) * 5 * adj.flamable, (Math.random() - .5) * 5 * adj.flamable);
	                  if (adj.type === Type.Nitro) {
	                      adj.type = Type.Fire;
	                      adj.Burn();
	                  }
	                  adj.type = Type.Fire;
	                  adj.life = 40;
	                  // adj.Burn();
	              }
	              if (adj != 0 && adj.type === Type.Water) this.life -= 10;
	          }
	          PortField.setDensity(this.x, this.y, 60);
	          PortField.setVelocity(this.x, this.y, 0, -.2);
	      },
	      Glitch: function() {
	          if (Math.random() < .9) return;
	          if (this.y < 98 && Grid[this.x][this.y + 1] == 0) new ptc(this.x, this.y + 1, Selection);
	          else if (this.x < 98 && Grid[this.x + 1][this.y] === 0) new ptc(this.x + 1, this.y, Selection);
	          else if (this.x > 1 && Grid[this.x - 1][this.y] === 0) new ptc(this.x - 1, this.y, Selection);
	          else if (this.y > 1 && Grid[this.x][this.y - 1] === 0) new ptc(this.x, this.y - 1, Selection);
	      },
	      Tap: function() {
	          if (this.SpawnType === Type.Tap) {
	              for (var i = 0; i < 4; i++) {
	                  if (0 > this.x + Adjacent[i][0] || this.x + Adjacent[i][0] > 99 || 0 > this.y + Adjacent[i][1] || this.y + Adjacent[i][1] > 99) continue;
	                  adj = Grid[this.x + Adjacent[i][0]][this.y + Adjacent[i][1]];
	                  if (adj != 0 && adj.type != Type.Tap) this.SpawnType = adj.type;
	              }
	          } else {
	              if (Math.random() < .6) return;
	              if (this.y < 98 && Grid[this.x][this.y + 1] === 0) new ptc(this.x, this.y + 1, this.SpawnType);
	              else if (this.x < 98 && Grid[this.x + 1][this.y] === 0) new ptc(this.x + 1, this.y, this.SpawnType);
	              else if (this.x > 1 && Grid[this.x - 1][this.y] === 0) new ptc(this.x - 1, this.y, this.SpawnType);
	              else if (this.y > 1 && Grid[this.x][this.y - 1] === 0) new ptc(this.x, this.y - 1, this.SpawnType);
	          }
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
	          PortField = field;
	          context = canvas.getContext('2d');
	          context.save();
	          context.lineWidth = .1;
	          scale = 5
	          context.strokeStyle = "rgb(255,255,255)";
	          var vectorScale = 8;
	          context.beginPath();
	          // console.log(field.getXVelocity(50, 50) + field.getYVelocity(50, 50));
	          for (var x = 0; x < field.width(); x++) {
	              for (var y = 0; y < field.height(); y++) {
	                  if (Math.abs(field.getXVelocity(x, y) * field.getYVelocity(x, y)) > .003) {
	                      context.moveTo(x * scale + 0.5 * scale, y * scale + 0.5 * scale);
	                      context.lineTo((x + 0.5 + vectorScale * field.getXVelocity(x, y)) * scale, (y + 0.5 + vectorScale * field.getYVelocity(x, y)) * scale);
	                  }
	              }
	          }
	          context.stroke();
	          context.restore();
	      },
	      drawFrame: function() {
	          Cursor();
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
	  // return Dust;
	  // })();
	  var dust = new Dust('0', document.getElementById('display'));
	  dust.play();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// Generated by CoffeeScript 1.9.3
	(function() {
	  var L_to_Y, Y_to_L, conv, distanceFromPole, dotProduct, epsilon, fromLinear, getBounds, intersectLineLine, kappa, lengthOfRayUntilIntersect, m, m_inv, maxChromaForLH, maxSafeChromaForL, refU, refV, root, toLinear;

	  m = {
	    R: [3.2409699419045214, -1.5373831775700935, -0.49861076029300328],
	    G: [-0.96924363628087983, 1.8759675015077207, 0.041555057407175613],
	    B: [0.055630079696993609, -0.20397695888897657, 1.0569715142428786]
	  };

	  m_inv = {
	    X: [0.41239079926595948, 0.35758433938387796, 0.18048078840183429],
	    Y: [0.21263900587151036, 0.71516867876775593, 0.072192315360733715],
	    Z: [0.019330818715591851, 0.11919477979462599, 0.95053215224966058]
	  };

	  refU = 0.19783000664283681;

	  refV = 0.468319994938791;

	  kappa = 903.2962962962963;

	  epsilon = 0.0088564516790356308;

	  getBounds = function(L) {
	    var bottom, channel, j, k, len1, len2, m1, m2, m3, ref, ref1, ref2, ret, sub1, sub2, t, top1, top2;
	    sub1 = Math.pow(L + 16, 3) / 1560896;
	    sub2 = sub1 > epsilon ? sub1 : L / kappa;
	    ret = [];
	    ref = ['R', 'G', 'B'];
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      channel = ref[j];
	      ref1 = m[channel], m1 = ref1[0], m2 = ref1[1], m3 = ref1[2];
	      ref2 = [0, 1];
	      for (k = 0, len2 = ref2.length; k < len2; k++) {
	        t = ref2[k];
	        top1 = (284517 * m1 - 94839 * m3) * sub2;
	        top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
	        bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
	        ret.push([top1 / bottom, top2 / bottom]);
	      }
	    }
	    return ret;
	  };

	  intersectLineLine = function(line1, line2) {
	    return (line1[1] - line2[1]) / (line2[0] - line1[0]);
	  };

	  distanceFromPole = function(point) {
	    return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
	  };

	  lengthOfRayUntilIntersect = function(theta, line) {
	    var b1, len, m1;
	    m1 = line[0], b1 = line[1];
	    len = b1 / (Math.sin(theta) - m1 * Math.cos(theta));
	    if (len < 0) {
	      return null;
	    }
	    return len;
	  };

	  maxSafeChromaForL = function(L) {
	    var b1, j, len1, lengths, m1, ref, ref1, x;
	    lengths = [];
	    ref = getBounds(L);
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      ref1 = ref[j], m1 = ref1[0], b1 = ref1[1];
	      x = intersectLineLine([m1, b1], [-1 / m1, 0]);
	      lengths.push(distanceFromPole([x, b1 + x * m1]));
	    }
	    return Math.min.apply(Math, lengths);
	  };

	  maxChromaForLH = function(L, H) {
	    var hrad, j, l, len1, lengths, line, ref;
	    hrad = H / 360 * Math.PI * 2;
	    lengths = [];
	    ref = getBounds(L);
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      line = ref[j];
	      l = lengthOfRayUntilIntersect(hrad, line);
	      if (l !== null) {
	        lengths.push(l);
	      }
	    }
	    return Math.min.apply(Math, lengths);
	  };

	  dotProduct = function(a, b) {
	    var i, j, ref, ret;
	    ret = 0;
	    for (i = j = 0, ref = a.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	      ret += a[i] * b[i];
	    }
	    return ret;
	  };

	  fromLinear = function(c) {
	    if (c <= 0.0031308) {
	      return 12.92 * c;
	    } else {
	      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
	    }
	  };

	  toLinear = function(c) {
	    var a;
	    a = 0.055;
	    if (c > 0.04045) {
	      return Math.pow((c + a) / (1 + a), 2.4);
	    } else {
	      return c / 12.92;
	    }
	  };

	  conv = {
	    'xyz': {},
	    'luv': {},
	    'lch': {},
	    'husl': {},
	    'huslp': {},
	    'rgb': {},
	    'hex': {}
	  };

	  conv.xyz.rgb = function(tuple) {
	    var B, G, R;
	    R = fromLinear(dotProduct(m.R, tuple));
	    G = fromLinear(dotProduct(m.G, tuple));
	    B = fromLinear(dotProduct(m.B, tuple));
	    return [R, G, B];
	  };

	  conv.rgb.xyz = function(tuple) {
	    var B, G, R, X, Y, Z, rgbl;
	    R = tuple[0], G = tuple[1], B = tuple[2];
	    rgbl = [toLinear(R), toLinear(G), toLinear(B)];
	    X = dotProduct(m_inv.X, rgbl);
	    Y = dotProduct(m_inv.Y, rgbl);
	    Z = dotProduct(m_inv.Z, rgbl);
	    return [X, Y, Z];
	  };

	  Y_to_L = function(Y) {
	    if (Y <= epsilon) {
	      return Y * kappa;
	    } else {
	      return 116 * Math.pow(Y, 1 / 3) - 16;
	    }
	  };

	  L_to_Y = function(L) {
	    if (L <= 8) {
	      return L / kappa;
	    } else {
	      return Math.pow((L + 16) / 116, 3);
	    }
	  };

	  conv.xyz.luv = function(tuple) {
	    var L, U, V, X, Y, Z, varU, varV;
	    X = tuple[0], Y = tuple[1], Z = tuple[2];
	    if (Y === 0) {
	      return [0, 0, 0];
	    }
	    L = Y_to_L(Y);
	    varU = (4 * X) / (X + (15 * Y) + (3 * Z));
	    varV = (9 * Y) / (X + (15 * Y) + (3 * Z));
	    U = 13 * L * (varU - refU);
	    V = 13 * L * (varV - refV);
	    return [L, U, V];
	  };

	  conv.luv.xyz = function(tuple) {
	    var L, U, V, X, Y, Z, varU, varV;
	    L = tuple[0], U = tuple[1], V = tuple[2];
	    if (L === 0) {
	      return [0, 0, 0];
	    }
	    varU = U / (13 * L) + refU;
	    varV = V / (13 * L) + refV;
	    Y = L_to_Y(L);
	    X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV);
	    Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV);
	    return [X, Y, Z];
	  };

	  conv.luv.lch = function(tuple) {
	    var C, H, Hrad, L, U, V;
	    L = tuple[0], U = tuple[1], V = tuple[2];
	    C = Math.sqrt(Math.pow(U, 2) + Math.pow(V, 2));
	    if (C < 0.00000001) {
	      H = 0;
	    } else {
	      Hrad = Math.atan2(V, U);
	      H = Hrad * 360 / 2 / Math.PI;
	      if (H < 0) {
	        H = 360 + H;
	      }
	    }
	    return [L, C, H];
	  };

	  conv.lch.luv = function(tuple) {
	    var C, H, Hrad, L, U, V;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    Hrad = H / 360 * 2 * Math.PI;
	    U = Math.cos(Hrad) * C;
	    V = Math.sin(Hrad) * C;
	    return [L, U, V];
	  };

	  conv.husl.lch = function(tuple) {
	    var C, H, L, S, max;
	    H = tuple[0], S = tuple[1], L = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      C = 0;
	    } else {
	      max = maxChromaForLH(L, H);
	      C = max / 100 * S;
	    }
	    return [L, C, H];
	  };

	  conv.lch.husl = function(tuple) {
	    var C, H, L, S, max;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      S = 0;
	    } else {
	      max = maxChromaForLH(L, H);
	      S = C / max * 100;
	    }
	    return [H, S, L];
	  };

	  conv.huslp.lch = function(tuple) {
	    var C, H, L, S, max;
	    H = tuple[0], S = tuple[1], L = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      C = 0;
	    } else {
	      max = maxSafeChromaForL(L);
	      C = max / 100 * S;
	    }
	    return [L, C, H];
	  };

	  conv.lch.huslp = function(tuple) {
	    var C, H, L, S, max;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      S = 0;
	    } else {
	      max = maxSafeChromaForL(L);
	      S = C / max * 100;
	    }
	    return [H, S, L];
	  };

	  conv.rgb.hex = function(tuple) {
	    var ch, hex, j, len1;
	    hex = "#";
	    for (j = 0, len1 = tuple.length; j < len1; j++) {
	      ch = tuple[j];
	      ch = Math.round(ch * 1e6) / 1e6;
	      if (ch < 0 || ch > 1) {
	        throw new Error("Illegal rgb value: " + ch);
	      }
	      ch = Math.round(ch * 255).toString(16);
	      if (ch.length === 1) {
	        ch = "0" + ch;
	      }
	      hex += ch;
	    }
	    return hex;
	  };

	  conv.hex.rgb = function(hex) {
	    var b, g, j, len1, n, r, ref, results;
	    if (hex.charAt(0) === "#") {
	      hex = hex.substring(1, 7);
	    }
	    r = hex.substring(0, 2);
	    g = hex.substring(2, 4);
	    b = hex.substring(4, 6);
	    ref = [r, g, b];
	    results = [];
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      n = ref[j];
	      results.push(parseInt(n, 16) / 255);
	    }
	    return results;
	  };

	  conv.lch.rgb = function(tuple) {
	    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(tuple)));
	  };

	  conv.rgb.lch = function(tuple) {
	    return conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(tuple)));
	  };

	  conv.husl.rgb = function(tuple) {
	    return conv.lch.rgb(conv.husl.lch(tuple));
	  };

	  conv.rgb.husl = function(tuple) {
	    return conv.lch.husl(conv.rgb.lch(tuple));
	  };

	  conv.huslp.rgb = function(tuple) {
	    return conv.lch.rgb(conv.huslp.lch(tuple));
	  };

	  conv.rgb.huslp = function(tuple) {
	    return conv.lch.huslp(conv.rgb.lch(tuple));
	  };

	  root = {};

	  root.fromRGB = function(R, G, B) {
	    return conv.rgb.husl([R, G, B]);
	  };

	  root.fromHex = function(hex) {
	    return conv.rgb.husl(conv.hex.rgb(hex));
	  };

	  root.toRGB = function(H, S, L) {
	    return conv.husl.rgb([H, S, L]);
	  };

	  root.toHex = function(H, S, L) {
	    return conv.rgb.hex(conv.husl.rgb([H, S, L]));
	  };

	  root.p = {};

	  root.p.toRGB = function(H, S, L) {
	    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L]))));
	  };

	  root.p.toHex = function(H, S, L) {
	    return conv.rgb.hex(conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L])))));
	  };

	  root.p.fromRGB = function(R, G, B) {
	    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz([R, G, B]))));
	  };

	  root.p.fromHex = function(hex) {
	    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(conv.hex.rgb(hex)))));
	  };

	  root._conv = conv;

	  root._getBounds = getBounds;

	  root._maxChromaForLH = maxChromaForLH;

	  root._maxSafeChromaForL = maxSafeChromaForL;

	  if (!((typeof module !== "undefined" && module !== null) || (typeof jQuery !== "undefined" && jQuery !== null) || (typeof requirejs !== "undefined" && requirejs !== null))) {
	    this.HUSL = root;
	  }

	  if (typeof module !== "undefined" && module !== null) {
	    module.exports = root;
	  }

	  if (typeof jQuery !== "undefined" && jQuery !== null) {
	    jQuery.husl = root;
	  }

	  if ((typeof requirejs !== "undefined" && requirejs !== null) && ("function" !== "undefined" && __webpack_require__(3) !== null)) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (root), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 5 */
/***/ function(module, exports) {

	// Based on http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
	/**
	 * Copyright (c) 2009 Oliver Hunt <http://nerget.com>
	 * 
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 * 
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	module.exports = function FluidField(canvas) {
	    function addFields(x, s, dt)
	    {
	        for (var i=0; i<size ; i++ ) x[i] += dt*s[i];
	    }

	    function set_bnd(b, x)
	    {
	        if (b===1) {
	            for (var i = 1; i <= width; i++) {
	                x[i] =  x[i + rowSize];
	                x[i + (height+1) *rowSize] = x[i + height * rowSize];
	            }

	            for (var j = 1; i <= height; i++) {
	                x[j * rowSize] = -x[1 + j * rowSize];
	                x[(width + 1) + j * rowSize] = -x[width + j * rowSize];
	            }
	        } else if (b === 2) {
	            for (var i = 1; i <= width; i++) {
	                x[i] = -x[i + rowSize];
	                x[i + (height + 1) * rowSize] = -x[i + height * rowSize];
	            }

	            for (var j = 1; j <= height; j++) {
	                x[j * rowSize] =  x[1 + j * rowSize];
	                x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
	            }
	        } else {
	            for (var i = 1; i <= width; i++) {
	                x[i] =  x[i + rowSize];
	                x[i + (height + 1) * rowSize] = x[i + height * rowSize];
	            }

	            for (var j = 1; j <= height; j++) {
	                x[j * rowSize] =  x[1 + j * rowSize];
	                x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
	            }
	        }
	        var maxEdge = (height + 1) * rowSize;
	        x[0]                 = 0.5 * (x[1] + x[rowSize]);
	        x[maxEdge]           = 0.5 * (x[1 + maxEdge] + x[height * rowSize]);
	        x[(width+1)]         = 0.5 * (x[width] + x[(width + 1) + rowSize]);
	        x[(width+1)+maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);
	    }

	    function lin_solve(b, x, x0, a, c)
	    {
	        if (a === 0 && c === 1) {
	            for (var j=1 ; j<=height; j++) {
	                var currentRow = j * rowSize;
	                ++currentRow;
	                for (var i = 0; i < width; i++) {
	                    x[currentRow] = x0[currentRow];
	                    ++currentRow;
	                }
	            }
	            set_bnd(b, x);
	        } else {
	            var invC = 1 / c;
	            for (var k=0 ; k<iterations; k++) {
	                for (var j=1 ; j<=height; j++) {
	                    var lastRow = (j - 1) * rowSize;
	                    var currentRow = j * rowSize;
	                    var nextRow = (j + 1) * rowSize;
	                    var lastX = x[currentRow];
	                    ++currentRow;
	                    for (var i=1; i<=width; i++)
	                        lastX = x[currentRow] = (x0[currentRow] + a*(lastX+x[++currentRow]+x[++lastRow]+x[++nextRow])) * invC;
	                }
	                set_bnd(b, x);
	            }
	        }
	    }
	    
	    function diffuse(b, x, x0, dt)
	    {
	        var a = 0;
	        lin_solve(b, x, x0, a, 1 + 4*a);
	    }
	    
	    function lin_solve2(x, x0, y, y0, a, c)
	    {
	        if (a === 0 && c === 1) {
	            for (var j=1 ; j <= height; j++) {
	                var currentRow = j * rowSize;
	                ++currentRow;
	                for (var i = 0; i < width; i++) {
	                    x[currentRow] = x0[currentRow];
	                    y[currentRow] = y0[currentRow];
	                    ++currentRow;
	                }
	            }
	            set_bnd(1, x);
	            set_bnd(2, y);
	        } else {
	            var invC = 1/c;
	            for (var k=0 ; k<iterations; k++) {
	                for (var j=1 ; j <= height; j++) {
	                    var lastRow = (j - 1) * rowSize;
	                    var currentRow = j * rowSize;
	                    var nextRow = (j + 1) * rowSize;
	                    var lastX = x[currentRow];
	                    var lastY = y[currentRow];
	                    ++currentRow;
	                    for (var i = 1; i <= width; i++) {
	                        lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
	                        lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
	                    }
	                }
	                set_bnd(1, x);
	                set_bnd(2, y);
	            }
	        }
	    }
	    
	    function diffuse2(x, x0, y, y0, dt)
	    {
	        var a = 0;
	        lin_solve2(x, x0, y, y0, a, 1 + 4 * a);
	    }
	    
	    function advect(b, d, d0, u, v, dt)
	    {
	        var Wdt0 = dt * width;
	        var Hdt0 = dt * height;
	        var Wp5 = width + 0.5;
	        var Hp5 = height + 0.5;
	        for (var j = 1; j<= height; j++) {
	            var pos = j * rowSize;
	            for (var i = 1; i <= width; i++) {
	                var x = i - Wdt0 * u[++pos]; 
	                var y = j - Hdt0 * v[pos];
	                if (x < 0.5)
	                    x = 0.5;
	                else if (x > Wp5)
	                    x = Wp5;
	                var i0 = x | 0;
	                var i1 = i0 + 1;
	                if (y < 0.5)
	                    y = 0.5;
	                else if (y > Hp5)
	                    y = Hp5;
	                var j0 = y | 0;
	                var j1 = j0 + 1;
	                var s1 = x - i0;
	                var s0 = 1 - s1;
	                var t1 = y - j0;
	                var t0 = 1 - t1;
	                var row1 = j0 * rowSize;
	                var row2 = j1 * rowSize;
	                d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
	            }
	        }
	        set_bnd(b, d);
	    }
	    
	    function project(u, v, p, div)
	    {
	        var h = -0.5 / Math.sqrt(width * height);
	        for (var j = 1 ; j <= height; j++ ) {
	            var row = j * rowSize;
	            var previousRow = (j - 1) * rowSize;
	            var prevValue = row - 1;
	            var currentRow = row;
	            var nextValue = row + 1;
	            var nextRow = (j + 1) * rowSize;
	            for (var i = 1; i <= width; i++ ) {
	                div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++previousRow]);
	                p[currentRow] = 0;
	            }
	        }
	        set_bnd(0, div);
	        set_bnd(0, p);
	        
	        lin_solve(0, p, div, 1, 4 );
	        var wScale = 0.5 * width;
	        var hScale = 0.5 * height;
	        for (var j = 1; j<= height; j++ ) {
	            var prevPos = j * rowSize - 1;
	            var currentPos = j * rowSize;
	            var nextPos = j * rowSize + 1;
	            var prevRow = (j - 1) * rowSize;
	            var currentRow = j * rowSize;
	            var nextRow = (j + 1) * rowSize;

	            for (var i = 1; i<= width; i++) {
	                u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
	                v[currentPos]   -= hScale * (p[++nextRow] - p[++prevRow]);
	            }
	        }
	        set_bnd(1, u);
	        set_bnd(2, v);
	    }
	    
	    function dens_step(x, x0, u, v, dt)
	    {
	        addFields(x, x0, dt);
	        diffuse(0, x0, x, dt );
	        advect(0, x, x0, u, v, dt );
	    }
	    
	    function vel_step(u, v, u0, v0, dt)
	    {
	        addFields(u, u0, dt );
	        addFields(v, v0, dt );
	        var temp = u0; u0 = u; u = temp;
	        var temp = v0; v0 = v; v = temp;
	        diffuse2(u,u0,v,v0, dt);
	        project(u, v, u0, v0);
	        var temp = u0; u0 = u; u = temp; 
	        var temp = v0; v0 = v; v = temp;
	        advect(1, u, u0, u0, v0, dt);
	        advect(2, v, v0, u0, v0, dt);
	        project(u, v, u0, v0 );
	    }
	    var uiCallback = function(d,u,v) {};

	    function Field(dens, u, v) {
	        // Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
	        // but makes the code ugly.
	        this.setDensity = function(x, y, d) {
	             dens[(x + 1) + (y + 1) * rowSize] = d;
	        }
	        this.getDensity = function(x, y) {
	             return dens[(x + 1) + (y + 1) * rowSize];
	        }
	        this.setVelocity = function(x, y, xv, yv) {
	             u[(x + 1) + (y + 1) * rowSize] = xv;
	             v[(x + 1) + (y + 1) * rowSize] = yv;
	        }
	        this.getXVelocity = function(x, y) {
	             return u[(x + 1) + (y + 1) * rowSize];
	        }
	        this.getYVelocity = function(x, y) {
	             return v[(x + 1) + (y + 1) * rowSize];
	        }
	        this.width = function() { return width; }
	        this.height = function() { return height; }
	    }
	    function queryUI(d, u, v)
	    {
	        for (var i = 0; i < size; i++)
	            u[i] = v[i] = d[i] = 0.0;
	        uiCallback(new Field(d, u, v));
	    }

	    this.update = function () {
	        queryUI(dens_prev, u_prev, v_prev);
	        vel_step(u, v, u_prev, v_prev, dt);
	        dens_step(dens, dens_prev, u, v, dt);
	        displayFunc(new Field(dens, u, v));
	    }
	    this.setDisplayFunction = function(func) {
	        displayFunc = func;
	    }
	    
	    this.iterations = function() { return iterations; }
	    this.setIterations = function(iters) {
	        if (iters > 0 && iters <= 100)
	           iterations = iters;
	    }
	    this.setUICallback = function(callback) {
	        uiCallback = callback;
	    }
	    var iterations = 15;
	    var visc = 0.8;
	    var dt = 0.1;
	    var dens;
	    var dens_prev;
	    var u;
	    var u_prev;
	    var v;
	    var v_prev;
	    var width;
	    var height;
	    var rowSize;
	    var size;
	    var displayFunc;
	    function reset()
	    {
	        rowSize = width + 2;
	        size = (width+2)*(height+2);
	        dens = new Array(size);
	        dens_prev = new Array(size);
	        u = new Array(size);
	        u_prev = new Array(size);
	        v = new Array(size);
	        v_prev = new Array(size);
	        for (var i = 0; i < size; i++)
	            dens_prev[i] = u_prev[i] = v_prev[i] = dens[i] = u[i] = v[i] = 0;
	    }
	    this.reset = reset;
	    this.setResolution = function (hRes, wRes)
	    {
	        var res = wRes * hRes;
	        if (res > 0 && res < 1000000 && (wRes != width || hRes != height)) {
	            width = wRes;
	            height = hRes;
	            reset();
	            return true;
	        }
	        return false;
	    }
	    this.setResolution(100, 100);
	}



/***/ }
/******/ ]);