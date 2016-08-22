var sr;
var turing = new Turing2D();

var initial = new Tape();

var paused = true;
var interval = 200;
var hyper = false;

var focused = false;
var edit = true;
var pan = false;
var paint = false;
var paintColor;

var cursor = new Vector2(0,0);
var cameraTarget = new Vector2(0,0);
var scaleTarget = 1;

var scale = 1;

var autopan = true;

var steps = 0;

var turingloop;
var renderloop;
var continuous = true;

var dark = true;
var hideText = false;

var firstRun = true;

function init() {
    var canvas = document.getElementById('turingCanvas');

    sr = new ShapeRenderer(canvas);


    mouse.onmousedown = onmousedown;
    mouse.onmousemove = onmousemove;
    mouse.onmouseup = onmouseup;
    mouse.onpan = onpan;

    // first frame
    resize();
}

function drawhead() {
    var color;
    var tile = turing.read();
    if(tile.color) color = tile.dark ? Color.White : Color.Black;
    else color = dark ? Color.White : Color.Black;
    sr.drawarc(turing.head.x + .5, turing.head.y + .5, .5, 0, Math.PI * 2, false, color);
}

function drawcursor() {  
    sr.drawrect(new Rect(cursor.x, cursor.y, 1, 1), Color.Red);
}

function update() {   
    sr.camera.lerp(cameraTarget, .1);
    sr.setScale(sr.scale * .9 + scaleTarget * .1);
    draw(true);
}

function draw(force) {
    if(typeof force === 'undefined') force = false;

    if(!force && continuous) return;

    sr.clear();
    
    for(key in turing.tape.data.data) {
        var value = turing.tape.data.data[key];
        if(value != null) {
            if(value.color)
                sr.fillrect(new Rect(value.position.x, value.position.y, 1, 1), value.color);
            if(!hideText)
                sr.drawtext(value.value || ' ', value.position, 1, (value.color ? value.dark : dark) ? Color.White : Color.Black);
        }
    }

    drawhead();
    if(edit && !paint) drawcursor();
}

function setCameraTarget(point, immediate) {
    if(typeof immediate === 'undefined') immediate = false;

    if(point) cameraTarget = point.cpy();
    if(!continuous || immediate) sr.camera = cameraTarget.cpy(); 
}

function setScaleTarget(value) {
    scaleTarget = value;
    if(!continuous) sr.setScale(scaleTarget);
}

var offsetstart;
var panned = false;
function onmousedown(pos) {
    offsetstart = cameraTarget;

    focused = false;
    panned = false;
    setTimeout(function () {
        focused = $('#turingCanvas').is(':focus');
        if(edit && focused) {
            cursor = sr.unproject(pos);
            if(paint) {
                $('body').css('cursor','crosshair');
                painttile(cursor.x, cursor.y);
            }
            else {
                $('body').css('cursor','text');
            }
        }

        draw();
    }, 20);
}

var wasfocused;
function onmouseup(pos) {
    if(wasfocused && focused && !panned) {
        editturing();
        cursor = sr.unproject(pos);
    }
    wasfocused = focused;
}

function onmousemove(pos) {
    if(edit && focused)
    {
        if(!paint) {
            if(sr.unproject(pos).equals(cursor))
                $('body').css('cursor','text');
            else
                $('body').css('cursor', '');
        }
    }
    else
        $('body').css('cursor', '');
}

function onpan(start, pos) {
    if(focused) {
        if(pan) {
            setCameraTarget(start.cpy().sub(pos).scl(1 / sr.scale).add(offsetstart), true);
            panned = true;
        } else if(edit && paint) {
            var tilexy = sr.unproject(pos);
            painttile(tilexy.x, tilexy.y);
        }
        
        draw();
        return true;
    }
}

function painttile(x, y) {
    var tile = turing.tape.get(x,y);
    tile.setColor(paintColor);
}

/* Input */

function stepturing() {
    if(hyper) {
        for(var i = 0; i < 50; i++) {
            if(turing.step()) steps++;
            else pause();
        }
        $('#state').html(turing.state);
        $('#steps').html(steps);    
    } else {
        if(turing.step()) {
            $('#state').html(turing.state);
            $('#steps').html(++steps);
            if(autopan)
                setCameraTarget(turing.head);
        }
        else pause();
    }
    draw();
}

function btnload() {
    var data = $('#save').val().split(' ');
    var tapecode = data[0];
    if(tapecode) {
        tapecode = LZString.decompressFromEncodedURIComponent(tapecode);
        turing.tape = Tape.decode(tapecode);
    }

    var program = data[1];
    if(program) {
        program = LZString.decompressFromEncodedURIComponent(program);
        $('#turingCode').val(program);
    }

    if(tapecode || program) {
        btnok();
    }

    pause();
    btnreset();
}

function pause() {
    paused = true;
    clearInterval(turingloop);
    $('#pause').html('Run');
}

function unpause() {
    if(firstRun) {
        turing.parse($('#turingCode').val());
        console.log(JSON.stringify(turing.program, null, 4));

        firstRun = false;
    }

    paused = false;
    turingloop = setInterval(stepturing, interval);
    panturing();
    $('#pause').html('Pause');
}

function editturing() {
    edit = true;
    pan = false;
    pause();
    $('#edit').html('Pan');
    $(':focus').blur();
    draw();
}

function panturing() {
    edit = false;
    pan = true;
    $('#edit').html('Edit');
    draw();
}

function btnok() {
    initial = turing.tape.copy();

    draw();
}

function btngen() {
    var tapecode = LZString.compressToEncodedURIComponent(turing.tape.encode());
    var program = LZString.compressToEncodedURIComponent($('#turingCode').val());

    var data = tapecode + ' ' + program;
    $('#save').val(data);
}

function btnreset() {
    firstRun = true;

    turing.head = new Vector2(0,0);
    turing.tape = initial;
    turing.state = '0';
    initial = turing.tape.copy();

    steps = 0;
    $('#state').html('0');
    $('#steps').html('0');

    camera = new Vector2(0,0);
    pause();

    draw();
}

function btnedit() {
    if(edit) panturing();
    else editturing();
}

function btnpaint() {
    paint = !paint;
    editturing();
    if(paint) {
        $('#paint').html('Type');
        // $('#color').css('display','inline');
    } else {
        $('#paint').html('Paint');
        // $('#color').css('display','none');
    }
}

function btnpause() {
    if(paused) unpause();
    else pause();
}

function btnclear() {
    initial = new Tape();
    btnreset();
}

function txtcolor() {
    var hex = $('#colorhex').val();
    paintColor = hex == '' ? null : Color.parse(hex);
    if(paintColor == null) {
        $('#colorhex').css('color', '#ff0000');
        $('#colorhex').css('background', 'rgba(0,0,0,0)');
    } else {
        $('#colorhex').css('color', paintColor.luma() > .65 ? '#000000' : '#ffffff');
        $('#colorhex').css('background', paintColor.toString());
    }
}

function resize() {
    sr.canvas.width  = window.innerWidth;
    sr.canvas.height = window.innerHeight;

    if(sr.canvas.width < sr.canvas.height)
        sr.setScale(20 * scale * sr.canvas.height / sr.canvas.width);
    else
        sr.setScale(20 * scale * sr.canvas.width / sr.canvas.height);
    setScaleTarget(sr.scale);

    draw();
}

function rdospeed() {
    switch($('input[name="speed"]:checked').val()) {
        default:
        case 'med':
            interval = 200;
            hyper = false;
            break;
        case 'fast':
            interval = 100;
            hyper = false;
            break;
        case 'max':
            interval = 20;
            hyper = false;
            break;
        case 'hyper':
            interval = 20;
            hyper = true;
            document.getElementById('autopan').checked = false;
            autopan = false;
            break;
    }
    if(!paused) {
        clearInterval(turingloop);
        turingloop = setInterval(stepturing, interval);
    }
}

var caps = false;
function keyDown(event) {
    if(event.which == 16) caps = true;
}

function keyUp(event) {
    if(event.which == 16) caps = false;
    if(pan && focused) {
        switch(event.which) {
            case 189: // -
                setScaleTarget(scaleTarget * .8);
                scale *= .8;
                break; // +
            case 187:
                setScaleTarget(scaleTarget * 1.25);
                scale *= 1.25;
                break;
                
            case 37: // left
                cameraTarget.x -= sr.scale / 10;
                setCameraTarget();
                break;
            case 38: // up
                cameraTarget.y -= sr.scale / 10;
                setCameraTarget();
                break;
            case 39: // right
                cameraTarget.x += sr.scale / 10;
                setCameraTarget();
                break;
            case 40: // down
                cameraTarget.y += sr.scale / 10;
                setCameraTarget();
                break;
        }
        draw();
    }
    if(edit && focused) {
        if(event.which == 27)
            panturing();
        else if(!paint) {
            switch(event.which) {
                case 37: // left
                    cursor.x--;
                    break;
                case 38: // up
                    cursor.y--;
                    break;
                case 39: // right
                    cursor.x++;
                    break;
                case 40: // down
                    cursor.y++;
                    break;

                case 8: // bksp
                    cursor.x--;
                case 46: // del
                    var tile = turing.tape.get(cursor.x, cursor.y);
                    tile.value = '';
                    break;
                case 32: // space
                    var tile = turing.tape.get(cursor.x, cursor.y);
                    tile.value = '';
                    cursor.x++;
                    break;
                default:
                    var tile = turing.tape.get(cursor.x, cursor.y);
                    tile.value = Keyboard.fromCharCode(event.which, caps);
                    cursor.x++;
                    break;
                case 16: // shift
                    break;
            }
        }

        draw();
    }
}

function setContinuous(value) {
    continuous = value;
    if(continuous) renderloop = setInterval(update, 20);
    else clearInterval(renderloop);
}

function setDark(value) {
    dark = value;
    if(dark) $('body').addClass('dark');
    else $('body').removeClass('dark');
    draw();
}

/* Extensions */
// (function($) {
//     $.QueryString = (function(a) {
//         if (a == "") return {};
//         var b = {};
//         for (var i = 0; i < a.length; ++i)
//         {
//             var p=a[i].split('=', 2);
//             if (p.length != 2) continue;
//             b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
//         }
//         return b;
//     })(window.location.search.substr(1).split('&'))
// })(jQuery);

// String.prototype.replaceAll = function (find, replace) {
//     var str = this;
//     return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
// };

/* Init */
$(function() {
    $(window).resize(resize);
    $('#turingCanvas').focus();
    $('body').keydown(keyDown);
    $('body').keyup(keyUp);
    $('input[name="speed"]').click(rdospeed);
    $('#colorhex').keyup(txtcolor);
    $('#smooth').click(function() {setContinuous(this.checked);})
    $('#autopan').click(function() { autopan = this.checked;})
    $('#dark').click(function() {setDark(this.checked);})
    $('#hidetext').click(function() {hideText = this.checked; draw();})
    $('#save').focus(function() {$(this).select();})

    init();

    panturing();
    setContinuous(false);
    autopan = false;
    setDark(true);
});
