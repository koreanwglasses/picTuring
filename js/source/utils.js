/* Vector2 */

function Vector2(x,y) {
    this.x = x;
    this.y = y;
}

Vector2.prototype.cpy = function() {
    return new Vector2(this.x, this.y);
}

Vector2.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
}

Vector2.prototype.add = function(p) {
    this.x += p.x;
    this.y += p.y;
    return this;
}

Vector2.prototype.sub = function(p) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
}

Vector2.prototype.scl = function(factor) {
    this.x = this.x * factor;
    this.y = this.y * factor;
    return this;
}

Vector2.prototype.lerp = function(target, alpha) {
    this.scl(1-alpha).add(target.cpy().scl(alpha));
    return this;
}

Vector2.prototype.equals = function(vector) {
    return this.x == vector.x && this.y == vector.y;
}

/* Rect */

function Rect(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rect.prototype.getpos = function() {
    return new Vector2(this.x, this.y);
}

Rect.prototype.setpos = function(pos) {
    this.x = pos.x;
    this.y = pos.y;
}

/* Color */

function Color(r, g, b, a) {
    if(typeof a === 'undefined') a = 1;

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

Color.prototype.cpy = function() {
    return new Color(this.r, this.g, this.b, this.a);
}

Color.prototype.mul = function(factor) {
    this.r *= factor;
    this.g *= factor;
    this.b *= factor;
    this.a *= factor;

    return this;
}

Color.prototype.luma = function() {
    return (0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b) / 255;
}

Color.prototype.toString = function () {
    return 'rgba(' + Math.floor(this.r) + ',' + Math.floor(this.g) + ',' + Math.floor(this.b) + ',' + this.a + ')';
}

Color.prototype.tohex = function () {
    var hex = ((this.r << 16) + (this.g << 8) + this.b).toString(16);
    return '#' + ('000000' + hex).slice(-6);
}

Color.prototype.encode = function () {
    return this.a + this.tohex();
}

Color.Blank = new Color(0,0,0,0);
Color.White = new Color(255, 255, 255);
Color.Black = new Color(0,0,0);
Color.Red = new Color(255, 0, 0);
Color.Cyan = new Color(0, 255, 255);
Color.Green = new Color(0, 255, 0);
Color.Magenta = new Color(255, 0, 255);
Color.Blue = new Color(0, 0, 255);
Color.Yellow = new Color(255, 255, 0);
Color.Orange = new Color(255, 128, 0);
Color.Lime = new Color(128, 255, 0);

Color.fromHex = function (hex) {
    var rgb = parseInt(hex.slice(1), 16);
    return new Color(rgb >> 16, rgb >> 8 & 255, rgb & 255);
}

Color.fromRgb = function (str) {
    var rgba = str.slice(4, str.lengh - 1).split(',');
    return new Color(parseInt(rgba[0]),parseInt(rgba[1]),parseInt(rgba[2]));
}

Color.fromRgba = function (str) {
    var rgba = str.slice(5, str.lengh - 1).split(',');
    return new Color(parseInt(rgba[0]),parseInt(rgba[1]),parseInt(rgba[2]),parseFloat(rgba[0]));
}

Color.parse = function(str, defaut) {
    if(!str) return defaut;
    if(str[0] == '#') return Color.fromHex(str);
    var key = str[0].toUpperCase() + str.slice(1).toLowerCase();
    return Color[key] || defaut;
}

Color.decode = function (str) {
    var argb = str.split('#');
    var color = Color.fromHex('#' + argb[1]);
    color.a = parseFloat(argb[0]);
    return color;
}

/* Sparse Matrix */

function SMatrix() {
    this.data = {}
}

SMatrix.prototype.get = function(x, y) {
    return this.data[x + ',' + y];
}

SMatrix.prototype.set = function(x, y, value) {
    this.data[x + ',' + y] = value;
}