/* Mouse */

var mouse = new function() {
    this.isMouseDown = false;
    this.mousepos = new Vector2(0,0);

    this.mousedownpos = new Vector2(0,0);

    this.onmousemove = function(pos) {};
    this.onmousedown = function(pos) {};
    this.onmouseup = function(pos) {};
    this.onpan = function (start, pos) {};
}

document.onmousedown = function (e) {
    mouse.isMouseDown = true;
    mouse.mousedownpos.set(e.clientX, e.clientY);

    mouse.onmousedown(mouse.mousedownpos);
};
document.onmouseup = function (e) {
    mouse.isMouseDown = false;

    mouse.onmouseup(new Vector2(e.clientX, e.clientY));
};
document.onmousemove = function (e) {
    mouse.mousepos.set(e.clientX, e.clientY);
    
    mouse.onmousemove(mouse.mousepos);
    if(mouse.isMouseDown)
        if(mouse.onpan(mouse.mousedownpos, mouse.mousepos))
            e.preventDefault();
};


function Keyboard() {

}

Keyboard.fromCharCode = function(code, shift) {
    switch(code) {
        case 48: // 0
        case 96:
            return shift ? ')' : '0';
        case 49: // 1
        case 97:
            return shift ? '!' : '1';
        case 50: // 2
        case 98:
            return shift ? '@' : '2';
        case 51: // 3
        case 99:
            return shift ? '#' : '3';
        case 52: // 4
        case 100:
            return shift ? '$' : '4';
        case 53: // 5
        case 101:
            return shift ? '%' : '5';
        case 54: // 6
        case 102:
            return shift ? '^' : '6';
        case 55: // 7
        case 103:
            return shift ? '&' : '7';
        case 56: // 8
        case 104:
            return shift ? '*' : '8';
        case 57: // 9
        case 105:
            return shift ? '(' : '9';
        case 106:
            return '*';
        case 107:
            return '+';
        case 109:
            return '-';
        case 110:
            return '.';
        case 111:
            return '/';
        case 186:
            return shift ? ':' : ';';
        case 187:
            return shift ? '+' : '=';
        case 188:
            return shift ? '<' : ',';
        case 189:
            return shift ? '_' : '-';
        case 190:
            return shift ? '>' : '.';
        case 191:
            return shift ? '?' : '/';
        case 192:
            return shift ? '~' : '`';
        case 219:
            return shift ? '{' : '[';
        case 220:
            return shift ? '|' : '\\';
        case 221:
            return shift ? '}' : ']';
        case 222:
            return shift ? '"' : "'"; 
        default:
            var value = String.fromCharCode(event.which);
            if(!caps) value = value.toLowerCase();
            return value;
    }
}