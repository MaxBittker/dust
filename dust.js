var husl = require('husl');
var _ = require('underscore');
var FluidField = require('./pressure.js');

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
    Nitro: "Nitro",
    Dirt: "Dirt",
    Seed: "Seed",
    Plant: "Plant",
    Lava: "Lava"

};

var width = 100;
var height = 100;
var interval = 1000 / (30 /* fps */ );
var frame = 1;

var color = 0;

var Selection = Type.Dust;
var MouseX = 0;
var MouseY = 0;
var cursorSize = 2;
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
// sources.push([250, 250]);
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
            field.setVelocity(x, y, dx * cursorSize, dy * cursorSize);
            field.setDensity(x, y, cursorSize * 20);
        }
        omx = mx;
        omy = my;
    }
    // for (var i = 0; i < sources.length; i++) {
    // var x = ((sources[i][0] / displaySize) * field.width()) | 0;
    // var y = ((sources[i][1] / displaySize) * field.height()) | 0;
    // field.setDensity(x, y, 30);
    // }
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
        for (var sx = -cursorSize + 1; sx < cursorSize; sx++) {
            for (var sy = -cursorSize + 1; sy < cursorSize; sy++) {
                if ((sx * sx + sy * sy) < .4 * (cursorSize * cursorSize))
                    touchLoc({
                        x: MouseX + sx,
                        y: MouseY + sy
                    })
            }
        }
    }
}

function touchLoc(loc) {
    if (!inBounds(loc))
        return
    var point = Grid[loc.x][loc.y]
    if (Selection === Type.Erase) {
        if (point != 0) point.remove();
    } else if (point === 0) new ptc(loc.x, loc.y, Selection);
}
window.addEventListener("keydown", onKeyDown, false);

function inBounds(loc) {
    if (loc.x >= width || loc.x < 0)
        return false
    if (loc.y >= height || loc.y < 0)
        return false
    return true
}

function KeyEvent(keyCode) {
    // console.log(keyCode)
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
        case 68: //d
            Selection = Type.Dirt;
            break;
        case 83: //s
            Selection = Type.Seed;
            break;
        case 67: //c
            Selection = Type.Lava;
            break;
        case 49: //1
            if (cursorSize > 1)
                cursorSize--
                break;
        case 50: //2
            cursorSize++
            break;
    }
}

function onKeyDown(event) {
    var keyCode = event.keyCode;
    // xconsole.log(keyCode);
    KeyEvent(keyCode);
}

function ptc(x, y, type) {
    if (Grid[x][y] != 0) return;
    this.x = x;
    this.y = y;
    this.dx = 0
    this.dy = 0
    this.friction = .8
        // this.inertia = 1
        //velocity and inertia will go here
    Grid[x][y] = this;
    this.type = type;
    this.SpawnType = type;
    this.life = 100;
    this.flamable = 0;
    this.hue = null
    this.moisture = 0
    this.sinks = false;

    switch (type) {
        case Type.Dust:
            this.hue = color += .2;
            h = this.hue
            s = 360;
            l = 50;
            d = 20;
            this.flamable = 1;
            this.sinks = true;
            break;
        case Type.Dirt:
            h = 35;
            s = 150;
            l = 46;
            d = 10;
            this.sinks = true;
            break;
        case Type.Seed:
            h = 150;
            s = 130;
            l = 60;
            d = 20;
            this.flamable = 2;
            break;
        case Type.Plant:
            h = 150;
            s = 100;
            l = 30;
            d = 20;
            this.life = 15;
            this.flamable = 1;
            break;
        case Type.Water:
            h = 205;
            s = 360;
            l = 100;
            d = 20;
            this.moisture = 1
            break;
        case Type.Lava:
            h = 10;
            s = 360;
            l = 30;
            d = 10;
            this.life = 50;
            break;
        case Type.Brick:
            h = 12;
            s = 77;
            l = 30;
            d = 0;
            break;
        case Type.Tap:
            h = 12;
            s = 60;
            l = 99;
            d = 0;
        case Type.Fire:
            h = 10;
            s = 360;
            l = 99;
            d = 40;
            this.life = (Math.random() * 50) | 0;
            break;
        case Type.Glitch:
            h = Math.random() * 360 | 0;
            s = 100;
            l = 30 + Math.random() * 30 | 0;
            d = 0;
            break;
        case Type.Powder:
            h = 50;
            s = 10;
            l = 20;
            d = 35;
            this.sinks = true;
            this.life = 1;
            this.flamable = 8;
            break;
        case Type.Nitro:
            h = 130;
            s = 100;
            l = 50;
            d = 15;
            this.life = 1;
            this.flamable = 12;
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
        var d = this.D
        if (this.type === Type.Dirt)
            d /= (.1 + this.moisture)
        dx = Math.round((.7 * dx) + Math.random() * d * PortField.getXVelocity(this.x, this.y));
        dy = Math.round((.7 * dy) + Math.random() * d * PortField.getYVelocity(this.x, this.y));
        // if (dx != 0) dx = (dx / Math.abs(dx)) | 0;
        // if (dy != 0) dy = (dy / Math.abs(dy)) | 0;
        return ([dx, dy]);
    },
    tick: function(dir) {
        var accel = [0, 0];
        switch (this.type) {
            case Type.Dust:
                accel = this.wind(0, 1);
                this.hue += 1
                this.color = husl.p.toRGB(this.hue, 360, 50);
                break;
            case Type.Dirt:
                // console.log(this.moisture)
                // this.moisture *= .9995 rying up
                this.color = husl.p.toRGB(35, 150, 45 - Math.round(20 * this.moisture));
                accel = this.wind(0, 1);
                break;
            case Type.Seed:
                accel = this.wind(0, 1);
                if (Grid[this.x][this.y + 1] && Grid[this.x][this.y + 1].type == Type.Dirt && Grid[this.x][this.y + 1].moisture > .5) {
                    this.Transform(Type.Plant)
                    return
                }

                break;
            case Type.Plant:
                this.Grow();
                return;
                break;
            case Type.Water:
                tdx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
                accel = this.wind(tdx, 1);
                this.color = husl.p.toRGB(205, 360, Math.floor((Math.random() * 20) + 30));
                break;
            case Type.Lava:
                tdx = Math.round(-.6 + Math.random() * 1.2); //(Math.random() > .5 ? -1 : 1);
                accel = this.wind(tdx, 1);
                this.color = husl.p.toRGB((Math.random() * 30) + 4 | 0, 340, Math.floor((Math.random() * 15) + this.life));
                this.Burn(.2);
                this.life *= .9995
                if (this.life < 0.1) {
                    this.Transform(Type.Brick)
                    return
                }


                break;
            case Type.Powder:
                accel = this.wind(0, 1);
                break;
            case Type.Nitro:
                tdx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
                accel = this.wind(tdx, 1);
                break;
            case Type.Brick:
                return;
                break;
            case Type.Tap:
                this.Tap();
                return;
                break;
            case Type.Glitch:
                this.Glitch();
                return;
                break;
            case Type.Fire:
                tdx = Math.floor(-1 + Math.random() * 3); //(Math.random() > .5 ? -1 : 1);
                accel = this.wind(0, 0);
                this.color = husl.p.toRGB(Math.floor(Math.random() * 20) + 10, 360, Math.floor((Math.random() * 40) + 40));
                this.Burn(1);
                this.life -= 1;
                if (this.life < 0) {
                    this.remove();
                    return
                }
                break;
        }

        this.dx *= this.friction
        this.dy *= this.friction

        this.dx += accel[0];
        this.dy += accel[1];

        this.dx = Math.min(this.dx, 5)
        this.dy = Math.min(this.dy, 5)

        var dx = 0
        var dy = 0

        if (this.dx >= 1)
            dx = 1
        else if (this.dx <= -1)
            dx = -1

        if (this.dy >= 1)
            dy = 1
        else if (this.dy <= -1)
            dy = -1

        if (dx > 1) dx = 1
        if ((this.x + dx) < 0 || (this.x + dx) > 99 || this.y + dy < 0) {
            this.remove();
            return;
        }
        if ((this.y + dy) > 99) dy = 0;
        if (this.Move(0, dy) && (this.type === Type.Water || this.type === Type.Fire) && Math.random() > .2) dx = 0; // water spread
        if (!this.Move(dx, 0)) this.Move(-dx, 0); //fix this later

        if (this.type === Type.Water) {
            _.every(this.ReturnAdjacent({
                x: this.x,
                y: this.y
            }), (point) => {
                if (point.type === Type.Dirt && point.moisture < 1) {
                    var space = 1 - point.moisture
                    var change = Math.min(space, this.moisture)
                    point.moisture += change
                    this.moisture -= change
                    if (this.moisture < .01) {
                        this.remove()
                        return false
                    }
                }
                return true
            })
        }
        if (this.type === Type.Dirt && this.moisture > .2) {
            _.each(this.ReturnAdjacent({
                x: this.x,
                y: this.y
            }), (point) => {
                if (point.type === Type.Dirt && point.moisture < this.moisture) {
                    var halfdiff = (this.moisture - point.moisture) / 4
                    point.moisture += halfdiff
                    this.moisture -= halfdiff
                        // return false
                }
                return true
            })
        }
        if (this.type === Type.Lava) {
            _.each(this.ReturnAdjacent({
                x: this.x,
                y: this.y
            }), (point) => {
                if (point.type === Type.Lava && point.life < this.life) {
                    var halfdiff = (this.life - point.life) / 2
                    point.life += halfdiff
                    this.life -= halfdiff
                        // return false
                }
                return true
            })
        }
        if (this.sinks && (this.y + dy < 100) && (this.y + dy > 0) && Grid[this.x][this.y + dy].type === Type.Water) {
            this.Swap(dx, dy)
        }
        if (this.type === Type.Water && (this.y + dy < 100) && (this.y + dy > 0) && Grid[this.x][this.y + dy].type === Type.Nitro) {
            this.Swap(dx, dy)
        }
        return;
    },
    Swap: function(dx, dy) {
        temp = Grid[this.x][this.y + dy];
        Grid[this.x][this.y + dy] = this;
        Grid[this.x][this.y] = temp;
        temp.y -= dy;
        this.y += dy;
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

    ReturnAdjacent: function(point) {
        var AdjSet = []
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (!(dx == 0 && dy == 0)) {
                    var nPoint = {
                        x: point.x + dx,
                        y: point.y + dy
                    }
                    if (Grid[nPoint.x] !== undefined && Grid[nPoint.x][nPoint.y] !== undefined && Grid[nPoint.x][nPoint.y] !== 0)
                        AdjSet.push(Grid[nPoint.x][nPoint.y])
                }
            }
        }
        return AdjSet
    },
    Transform: function(type) {
        var x = this.x
        var y = this.y
        this.remove()
        Grid[x][y] = new ptc(x, y, type)
    },
    Burn: function(str) {
        for (var i = 0; i < 4; i++) {
            if (0 > this.x + Adjacent[i][0] || this.x + Adjacent[i][0] > 99 || 0 > this.y + Adjacent[i][1] || this.y + Adjacent[i][1] > 99) continue;
            adj = Grid[this.x + Adjacent[i][0]][this.y + Adjacent[i][1]];
            if (adj != 0 && adj.flamable > 0) adj.life -= 3;
            if (adj.life < 0) {
                PortField.setVelocity(adj.x, adj.y, (Math.random() - .5) * 5 * adj.flamable, (Math.random() - .5) * 5 * adj.flamable);
                if (adj.type === Type.Nitro) {
                    adj.type = Type.Fire;
                    adj.Burn(2);
                }
                adj.type = Type.Fire;
                adj.life = 40;
                // adj.Burn();
            }
            if (adj != 0 && adj.type === Type.Water) {
                this.life -= 5;
                if (this.type === Type.Lava)
                    adj.remove()
            }
        }
        PortField.setDensity(this.x, this.y, str * 60);
        PortField.setVelocity(this.x, this.y, 0, str * -.2);
    },
    Grow: function() {
        if ((Math.random() < .01) && this.y > 1 && Grid[this.x][this.y - 1] === 0) new ptc(this.x, this.y - 1, Type.Plant);
        if (Math.random() < .003 && this.x > 1 && Grid[this.x - 1][this.y] === 0) new ptc(this.x - 1, this.y, Type.Plant);
        if (Math.random() < .003 && this.x < 98 && Grid[this.x + 1][this.y] === 0) new ptc(this.x + 1, this.y, Type.Plant);

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
    for (var x = 0; x < 100; x++) {
        // for (var y = 0; y < 100; y++) { 
        new ptc(x, x, Type.Dust); // Math.random() * 360, 360, 50)
        // }
    }
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
        this.context.fillStyle = husl.p.toHex(40, 60, 2); ////t'#0010'+offset.toString(16);
        this.context.fillRect(0, 0, 500, 500);

        this.context.font = "20px courier"
        this.context.fillStyle = husl.p.toHex(40, 60, 90); ////t'#0010'+offset.toString(16);
        this.context.fillText(Selection.toString() + ":" + cursorSize, 10, 20)
        this.context.fill();

        updatePressure();
        this.imageData = this.context.getImageData(0, 0, 500, 500);
        for (var i = 0; i < particles.length; i++) {
            particles[i].tick();
            if (particles[i]) this.drawParticle(particles[i]);
        }
        this.context.putImageData(this.imageData, 0, 0);

        document.getElementById('SelectionDisplay').innerHTML = 'Selection: ' + Selection + ' Size: ' + cursorSize + '   ------------- Particles: ' + particles.length;
    }
};
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 0);
};

var dust = new Dust('0', document.getElementById('display'));
dust.play();
