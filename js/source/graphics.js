function ShapeRenderer(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.offset = new Vector2(0,0);
    this.camera = new Vector2(0,0);
    this.scale = 1;
}

ShapeRenderer.prototype.setScale = function(value) {
    this.scale = value;
    this.offset.x = -this.ctx.canvas.width / (2 * this.scale) + .5;
    this.offset.y = -this.ctx.canvas.height / (2 * this.scale) + .5;
}

ShapeRenderer.prototype.getScale = function() {
    return this.scale;
}

ShapeRenderer.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

ShapeRenderer.prototype.drawarc = function(x, y, radius, startAngle, endAngle, anticlockwise, color) {
    this.ctx.strokeStyle = color.toString();

    this.ctx.beginPath();
    this.ctx.arc((x - this.offset.x - this.camera.x) * this.scale, (y - this.offset.y - this.camera.y) * this.scale, radius * this.scale, startAngle, endAngle, anticlockwise);
    this.ctx.stroke();
}

ShapeRenderer.prototype.fillrect = function(rect, color) {
    this.ctx.fillStyle = color.toString();
    this.ctx.fillRect((rect.x - this.offset.x - this.camera.x) * this.scale, (rect.y - this.offset.y - this.camera.y) * this.scale, rect.width * this.scale, rect.height * this.scale);
}

ShapeRenderer.prototype.drawtext = function(text, position, size, color) {
    this.ctx.font = Math.round(size * this.scale) + 'px Courier New';
    this.ctx.fillStyle = color.toString();
    this.ctx.fillText(text, (position.x - this.offset.x - this.camera.x + .2) * this.scale, (position.y - this.offset.y - this.camera.y + .8) * this.scale); 
}

ShapeRenderer.prototype.drawrect = function(rect, color) {
    this.ctx.strokeStyle = color.toString();

    this.ctx.beginPath();
    this.ctx.rect((rect.x - this.offset.x - this.camera.x) * this.scale, (rect.y - this.offset.y - this.camera.y) * this.scale, rect.width * this.scale, rect.height * this.scale);
    this.ctx.stroke();
}

ShapeRenderer.prototype.unproject = function(pos) {
    var origin = this.offset.cpy().add(this.camera).scl(-this.scale);
    var unproject = pos.cpy().sub(origin).scl(1/this.scale);
    unproject.x = Math.floor(unproject.x);
    unproject.y = Math.floor(unproject.y);

    return unproject;
}

