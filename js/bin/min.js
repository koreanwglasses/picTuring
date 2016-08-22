function Keyboard(){}function init(){var a=document.getElementById("turingCanvas");sr=new ShapeRenderer(a),mouse.onmousedown=onmousedown,mouse.onmousemove=onmousemove,mouse.onmouseup=onmouseup,mouse.onpan=onpan,resize()}function drawhead(){var a,b=turing.read();a=b.color?b.dark?Color.White:Color.Black:dark?Color.White:Color.Black,sr.drawarc(turing.head.x+.5,turing.head.y+.5,.5,0,2*Math.PI,!1,a)}function drawcursor(){sr.drawrect(new Rect(cursor.x,cursor.y,1,1),Color.Red)}function update(){sr.camera.lerp(cameraTarget,.1),sr.setScale(.9*sr.scale+.1*scaleTarget),draw(!0)}function draw(a){if("undefined"==typeof a&&(a=!1),a||!continuous){sr.clear();for(key in turing.tape.data.data){var b=turing.tape.data.data[key];null!=b&&(b.color&&sr.fillrect(new Rect(b.position.x,b.position.y,1,1),b.color),hideText||sr.drawtext(b.value||" ",b.position,1,(b.color?b.dark:dark)?Color.White:Color.Black))}drawhead(),edit&&!paint&&drawcursor()}}function setCameraTarget(a,b){"undefined"==typeof b&&(b=!1),a&&(cameraTarget=a.cpy()),continuous&&!b||(sr.camera=cameraTarget.cpy())}function setScaleTarget(a){scaleTarget=a,continuous||sr.setScale(scaleTarget)}function onmousedown(a){offsetstart=cameraTarget,focused=!1,panned=!1,setTimeout(function(){focused=$("#turingCanvas").is(":focus"),edit&&focused&&(cursor=sr.unproject(a),paint?($("body").css("cursor","crosshair"),painttile(cursor.x,cursor.y)):$("body").css("cursor","text")),draw()},20)}function onmouseup(a){wasfocused&&focused&&!panned&&(editturing(),cursor=sr.unproject(a)),wasfocused=focused}function onmousemove(a){edit&&focused?paint||(sr.unproject(a).equals(cursor)?$("body").css("cursor","text"):$("body").css("cursor","")):$("body").css("cursor","")}function onpan(a,b){if(focused){if(pan)setCameraTarget(a.cpy().sub(b).scl(1/sr.scale).add(offsetstart),!0),panned=!0;else if(edit&&paint){var c=sr.unproject(b);painttile(c.x,c.y)}return draw(),!0}}function painttile(a,b){var c=turing.tape.get(a,b);c.setColor(paintColor)}function stepturing(){if(hyper){for(var a=0;a<50;a++)turing.step()?steps++:pause();$("#state").html(turing.state),$("#steps").html(steps)}else turing.step()?($("#state").html(turing.state),$("#steps").html(++steps),autopan&&setCameraTarget(turing.head)):pause();draw()}function btnload(){var a=$("#save").val().split(" "),b=a[0];b&&(b=LZString.decompressFromEncodedURIComponent(b),turing.tape=Tape.decode(b));var c=a[1];c&&(c=LZString.decompressFromEncodedURIComponent(c),$("#turingCode").val(c)),(b||c)&&btnok(),pause(),btnreset()}function pause(){paused=!0,clearInterval(turingloop),$("#pause").html("Run")}function unpause(){firstRun&&(turing.parse($("#turingCode").val()),console.log(JSON.stringify(turing.program,null,4)),firstRun=!1),paused=!1,turingloop=setInterval(stepturing,interval),panturing(),$("#pause").html("Pause")}function editturing(){edit=!0,pan=!1,pause(),$("#edit").html("Pan"),$(":focus").blur(),draw()}function panturing(){edit=!1,pan=!0,$("#edit").html("Edit"),draw()}function btnok(){initial=turing.tape.copy(),draw()}function btngen(){var a=LZString.compressToEncodedURIComponent(turing.tape.encode()),b=LZString.compressToEncodedURIComponent($("#turingCode").val()),c=a+" "+b;$("#save").val(c)}function btnreset(){firstRun=!0,turing.head=new Vector2(0,0),turing.tape=initial,turing.state="0",initial=turing.tape.copy(),steps=0,$("#state").html("0"),$("#steps").html("0"),camera=new Vector2(0,0),pause(),draw()}function btnedit(){edit?panturing():editturing()}function btnpaint(){paint=!paint,editturing(),paint?$("#paint").html("Type"):$("#paint").html("Paint")}function btnpause(){paused?unpause():pause()}function btnclear(){initial=new Tape,btnreset()}function txtcolor(){var a=$("#colorhex").val();paintColor=""==a?null:Color.parse(a),null==paintColor?($("#colorhex").css("color","#ff0000"),$("#colorhex").css("background","rgba(0,0,0,0)")):($("#colorhex").css("color",paintColor.luma()>.65?"#000000":"#ffffff"),$("#colorhex").css("background",paintColor.toString()))}function resize(){sr.canvas.width=window.innerWidth,sr.canvas.height=window.innerHeight,sr.canvas.width<sr.canvas.height?sr.setScale(20*scale*sr.canvas.height/sr.canvas.width):sr.setScale(20*scale*sr.canvas.width/sr.canvas.height),setScaleTarget(sr.scale),draw()}function rdospeed(){switch($('input[name="speed"]:checked').val()){default:case"med":interval=200,hyper=!1;break;case"fast":interval=100,hyper=!1;break;case"max":interval=20,hyper=!1;break;case"hyper":interval=20,hyper=!0,document.getElementById("autopan").checked=!1,autopan=!1}paused||(clearInterval(turingloop),turingloop=setInterval(stepturing,interval))}function keyDown(a){16==a.which&&(caps=!0)}function keyUp(a){if(16==a.which&&(caps=!1),pan&&focused){switch(a.which){case 189:setScaleTarget(.8*scaleTarget),scale*=.8;break;case 187:setScaleTarget(1.25*scaleTarget),scale*=1.25;break;case 37:cameraTarget.x-=sr.scale/10,setCameraTarget();break;case 38:cameraTarget.y-=sr.scale/10,setCameraTarget();break;case 39:cameraTarget.x+=sr.scale/10,setCameraTarget();break;case 40:cameraTarget.y+=sr.scale/10,setCameraTarget()}draw()}if(edit&&focused){if(27==a.which)panturing();else if(!paint)switch(a.which){case 37:cursor.x--;break;case 38:cursor.y--;break;case 39:cursor.x++;break;case 40:cursor.y++;break;case 8:cursor.x--;case 46:var b=turing.tape.get(cursor.x,cursor.y);b.value="";break;case 32:var b=turing.tape.get(cursor.x,cursor.y);b.value="",cursor.x++;break;default:var b=turing.tape.get(cursor.x,cursor.y);b.value=Keyboard.fromCharCode(a.which,caps),cursor.x++;break;case 16:}draw()}}function setContinuous(a){continuous=a,continuous?renderloop=setInterval(update,20):clearInterval(renderloop)}function setDark(a){dark=a,dark?$("body").addClass("dark"):$("body").removeClass("dark"),draw()}function Turing2D(){this.tape=new Tape,this.head=new Vector2(0,0),this.state="0",this.direction=0,this.program={}}function Tape(){this.data=new SMatrix}function Tile(a,b){this.position=new Vector2(a,b),this.color=null,this.value=null,this.dark=!1}function Vector2(a,b){this.x=a,this.y=b}function Rect(a,b,c,d){this.x=a,this.y=b,this.width=c,this.height=d}function Color(a,b,c,d){"undefined"==typeof d&&(d=1),this.r=a,this.g=b,this.b=c,this.a=d}function SMatrix(){this.data={}}function ShapeRenderer(a){this.canvas=a,this.ctx=this.canvas.getContext("2d"),this.offset=new Vector2(0,0),this.camera=new Vector2(0,0),this.scale=1}var mouse=new function(){this.isMouseDown=!1,this.mousepos=new Vector2(0,0),this.mousedownpos=new Vector2(0,0),this.onmousemove=function(a){},this.onmousedown=function(a){},this.onmouseup=function(a){},this.onpan=function(a,b){}};document.onmousedown=function(a){mouse.isMouseDown=!0,mouse.mousedownpos.set(a.clientX,a.clientY),mouse.onmousedown(mouse.mousedownpos)},document.onmouseup=function(a){mouse.isMouseDown=!1,mouse.onmouseup(new Vector2(a.clientX,a.clientY))},document.onmousemove=function(a){mouse.mousepos.set(a.clientX,a.clientY),mouse.onmousemove(mouse.mousepos),mouse.isMouseDown&&mouse.onpan(mouse.mousedownpos,mouse.mousepos)&&a.preventDefault()},Keyboard.fromCharCode=function(a,b){switch(a){case 48:case 96:return b?")":"0";case 49:case 97:return b?"!":"1";case 50:case 98:return b?"@":"2";case 51:case 99:return b?"#":"3";case 52:case 100:return b?"$":"4";case 53:case 101:return b?"%":"5";case 54:case 102:return b?"^":"6";case 55:case 103:return b?"&":"7";case 56:case 104:return b?"*":"8";case 57:case 105:return b?"(":"9";case 106:return"*";case 107:return"+";case 109:return"-";case 110:return".";case 111:return"/";case 186:return b?":":";";case 187:return b?"+":"=";case 188:return b?"<":",";case 189:return b?"_":"-";case 190:return b?">":".";case 191:return b?"?":"/";case 192:return b?"~":"`";case 219:return b?"{":"[";case 220:return b?"|":"\\";case 221:return b?"}":"]";case 222:return b?'"':"'";default:var c=String.fromCharCode(event.which);return caps||(c=c.toLowerCase()),c}};var sr,turing=new Turing2D,initial=new Tape,paused=!0,interval=200,hyper=!1,focused=!1,edit=!0,pan=!1,paint=!1,paintColor,cursor=new Vector2(0,0),cameraTarget=new Vector2(0,0),scaleTarget=1,scale=1,autopan=!0,steps=0,turingloop,renderloop,continuous=!0,dark=!0,hideText=!1,firstRun=!0,offsetstart,panned=!1,wasfocused,caps=!1;$(function(){$(window).resize(resize),$("#turingCanvas").focus(),$("body").keydown(keyDown),$("body").keyup(keyUp),$('input[name="speed"]').click(rdospeed),$("#colorhex").keyup(txtcolor),$("#smooth").click(function(){setContinuous(this.checked)}),$("#autopan").click(function(){autopan=this.checked}),$("#dark").click(function(){setDark(this.checked)}),$("#hidetext").click(function(){hideText=this.checked,draw()}),$("#save").focus(function(){$(this).select()}),init(),panturing(),setContinuous(!1),autopan=!1,setDark(!0)}),Turing2D.prototype.step=function(){var a=this.read(),b=this.transition(this.state,a.color,a.value);if(null==b)return!1;switch(this.state=b[0],"*"!=b[1]&&("_"==b[1]?a.setColor(null):a.setColor(Color.parse(b[1])||Color.Blank)),"*"!=b[2]&&("_"==b[2]?a.value="":a.value=b[2]),this.direction=b[3],this.direction){case"*":default:break;case"<":case"l":case"L":this.head.x--;break;case">":case"r":case"R":this.head.x++;break;case"^":case"u":case"U":this.head.y--;break;case"v":case"d":case"D":this.head.y++}return!0},Turing2D.prototype.transition=function(c,d,e){null!=e&&""!=e&&" "!=e||(e="_");var f=d?d.tohex():"_";for(a=0;a<2;a++)for(b=0;b<2;b++){var g=c+" "+(a?"*":f)+" "+(b?"*":e),h=this.program[g];if(null!=h)return h}return null},Turing2D.prototype.read=function(){return this.tape.get(this.head.x,this.head.y)},Turing2D.prototype.parse=function(a){this.program={};var b=a.split("\n");for(i=0;i<b.length;i++){var c=b[i].split("//")[0],d=c.split(" ");if(7==d.length){var e=Color.parse(d[1]),f=d[0]+" "+(e?e.tohex():"_")+" "+d[2],g=d.slice(3);this.program[f]=g}else if(6==d.length){var f=d[0]+" * "+d[1],g=d.slice(2);this.program[f]=g}else if(5==d.length){var f=d[0]+" * "+d[1],g=[d[2],"*",d[3],d[4]];this.program[f]=g}}},Tape.prototype.get=function(a,b){var c=this.data.get(a,b);return null==c&&(c=new Tile(a,b),this.data.set(a,b,c)),c},Tape.prototype.set=function(a,b,c){this.data.set(a,b,c)},Tape.prototype.copy=function(){var a=new Tape;for(key in this.data.data){var b=this.data.data[key],c=new Tile(b.position.x,b.position.y);c.color=b.color,c.value=b.value,c.dark=b.dark,a.data.data[key]=c}return a},Tape.prototype.encode=function(){var a="";for(key in this.data.data){var b=this.data.data[key];a+=b.position.x+" "+b.position.y+" "+(b.color?b.color.encode():"_")+" "+b.value+" "}return a},Tape.decode=function(a){for(var b=new Tape,c=a.split(" "),d=0;4*d+3<c.length;d++){var e=parseInt(c[4*d]),f=parseInt(c[4*d+1]),g="_"==c[4*d+2]?null:Color.decode(c[4*d+2]),h=c[4*d+3];"null"==h&&(h="");var i=b.get(e,f);i.setColor(g),i.value=h}return b},Tile.prototype.setColor=function(a){this.color=a,a?this.dark=a.luma()<.65:this.dark=!1},Vector2.prototype.cpy=function(){return new Vector2(this.x,this.y)},Vector2.prototype.set=function(a,b){return this.x=a,this.y=b,this},Vector2.prototype.add=function(a){return this.x+=a.x,this.y+=a.y,this},Vector2.prototype.sub=function(a){return this.x-=a.x,this.y-=a.y,this},Vector2.prototype.scl=function(a){return this.x=this.x*a,this.y=this.y*a,this},Vector2.prototype.lerp=function(a,b){return this.scl(1-b).add(a.cpy().scl(b)),this},Vector2.prototype.equals=function(a){return this.x==a.x&&this.y==a.y},Rect.prototype.getpos=function(){return new Vector2(this.x,this.y)},Rect.prototype.setpos=function(a){this.x=a.x,this.y=a.y},Color.prototype.cpy=function(){return new Color(this.r,this.g,this.b,this.a)},Color.prototype.mul=function(a){return this.r*=a,this.g*=a,this.b*=a,this.a*=a,this},Color.prototype.luma=function(){return(.2126*this.r+.7152*this.g+.0722*this.b)/255},Color.prototype.toString=function(){return"rgba("+Math.floor(this.r)+","+Math.floor(this.g)+","+Math.floor(this.b)+","+this.a+")"},Color.prototype.tohex=function(){var a=((this.r<<16)+(this.g<<8)+this.b).toString(16);return"#"+("000000"+a).slice(-6)},Color.prototype.encode=function(){return this.a+this.tohex()},Color.Blank=new Color(0,0,0,0),Color.White=new Color(255,255,255),Color.Black=new Color(0,0,0),Color.Red=new Color(255,0,0),Color.Cyan=new Color(0,255,255),Color.Green=new Color(0,255,0),Color.Magenta=new Color(255,0,255),Color.Blue=new Color(0,0,255),Color.Yellow=new Color(255,255,0),Color.Orange=new Color(255,128,0),Color.Lime=new Color(128,255,0),Color.fromHex=function(a){var b=parseInt(a.slice(1),16);return new Color(b>>16,b>>8&255,255&b)},Color.fromRgb=function(a){var b=a.slice(4,a.lengh-1).split(",");return new Color(parseInt(b[0]),parseInt(b[1]),parseInt(b[2]))},Color.fromRgba=function(a){var b=a.slice(5,a.lengh-1).split(",");return new Color(parseInt(b[0]),parseInt(b[1]),parseInt(b[2]),parseFloat(b[0]))},Color.parse=function(a,b){if(!a)return b;if("#"==a[0])return Color.fromHex(a);var c=a[0].toUpperCase()+a.slice(1).toLowerCase();return Color[c]||b},Color.decode=function(a){var b=a.split("#"),c=Color.fromHex("#"+b[1]);return c.a=parseFloat(b[0]),c},SMatrix.prototype.get=function(a,b){return this.data[a+","+b]},SMatrix.prototype.set=function(a,b,c){this.data[a+","+b]=c},ShapeRenderer.prototype.setScale=function(a){this.scale=a,this.offset.x=-this.ctx.canvas.width/(2*this.scale)+.5,this.offset.y=-this.ctx.canvas.height/(2*this.scale)+.5},ShapeRenderer.prototype.getScale=function(){return this.scale},ShapeRenderer.prototype.clear=function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},ShapeRenderer.prototype.drawarc=function(a,b,c,d,e,f,g){this.ctx.strokeStyle=g.toString(),this.ctx.beginPath(),this.ctx.arc((a-this.offset.x-this.camera.x)*this.scale,(b-this.offset.y-this.camera.y)*this.scale,c*this.scale,d,e,f),this.ctx.stroke()},ShapeRenderer.prototype.fillrect=function(a,b){this.ctx.fillStyle=b.toString(),this.ctx.fillRect((a.x-this.offset.x-this.camera.x)*this.scale,(a.y-this.offset.y-this.camera.y)*this.scale,a.width*this.scale,a.height*this.scale)},ShapeRenderer.prototype.drawtext=function(a,b,c,d){this.ctx.font=Math.round(c*this.scale)+"px Courier New",this.ctx.fillStyle=d.toString(),this.ctx.fillText(a,(b.x-this.offset.x-this.camera.x+.2)*this.scale,(b.y-this.offset.y-this.camera.y+.8)*this.scale)},ShapeRenderer.prototype.drawrect=function(a,b){this.ctx.strokeStyle=b.toString(),this.ctx.beginPath(),this.ctx.rect((a.x-this.offset.x-this.camera.x)*this.scale,(a.y-this.offset.y-this.camera.y)*this.scale,a.width*this.scale,a.height*this.scale),this.ctx.stroke()},ShapeRenderer.prototype.unproject=function(a){var b=this.offset.cpy().add(this.camera).scl(-this.scale),c=a.cpy().sub(b).scl(1/this.scale);return c.x=Math.floor(c.x),c.y=Math.floor(c.y),c};