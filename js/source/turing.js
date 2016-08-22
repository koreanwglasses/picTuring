function Turing2D() {
    this.tape = new Tape();
    this.head = new Vector2(0,0);
    this.state = '0';
    this.direction = 0;

    this.program = {};
}

Turing2D.prototype.step = function() {
    var tile = this.read();

    var transition = this.transition(this.state, tile.color, tile.value);

    if(transition == null)
        return false;

    this.state = transition[0];
    
    if(transition[1] != '*') {
        if(transition[1] == '_')
            tile.setColor(null);
        else 
            tile.setColor(Color.parse(transition[1]) || Color.Blank);
    }

    if(transition[2] != '*')
        if(transition[2] == '_')
            tile.value = '';
        else
            tile.value = transition[2];

    this.direction = transition[3];

    switch (this.direction) {
        case '*':
        default:
            break;

        case '<':
        case 'l':
        case 'L':
            this.head.x--;
            break;

        case '>':
        case 'r':
        case 'R':
            this.head.x++;
            break;

        case '^':
        case 'u':
        case 'U':
            this.head.y--;
            break;

        case 'v':
        case 'd':
        case 'D':
            this.head.y++;
            break;
    }

    return true;
}

Turing2D.prototype.transition = function(state, color, value) {
    if(value == null || value == '' || value == ' ') value = '_';
    var hex = color ? color.tohex() : '_';
    for(a = 0; a < 2; a++)
        for(b = 0; b < 2; b++) {
            var key = state + ' ' + (a ? '*': hex) + ' ' + (b ? '*': value);
            var transition = this.program[key];
            if(transition != null)
                return transition;
        }
    return null;
}

Turing2D.prototype.read = function() {
    return this.tape.get(this.head.x, this.head.y);
}

Turing2D.prototype.parse = function(code) {
    this.program = {};

    var lines = code.split('\n');
    for(i = 0; i < lines.length; i++) {
        var line = lines[i].split('//')[0];
        var words = line.split(' ');
        if(words.length == 7) {
            var color = Color.parse(words[1]);
            var key = words[0] + ' ' +  (color ? color.tohex() : '_') + ' ' + words[2];

            var transition = words.slice(3);
            this.program[key] = transition;
        } else if (words.length == 6) {
            var key = words[0] + ' * ' + words[1];
            
            var transition = words.slice(2);
            this.program[key] = transition;
        } else if (words.length == 5) {
            var key = words[0] + ' * ' + words[1];
            var transition = [words[2], '*', words[3], words[4]];

            this.program[key] = transition;
        }
    }
}

function Tape() {
    this.data = new SMatrix();
}

Tape.prototype.get = function(x, y) {
    var tile = this.data.get(x,y);
    if(tile == null) {
        tile = new Tile(x, y);
        this.data.set(x,y,tile);
    }
    return tile;
}

Tape.prototype.set = function(x,y,value) {
    this.data.set(x,y,value);
}

Tape.prototype.copy = function() {
    var clone = new Tape();
    for(key in this.data.data) {
        var tile = this.data.data[key];
        var newtile = new Tile(tile.position.x, tile.position.y);
        newtile.color = tile.color;
        newtile.value = tile.value;
        newtile.dark = tile.dark;
        clone.data.data[key] = newtile;
    }
    return clone;
}

Tape.prototype.encode = function() {
    var str = '';
    for(key in this.data.data) {
        var tile = this.data.data[key];
        str += tile.position.x + ' ' + tile.position.y + ' ' + (tile.color ? tile.color.encode() : '_') + ' ' + tile.value + ' ';
    }
    return str;
}

Tape.decode = function(str) {
    var tape = new Tape();
    var array = str.split(' ');
    for(var i = 0; i * 4 + 3 < array.length; i++) {
        var x = parseInt(array[i * 4]);
        var y = parseInt(array[i * 4 + 1]);
        var color = array[i * 4 + 2] == '_' ? null : Color.decode(array[i * 4 + 2]);
        var value = array[i * 4 + 3];

        if(value == 'null') value = '';

        var tile = tape.get(x, y);
        tile.setColor(color);
        tile.value = value;
    }
    return tape;
}

function Tile(x, y) {
    this.position = new Vector2(x,y);
    this.color = null;
    this.value = null;
    this.dark = false;
}

Tile.prototype.setColor = function(color) {
    this.color = color;
    if(color)
        this.dark = color.luma() < .65;
    else
        this.dark = false;
}