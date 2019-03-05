(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Hear = require("./Events.js");

module.exports = function(Logic){

	
	Hear("switchAct", "click", function(){
		Logic.switchSpace();
	});

	Hear("Tiles", "click", function(event){
		
		if(event.target.getAttribute("tile") !== null){
			Logic.changeTile(event.target.parentElement.getAttribute("categ"), event.target.getAttribute("tile"));
		}
	});

	Hear("Objects", "click", function(event){
		
		if(event.target.getAttribute("tile") !== null){
			Logic.changeObjs(event.target.parentElement.getAttribute("categ"), event.target.getAttribute("tile"));
		}
	});
	
	Hear("Add", "change", function(){
		if(this.files[0]) 
			Logic.addTileset(this.files[0]);
	});
	
	var cursorLine = null;
	
	
	Hear("Grid", "mousedown", function(event){
		cursorLine = [event.target.x, event.target.y];
	});
	Hear("Grid", "mouseup", function(event){
		if(event.ctrlKey)
			Logic.clear(cursorLine, [event.target.x, event.target.y]);
		else
			Logic.draw(cursorLine, [event.target.x, event.target.y]);

		cursorLine = null;
	});
	
};



},{"./Events.js":4}],2:[function(require,module,exports){
const Hear = require("./Events.js");

module.exports = function(Draw){

	Hear("switchAct", "click", Draw.crSwitch("invis", ["Tiles", "Objects"]));

	Hear("Tiles", "click", function(event){
		if(event.target.swit) event.target.swit();
	});

	Hear("Objects", "click", function(event){
		if(event.target.swit) event.target.swit();
	});

	Hear("switchGrid", "click", Draw.crSwitch("grid", "Grid"));

	Hear("Grid", "dragstart", function(event){
		event.preventDefault();
	});
};
},{"./Events.js":4}],3:[function(require,module,exports){
require("typesjs");
const RGB = require('chromath').rgb;
var Base64 = require('js-base64').Base64;

const CrSwitches = require("./CrSwitches.js");

var id_ground = "Ground";
var id_boxs = "Boxs";
var id_grid = "Grid";
var id_tiles = "Tiles";
var id_objects = "Objects";
var id_pallet = "Pallet";

var size = 20;

function CrSpace(id_map, size){
	var container = getNode(id_map);
	
	var coord_arr_tiles = Array.create(Array.create.bind(null, null, 20), 20);
	this.add = function(new_tile, x, y){
		var tile = drawTile(new_tile);
		tile.style.width = (new_tile.width * (100 / size)) + "%";
		tile.style.height = (new_tile.height * (100 / size)) + "%";
		
		tile.style.left = (x * (100 / size)) + "%";
		tile.style.top = (y * (100 / size)) + "%";
		
		container.appendChild(tile);
		coord_arr_tiles[x][y] = tile;
	}
	this.dell = function(box){
		coord_arr_tiles[box.x][box.y].remove();
		coord_arr_tiles[box.x][box.y] = null;
	}
	
	function NormTile(tile){
		var box = getComputedStyle(tile);
		tile.style.left = NormCoord(parseFloat(box.left), parseFloat(box.width)) + "%";
		tile.style.top = NormCoord(parseFloat(box.top), parseFloat(box.height)) + "%";
	}
	
	function NormCoord(coord, s){
		var con_size = parseFloat(getComputedStyle(container).width);
		
		if(coord + s > con_size) coord = con_size - s;
		if(coord < 0) coord = 0;
		
		return Math.round((coord / con_size) * size) * (100 / size);
	}
	
}

function CrTiles(id_container){
	var container = getNode(id_container);
	
	this.add = function(Tileset){
		var categ = drawCateg(Tileset);
		container.appendChild(categ);
	}
}

function CrPallet(){
	var container = getNode(id_pallet);
	
	this.change = function(tile){
		if(container.children[0]) 
			container.children[0].remove();

		container.appendChild(drawTile(tile));
	}
}

function appendTile(tile, x, y){
	if(tile.durability) 
		this.boxs.add(tile, x, y);
	else
		this.map.add(tile, x, y);
}

function removeTile(box){
	if(box.tile.durability) 
		this.boxs.dell(box);
	else
		console.log("!!!!!!");
}

drawGrid(getNode(id_grid), size);

 var Draw = {
	map: new CrSpace(id_ground, size),
	boxs: new CrSpace(id_boxs, size),
	append: appendTile,
	remove: removeTile,
	pallet: new CrPallet(id_pallet),
	tiles: new CrTiles(id_tiles),
	objects: new CrTiles(id_objects),
	crSwitch:  require("./Switch.js")
};
CrSwitches(Draw);
module.exports = Draw;

function drawGrid(container, grid_size){
		var size = 100 / grid_size;
		for(var i = grid_size - 1; i >= 0; i--){
			for(var j = grid_size - 1; j >= 0; j--){
				var box = darwBox(i*size, j*size, size);
				box.x = i;
				box.y = j;
				container.appendChild(box);
			}
		}
	}
	
function darwBox(x, y, size){
	var box = document.createElement('div');
	box.classList.add("box");
	box.style.width = size + "%";
	box.style.height = size + "%";
	
	box.style.left = x + "%";
	box.style.top = y + "%";
	
	return box;
}



function Save(name, text){
	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	FileSaver.saveAs(blob, name);
}

function CrSwitchTwo(id, first_id, name_class){
	var elem = getNode(id).classList;
	var first_elem = getNode(first_id).classList;
	return function(){
		elem.toggle(name_class);
		first_elem.toggle(name_class);
	}
}

function drawCateg(new_tileset){
	var categ = document.createElement('div');
	categ.classList.add("panel-column");
	
	var title = document.createElement('h3');
	title.innerHTML = new_tileset.name;
	title.classList.add("title-categ");
	
	
	//var close = document.createElement('button');
	//close.innerHTML = "-";
	//title.appendChild(close);
	
	categ.appendChild(title);
	
	var list = drawTiles(new_tileset.tiles);
	list.setAttribute("categ", new_tileset.id);
	
	title.swit = function(){
		list.classList.toggle("invis");
	}
	
	categ.appendChild(list);
	
	return categ;
}

function drawTiles(tiles){
	var list = document.createElement('div');
	list.classList.add("panel-wrap");
	
	tiles.map(drawTile).forEach(list.appendChild.bind(list));
	return list;
}

function drawTile(new_tile){
	
	if(new_tile.type == "color"){
		var img = document.createElement('div');
		img.style.backgroundColor = new RGB(new_tile.color).toString();
	}
	if(new_tile.type == "svg" || new_tile.type == "phisic"){
		var img = document.createElement('img');
		img.src = "data:image/svg+xml;base64,"+ Base64.encode(new_tile.img);
	}

	img.classList.add("tile");
	img.setAttribute("tile", new_tile.id);
	img.setAttribute("draggable", true);
	
	return img;
}

function getNode(id){
	var elem = document.getElementById(id);
	if(!elem) throw new Error("Elem is not find!");
	return elem;
}

},{"./CrSwitches.js":2,"./Switch.js":6,"chromath":9,"js-base64":17,"typesjs":19}],4:[function(require,module,exports){

function IdEvent(id, name_event, func){
	
	if(name_event == "submit"){
		var old_func = func;
		func = function(e){
			e.preventDefault();
			old_func.apply(this, arguments);
		} 
	}
	
	if(Array.isArray(name_event)){
		name_event.forEach(name => getNode(id).addEventListener(name, func));
	}
	else getNode(id).addEventListener(name_event, func);
}

function Submit(func){
	return function(event){
		event.preventDefault();
		func.apply(this, arguments);
	}
}

function getNode(id){
	var elem = document.getElementById(id);
	if(!elem) throw new Error("Elem is not find!");
	return elem;
}

module.exports = IdEvent;

},{}],5:[function(require,module,exports){
const Files = require("./SysFiles.js");

var Tilesets = [];
var Ground = Array.create(Array.create.bind(null, null, 20), 20);
var Objects = Array.create(Array.create.bind(null, null, 20), 20);

function CrLogic(Draw){
	var current_tile = null;
	var current_objs = null;

	var switchSpace = false;
	
	this.addTileset = function(file){
		Files.open(file, function(file){
			var tileset = JSON.parse(file.content);
			tileset.name = file.name;
			addTileset(tileset);
		});
	}

	this.switchSpace = function(){
		switchSpace = !switchSpace;

		if(!switchSpace && current_tile)
			Draw.pallet.change(current_tile);
		else if(current_objs) 
			Draw.pallet.change(current_objs);
	}
	
	this.changeTile = function(id_categ, id_tile){
		current_tile = Tilesets[id_categ].tiles[id_tile];
		
		defSize(current_tile, id_categ)
		Draw.pallet.change(current_tile);
	}

	this.changeObjs = function(id_categ, id_tile){
		current_objs = Tilesets[id_categ].tiles[id_tile];
		
		defSize(current_objs, id_categ);
		Draw.pallet.change(current_objs);
	}

	function defSize(tile, id_categ){
		if(!tile.width) tile.width = Tilesets[id_categ].width;
		if(!tile.height) tile.height = Tilesets[id_categ].height;
	}
	
	this.draw = function(beg, end){
		if(!switchSpace && current_tile)
			fill(Ground, current_tile, beg, end);
	
		else if(is_empty(Objects, beg, end) && current_objs)
			fill(Objects, current_objs, beg, end);

	}
	this.clear = function(beg, end){
		if(!switchSpace)
			console.log("!!!!!!!!");
		else 
			clear(Objects, beg, end);
	}


	function addTileset(Tileset){
		var objs = [];
		var tiles = [];

		Tileset.tiles.forEach(function(tile, id){
			if(tile.type != "phisic")
				tile.id = tiles.push(tile) - 1;
			else
				tile.id = objs.push(tile) - 1;
		});

		var ObjSet = Object.assign({}, Tileset);
		ObjSet.tiles = objs;

		Tileset.tiles = tiles;

		console.log(Tileset, ObjSet);

		Tileset.id = Tilesets.add(Tileset);
		Draw.tiles.add(Tileset);

		ObjSet.id = Tilesets.add(ObjSet);
		Draw.objects.add(ObjSet);
	}

	function fill(Map, tile, beg, end){
			
			var inc_x = tile.width;
			var inc_y = tile.height;
			
			for(var i = beg[0]; i + inc_x <= end[0] + 1; i = i + inc_x){
				for(var j = beg[1]; j + inc_y <= end[1] + 1; j = j + inc_y){
					drawTile(Map, i, j, tile);
				}
			}
			
	}
	function clear(Map, beg, end){
			
		for(var i = beg[0]; i <= end[0]; i++){
			for(var j = beg[1]; j <= end[1]; j++){
				if(Map[j][i] !== null){
					dellTile(Map, Map[j][i]);
				}
			}
		}
			
	}

	function is_empty(Map, beg, end){
		var empty = true;

		for(var i = beg[0]; i <= end[0]; i++){
			for(var j = beg[1]; j <= end[1]; j++){
				empty = empty && (Map[j][i] == null);
				if(!empty) return empty;
			}
		}

		return empty;
	}
	
	function drawTile(Map, x, y, tile){
		x = Math.floor(x);
		y = Math.floor(y);

		var box = {tile: tile, x: x, y: y};
		
		for(var i = 0; i < tile.width; i++){
			for(var j = 0; j < tile.height; j++){
				
				Map[j+y][i+x] = box;
			}
		}
		
		Draw.append(tile, x, y);
	}

	function dellTile(Map, box){
		
		for(var i = 0; i < box.tile.width; i++){
			for(var j = 0; j < box.tile.height; j++){
				
				Map[j+box.y][i+box.x] = null;
			}
		}
		
		Draw.remove(box);
	}
}

module.exports = CrLogic;

},{"./SysFiles.js":7}],6:[function(require,module,exports){
function CrSwitch(name_class, ids){
	if(Array.isArray(ids)){
		var elems = ids.map(getNode);
		elems = elems.map(elem => elem.classList);

		return arrSwicth.bind(null, elems, name_class);
	}
	else if(typeof ids == "object"){
		return objSwitch(ids, name_class);
	}
	else{
		var elem = getNode(ids).classList;
		return oneSwitch.bind(null, name_class, elem);
	}
	
}

function objSwitch(id_obj, class_name){
	for (var key in id_obj){
		id_obj[key] = getNode(id_obj[key]).classList;
	}

	return function(id){
		for (var i in id_obj){
			id_obj[i].add(class_name);
		}
		
		id_obj[id].remove(class_name);
	}
}

function arrSwicth(elem_arr, name_class){
	elem_arr.forEach(oneSwitch.bind(null, name_class));
}

function oneSwitch(name_class, elem){
		elem.toggle(name_class);
}

module.exports = CrSwitch;

function getNode(id){
	var elem = document.getElementById(id);
	if(!elem) throw new Error("Elem is not find!");
	return elem;
}
},{}],7:[function(require,module,exports){
var FileSaver = require('file-saver');

function Open(file, callback){
	var reader = new FileReader();
	
	reader.onload = function(e){
		file.content = e.target.result;
		file.name = name;
		callback(file);
	};
	reader.readAsText(file);
}

function Save(name, text){
	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	FileSaver.saveAs(blob, name);
}

module.exports = {save: Save, open: Open};
},{"file-saver":16}],8:[function(require,module,exports){
const Draw = require("./Draw.js");
const CrLogic = require("./Logic.js");
const CrContr = require("./Control.js");

var Logic = new CrLogic(Draw);
CrContr(Logic);

},{"./Control.js":1,"./Draw.js":3,"./Logic.js":5}],9:[function(require,module,exports){
var Chromath = require('./src/chromath.js');
module.exports = Chromath;

},{"./src/chromath.js":10}],10:[function(require,module,exports){
var util = require('./util');
/*
   Class: Chromath
*/
// Group: Constructors
/*
   Constructor: Chromath
   Create a new Chromath instance from a string or integer

   Parameters:
   mixed - The value to use for creating the color

   Returns:
   <Chromath> instance

   Properties:
   r - The red channel of the RGB representation of the Chromath. A number between 0 and 255.
   g - The green channel of the RGB representation of the Chromath. A number between 0 and 255.
   b - The blue channel of the RGB representation of the Chromath. A number between 0 and 255.
   a - The alpha channel of the Chromath. A number between 0 and 1.
   h - The hue of the Chromath. A number between 0 and 360.
   sl - The saturation of the HSL representation of the Chromath. A number between 0 and 1.
   sv - The saturation of the HSV/HSB representation of the Chromath. A number between 0 and 1.
   l - The lightness of the HSL representation of the Chromath. A number between 0 and 1.
   v - The lightness of the HSV/HSB representation of the Chromath. A number between 0 and 1.

   Examples:
  (start code)
// There are many ways to create a Chromath instance
new Chromath('#FF0000');                  // Hex (6 characters with hash)
new Chromath('FF0000');                   // Hex (6 characters without hash)
new Chromath('#F00');                     // Hex (3 characters with hash)
new Chromath('F00');                      // Hex (3 characters without hash)
new Chromath('red');                      // CSS/SVG Color name
new Chromath('rgb(255, 0, 0)');           // RGB via CSS
new Chromath({r: 255, g: 0, b: 0});       // RGB via object
new Chromath('rgba(255, 0, 0, 1)');       // RGBA via CSS
new Chromath({r: 255, g: 0, b: 0, a: 1}); // RGBA via object
new Chromath('hsl(0, 100%, 50%)');        // HSL via CSS
new Chromath({h: 0, s: 1, l: 0.5});       // HSL via object
new Chromath('hsla(0, 100%, 50%, 1)');    // HSLA via CSS
new Chromath({h: 0, s: 1, l: 0.5, a: 1}); // HSLA via object
new Chromath('hsv(0, 100%, 100%)');       // HSV via CSS
new Chromath({h: 0, s: 1, v: 1});         // HSV via object
new Chromath('hsva(0, 100%, 100%, 1)');   // HSVA via CSS
new Chromath({h: 0, s: 1, v: 1, a: 1});   // HSVA via object
new Chromath('hsb(0, 100%, 100%)');       // HSB via CSS
new Chromath({h: 0, s: 1, b: 1});         // HSB via object
new Chromath('hsba(0, 100%, 100%, 1)');   // HSBA via CSS
new Chromath({h: 0, s: 1, b: 1, a: 1});   // HSBA via object
new Chromath(16711680);                   // RGB via integer (alpha currently ignored)
(end code)
*/
function Chromath( mixed )
{
    var channels, color, hsl, hsv, rgb;

    if (util.isString(mixed) || util.isNumber(mixed)) {
        channels = Chromath.parse(mixed);
    } else if (util.isArray(mixed)){
        throw new Error('Unsure how to parse array `'+mixed+'`' +
                        ', please pass an object or CSS style ' +
                        'or try Chromath.rgb, Chromath.hsl, or Chromath.hsv'
                       );
    } else if (mixed instanceof Chromath) {
        channels = util.merge({}, mixed);
    } else if (util.isObject(mixed)){
        channels = util.merge({}, mixed);
    }

    if (! channels)
        throw new Error('Could not parse `'+mixed+'`');
    else if (!isFinite(channels.a))
        channels.a = 1;

    if ('r' in channels ){
        rgb = util.rgb.scaled01([channels.r, channels.g, channels.b]);
        hsl = Chromath.rgb2hsl(rgb);
        hsv = Chromath.rgb2hsv(rgb);
    } else if ('h' in channels ){
        if ('l' in channels){
            hsl = util.hsl.scaled([channels.h, channels.s, channels.l]);
            rgb = Chromath.hsl2rgb(hsl);
            hsv = Chromath.rgb2hsv(rgb);
        } else if ('v' in channels || 'b' in channels) {
            if ('b' in channels) channels.v = channels.b;
            hsv = util.hsl.scaled([channels.h, channels.s, channels.v]);
            rgb = Chromath.hsv2rgb(hsv);
            hsl = Chromath.rgb2hsl(rgb);
        }
    }


    util.merge(this, {
        r:  rgb[0],  g: rgb[1], b: rgb[2],
        h:  hsl[0], sl: hsl[1], l: hsl[2],
        sv: hsv[1],  v: hsv[2], a: channels.a
    });

    return this;
}

/*
  Constructor: Chromath.rgb
  Create a new <Chromath> instance from RGB values

  Parameters:
  r - Number, 0-255, representing the green channel OR Array OR object (with keys r,g,b) of RGB values
  g - Number, 0-255, representing the green channel
  b - Number, 0-255, representing the red channel
  a - (Optional) Float, 0-1, representing the alpha channel

 Returns:
 <Chromath>

 Examples:
 > > new Chromath.rgb(123, 234, 56).toString()
 > "#7BEA38"

 > > new Chromath.rgb([123, 234, 56]).toString()
 > "#7BEA38"

 > > new Chromath.rgb({r: 123, g: 234, b: 56}).toString()
 > "#7BEA38"
 */
Chromath.rgb = function (r, g, b, a)
{
    var rgba = util.rgb.fromArgs(r, g, b, a);
    r = rgba[0], g = rgba[1], b = rgba[2], a = rgba[3];

    return new Chromath({r: r, g: g, b: b, a: a});
};

/*
  Constructor: Chromath.rgba
  Alias for <Chromath.rgb>
*/
Chromath.rgba = Chromath.rgb;

/*
  Constructor: Chromath.hsl
  Create a new Chromath instance from HSL values

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,l) of HSL values
  s - Number, 0-1, representing the saturation
  l - Number, 0-1, representing the lightness
  a - (Optional) Float, 0-1, representing the alpha channel

  Returns:
  <Chromath>

  Examples:
  > > new Chromath.hsl(240, 1, 0.5).toString()
  > "#0000FF"

  > > new Chromath.hsl([240, 1, 0.5]).toString()
  > "#0000FF"

  > new Chromath.hsl({h:240, s:1, l:0.5}).toString()
  > "#0000FF"
 */
Chromath.hsl = function (h, s, l, a)
{
    var hsla = util.hsl.fromArgs(h, s, l, a);
    h = hsla[0], s = hsla[1], l = hsla[2], a = hsla[3];

    return new Chromath({h: h, s: s, l: l, a: a});
};

/*
  Constructor: Chromath.hsla
  Alias for <Chromath.hsl>
*/
Chromath.hsla = Chromath.hsl;

/*
  Constructor: Chromath.hsv
  Create a new Chromath instance from HSV values

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,l) of HSV values
  s - Number, 0-1, representing the saturation
  v - Number, 0-1, representing the lightness
  a - (Optional) Float, 0-1, representing the alpha channel

  Returns:
  <Chromath>

  Examples:
  > > new Chromath.hsv(240, 1, 1).toString()
  > "#0000FF"

  > > new Chromath.hsv([240, 1, 1]).toString()
  > "#0000FF"

  > > new Chromath.hsv({h:240, s:1, v:1}).toString()
  > "#0000FF"
 */
Chromath.hsv = function (h, s, v, a)
{
    var hsva = util.hsl.fromArgs(h, s, v, a);
    h = hsva[0], s = hsva[1], v = hsva[2], a = hsva[3];

    return new Chromath({h: h, s: s, v: v, a: a});
};

/*
  Constructor: Chromath.hsva
  Alias for <Chromath.hsv>
*/
Chromath.hsva = Chromath.hsv;

/*
  Constructor: Chromath.hsb
  Alias for <Chromath.hsv>
 */
Chromath.hsb = Chromath.hsv;

/*
   Constructor: Chromath.hsba
   Alias for <Chromath.hsva>
 */
Chromath.hsba = Chromath.hsva;

// Group: Static methods - representation
/*
  Method: Chromath.toInteger
  Convert a color into an integer (alpha channel currently omitted)

  Parameters:
  color - Accepts the same arguments as the Chromath constructor

  Returns:
  integer

  Examples:
  > > Chromath.toInteger('green');
  > 32768

  > > Chromath.toInteger('white');
  > 16777215
*/
Chromath.toInteger = function (color)
{
    // create something like '008000' (green)
    var hex6 = new Chromath(color).hex().join('');

    // Arguments beginning with `0x` are treated as hex values
    return Number('0x' + hex6);
};

/*
  Method: Chromath.toName
  Return the W3C color name of the color it matches

  Parameters:
  comparison

  Examples:
  > > Chromath.toName('rgb(255, 0, 255)');
  > 'fuchsia'

  > > Chromath.toName(65535);
  > 'aqua'
*/
Chromath.toName = function (comparison)
{
    comparison = +new Chromath(comparison);
    for (var color in Chromath.colors) if (+Chromath[color] == comparison) return color;
};

// Group: Static methods - color conversion
/*
  Method: Chromath.rgb2hex
  Convert an RGB value to a Hex value

  Returns: array

  Example:
  > > Chromath.rgb2hex(50, 100, 150)
  > "[32, 64, 96]"
 */
Chromath.rgb2hex = function rgb2hex(r, g, b)
{
    var rgb = util.rgb.scaled01(r, g, b);
    var hex = rgb.map(function (pct) {
      var dec = Math.round(pct * 255);
      var hex = dec.toString(16).toUpperCase();
      return util.lpad(hex, 2, 0);
    });

    return hex;
};

// Converted from http://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
/*
  Method: Chromath.rgb2hsl
  Convert RGB to HSL

  Parameters:
  r - Number, 0-255, representing the green channel OR Array OR object (with keys r,g,b) of RGB values
  g - Number, 0-255, representing the green channel
  b - Number, 0-255, representing the red channel

  Returns: array

  > > Chromath.rgb2hsl(0, 255, 0);
  > [ 120, 1, 0.5 ]

  > > Chromath.rgb2hsl([0, 0, 255]);
  > [ 240, 1, 0.5 ]

  > > Chromath.rgb2hsl({r: 255, g: 0, b: 0});
  > [ 0, 1, 0.5 ]
 */
Chromath.rgb2hsl = function rgb2hsl(r, g, b)
{
    var rgb = util.rgb.scaled01(r, g, b);
    r = rgb[0], g = rgb[1], b = rgb[2];

    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var C = M - m;
    var L = 0.5*(M + m);
    var S = (C === 0) ? 0 : C/(1-Math.abs(2*L-1));

    var h;
    if (C === 0) h = 0; // spec'd as undefined, but usually set to 0
    else if (M === r) h = ((g-b)/C) % 6;
    else if (M === g) h = ((b-r)/C) + 2;
    else if (M === b) h = ((r-g)/C) + 4;

    var H = 60 * h;

    return [H, parseFloat(S), parseFloat(L)];
};

/*
  Method: Chromath.rgb2hsv
  Convert RGB to HSV

  Parameters:
  r - Number, 0-255, representing the green channel OR Array OR object (with keys r,g,b) of RGB values
  g - Number, 0-255, representing the green channel
  b - Number, 0-255, representing the red channel

  Returns:
  Array

  > > Chromath.rgb2hsv(0, 255, 0);
  > [ 120, 1, 1 ]

  > > Chromath.rgb2hsv([0, 0, 255]);
  > [ 240, 1, 1 ]

  > > Chromath.rgb2hsv({r: 255, g: 0, b: 0});
  > [ 0, 1, 1 ]
 */
Chromath.rgb2hsv = function rgb2hsv(r, g, b)
{
    var rgb = util.rgb.scaled01(r, g, b);
    r = rgb[0], g = rgb[1], b = rgb[2];

    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var C = M - m;
    var L = M;
    var S = (C === 0) ? 0 : C/M;

    var h;
    if (C === 0) h = 0; // spec'd as undefined, but usually set to 0
    else if (M === r) h = ((g-b)/C) % 6;
    else if (M === g) h = ((b-r)/C) + 2;
    else if (M === b) h = ((r-g)/C) + 4;

    var H = 60 * h;

    return [H, parseFloat(S), parseFloat(L)];
};

/*
   Method: Chromath.rgb2hsb
   Alias for <Chromath.rgb2hsv>
 */
Chromath.rgb2hsb = Chromath.rgb2hsv;

/*
  Method: Chromath.hsl2rgb
  Convert from HSL to RGB

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,l) of HSL values
  s - Number, 0-1, representing the saturation
  l - Number, 0-1, representing the lightness

  Returns:
  array

  Examples:
  > > Chromath.hsl2rgb(360, 1, 0.5);
  > [ 255, 0, 0 ]

  > > Chromath.hsl2rgb([0, 1, 0.5]);
  > [ 255, 0, 0 ]

  > > Chromath.hsl2rgb({h: 210, s:1, v: 0.5});
  > [ 0, 127.5, 255 ]
 */
// TODO: Can I %= hp and then do a switch?
Chromath.hsl2rgb = function hsl2rgb(h, s, l)
{
    var hsl = util.hsl.scaled(h, s, l);
    h=hsl[0], s=hsl[1], l=hsl[2];

    var C = (1 - Math.abs(2*l-1)) * s;
    var hp = h/60;
    var X = C * (1-Math.abs(hp%2-1));
    var rgb, m;

    switch (Math.floor(hp)){
    case 0:  rgb = [C,X,0]; break;
    case 1:  rgb = [X,C,0]; break;
    case 2:  rgb = [0,C,X]; break;
    case 3:  rgb = [0,X,C]; break;
    case 4:  rgb = [X,0,C]; break;
    case 5:  rgb = [C,0,X]; break;
    default: rgb = [0,0,0];
    }

    m = l - (C/2);

    return [
        (rgb[0]+m),
        (rgb[1]+m),
        (rgb[2]+m)
    ];
};

/*
  Method: Chromath.hsv2rgb
  Convert HSV to RGB

  Parameters:
  h - Number, -Infinity - Infinity, representing the hue OR Array OR object (with keys h,s,v or h,s,b) of HSV values
  s - Number, 0-1, representing the saturation
  v - Number, 0-1, representing the lightness

  Examples:
  > > Chromath.hsv2rgb(360, 1, 1);
  > [ 255, 0, 0 ]

  > > Chromath.hsv2rgb([0, 1, 0.5]);
  > [ 127.5, 0, 0 ]

  > > Chromath.hsv2rgb({h: 210, s: 0.5, v: 1});
  > [ 127.5, 191.25, 255 ]
 */
Chromath.hsv2rgb = function hsv2rgb(h, s, v)
{
    var hsv = util.hsl.scaled(h, s, v);
    h=hsv[0], s=hsv[1], v=hsv[2];

    var C = v * s;
    var hp = h/60;
    var X = C*(1-Math.abs(hp%2-1));
    var rgb, m;

    if (h == undefined)         rgb = [0,0,0];
    else if (0 <= hp && hp < 1) rgb = [C,X,0];
    else if (1 <= hp && hp < 2) rgb = [X,C,0];
    else if (2 <= hp && hp < 3) rgb = [0,C,X];
    else if (3 <= hp && hp < 4) rgb = [0,X,C];
    else if (4 <= hp && hp < 5) rgb = [X,0,C];
    else if (5 <= hp && hp < 6) rgb = [C,0,X];

    m = v - C;

    return [
        (rgb[0]+m),
        (rgb[1]+m),
        (rgb[2]+m)
    ];
};

/*
   Method: Chromath.hsb2rgb
   Alias for <Chromath.hsv2rgb>
 */
Chromath.hsb2rgb = Chromath.hsv2rgb;

/*
    Property: Chromath.convert
    Aliases for the Chromath.x2y functions.
    Use like Chromath.convert[x][y](args) or Chromath.convert.x.y(args)
*/
Chromath.convert = {
    rgb: {
        hex: Chromath.hsv2rgb,
        hsl: Chromath.rgb2hsl,
        hsv: Chromath.rgb2hsv
    },
    hsl: {
        rgb: Chromath.hsl2rgb
    },
    hsv: {
        rgb: Chromath.hsv2rgb
    }
};

/* Group: Static methods - color scheme */
/*
  Method: Chromath.complement
  Return the complement of the given color

  Returns: <Chromath>

  > > Chromath.complement(new Chromath('red'));
  > { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 }

  > > Chromath.complement(new Chromath('red')).toString();
  > '#00FFFF'
 */
Chromath.complement = function (color)
{
    var c = new Chromath(color);
    var hsl = c.toHSLObject();

    hsl.h = (hsl.h + 180) % 360;

    return new Chromath(hsl);
};

/*
  Method: Chromath.triad
  Create a triad color scheme from the given Chromath.

  Examples:
  > > Chromath.triad(Chromath.yellow)
  > [ { r: 255, g: 255, b: 0, a: 1, h: 60, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 255, g: 0, b: 255, a: 1, h: 300, sl: 1, sv: 1, l: 0.5, v: 1 } ]

 > > Chromath.triad(Chromath.yellow).toString();
 > '#FFFF00,#00FFFF,#FF00FF'
*/
Chromath.triad = function (color)
{
    var c = new Chromath(color);

    return [
        c,
        new Chromath({r: c.b, g: c.r, b: c.g}),
        new Chromath({r: c.g, g: c.b, b: c.r})
    ];
};

/*
  Method: Chromath.tetrad
  Create a tetrad color scheme from the given Chromath.

  Examples:
  > > Chromath.tetrad(Chromath.cyan)
  > [ { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 255, g: 0, b: 255, a: 1, h: 300, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 255, g: 255, b: 0, a: 1, h: 60, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 0, a: 1, h: 120, sl: 1, sv: 1, l: 0.5, v: 1 } ]

  > > Chromath.tetrad(Chromath.cyan).toString();
  > '#00FFFF,#FF00FF,#FFFF00,#00FF00'
*/
Chromath.tetrad = function (color)
{
    var c = new Chromath(color);

    return [
        c,
        new Chromath({r: c.b, g: c.r, b: c.b}),
        new Chromath({r: c.b, g: c.g, b: c.r}),
        new Chromath({r: c.r, g: c.b, b: c.r})
    ];
};

/*
  Method: Chromath.analogous
  Find analogous colors from a given color

  Parameters:
  mixed - Any argument which is passed to <Chromath>
  results - How many colors to return (default = 3)
  slices - How many pieces are in the color wheel (default = 12)

  Examples:
  > > Chromath.analogous(new Chromath('rgb(0, 255, 255)'))
  > [ { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 101, a: 1, h: 144, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 153, a: 1, h: 156, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 203, a: 1, h: 168, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 255, b: 255, a: 1, h: 180, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 203, b: 255, a: 1, h: 192, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 153, b: 255, a: 1, h: 204, sl: 1, sv: 1, l: 0.5, v: 1 },
  >   { r: 0, g: 101, b: 255, a: 1, h: 216, sl: 1, sv: 1, l: 0.5, v: 1 } ]

  > > Chromath.analogous(new Chromath('rgb(0, 255, 255)')).toString()
  > '#00FFFF,#00FF65,#00FF99,#00FFCB,#00FFFF,#00CBFF,#0099FF,#0065FF'
 */
Chromath.analogous = function (color, results, slices)
{
    if (!isFinite(results)) results = 3;
    if (!isFinite(slices)) slices = 12;

    var c = new Chromath(color);
    var hsv = c.toHSVObject();
    var slice = 360 / slices;
    var ret = [ c ];

    hsv.h = ((hsv.h - (slices * results >> 1)) + 720) % 360;
    while (--results) {
        hsv.h = (hsv.h + slice) % 360;
        ret.push(new Chromath(hsv));
    }

    return ret;
};

/*
  Method: Chromath.monochromatic
  Return a series of the given color at various lightnesses

  Examples:
  > > Chromath.monochromatic('rgb(0, 100, 255)').forEach(function (c){ console.log(c.toHSVString()); })
  > hsv(216,100%,20%)
  > hsv(216,100%,40%)
  > hsv(216,100%,60%)
  > hsv(216,100%,80%)
  > hsv(216,100%,100%)
*/
Chromath.monochromatic = function (color, results)
{
    if (!results) results = 5;

    var c = new Chromath(color);
    var hsv = c.toHSVObject();
    var inc = 1 / results;
    var ret = [], step = 0;

    while (step++ < results) {
        hsv.v = step * inc;
        ret.push(new Chromath(hsv));
    }

    return ret;
};

/*
  Method: Chromath.splitcomplement
  Generate a split complement color scheme from the given color

  Examples:
  > > Chromath.splitcomplement('rgb(0, 100, 255)')
  > [ { r: 0, g: 100, b: 255, h: 216.47058823529414, sl: 1, l: 0.5, sv: 1, v: 1, a: 1 },
  >   { r: 255, g: 183, b: 0, h: 43.19999999999999, sl: 1, l: 0.5, sv: 1, v: 1, a: 1 },
  >   { r: 255, g: 73, b: 0, h: 17.279999999999973, sl: 1, l: 0.5, sv: 1, v: 1, a: 1 } ]

  > > Chromath.splitcomplement('rgb(0, 100, 255)').toString()
  > '#0064FF,#FFB700,#FF4900'
 */
Chromath.splitcomplement = function (color)
{
    var ref = new Chromath(color);
    var hsv = ref.toHSVObject();

    var a = new Chromath.hsv({
        h: (hsv.h + 150) % 360,
        s: hsv.s,
        v: hsv.v
    });

    var b = new Chromath.hsv({
        h: (hsv.h + 210) % 360,
        s: hsv.s,
        v: hsv.v
    });

    return [ref, a, b];
};

//Group: Static methods - color alteration
/*
  Method: Chromath.tint
  Lighten a color by adding a percentage of white to it

  Returns <Chromath>

  > > Chromath.tint('rgb(0, 100, 255)', 0.5).toRGBString();
  > 'rgb(127,177,255)'
*/
Chromath.tint = function ( from, by )
{
    return Chromath.towards( from, '#FFFFFF', by );
};

/*
   Method: Chromath.lighten
   Alias for <Chromath.tint>
*/
Chromath.lighten = Chromath.tint;

/*
  Method: Chromath.shade
  Darken a color by adding a percentage of black to it

  Example:
  > > Chromath.darken('rgb(0, 100, 255)', 0.5).toRGBString();
  > 'rgb(0,50,127)'
 */
Chromath.shade = function ( from, by )
{
    return Chromath.towards( from, '#000000', by );
};

/*
   Method: Chromath.darken
   Alias for <Chromath.shade>
 */
Chromath.darken = Chromath.shade;

/*
  Method: Chromath.desaturate
  Desaturate a color using any of 3 approaches

  Parameters:
  color - any argument accepted by the <Chromath> constructor
  formula - The formula to use (from <xarg's greyfilter at http://www.xarg.org/project/jquery-color-plugin-xcolor>)
  - 1 - xarg's own formula
  - 2 - Sun's formula: (1 - avg) / (100 / 35) + avg)
  - empty - The oft-seen 30% red, 59% green, 11% blue formula

  Examples:
  > > Chromath.desaturate('red').toString()
  > "#4C4C4C"

  > > Chromath.desaturate('red', 1).toString()
  > "#373737"

  > > Chromath.desaturate('red', 2).toString()
  > "#909090"
*/
Chromath.desaturate = function (color, formula)
{
    var c = new Chromath(color), rgb, avg;

    switch (formula) {
    case 1: // xarg's formula
        avg = .35 + 13 * (c.r + c.g + c.b) / 60; break;
    case 2: // Sun's formula: (1 - avg) / (100 / 35) + avg)
        avg = (13 * (c.r + c.g + c.b) + 5355) / 60; break;
    default:
        avg = c.r * .3 + c.g * .59 + c.b * .11;
    }

    avg = util.clamp(avg, 0, 255);
    rgb = {r: avg, g: avg, b: avg};

    return new Chromath(rgb);
};

/*
  Method: Chromath.greyscale
  Alias for <Chromath.desaturate>
*/
Chromath.greyscale = Chromath.desaturate;

/*
  Method: Chromath.websafe
  Convert a color to one of the 216 "websafe" colors

  Examples:
  > > Chromath.websafe('#ABCDEF').toString()
  > '#99CCFF'

  > > Chromath.websafe('#BBCDEF').toString()
  > '#CCCCFF'
 */
Chromath.websafe = function (color)
{
    color = new Chromath(color);

    color.r = Math.round(color.r / 51) * 51;
    color.g = Math.round(color.g / 51) * 51;
    color.b = Math.round(color.b / 51) * 51;

    return new Chromath(color);
};

//Group: Static methods - color combination
/*
  Method: Chromath.additive
  Combine any number colors using additive color

  Examples:
  > > Chromath.additive('#F00', '#0F0').toString();
  > '#FFFF00'

  > > Chromath.additive('#F00', '#0F0').toString() == Chromath.yellow.toString();
  > true

  > > Chromath.additive('red', '#0F0', 'rgb(0, 0, 255)').toString() == Chromath.white.toString();
  > true
 */
Chromath.additive = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        if ((a.r += b.r) > 255) a.r = 255;
        if ((a.g += b.g) > 255) a.g = 255;
        if ((a.b += b.b) > 255) a.b = 255;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.subtractive
  Combine any number of colors using subtractive color

  Examples:
  > > Chromath.subtractive('yellow', 'magenta').toString();
  > '#FF0000'

  > > Chromath.subtractive('yellow', 'magenta').toString() === Chromath.red.toString();
  > true

  > > Chromath.subtractive('cyan', 'magenta', 'yellow').toString();
  > '#000000'

  > > Chromath.subtractive('red', '#0F0', 'rgb(0, 0, 255)').toString();
  > '#000000'
*/
Chromath.subtractive = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        if ((a.r += b.r - 255) < 0) a.r = 0;
        if ((a.g += b.g - 255) < 0) a.g = 0;
        if ((a.b += b.b - 255) < 0) a.b = 0;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.multiply
  Multiply any number of colors

  Examples:
  > > Chromath.multiply(Chromath.lightgoldenrodyellow, Chromath.lightblue).toString();
  > "#A9D3BD"

  > > Chromath.multiply(Chromath.oldlace, Chromath.lightblue, Chromath.darkblue).toString();
  > "#000070"
*/
Chromath.multiply = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        a.r = (a.r / 255 * b.r)|0;
        a.g = (a.g / 255 * b.g)|0;
        a.b = (a.b / 255 * b.b)|0;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.average
  Averages any number of colors

  Examples:
  > > Chromath.average(Chromath.lightgoldenrodyellow, Chromath.lightblue).toString()
  > "#D3E9DC"

  > > Chromath.average(Chromath.oldlace, Chromath.lightblue, Chromath.darkblue).toString()
  > "#6A73B8"
 */
Chromath.average = function ()
{
    var args = arguments.length-2, i=-1, a, b;
    while (i++ < args){

        a = a || new Chromath(arguments[i]);
        b = new Chromath(arguments[i+1]);

        a.r = (a.r + b.r) >> 1;
        a.g = (a.g + b.g) >> 1;
        a.b = (a.b + b.b) >> 1;

        a = new Chromath(a);
    }

    return a;
};

/*
  Method: Chromath.overlay
  Add one color on top of another with a given transparency

  Examples:
  > > Chromath.average(Chromath.lightgoldenrodyellow, Chromath.lightblue).toString()
  > "#D3E9DC"

  > > Chromath.average(Chromath.oldlace, Chromath.lightblue, Chromath.darkblue).toString()
  > "#6A73B8"
 */
Chromath.overlay = function (top, bottom, opacity)
{
    var a = new Chromath(top);
    var b = new Chromath(bottom);

    if (opacity > 1) opacity /= 100;
    opacity = util.clamp(opacity - 1 + b.a, 0, 1);

    return new Chromath({
        r: util.lerp(a.r, b.r, opacity),
        g: util.lerp(a.g, b.g, opacity),
        b: util.lerp(a.b, b.b, opacity)
    });
};


//Group: Static methods - other
/*
  Method: Chromath.towards
  Move from one color towards another by the given percentage (0-1, 0-100)

  Parameters:
  from - The starting color
  to - The destination color
  by - The percentage, expressed as a floating number between 0 and 1, to move towards the destination color
  interpolator - The function to use for interpolating between the two points. Defaults to Linear Interpolation. Function has the signature `(from, to, by)` with the parameters having the same meaning as those in `towards`.

  > > Chromath.towards('red', 'yellow', 0.5).toString()
  > "#FF7F00"
*/
Chromath.towards = function (from, to, by, interpolator)
{
    if (!to) { return from; }
    if (!isFinite(by))
        throw new Error('TypeError: `by`(' + by  +') should be between 0 and 1');
    if (!(from instanceof Chromath)) from = new Chromath(from);
    if (!(to instanceof Chromath)) to = new Chromath(to || '#FFFFFF');
    if (!interpolator) interpolator = util.lerp;
    by = parseFloat(by);

    return new Chromath({
        r: interpolator(from.r, to.r, by),
        g: interpolator(from.g, to.g, by),
        b: interpolator(from.b, to.b, by),
        a: interpolator(from.a, to.a, by)
    });
};

/*
  Method: Chromath.gradient
  Create an array of Chromath objects

  Parameters:
  from - The beginning color of the gradient
  to - The end color of the gradient
  slices - The number of colors in the array
  slice - The color at a specific, 1-based, slice index

  Examples:
  > > Chromath.gradient('red', 'yellow').length;
  > 20

  > > Chromath.gradient('red', 'yellow', 5).toString();
  > "#FF0000,#FF3F00,#FF7F00,#FFBF00,#FFFF00"

  > > Chromath.gradient('red', 'yellow', 5, 2).toString();
  > "#FF7F00"

  > > Chromath.gradient('red', 'yellow', 5)[2].toString();
  > "#FF7F00"
 */
Chromath.gradient = function (from, to, slices, slice)
{
    var gradient = [], stops;

    if (! slices) slices = 20;
    stops = (slices-1);

    if (isFinite(slice)) return Chromath.towards(from, to, slice/stops);
    else slice = -1;

    while (++slice < slices){
        gradient.push(Chromath.towards(from, to, slice/stops));
    }

    return gradient;
};

/*
  Method: Chromath.parse
  Iterate through the objects set in Chromath.parsers and, if a match is made, return the value specified by the matching parsers `process` function

  Parameters:
  string - The string to parse

  Example:
  > > Chromath.parse('rgb(0, 128, 255)')
  > { r: 0, g: 128, b: 255, a: undefined }
 */
Chromath.parse = function (string)
{
    var parsers = Chromath.parsers, i, l, parser, parts, channels;

    for (i = 0, l = parsers.length; i < l; i++) {
        parser = parsers[i];
        parts = parser.regex.exec(string);
        if (parts && parts.length) channels = parser.process.apply(this, parts);
        if (channels) return channels;
    }
};

// Group: Static properties
/*
  Property: Chromath.parsers
   An array of objects for attempting to convert a string describing a color into an object containing the various channels. No user action is required but parsers can be

   Object properties:
   regex - regular expression used to test the string or numeric input
   process - function which is passed the results of `regex.match` and returns an object with either the rgb, hsl, hsv, or hsb channels of the Chromath.

   Examples:
(start code)
// Add a parser
Chromath.parsers.push({
    example: [3554431, 16809984],
    regex: /^\d+$/,
    process: function (color){
        return {
            r: color >> 16 & 255,
            g: color >> 8 & 255,
            b: color & 255
        };
    }
});
(end code)
(start code)
// Override entirely
Chromath.parsers = [
   {
       example: [3554431, 16809984],
       regex: /^\d+$/,
       process: function (color){
           return {
               r: color >> 16 & 255,
               g: color >> 8 & 255,
               b: color & 255
           };
       }
   },

   {
       example: ['#fb0', 'f0f'],
       regex: /^#?([\dA-F]{1})([\dA-F]{1})([\dA-F]{1})$/i,
       process: function (hex, r, g, b){
           return {
               r: parseInt(r + r, 16),
               g: parseInt(g + g, 16),
               b: parseInt(b + b, 16)
           };
       }
   }
(end code)
 */
Chromath.parsers = require('./parsers').parsers;

// Group: Instance methods - color representation
Chromath.prototype = require('./prototype')(Chromath);

/*
  Property: Chromath.colors
  Object, indexed by SVG/CSS color name, of <Chromath> instances
  The color names from CSS and SVG 1.0

  Examples:
  > > Chromath.colors.aliceblue.toRGBArray()
  > [240, 248, 255]

  > > Chromath.colors.beige.toString()
  > "#F5F5DC"

  > // Can also be accessed without `.color`
  > > Chromath.aliceblue.toRGBArray()
  > [240, 248, 255]

  > > Chromath.beige.toString()
  > "#F5F5DC"
*/
var css2Colors  = require('./colornames_css2');
var css3Colors  = require('./colornames_css3');
var allColors   = util.merge({}, css2Colors, css3Colors);
Chromath.colors = {};
for (var colorName in allColors) {
    // e.g., Chromath.wheat and Chromath.colors.wheat
    Chromath[colorName] = Chromath.colors[colorName] = new Chromath(allColors[colorName]);
}
// add a parser for the color names
Chromath.parsers.push({
    example: ['red', 'burlywood'],
    regex: /^[a-z]+$/i,
    process: function (colorName){
        if (Chromath.colors[colorName]) return Chromath.colors[colorName];
    }
});

module.exports = Chromath;

},{"./colornames_css2":11,"./colornames_css3":12,"./parsers":13,"./prototype":14,"./util":15}],11:[function(require,module,exports){
module.exports = {
    // from http://www.w3.org/TR/REC-html40/types.html#h-6.5
    aqua    : {r: 0,   g: 255, b: 255},
    black   : {r: 0,   g: 0,   b: 0},
    blue    : {r: 0,   g: 0,   b: 255},
    fuchsia : {r: 255, g: 0,   b: 255},
    gray    : {r: 128, g: 128, b: 128},
    green   : {r: 0,   g: 128, b: 0},
    lime    : {r: 0,   g: 255, b: 0},
    maroon  : {r: 128, g: 0,   b: 0},
    navy    : {r: 0,   g: 0,   b: 128},
    olive   : {r: 128, g: 128, b: 0},
    purple  : {r: 128, g: 0,   b: 128},
    red     : {r: 255, g: 0,   b: 0},
    silver  : {r: 192, g: 192, b: 192},
    teal    : {r: 0,   g: 128, b: 128},
    white   : {r: 255, g: 255, b: 255},
    yellow  : {r: 255, g: 255, b: 0}
};

},{}],12:[function(require,module,exports){
module.exports = {
    // http://www.w3.org/TR/css3-color/#svg-color
    // http://www.w3.org/TR/SVG/types.html#ColorKeywords
    aliceblue            : {r: 240, g: 248, b: 255},
    antiquewhite         : {r: 250, g: 235, b: 215},
    aquamarine           : {r: 127, g: 255, b: 212},
    azure                : {r: 240, g: 255, b: 255},
    beige                : {r: 245, g: 245, b: 220},
    bisque               : {r: 255, g: 228, b: 196},
    blanchedalmond       : {r: 255, g: 235, b: 205},
    blueviolet           : {r: 138, g: 43,  b: 226},
    brown                : {r: 165, g: 42,  b: 42},
    burlywood            : {r: 222, g: 184, b: 135},
    cadetblue            : {r: 95,  g: 158, b: 160},
    chartreuse           : {r: 127, g: 255, b: 0},
    chocolate            : {r: 210, g: 105, b: 30},
    coral                : {r: 255, g: 127, b: 80},
    cornflowerblue       : {r: 100, g: 149, b: 237},
    cornsilk             : {r: 255, g: 248, b: 220},
    crimson              : {r: 220, g: 20,  b: 60},
    cyan                 : {r: 0,   g: 255, b: 255},
    darkblue             : {r: 0,   g: 0,   b: 139},
    darkcyan             : {r: 0,   g: 139, b: 139},
    darkgoldenrod        : {r: 184, g: 134, b: 11},
    darkgray             : {r: 169, g: 169, b: 169},
    darkgreen            : {r: 0,   g: 100, b: 0},
    darkgrey             : {r: 169, g: 169, b: 169},
    darkkhaki            : {r: 189, g: 183, b: 107},
    darkmagenta          : {r: 139, g: 0,   b: 139},
    darkolivegreen       : {r: 85,  g: 107, b: 47},
    darkorange           : {r: 255, g: 140, b: 0},
    darkorchid           : {r: 153, g: 50,  b: 204},
    darkred              : {r: 139, g: 0,   b: 0},
    darksalmon           : {r: 233, g: 150, b: 122},
    darkseagreen         : {r: 143, g: 188, b: 143},
    darkslateblue        : {r: 72,  g: 61,  b: 139},
    darkslategray        : {r: 47,  g: 79,  b: 79},
    darkslategrey        : {r: 47,  g: 79,  b: 79},
    darkturquoise        : {r: 0,   g: 206, b: 209},
    darkviolet           : {r: 148, g: 0,   b: 211},
    deeppink             : {r: 255, g: 20,  b: 147},
    deepskyblue          : {r: 0,   g: 191, b: 255},
    dimgray              : {r: 105, g: 105, b: 105},
    dimgrey              : {r: 105, g: 105, b: 105},
    dodgerblue           : {r: 30,  g: 144, b: 255},
    firebrick            : {r: 178, g: 34,  b: 34},
    floralwhite          : {r: 255, g: 250, b: 240},
    forestgreen          : {r: 34,  g: 139, b: 34},
    gainsboro            : {r: 220, g: 220, b: 220},
    ghostwhite           : {r: 248, g: 248, b: 255},
    gold                 : {r: 255, g: 215, b: 0},
    goldenrod            : {r: 218, g: 165, b: 32},
    greenyellow          : {r: 173, g: 255, b: 47},
    grey                 : {r: 128, g: 128, b: 128},
    honeydew             : {r: 240, g: 255, b: 240},
    hotpink              : {r: 255, g: 105, b: 180},
    indianred            : {r: 205, g: 92,  b: 92},
    indigo               : {r: 75,  g: 0,   b: 130},
    ivory                : {r: 255, g: 255, b: 240},
    khaki                : {r: 240, g: 230, b: 140},
    lavender             : {r: 230, g: 230, b: 250},
    lavenderblush        : {r: 255, g: 240, b: 245},
    lawngreen            : {r: 124, g: 252, b: 0},
    lemonchiffon         : {r: 255, g: 250, b: 205},
    lightblue            : {r: 173, g: 216, b: 230},
    lightcoral           : {r: 240, g: 128, b: 128},
    lightcyan            : {r: 224, g: 255, b: 255},
    lightgoldenrodyellow : {r: 250, g: 250, b: 210},
    lightgray            : {r: 211, g: 211, b: 211},
    lightgreen           : {r: 144, g: 238, b: 144},
    lightgrey            : {r: 211, g: 211, b: 211},
    lightpink            : {r: 255, g: 182, b: 193},
    lightsalmon          : {r: 255, g: 160, b: 122},
    lightseagreen        : {r: 32,  g: 178, b: 170},
    lightskyblue         : {r: 135, g: 206, b: 250},
    lightslategray       : {r: 119, g: 136, b: 153},
    lightslategrey       : {r: 119, g: 136, b: 153},
    lightsteelblue       : {r: 176, g: 196, b: 222},
    lightyellow          : {r: 255, g: 255, b: 224},
    limegreen            : {r: 50,  g: 205, b: 50},
    linen                : {r: 250, g: 240, b: 230},
    magenta              : {r: 255, g: 0,   b: 255},
    mediumaquamarine     : {r: 102, g: 205, b: 170},
    mediumblue           : {r: 0,   g: 0,   b: 205},
    mediumorchid         : {r: 186, g: 85,  b: 211},
    mediumpurple         : {r: 147, g: 112, b: 219},
    mediumseagreen       : {r: 60,  g: 179, b: 113},
    mediumslateblue      : {r: 123, g: 104, b: 238},
    mediumspringgreen    : {r: 0,   g: 250, b: 154},
    mediumturquoise      : {r: 72,  g: 209, b: 204},
    mediumvioletred      : {r: 199, g: 21,  b: 133},
    midnightblue         : {r: 25,  g: 25,  b: 112},
    mintcream            : {r: 245, g: 255, b: 250},
    mistyrose            : {r: 255, g: 228, b: 225},
    moccasin             : {r: 255, g: 228, b: 181},
    navajowhite          : {r: 255, g: 222, b: 173},
    oldlace              : {r: 253, g: 245, b: 230},
    olivedrab            : {r: 107, g: 142, b: 35},
    orange               : {r: 255, g: 165, b: 0},
    orangered            : {r: 255, g: 69,  b: 0},
    orchid               : {r: 218, g: 112, b: 214},
    palegoldenrod        : {r: 238, g: 232, b: 170},
    palegreen            : {r: 152, g: 251, b: 152},
    paleturquoise        : {r: 175, g: 238, b: 238},
    palevioletred        : {r: 219, g: 112, b: 147},
    papayawhip           : {r: 255, g: 239, b: 213},
    peachpuff            : {r: 255, g: 218, b: 185},
    peru                 : {r: 205, g: 133, b: 63},
    pink                 : {r: 255, g: 192, b: 203},
    plum                 : {r: 221, g: 160, b: 221},
    powderblue           : {r: 176, g: 224, b: 230},
    rosybrown            : {r: 188, g: 143, b: 143},
    royalblue            : {r: 65,  g: 105, b: 225},
    saddlebrown          : {r: 139, g: 69,  b: 19},
    salmon               : {r: 250, g: 128, b: 114},
    sandybrown           : {r: 244, g: 164, b: 96},
    seagreen             : {r: 46,  g: 139, b: 87},
    seashell             : {r: 255, g: 245, b: 238},
    sienna               : {r: 160, g: 82,  b: 45},
    skyblue              : {r: 135, g: 206, b: 235},
    slateblue            : {r: 106, g: 90,  b: 205},
    slategray            : {r: 112, g: 128, b: 144},
    slategrey            : {r: 112, g: 128, b: 144},
    snow                 : {r: 255, g: 250, b: 250},
    springgreen          : {r: 0,   g: 255, b: 127},
    steelblue            : {r: 70,  g: 130, b: 180},
    tan                  : {r: 210, g: 180, b: 140},
    thistle              : {r: 216, g: 191, b: 216},
    tomato               : {r: 255, g: 99,  b: 71},
    turquoise            : {r: 64,  g: 224, b: 208},
    violet               : {r: 238, g: 130, b: 238},
    wheat                : {r: 245, g: 222, b: 179},
    whitesmoke           : {r: 245, g: 245, b: 245},
    yellowgreen          : {r: 154, g: 205, b: 50}
}

},{}],13:[function(require,module,exports){
var util = require('./util');

module.exports = {
    parsers: [
        {
            example: [3554431, 16809984],
            regex: /^\d+$/,
            process: function (color){
                return {
                    //a: color >> 24 & 255,
                    r: color >> 16 & 255,
                    g: color >> 8 & 255,
                    b: color & 255
                };
            }
        },

        {
            example: ['#fb0', 'f0f'],
            regex: /^#?([\dA-F]{1})([\dA-F]{1})([\dA-F]{1})$/i,
            process: function (hex, r, g, b){
                return {
                    r: parseInt(r + r, 16),
                    g: parseInt(g + g, 16),
                    b: parseInt(b + b, 16)
                };
            }
        },

        {
            example: ['#00ff00', '336699'],
            regex: /^#?([\dA-F]{2})([\dA-F]{2})([\dA-F]{2})$/i,
            process: function (hex, r, g, b){
                return {
                    r: parseInt(r, 16),
                    g: parseInt(g, 16),
                    b: parseInt(b, 16)
                };
            }
        },

        {
            example: ['rgb(123, 234, 45)', 'rgb(25, 50%, 100%)', 'rgba(12%, 34, 56%, 0.78)'],
            // regex: /^rgba*\((\d{1,3}\%*),\s*(\d{1,3}\%*),\s*(\d{1,3}\%*)(?:,\s*([0-9.]+))?\)/,
            regex: /^rgba*\(([0-9]*\.?[0-9]+\%*),\s*([0-9]*\.?[0-9]+\%*),\s*([0-9]*\.?[0-9]+\%*)(?:,\s*([0-9.]+))?\)/,
            process: function (s,r,g,b,a)
            {
                r = r && r.slice(-1) == '%' ? (r.slice(0,-1) / 100) : r*1;
                g = g && g.slice(-1) == '%' ? (g.slice(0,-1) / 100) : g*1;
                b = b && b.slice(-1) == '%' ? (b.slice(0,-1) / 100) : b*1;
                a = a*1;

                return {
                    r: util.clamp(r, 0, 255),
                    g: util.clamp(g, 0, 255),
                    b: util.clamp(b, 0, 255),
                    a: util.clamp(a, 0, 1) || undefined
                };
            }
        },

        {
            example: ['hsl(123, 34%, 45%)', 'hsla(25, 50%, 100%, 0.75)', 'hsv(12, 34%, 56%)'],
            regex: /^hs([bvl])a*\((\d{1,3}\%*),\s*(\d{1,3}\%*),\s*(\d{1,3}\%*)(?:,\s*([0-9.]+))?\)/,
            process: function (c,lv,h,s,l,a)
            {
                h *= 1;
                s = s.slice(0,-1) / 100;
                l = l.slice(0,-1) / 100;
                a *= 1;

                var obj = {
                    h: util.clamp(h, 0, 360),
                    a: util.clamp(l, 0, 1)
                };
                // `s` is used in many different spaces (HSL, HSV, HSB)
                // so we use `sl`, `sv` and `sb` to differentiate
                obj['s'+lv] = util.clamp(s, 0, 1),
                obj[lv] = util.clamp(l, 0, 1);

                return obj;
            }
        }
    ]
};

},{"./util":15}],14:[function(require,module,exports){
module.exports = function ChromathPrototype(Chromath) {
  return {
      /*
         Method: toName
         Call <Chromath.toName> on the current instance
         > > var color = new Chromath('rgb(173, 216, 230)');
         > > color.toName();
         > "lightblue"
      */
      toName: function (){ return Chromath.toName(this); },

      /*
         Method: toString
         Display the instance as a string. Defaults to <Chromath.toHexString>
         > > var color = Chromath.rgb(56, 78, 90);
         > > Color.toHexString();
         > "#384E5A"
      */
      toString: function (){ return this.toHexString(); },

      /*
         Method: valueOf
         Display the instance as an integer. Defaults to <Chromath.toInteger>
         > > var yellow = new Chromath('yellow');
         > > yellow.valueOf();
         > 16776960
         > > +yellow
         > 16776960
      */
      valueOf: function (){ return Chromath.toInteger(this); },

    /*
       Method: rgb
       Return the RGB array of the instance
       > > new Chromath('red').rgb();
       > [255, 0, 0]
    */
      rgb: function (){ return this.toRGBArray(); },

      /*
         Method: toRGBArray
         Return the RGB array of the instance
         > > Chromath.burlywood.toRGBArray();
         > [255, 184, 135]
      */
      toRGBArray: function (){ return this.toRGBAArray().slice(0,3); },

      /*
         Method: toRGBObject
         Return the RGB object of the instance
         > > new Chromath('burlywood').toRGBObject();
         > {r: 255, g: 184, b: 135}
      */
      toRGBObject: function ()
      {
          var rgb = this.toRGBArray();

          return {r: rgb[0], g: rgb[1], b: rgb[2]};
      },

      /*
         Method: toRGBString
         Return the RGB string of the instance
         > > new Chromath('aliceblue').toRGBString();
         > "rgb(240,248,255)"
      */
      toRGBString: function ()
      {
          return "rgb("+ this.toRGBArray().join(",") +")";
      },

      /*
         Method: rgba
         Return the RGBA array of the instance
         > > new Chromath('red').rgba();
         > [255, 0, 0, 1]
      */
      rgba: function (){ return this.toRGBAArray(); },

      /*
         Method: toRGBAArray
         Return the RGBA array of the instance
         > > Chromath.lime.toRGBAArray();
         > [0, 255, 0, 1]
      */
      toRGBAArray: function ()
      {
          var rgba = [
              Math.round(this.r*255),
              Math.round(this.g*255),
              Math.round(this.b*255),
              parseFloat(this.a)
          ];

          return rgba;
      },

      /*
         Method: toRGBAObject
         Return the RGBA object of the instance
         > > Chromath.cadetblue.toRGBAObject();
         > {r: 95, g: 158, b: 160}
      */
      toRGBAObject: function ()
      {
          var rgba = this.toRGBAArray();

          return {r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3]};
      },

      /*
         Method: toRGBAString
         Return the RGBA string of the instance
         > > new Chromath('darkblue').toRGBAString();
         > "rgba(0,0,139,1)"
      */
      toRGBAString: function (){
          return "rgba("+ this.toRGBAArray().join(",") +")";
      },

      /*
         Method: hex
         Return the hex array of the instance
         > new Chromath('darkgreen').hex()
         [ '00', '64', '00' ]
      */
      hex: function (){ return this.toHexArray(); },

      /*
        Method: toHexArray
         Return the hex array of the instance
        > > Chromath.firebrick.toHexArray();
        > ["B2", "22", "22"]
      */
      toHexArray: function (){
          return Chromath.rgb2hex(this.r, this.g, this.b);
      },

      /*
         Method: toHexObject
         Return the hex object of the instance
         > > Chromath.gainsboro.toHexObject();
         > {r: "DC", g: "DC", b: "DC"}
      */
      toHexObject: function ()
      {
          var hex = this.toHexArray();

          return { r: hex[0], g: hex[1], b: hex[2] };
      },

      /*
        Method: toHexString
         Return the hex string of the instance
        > > Chromath.honeydew.toHexString();
        > "#F0FFF0"
      */
      toHexString: function (){
          var hex = this.toHexArray();

          return '#' + hex.join('');
      },

      /*
         Method: hsl
         Return the HSL array of the instance
         > >new Chromath('green').hsl();
         > [120, 1, 0.25098039215686274]
      */
      hsl: function (){ return this.toHSLArray(); },

      /*
         Method: toHSLArray
         Return the HSL array of the instance
         > > new Chromath('red').toHSLArray();
         > [0, 1, 0.5]
      */
      toHSLArray: function (){
          return this.toHSLAArray().slice(0,3);
      },

      /*
         Method: toHSLObject
         Return the HSL object of the instance
         > > new Chromath('red').toHSLObject();
         [h:0, s:1, l:0.5]
      */
      toHSLObject: function ()
      {
          var hsl = this.toHSLArray();

          return {h: hsl[0], s: hsl[1], l: hsl[2]};
      },

      /*
         Method: toHSLString
         Return the HSL string of the instance
         > > new Chromath('red').toHSLString();
         > "hsl(0,1,0.5)"
      */
      toHSLString: function (){
          var hsla = this.toHSLAArray();
          var vals = [
              hsla[0],
              Math.round(hsla[1]*100)+'%',
              Math.round(hsla[2]*100)+'%'
          ];

          return 'hsl('+ vals +')';
      },

      /*
        Method: hsla
        Return the HSLA array of the instance
        > > new Chromath('green').hsla();
        > [120, 1, 0.25098039215686274, 1]
      */
      hsla: function (){ return this.toHSLAArray(); },

      /*
         Method: toHSLArray
         Return the HSLA array of the instance
         > > Chromath.antiquewhite.toHSLAArray();
         > [34, 0.7777777777777773, 0.9117647058823529, 1]
      */
      toHSLAArray: function ()
      {
          return [
              Math.round(this.h),
              parseFloat(this.sl),
              parseFloat(this.l),
              parseFloat(this.a)
          ];
      },

      /*
         Method: toHSLAObject
         Return the HSLA object of the instance
         > > Chromath.antiquewhite.toHSLAArray();
         > {h:34, s:0.7777777777777773, l:0.9117647058823529, a:1}
      */
      toHSLAObject: function ()
      {
          var hsla = this.toHSLAArray();

          return {h: hsla[0], s: hsla[1], l: hsla[2], a: hsla[3]};
      },

      /*
         Method: toHSLAString
         Return the HSLA string of the instance
         > > Chromath.antiquewhite.toHSLAString();
         > "hsla(34,0.7777777777777773,0.9117647058823529,1)"
      */
      toHSLAString: function (){
          var hsla = this.toHSLAArray();
          var vals = [
              hsla[0],
              Math.round(hsla[1]*100)+'%',
              Math.round(hsla[2]*100)+'%',
              Math.round(hsla[3])
          ];

          return 'hsla('+ vals +')';
      },

      /*
         Method: hsv
         Return the HSV array of the instance
         > > new Chromath('blue').hsv();
         > [240, 1, 1]
      */
      hsv: function (){ return this.toHSVArray(); },

      /*
         Method: toHSVArray
         Return the HSV array of the instance
         > > new Chromath('navajowhite').toHSVArray();
         > [36, 0.32156862745098036, 1]
      */
      toHSVArray: function ()
      {
          return this.toHSVAArray().slice(0,3);
      },

      /*
         Method: toHSVObject
         Return the HSV object of the instance
         > > new Chromath('navajowhite').toHSVObject();
         > {h36, s:0.32156862745098036, v:1}
      */
      toHSVObject: function ()
      {
          var hsva = this.toHSVAArray();

          return {h: hsva[0], s: hsva[1], v: hsva[2]};
      },

      /*
         Method: toHSVString
         Return the HSV string of the instance
         > > new Chromath('navajowhite').toHSVString();
         > "hsv(36,32.15686274509804%,100%)"
      */
      toHSVString: function ()
      {
          var hsv = this.toHSVArray();
          var vals = [
              hsv[0],
              Math.round(hsv[1]*100)+'%',
              Math.round(hsv[2]*100)+'%'
          ];

          return 'hsv('+ vals +')';
      },

      /*
         Method: hsva
         Return the HSVA array of the instance
         > > new Chromath('blue').hsva();
         > [240, 1, 1, 1]
      */
      hsva: function (){ return this.toHSVAArray(); },

      /*
         Method: toHSVAArray
         Return the HSVA array of the instance
         > > new Chromath('olive').toHSVAArray();
         > [60, 1, 0.5019607843137255, 1]
      */
      toHSVAArray: function (){
          return [
              Math.round(this.h),
              parseFloat(this.sv),
              parseFloat(this.v),
              parseFloat(this.a)
          ];
      },

      /*
         Method: toHSVAObject
         Return the HSVA object of the instance
         > > new Chromath('olive').toHSVAArray();
         > {h:60, s: 1, v:0.5019607843137255, a:1}
      */
      toHSVAObject: function (){
          var hsva = this.toHSVAArray();

          return {h: hsva[0], s: hsva[1], l: hsva[2], a: hsva[3]};
      },

      /*
         Method: toHSVAString
         Return the HSVA string of the instance
         > > new Chromath('olive').toHSVAString();
         > "hsva(60,100%,50.19607843137255%,1)"
      */
      toHSVAString: function ()
      {
          var hsva = this.toHSVAArray();
          var vals = [
              hsva[0],
              Math.round(hsva[1]*100)+'%',
              Math.round(hsva[2]*100)+'%',
              hsva[3]
          ];

          return 'hsva('+ vals +')';
      },

      /*
         Method: hsb
         Alias for <hsv>
      */
      hsb: function (){ return this.hsv(); },

      /*
         Method: toHSBArray
         Alias for <toHSBArray>
      */
      toHSBArray: function ()
      {
          return this.toHSVArray();
      },

      /*
         Method: toHSBObject
         Alias for <toHSVObject>
      */
      toHSBObject: function ()
      {
          return this.toHSVObject();
      },

      /*
         Method: toHSBString
         Alias for <toHSVString>
      */
      toHSBString: function ()
      {
          return this.toHSVString();
      },

      /*
         Method: hsba
         Alias for <hsva>
      */
      hsba: function (){ return this.hsva(); },

      /*
         Method: toHSBAArray
         Alias for <toHSVAArray>
      */
      toHSBAArray: function (){
          return this.toHSVAArray();
      },

      /*
         Method: toHSBAObject
         Alias for <toHSVAObject>
      */
      toHSBAObject: function (){
          return this.toHSVAObject();
      },

      /*
         Method: toHSBAString
         Alias for <toHSVAString>
      */
      toHSBAString: function ()
      {
          return this.toHSVAString();
      },

      //Group: Instance methods - color scheme
      /*
         Method: complement
         Calls <Chromath.complement> with the current instance as the first parameter

         > > Chromath.red.complement().rgb();
         > [0, 255, 255]
      */
      complement: function (){
          return Chromath.complement(this);
      },

      /*
         Method: triad
         Calls <Chromath.triad> with the current instance as the first parameter

         > > new Chromath('hsl(0, 100%, 50%)').triad().toString();
         > "#FF0000,#00FF00,#0000FF"
      */
      triad: function (){
          return Chromath.triad(this);
      },

      /*
         Method: tetrad
         Calls <Chromath.tetrad> with the current instance as the first parameter

         > > Chromath.hsb(240, 1, 1).triad();
         > [Chromath, Chromath, Chromath]
      */
      tetrad: function (){
          return Chromath.tetrad(this);
      },

      /*
         Method: analogous
         Calls <Chromath.analogous> with the current instance as the first parameter

         > > Chromath.hsb(120, 1, 1).analogous();
         > [Chromath, Chromath, Chromath, Chromath, Chromath, Chromath, Chromath, Chromath]

         > > Chromath.hsb(180, 1, 1).analogous(5).toString();
         > "#00FFFF,#00FFB2,#00FFE5,#00E5FF,#00B2FF"

         > > Chromath.hsb(180, 1, 1).analogous(5, 10).toString();
         > "#00FFFF,#00FF19,#00FFB2,#00B2FF,#0019FF"
      */
      analogous: function (results, slices){
          return Chromath.analogous(this, results, slices);
      },

      /*
        Method: monochromatic
         Calls <Chromath.monochromatic> with the current instance as the first parameter

        > > Chromath.blue.monochromatic().toString();
        > "#000033,#000066,#000099,#0000CC,#0000FF"
      */
      monochromatic: function (results){
          return Chromath.monochromatic(this, results);
      },

      /*
         Method: splitcomplement
         Calls <Chromath.splitcomplement> with the current instance as the first parameter

         > > Chromath.blue.splitcomplement().toString();
         > "#0000FF,#FFCC00,#FF5100"
      */
      splitcomplement: function (){
          return Chromath.splitcomplement(this);
      },

      // Group: Instance methods - color alteration
      /*
         Method: tint
         Calls <Chromath.tint> with the current instance as the first parameter

         > > new Chromath('yellow').tint(0.25).toString();
         > "#FFFF3F"
      */
      tint: function (by) {
          return Chromath.tint(this, by);
      },

      /*
         Method: lighten
         Alias for <tint>
      */
      lighten: function (by) {
        return this.tint(by);
      },

      /*
        Method: shade
         Calls <Chromath.shade> with the current instance as the first parameter

        > > new Chromath('yellow').shade(0.25).toString();
        > "#BFBF00"
      */
      shade: function (by) {
          return Chromath.shade(this, by);
      },

      /*
         Method: darken
         Alias for <shade>
      */
      darken: function (by) {
        return this.shade(by);
      },

      /*
         Method: desaturate
         Calls <Chromath.desaturate> with the current instance as the first parameter

       > > new Chromath('orange').desaturate().toString();
       > "#ADADAD"

       > > new Chromath('orange').desaturate(1).toString();
       > "#5B5B5B"

       > > new Chromath('orange').desaturate(2).toString();
       > "#B4B4B4"
       */
      desaturate: function (formula){
          return Chromath.desaturate(this, formula);
      },

      /*
        Method: greyscale
        Alias for <desaturate>
      */
      greyscale: function (formula) {
        return this.desaturate(formula);
      },

      /*
         Method: websafe
         Calls <Chromath.websafe> with the current instance as the first parameter

         > > Chromath.rgb(123, 234, 56).toString();
         > "#7BEA38"

         > Chromath.rgb(123, 234, 56).websafe().toString();
         > "#66FF33"
       */
      websafe: function (){
          return Chromath.websafe(this);
      },

      // Group: Instance methods - color combination
      /*
         Method: additive
         Calls <Chromath.additive> with the current instance as the first parameter

         > > new Chromath('red').additive('#00FF00', 'blue').toString();
         > "#FFFFFF"
      */
      additive: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.additive.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: subtractive
         Calls <Chromath.subtractive> with the current instance as the first parameter

         > > new Chromath('cyan').subtractive('magenta', 'yellow').toString();
         > "#000000"
      */
      subtractive: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.subtractive.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: multiply
         Calls <Chromath.multiply> with the current instance as the first parameter

         > > Chromath.lightcyan.multiply(Chromath.brown).toString();
         > "#902A2A"
      */
      multiply: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.multiply.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: average
         Calls <Chromath.average> with the current instance as the first parameter

         > > Chromath.black.average('white').rgb();
         > [127, 127, 127]
      */
      average: function (){
          var arr = Array.prototype.slice.call(arguments);
          return Chromath.average.apply(Chromath, [this].concat(arr));
      },

      /*
         Method: overlay
         Calls <Chromath.overlay> with the current instance as the first parameter

       > > Chromath.red.overlay('green', 0.4).toString();
       > "#993300"

       > > Chromath.red.overlay('green', 1).toString();
       > "#008000"

       > > Chromath.red.overlay('green', 0).toString();
       > "#FF0000"
       */
      overlay: function (bottom, transparency){
          return Chromath.overlay(this, bottom, transparency);
      },

      // Group: Instance methods - other
      /*
         Method: clone
         Return an independent copy of the instance
      */
      clone: function (){
          return new Chromath(this);
      },

      /*
         Method: towards
         Calls <Chromath.towards> with the current instance as the first parameter

         > > var red = new Chromath('red');
         > > red.towards('yellow', 0.55).toString();
         > "#FF8C00"
      */
      towards: function (to, by) {
          return Chromath.towards(this, to, by);
      },

      /*
         Method: gradient
         Calls <Chromath.gradient> with the current instance as the first parameter

         > > new Chromath('#F00').gradient('#00F').toString()
         > "#FF0000,#F1000D,#E4001A,#D60028,#C90035,#BB0043,#AE0050,#A1005D,#93006B,#860078,#780086,#6B0093,#5D00A1,#5000AE,#4300BB,#3500C9,#2800D6,#1A00E4,#0D00F1,#0000FF"

         > > new Chromath('#F00').gradient('#00F', 5).toString()
         > "#FF0000,#BF003F,#7F007F,#3F00BF,#0000FF"

         > > new Chromath('#F00').gradient('#00F', 5, 3).toString()
         > "#3F00BF"
      */
      gradient: function (to, slices, slice){
          return Chromath.gradient(this, to, slices, slice);
      }
  };
};

},{}],15:[function(require,module,exports){
var util = {};

util.clamp = function ( val, min, max ) {
    if (val > max) return max;
    if (val < min) return min;
    return val;
};

util.merge = function () {
    var dest = arguments[0], i=1, source, prop;
    while (source = arguments[i++])
        for (prop in source) dest[prop] = source[prop];

    return dest;
};

util.isArray = function ( test ) {
    return Object.prototype.toString.call(test) === '[object Array]';
};

util.isString = function ( test ) {
    return Object.prototype.toString.call(test) === '[object String]';
};

util.isNumber = function ( test ) {
    return Object.prototype.toString.call(test) === '[object Number]';
};

util.isObject = function ( test ) {
    return Object.prototype.toString.call(test) === '[object Object]';
};

util.lpad = function ( val, len, pad ) {
    val = val.toString();
    if (!len) len = 2;
    if (!pad) pad = '0';

    while (val.length < len) val = pad+val;

    return val;
};

util.lerp = function (from, to, by) {
    return from + (to-from) * by;
};

util.times = function (n, fn, context) {
    for (var i = 0, results = []; i < n; i++) {
        results[i] = fn.call(context, i);
    }
    return results;
};

util.rgb = {
    fromArgs: function (r, g, b, a) {
        var rgb = arguments[0];

        if (util.isArray(rgb)){ r=rgb[0]; g=rgb[1]; b=rgb[2]; a=rgb[3]; }
        if (util.isObject(rgb)){ r=rgb.r; g=rgb.g; b=rgb.b; a=rgb.a;  }

        return [r, g, b, a];
    },
    scaled01: function (r, g, b) {
        if (!isFinite(arguments[1])){
            var rgb = util.rgb.fromArgs(r, g, b);
            r = rgb[0], g = rgb[1], b = rgb[2];
        }

        if (r > 1) r /= 255;
        if (g > 1) g /= 255;
        if (b > 1) b /= 255;

        return [r, g, b];
    },
    pctWithSymbol: function (r, g, b) {
        var rgb = this.scaled01(r, g, b);

        return rgb.map(function (v) {
            return Math.round(v * 255) + '%';
        });
    }
};

util.hsl = {
    fromArgs: function (h, s, l, a) {
        var hsl = arguments[0];

        if (util.isArray(hsl)){ h=hsl[0]; s=hsl[1]; l=hsl[2]; a=hsl[3]; }
        if (util.isObject(hsl)){ h=hsl.h; s=hsl.s; l=(hsl.l || hsl.v); a=hsl.a; }

        return [h, s, l, a];
    },
    scaled: function (h, s, l) {
        if (!isFinite(arguments[1])){
            var hsl = util.hsl.fromArgs(h, s, l);
            h = hsl[0], s = hsl[1], l = hsl[2];
        }

        h = (((h % 360) + 360) % 360);
        if (s > 1) s /= 100;
        if (l > 1) l /= 100;

        return [h, s, l];
    }
};

module.exports = util;

},{}],16:[function(require,module,exports){
(function (global){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Depricated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;return b.open("HEAD",a,!1),b.send(),200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||"object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}};f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],17:[function(require,module,exports){
(function (global){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.5.1";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function (u) {
            return (u.constructor === buffer.constructor ? u : buffer.from(u))
                .toString('base64')
        }
        :  function (u) {
            return (u.constructor === buffer.constructor ? u : new  buffer(u))
                .toString('base64')
        }
        : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function(a) {
            return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
        }
        : function(a) {
            return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
        }
        : function(a) { return btou(_atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        __buffer__: buffer
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],18:[function(require,module,exports){
"use strict";

//Craft object.protype
(function(){
	if( typeof(Object.addConstProp) == "function"){
		return;
	}
	
	
	function constProp(name_prop, value, vis){
		if(vis === undefined) vis = true;
		if(typeof value === "object") Object.freeze(value);
		Object.defineProperty(this, name_prop, {
				value: value,
				enumerable: vis
			});
	}
	function getSet(name, getter, setter){
		if(typeof setter == "function"){
			Object.defineProperty(this, name, {
				get: getter,
				set: setter,
				enumerable: true,
				configurable: true
			});
		}else{
			Object.defineProperty(this, name, {
				get: getter,
				enumerable: true,
				configurable: true
			});
		}
	}
	
	constProp.call(Object.prototype, 'addConstProp', constProp, false);
	Object.prototype.addConstProp('addGetSet', getSet, false);
	
	
	if(typeof(Object.prototype.toSource) !== "function"){
		Object.defineProperty(Object.prototype, 'toSource',{
			value: function(){
					var str = '{';
					for(var key in this){
						str += ' ' + key + ': ' + this[key] + ',';
					}
					if(str.length > 2) str = str.slice(0, -1) + ' ';
					return str + '}';
				},
			enumerable: false
		});
	}
	
	
	if(typeof(Object.values) !== "function"){
		var val_Obj = function(obj){
			var vals = [];
			
			for (var key in obj) {
				vals.push(obj[key]);
			}
			
			return vals;
		};
		
		 Object.addConstProp('values', val_Obj.bind(Object));
	}
	
	function randIndex(){
		var rand = Math.round((this.length - 1) * Math.random());
		return this[rand];
	}
	Array.prototype.addConstProp('rand_i', randIndex);
	
	
	function createArr(val, length, is_call){
		var arr = [];
		
		if(!length) length = 1;
		if(is_call === undefined) is_call = true;
		
		if(typeof val == 'function' && is_call){
			for(var i = 0; i < length; i++){
				arr.push(val(i, arr));
			}
		}else{
			
			for(var i = 0; i < length; i++){
				arr.push(val);
			}
		}
		
		return arr;
	}
	
	Array.prototype.addConstProp('add', function(val){
		if(!this._nulls) this._nulls = [];
		
		if(this._nulls.length){
			var ind = this._nulls.pop();
			this[ind] = val;
			return ind;
		}else{
			return this.push(val) - 1;
		}
	});
	
	Array.prototype.addConstProp('dell', function(ind){
		if(ind > this.length -1) return false;
		
		if(ind == this.length -1){
			this.pop();
		}else{
			if(!this._nulls) this._nulls = [];
			
			this[ind] = undefined;
			this._nulls.push(ind);
		}
		
		return true;	
	});
	
	Array.addConstProp('create', createArr);
	
	
	if(RegExp.prototype.toJSON !== "function"){
		RegExp.prototype.toJSON = function(){ return this.source; };
	}

})();





},{}],19:[function(require,module,exports){
'use strict';
new (function(){
	if(typeof(Object.addConstProp) !== "function"){
		if(typeof module == "object"){
			require("./mof.js");
		}else throw new Error("Требуеться библиотека mof.js");
	}

	if(typeof(Object.types) == "object"){
		return Object.types;
	}

	var T = this;
	var Doc = {
		types:{
			'bool':{
				name: "Boolean",
				arg: []
			},
			'const': {
				name: "Constant",
				arg: ["value"],
				params: { value: {type: "Something", default_value: null}}
			},
			'pos': {
				name: "Position",
				arg: ['max'],
				params: {max: {type: 'pos', default_value: +2147483647}}

			},

			'int': {
				name: "Integer",
				arg: ["max", "min", "step"],
				params: {
						max: {type: 'int', default_value: +2147483647},
						min: {type: 'int', default_value: -2147483648},
						step: {type: 'pos', default_value: 1}
					}
			},

			'num': {
				name: "Number",
				arg: ["max", "min", "precis"],
				params: {
						max: {type: 'num', default_value: +2147483647},
						min: {type: 'num', default_value: -2147483648},
						precis: {type: 'pos', default_value: 9}
					}
			},
			'arr': {
				name: "Array",
				arg: ["types", "size", "fixed"],
				params: {
						types: {type: "Type || [Type, Type...]", get default_value(){return T.pos}},
						size: {type: 'pos', default_value: 7},
						fixed: {type: 'bool', default_value: true}
					}
			},
			'any': {
				name: "MixType",
				arg: ["types"],
				params: {
						types: {type: "Type, Type... || [Type, Type...]", get default_value(){return [T.pos, T.str]}}
					}
			},
			'obj': {
				name: "Object",
				arg: ["types"],
				params: {types: {type: "Object", default_value: {}}}
			}
		},
		getConst: function(name_type, name_limit){
			return this.types[name_type].params[name_limit].default_value;
		}
	};
	this.doc = {};
	this.doc.json = JSON.stringify(Doc, "", 2);

	Doc.genDoc = (function(name, params){return {name: this.types[name].name, params: params}}).bind(Doc);
	this.doc.gen = Doc.genDoc;




	//Erros
	function argTypeError(wrong_arg, mess){
		if(mess === undefined) mess = '';
		var ER = new TypeError('Argument type is wrong! Arguments(' + forArg(wrong_arg) + ');' + mess);
		ER.wrong_arg = wrong_arg;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(ER, argTypeError);
		}

		return ER;

		function forArg(args){
			var str_args = '';
			for(var i = 0; i < args.length; i++){
				str_args += typeof(args[i]) + ': ' + args[i] + '; ';
			}
			return str_args;
		}
	}
	T.error = argTypeError;

	function typeSyntaxError(wrong_str, mess){
		if(mess === undefined) mess = '';
		var ER = new SyntaxError('Line: ' + wrong_str + '; ' + mess);
		ER.wrong_arg = wrong_str;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(ER, typeSyntaxError);
		}

		return ER;
	}



	function CreateCreator(New, test, rand, doc){
		var creator;
		if(typeof New === "function"){
			creator = function(){
				var tmp_obj = New.apply({}, arguments);
				var new_creator = new CreateCreator(New);
				for(var key in tmp_obj){
					new_creator.addConstProp(key, tmp_obj[key]);
				}
				return new_creator;
			};
		}else creator = function(){return creator};

		creator.addConstProp('is_creator', true);
		if(typeof test === "function") creator.addConstProp('test', test);
		if(typeof rand === "function") creator.addConstProp('rand', rand);
		if(typeof doc === "function") creator.addConstProp('doc', doc);

		return creator;
	}
	this.newType = function(key, desc, new_type){
		Doc.types[key] = desc;
		T.names[desc.name] = key;
		this.doc.json = JSON.stringify(Doc, "", 2);

		this[key] = new CreateCreator(new_type.New, new_type.test, new_type.rand, new_type.doc);
	}
	this.newType.doc = '(name, constructor, funcTest, funcRand, funcDoc)';



	//Craft Boolean
		this.bool = new CreateCreator(
			null,
			function(value){
				if(typeof value !== 'boolean'){
					return this.doc();
				}
			},
			function(){
				return !(Math.round(Math.random()));
			},
			Doc.genDoc.bind(null, "bool")
		);



	//Craft Const
		function docConst(val){

			if(typeof(val) === "object" && val !== null){
				val = 'Object';
			}
			if(typeof(val) === "function"){
				val = val.toString();
			}
			return Doc.genDoc.bind(null,"const", {value: val});
		}
		function newConst(val){
			return {
				rand: function(){return val},
				test: function(v){
					if(val !== v) return this.doc();
					return false;
				},
				doc: docConst(val)
			};
		}
		var def_const = newConst(Doc.getConst('const', 'value'));
		this.const = new CreateCreator(newConst, def_const.test, def_const.rand, def_const.doc);

		function tConst(Type){
			if(typeof (Type) !== "function" || !Type.is_creator){
				if(Array.isArray(Type)){

					return T.arr(Type);

				}else if(typeof(Type) == "object" && Type !== null){

					return T.obj(Type);

				}else return T.const(Type);
			}else{
				return Type;
			}
		}


	//Craft Number
		var randNum = function(max, min, precis){
			return function(){
				return +(((max - min)*Math.random() +  min).toFixed(precis));
			}
		};

		var testNum = function(max, min, precis){
			return function(n){
				if(typeof n !== 'number' || !isFinite(n)){
					return this.doc();
				}

				if((n > max)
					||(n < min)
					|| (n.toFixed(precis) != n && n !== 0) ){

					return this.doc();
				}
				return false;
			  };
		};

		var docNum = function(max, min, precis){
			return Doc.genDoc.bind(null, "num", {"max": max, "min": min, "precis": precis});
		}

		var max_def_n = Doc.getConst('num', 'max');
		var min_def_n = Doc.getConst('num', 'min');
		var precis_def = Doc.getConst('num', 'precis');

		this.num = new CreateCreator(
			function(max, min, precis){
				if(max === null) max = max_def_n;
				if(min === undefined||min === null) min = min_def_n;
				if(precis === undefined) precis = precis_def;

				if((typeof min !== 'number' || !isFinite(min))
					||(typeof max !== 'number' || !isFinite(max))
					||(typeof precis !== 'number' || !isFinite(precis))
					||(precis < 0)
					||(precis > 9)
					||(precis % 1 !== 0)){
					throw argTypeError(arguments, 'Wait arguments: min(number), max(number), precis(0<=number<9)');
				}
				if(min > max){
					var t = min;
					min = max;
					max = t;
				}

				return {
					test: testNum(max, min, precis),
					rand: randNum(max, min, precis),
					doc: docNum(max, min, precis)
				}
			},
			testNum(max_def_n, min_def_n, precis_def),
			randNum(max_def_n, min_def_n, precis_def),
			docNum(max_def_n, min_def_n, precis_def)
		);

		var randInt = function(max, min, precis){
			return function(){
				return Math.floor( ((max - (min + 0.1))/precis)*Math.random() ) * precis +  min;
			}
		};

		 var testInt = function(max, min, precis){
			return function(n){
				if(typeof n !== 'number' || !isFinite(n)){
					return this.doc();
				}

				if((n >= max)
					||(n < min)
					||(((n - min) % precis) !== 0) ){
					return this.doc();
				}
				return false;
			  };
		};

		var docInt = function(max, min, step){

				return Doc.genDoc.bind(null, "int", {"max": max, "min": min, "step": step});

		}

		var max_def = Doc.getConst('int', 'max');
		var min_def = Doc.getConst('int', 'min');
		var step_def = Doc.getConst('int', 'step');

		this.int = new CreateCreator(
			function(max, min, step){

				if(max === null) max = max_def;
				if(min === undefined||min === null) min = min_def;
				if(step === undefined) step = step_def;

				if((typeof min !== 'number' || !isFinite(min))
					||(typeof max !== 'number' || !isFinite(max))
					||(Math.round(min) !== min)
					||(Math.round(max) !== max)
					||(step <= 0)
					||(Math.round(step) !== step)){
					throw argTypeError(arguments, 'Wait arguments: min(int), max(int), step(int>0)');
				}
				if(min > max){
					var t = min;
					min = max;
					max = t;
				}

				return {
					test: testInt(max, min, step),
					rand: randInt(max, min, step),
					doc: docInt(max, min, step)
				}
			},
			testInt(max_def, min_def, step_def),
			randInt(max_def, min_def, step_def),
			docInt(max_def, min_def, step_def)
		);

		var docPos = function(max, min, step){

				return Doc.genDoc.bind(null, "pos", {"max": max});

		}

		var max_def_p = Doc.getConst('pos', 'max')
		this.pos = new CreateCreator(
			function(max){

				if(max === null) max = max_def_p;

				if((typeof max !== 'number' || !isFinite(max))
					||(max < 0)){
					throw argTypeError(arguments, 'Wait arguments: min(pos), max(pos), step(pos>0)');
				}

				return {
					test: testInt(max, 0, 1),
					rand: randInt(max, 0, 1),
					doc: docPos(max)
				}
			},
			testInt(max_def_p, 0, 1),
			randInt(max_def_p, 0, 1),
			docPos(max_def_p)
		);





  //Craft Any
		function randAny(arr){
			return function(){
				return arr.rand_i().rand();
			}
		}

		function testAny(arr){
			return function(val){
				if(arr.every(function(i){return i.test(val)})){
					return this.doc();
				}

				return false;
			}
		}

		function docAny(Types){

			var cont = Types.length;
			var type_docs = [];
			for(var i = 0; i < cont; i++){
				type_docs.push(Types[i].doc());
			}

			return Doc.genDoc.bind(null, "any", {types: type_docs});
		}

		var def_types = Doc.getConst('arr', 'types');
		function newAny(arr){
			if(!Array.isArray(arr) || arguments.length > 1) arr = arguments;

			var len = arr.length;
			var arr_types = [];
			for(var i = 0; i < len; i++){
				arr_types[i] = tConst(arr[i]);
			}

			return{
				test: testAny(arr_types),
				rand: randAny(arr_types),
				doc: docAny(arr_types)
			}
		}

		this.any = new CreateCreator(
			newAny,
			testAny(def_types),
			randAny(def_types),
			docAny(def_types)
		);



	//Craft Array



		function randArray(Type, size, is_fixed){
			var randSize = function (){return size};
			if(!is_fixed){
				randSize = T.pos(size).rand;
			}


			if(Array.isArray(Type)){
				var now_size = randSize();

				return function(){
					var arr = [];

					for(var i = 0, j = 0; i < now_size; i++){

						arr.push(Type[j].rand());

						j++;
						if(j >= Type.length){
							j = 0;
						}
					}
					return arr;
				}
			}



			return function(){
				var arr = [];

				var now_size = randSize();
				for(var i = 0; i < now_size; i++){
					arr.push(Type.rand(i, arr));
				}

				return arr;
			}

		}

		function testArray(Type, size, is_fixed){

			if(Array.isArray(Type)){
				return function(arr){

					if(!Array.isArray(arr)){
						var err = this.doc();
						err.params = "Value is not array!";
						return err;
					}

					if((arr.length > size) || (is_fixed && (arr.length !== size))){
						var err = this.doc();
						err.params = "Array lenght is wrong!";
						return err;
					}

					for(var i = 0, j = 0; i < arr.length; i++){

							var res = Type[j].test(arr[i]);
							if(res){
									var err = this.doc();
									err.params = {index: i, wrong_item: res};
									return err;
							}

							j++;
							if(j >= Type.length){
								j = 0;
							}
					}

					return false;
				}
			}

			return function(arr){
				if(!Array.isArray(arr)){
					var err = this.doc();
					err.params = "Value is not array!";
					return err;
				}

				if((arr.length > size) || (is_fixed && (arr.length !== size))){
					console.log(arr.length, size)
					var err = this.doc();
					err.params = "Array: lenght is wrong!";
					return err;
				}

				var err_arr = arr.filter(Type.test);
				if(err_arr.length != 0){
					var err = this.doc();
					err.params = err_arr;
					return err;
				}

				return false;
			}
		}

		function docArray(Type, size, is_fixed){
			var type_docs = [];
			if(Array.isArray(Type)){
				var cont = Type.length;
				for(var i = 0; i < cont; i++){
					type_docs.push(Type[i].doc());
				}
			}else{
				type_docs = Type.doc();
			}

			return Doc.genDoc.bind(null, "arr", {types: type_docs, size: size, fixed: is_fixed});

		}


		var def_Type = Doc.getConst('arr', 'types');
		var def_Size = Doc.getConst('arr', 'size');
		var def_fixed = Doc.getConst('arr', 'fixed');

		function newArray(Type, size, is_fixed){
			if(Type === null) Type = def_Type;
			if(is_fixed === undefined) is_fixed = def_fixed;

			if(Array.isArray(Type)){
				if(size === undefined||size === null) size = Type.length;

				Type = Type.map(function(item){return tConst(item);});
			}else{
				if(size === undefined||size === null) size = 1;
				Type = tConst(Type);
			}

			if(T.pos.test(size)){
					throw argTypeError(arguments, 'Wait arguments: ' + JSON.stringify(T.pos.test(size)));
			}

			return {
				test: testArray(Type, size, is_fixed),
				rand: randArray(Type, size, is_fixed),
				doc: docArray(Type, size, is_fixed)
			};
		}

		this.arr = new CreateCreator(
			newArray,
			testArray(def_Type, def_Size, def_fixed),
			randArray(def_Type, def_Size, def_fixed),
			docArray(def_Type, def_Size, def_fixed)
		);







	//Craft Object

		function randObj(funcObj){
			return function(){
				var obj = {};
				for(var key in funcObj){
					obj[key] = funcObj[key].rand();
				}
				return obj;
			};
		}

		function testObj(funcObj){
			return function(obj){

				if(typeof obj !== "object" && obj === null){
					var err = this.doc();
					err.params = "Value is not object!";
					return err;
				}

				for(var key in funcObj){
					var res = funcObj[key].test(obj[key]);
					if(res){
						var err = this.doc();
						err.params = {};
						err.params[key] = res;
						return err;
					}
				}

				return false;
			};
		}

		function docOb(funcObj){
			var doc_obj = {};

			for(var key in funcObj){
					doc_obj[key] = funcObj[key].doc();
			}

			return Doc.genDoc.bind(null, "obj", {types: doc_obj});
		}

		function NewObj(tempObj){
			if(typeof tempObj !== 'object') throw argTypeError(arguments, 'Wait arguments: tempObj(Object)');

			var begObj = {};
			var funcObj = {};
			for(var key in tempObj){
				funcObj[key] = tConst(tempObj[key]);
			}

			return{
				test: testObj(funcObj),
				rand: randObj(funcObj),
				doc: docOb(funcObj)
			}
		}
		this.obj = new CreateCreator(NewObj,
			function(obj){return typeof obj === "object"},
			randObj({}),
			Doc.genDoc.bind(null, "obj")
		);





//Craft Type out to  Document

	T.names = {};
	for(var key in Doc.types){
		T.names[Doc.types[key].name] = key;
	}

	this.outDoc = function(tmp){
		if((typeof tmp === "function") && tmp.is_creator) return tmp;

		if(!('name' in tmp)){
			throw new Error();
		}
		var type = tmp.name;

		if('params' in tmp){
			var params = tmp.params;
			switch(T.names[type]){
				case 'obj': {
					var new_obj = {};
					for(var key in params.types){
						new_obj[key] = T.outDoc(params.types[key]);
					}
					params.types = new_obj;
					break;
				}
				case 'any':
				case 'arr': {
					if(Array.isArray(params.types)){
						params.types = params.types.map(T.outDoc.bind(T));
					}else params.types = T.outDoc(params.types);
				}
			}
			return getSimpleType(T.names[type], params);
		}
		return getSimpleType(T.names[type], {});
	}

	function getSimpleType(name, params){
		var arg = [];
		Doc.types[name].arg.forEach(function(key, i){arg[i] = params[key];});
		return T[name].apply(T, arg);
	};

//Support Declarate Function

	function findeParse(str, beg, end){
		var point_beg = str.indexOf(beg);
		if(~point_beg){

			var point_end = point_beg;
			var point_temp = point_beg;
			var level = 1;
			var breakWhile = false;
			while(!breakWhile){
				breakWhile = true;

				if(~point_temp) point_temp = str.indexOf(beg, point_temp + 1);
				if(~point_end) point_end = str.indexOf(end, point_end + 1);

				if(point_temp < point_end){

					if(point_temp > 0){
						breakWhile = false;
						if(str[point_temp - 1] !== '\\') level = level+1;

					}


					if(point_end > 0){
						breakWhile = false;
						if(str[point_end - 1] !== '\\') level = level-1;
						if(level == 0){
							return [point_beg, point_end];
						}
					}
				}else{
					if(point_end > 0){
						breakWhile = false;
						if(str[point_end - 1] !== '\\') level = level-1;
						if(level == 0){
							return [point_beg, point_end];
						}
					}

					if(point_temp > 0){
						breakWhile = false;
						if(str[point_temp - 1] !== '\\') level = level+1;

					}
				}
			}
		}
		return false;
	}

	Object.types = T;
})();

},{"./mof.js":18}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkNvbnRyb2wuanMiLCJDclN3aXRjaGVzLmpzIiwiRHJhdy5qcyIsIkV2ZW50cy5qcyIsIkxvZ2ljLmpzIiwiU3dpdGNoLmpzIiwiU3lzRmlsZXMuanMiLCJicm9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tYXRoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tYXRoL3NyYy9jaHJvbWF0aC5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbWF0aC9zcmMvY29sb3JuYW1lc19jc3MyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9tYXRoL3NyYy9jb2xvcm5hbWVzX2NzczMuanMiLCJub2RlX21vZHVsZXMvY2hyb21hdGgvc3JjL3BhcnNlcnMuanMiLCJub2RlX21vZHVsZXMvY2hyb21hdGgvc3JjL3Byb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbWF0aC9zcmMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9maWxlLXNhdmVyL2Rpc3QvRmlsZVNhdmVyLm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9qcy1iYXNlNjQvYmFzZTY0LmpzIiwibm9kZV9tb2R1bGVzL3R5cGVzanMvbW9mLmpzIiwibm9kZV9tb2R1bGVzL3R5cGVzanMvdHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam5DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbHJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNHQTtBQUNBO0FBQ0E7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgSGVhciA9IHJlcXVpcmUoXCIuL0V2ZW50cy5qc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTG9naWMpe1xyXG5cclxuXHRcclxuXHRIZWFyKFwic3dpdGNoQWN0XCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcclxuXHRcdExvZ2ljLnN3aXRjaFNwYWNlKCk7XHJcblx0fSk7XHJcblxyXG5cdEhlYXIoXCJUaWxlc1wiLCBcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFxyXG5cdFx0aWYoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcInRpbGVcIikgIT09IG51bGwpe1xyXG5cdFx0XHRMb2dpYy5jaGFuZ2VUaWxlKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImNhdGVnXCIpLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwidGlsZVwiKSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdEhlYXIoXCJPYmplY3RzXCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHJcblx0XHRpZihldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwidGlsZVwiKSAhPT0gbnVsbCl7XHJcblx0XHRcdExvZ2ljLmNoYW5nZU9ianMoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY2F0ZWdcIiksIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0aWxlXCIpKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHRIZWFyKFwiQWRkXCIsIFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XHJcblx0XHRpZih0aGlzLmZpbGVzWzBdKSBcclxuXHRcdFx0TG9naWMuYWRkVGlsZXNldCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxuXHRcclxuXHR2YXIgY3Vyc29yTGluZSA9IG51bGw7XHJcblx0XHJcblx0XHJcblx0SGVhcihcIkdyaWRcIiwgXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0Y3Vyc29yTGluZSA9IFtldmVudC50YXJnZXQueCwgZXZlbnQudGFyZ2V0LnldO1xyXG5cdH0pO1xyXG5cdEhlYXIoXCJHcmlkXCIsIFwibW91c2V1cFwiLCBmdW5jdGlvbihldmVudCl7XHJcblx0XHRpZihldmVudC5jdHJsS2V5KVxyXG5cdFx0XHRMb2dpYy5jbGVhcihjdXJzb3JMaW5lLCBbZXZlbnQudGFyZ2V0LngsIGV2ZW50LnRhcmdldC55XSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdExvZ2ljLmRyYXcoY3Vyc29yTGluZSwgW2V2ZW50LnRhcmdldC54LCBldmVudC50YXJnZXQueV0pO1xyXG5cclxuXHRcdGN1cnNvckxpbmUgPSBudWxsO1xyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxuXHJcbiIsImNvbnN0IEhlYXIgPSByZXF1aXJlKFwiLi9FdmVudHMuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oRHJhdyl7XG5cblx0SGVhcihcInN3aXRjaEFjdFwiLCBcImNsaWNrXCIsIERyYXcuY3JTd2l0Y2goXCJpbnZpc1wiLCBbXCJUaWxlc1wiLCBcIk9iamVjdHNcIl0pKTtcblxuXHRIZWFyKFwiVGlsZXNcIiwgXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCl7XG5cdFx0aWYoZXZlbnQudGFyZ2V0LnN3aXQpIGV2ZW50LnRhcmdldC5zd2l0KCk7XG5cdH0pO1xuXG5cdEhlYXIoXCJPYmplY3RzXCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdGlmKGV2ZW50LnRhcmdldC5zd2l0KSBldmVudC50YXJnZXQuc3dpdCgpO1xuXHR9KTtcblxuXHRIZWFyKFwic3dpdGNoR3JpZFwiLCBcImNsaWNrXCIsIERyYXcuY3JTd2l0Y2goXCJncmlkXCIsIFwiR3JpZFwiKSk7XG5cblx0SGVhcihcIkdyaWRcIiwgXCJkcmFnc3RhcnRcIiwgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH0pO1xufTsiLCJyZXF1aXJlKFwidHlwZXNqc1wiKTtcclxuY29uc3QgUkdCID0gcmVxdWlyZSgnY2hyb21hdGgnKS5yZ2I7XHJcbnZhciBCYXNlNjQgPSByZXF1aXJlKCdqcy1iYXNlNjQnKS5CYXNlNjQ7XHJcblxyXG5jb25zdCBDclN3aXRjaGVzID0gcmVxdWlyZShcIi4vQ3JTd2l0Y2hlcy5qc1wiKTtcclxuXHJcbnZhciBpZF9ncm91bmQgPSBcIkdyb3VuZFwiO1xyXG52YXIgaWRfYm94cyA9IFwiQm94c1wiO1xyXG52YXIgaWRfZ3JpZCA9IFwiR3JpZFwiO1xyXG52YXIgaWRfdGlsZXMgPSBcIlRpbGVzXCI7XHJcbnZhciBpZF9vYmplY3RzID0gXCJPYmplY3RzXCI7XHJcbnZhciBpZF9wYWxsZXQgPSBcIlBhbGxldFwiO1xyXG5cclxudmFyIHNpemUgPSAyMDtcclxuXHJcbmZ1bmN0aW9uIENyU3BhY2UoaWRfbWFwLCBzaXplKXtcclxuXHR2YXIgY29udGFpbmVyID0gZ2V0Tm9kZShpZF9tYXApO1xyXG5cdFxyXG5cdHZhciBjb29yZF9hcnJfdGlsZXMgPSBBcnJheS5jcmVhdGUoQXJyYXkuY3JlYXRlLmJpbmQobnVsbCwgbnVsbCwgMjApLCAyMCk7XHJcblx0dGhpcy5hZGQgPSBmdW5jdGlvbihuZXdfdGlsZSwgeCwgeSl7XHJcblx0XHR2YXIgdGlsZSA9IGRyYXdUaWxlKG5ld190aWxlKTtcclxuXHRcdHRpbGUuc3R5bGUud2lkdGggPSAobmV3X3RpbGUud2lkdGggKiAoMTAwIC8gc2l6ZSkpICsgXCIlXCI7XHJcblx0XHR0aWxlLnN0eWxlLmhlaWdodCA9IChuZXdfdGlsZS5oZWlnaHQgKiAoMTAwIC8gc2l6ZSkpICsgXCIlXCI7XHJcblx0XHRcclxuXHRcdHRpbGUuc3R5bGUubGVmdCA9ICh4ICogKDEwMCAvIHNpemUpKSArIFwiJVwiO1xyXG5cdFx0dGlsZS5zdHlsZS50b3AgPSAoeSAqICgxMDAgLyBzaXplKSkgKyBcIiVcIjtcclxuXHRcdFxyXG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHRpbGUpO1xyXG5cdFx0Y29vcmRfYXJyX3RpbGVzW3hdW3ldID0gdGlsZTtcclxuXHR9XHJcblx0dGhpcy5kZWxsID0gZnVuY3Rpb24oYm94KXtcclxuXHRcdGNvb3JkX2Fycl90aWxlc1tib3gueF1bYm94LnldLnJlbW92ZSgpO1xyXG5cdFx0Y29vcmRfYXJyX3RpbGVzW2JveC54XVtib3gueV0gPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBOb3JtVGlsZSh0aWxlKXtcclxuXHRcdHZhciBib3ggPSBnZXRDb21wdXRlZFN0eWxlKHRpbGUpO1xyXG5cdFx0dGlsZS5zdHlsZS5sZWZ0ID0gTm9ybUNvb3JkKHBhcnNlRmxvYXQoYm94LmxlZnQpLCBwYXJzZUZsb2F0KGJveC53aWR0aCkpICsgXCIlXCI7XHJcblx0XHR0aWxlLnN0eWxlLnRvcCA9IE5vcm1Db29yZChwYXJzZUZsb2F0KGJveC50b3ApLCBwYXJzZUZsb2F0KGJveC5oZWlnaHQpKSArIFwiJVwiO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBOb3JtQ29vcmQoY29vcmQsIHMpe1xyXG5cdFx0dmFyIGNvbl9zaXplID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGNvbnRhaW5lcikud2lkdGgpO1xyXG5cdFx0XHJcblx0XHRpZihjb29yZCArIHMgPiBjb25fc2l6ZSkgY29vcmQgPSBjb25fc2l6ZSAtIHM7XHJcblx0XHRpZihjb29yZCA8IDApIGNvb3JkID0gMDtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIE1hdGgucm91bmQoKGNvb3JkIC8gY29uX3NpemUpICogc2l6ZSkgKiAoMTAwIC8gc2l6ZSk7XHJcblx0fVxyXG5cdFxyXG59XHJcblxyXG5mdW5jdGlvbiBDclRpbGVzKGlkX2NvbnRhaW5lcil7XHJcblx0dmFyIGNvbnRhaW5lciA9IGdldE5vZGUoaWRfY29udGFpbmVyKTtcclxuXHRcclxuXHR0aGlzLmFkZCA9IGZ1bmN0aW9uKFRpbGVzZXQpe1xyXG5cdFx0dmFyIGNhdGVnID0gZHJhd0NhdGVnKFRpbGVzZXQpO1xyXG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGNhdGVnKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENyUGFsbGV0KCl7XHJcblx0dmFyIGNvbnRhaW5lciA9IGdldE5vZGUoaWRfcGFsbGV0KTtcclxuXHRcclxuXHR0aGlzLmNoYW5nZSA9IGZ1bmN0aW9uKHRpbGUpe1xyXG5cdFx0aWYoY29udGFpbmVyLmNoaWxkcmVuWzBdKSBcclxuXHRcdFx0Y29udGFpbmVyLmNoaWxkcmVuWzBdLnJlbW92ZSgpO1xyXG5cclxuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChkcmF3VGlsZSh0aWxlKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBlbmRUaWxlKHRpbGUsIHgsIHkpe1xyXG5cdGlmKHRpbGUuZHVyYWJpbGl0eSkgXHJcblx0XHR0aGlzLmJveHMuYWRkKHRpbGUsIHgsIHkpO1xyXG5cdGVsc2VcclxuXHRcdHRoaXMubWFwLmFkZCh0aWxlLCB4LCB5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVGlsZShib3gpe1xyXG5cdGlmKGJveC50aWxlLmR1cmFiaWxpdHkpIFxyXG5cdFx0dGhpcy5ib3hzLmRlbGwoYm94KTtcclxuXHRlbHNlXHJcblx0XHRjb25zb2xlLmxvZyhcIiEhISEhIVwiKTtcclxufVxyXG5cclxuZHJhd0dyaWQoZ2V0Tm9kZShpZF9ncmlkKSwgc2l6ZSk7XHJcblxyXG4gdmFyIERyYXcgPSB7XHJcblx0bWFwOiBuZXcgQ3JTcGFjZShpZF9ncm91bmQsIHNpemUpLFxyXG5cdGJveHM6IG5ldyBDclNwYWNlKGlkX2JveHMsIHNpemUpLFxyXG5cdGFwcGVuZDogYXBwZW5kVGlsZSxcclxuXHRyZW1vdmU6IHJlbW92ZVRpbGUsXHJcblx0cGFsbGV0OiBuZXcgQ3JQYWxsZXQoaWRfcGFsbGV0KSxcclxuXHR0aWxlczogbmV3IENyVGlsZXMoaWRfdGlsZXMpLFxyXG5cdG9iamVjdHM6IG5ldyBDclRpbGVzKGlkX29iamVjdHMpLFxyXG5cdGNyU3dpdGNoOiAgcmVxdWlyZShcIi4vU3dpdGNoLmpzXCIpXHJcbn07XHJcbkNyU3dpdGNoZXMoRHJhdyk7XHJcbm1vZHVsZS5leHBvcnRzID0gRHJhdztcclxuXHJcbmZ1bmN0aW9uIGRyYXdHcmlkKGNvbnRhaW5lciwgZ3JpZF9zaXplKXtcclxuXHRcdHZhciBzaXplID0gMTAwIC8gZ3JpZF9zaXplO1xyXG5cdFx0Zm9yKHZhciBpID0gZ3JpZF9zaXplIC0gMTsgaSA+PSAwOyBpLS0pe1xyXG5cdFx0XHRmb3IodmFyIGogPSBncmlkX3NpemUgLSAxOyBqID49IDA7IGotLSl7XHJcblx0XHRcdFx0dmFyIGJveCA9IGRhcndCb3goaSpzaXplLCBqKnNpemUsIHNpemUpO1xyXG5cdFx0XHRcdGJveC54ID0gaTtcclxuXHRcdFx0XHRib3gueSA9IGo7XHJcblx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGJveCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbmZ1bmN0aW9uIGRhcndCb3goeCwgeSwgc2l6ZSl7XHJcblx0dmFyIGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdGJveC5jbGFzc0xpc3QuYWRkKFwiYm94XCIpO1xyXG5cdGJveC5zdHlsZS53aWR0aCA9IHNpemUgKyBcIiVcIjtcclxuXHRib3guc3R5bGUuaGVpZ2h0ID0gc2l6ZSArIFwiJVwiO1xyXG5cdFxyXG5cdGJveC5zdHlsZS5sZWZ0ID0geCArIFwiJVwiO1xyXG5cdGJveC5zdHlsZS50b3AgPSB5ICsgXCIlXCI7XHJcblx0XHJcblx0cmV0dXJuIGJveDtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBTYXZlKG5hbWUsIHRleHQpe1xyXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLThcIn0pO1xyXG5cdEZpbGVTYXZlci5zYXZlQXMoYmxvYiwgbmFtZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENyU3dpdGNoVHdvKGlkLCBmaXJzdF9pZCwgbmFtZV9jbGFzcyl7XHJcblx0dmFyIGVsZW0gPSBnZXROb2RlKGlkKS5jbGFzc0xpc3Q7XHJcblx0dmFyIGZpcnN0X2VsZW0gPSBnZXROb2RlKGZpcnN0X2lkKS5jbGFzc0xpc3Q7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRlbGVtLnRvZ2dsZShuYW1lX2NsYXNzKTtcclxuXHRcdGZpcnN0X2VsZW0udG9nZ2xlKG5hbWVfY2xhc3MpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0NhdGVnKG5ld190aWxlc2V0KXtcclxuXHR2YXIgY2F0ZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRjYXRlZy5jbGFzc0xpc3QuYWRkKFwicGFuZWwtY29sdW1uXCIpO1xyXG5cdFxyXG5cdHZhciB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XHJcblx0dGl0bGUuaW5uZXJIVE1MID0gbmV3X3RpbGVzZXQubmFtZTtcclxuXHR0aXRsZS5jbGFzc0xpc3QuYWRkKFwidGl0bGUtY2F0ZWdcIik7XHJcblx0XHJcblx0XHJcblx0Ly92YXIgY2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuXHQvL2Nsb3NlLmlubmVySFRNTCA9IFwiLVwiO1xyXG5cdC8vdGl0bGUuYXBwZW5kQ2hpbGQoY2xvc2UpO1xyXG5cdFxyXG5cdGNhdGVnLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHRcclxuXHR2YXIgbGlzdCA9IGRyYXdUaWxlcyhuZXdfdGlsZXNldC50aWxlcyk7XHJcblx0bGlzdC5zZXRBdHRyaWJ1dGUoXCJjYXRlZ1wiLCBuZXdfdGlsZXNldC5pZCk7XHJcblx0XHJcblx0dGl0bGUuc3dpdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRsaXN0LmNsYXNzTGlzdC50b2dnbGUoXCJpbnZpc1wiKTtcclxuXHR9XHJcblx0XHJcblx0Y2F0ZWcuYXBwZW5kQ2hpbGQobGlzdCk7XHJcblx0XHJcblx0cmV0dXJuIGNhdGVnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3VGlsZXModGlsZXMpe1xyXG5cdHZhciBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0bGlzdC5jbGFzc0xpc3QuYWRkKFwicGFuZWwtd3JhcFwiKTtcclxuXHRcclxuXHR0aWxlcy5tYXAoZHJhd1RpbGUpLmZvckVhY2gobGlzdC5hcHBlbmRDaGlsZC5iaW5kKGxpc3QpKTtcclxuXHRyZXR1cm4gbGlzdDtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1RpbGUobmV3X3RpbGUpe1xyXG5cdFxyXG5cdGlmKG5ld190aWxlLnR5cGUgPT0gXCJjb2xvclwiKXtcclxuXHRcdHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGltZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBuZXcgUkdCKG5ld190aWxlLmNvbG9yKS50b1N0cmluZygpO1xyXG5cdH1cclxuXHRpZihuZXdfdGlsZS50eXBlID09IFwic3ZnXCIgfHwgbmV3X3RpbGUudHlwZSA9PSBcInBoaXNpY1wiKXtcclxuXHRcdHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHRcdGltZy5zcmMgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsXCIrIEJhc2U2NC5lbmNvZGUobmV3X3RpbGUuaW1nKTtcclxuXHR9XHJcblxyXG5cdGltZy5jbGFzc0xpc3QuYWRkKFwidGlsZVwiKTtcclxuXHRpbWcuc2V0QXR0cmlidXRlKFwidGlsZVwiLCBuZXdfdGlsZS5pZCk7XHJcblx0aW1nLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCB0cnVlKTtcclxuXHRcclxuXHRyZXR1cm4gaW1nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXROb2RlKGlkKXtcclxuXHR2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHRpZighZWxlbSkgdGhyb3cgbmV3IEVycm9yKFwiRWxlbSBpcyBub3QgZmluZCFcIik7XHJcblx0cmV0dXJuIGVsZW07XHJcbn1cclxuIiwiXHJcbmZ1bmN0aW9uIElkRXZlbnQoaWQsIG5hbWVfZXZlbnQsIGZ1bmMpe1xyXG5cdFxyXG5cdGlmKG5hbWVfZXZlbnQgPT0gXCJzdWJtaXRcIil7XHJcblx0XHR2YXIgb2xkX2Z1bmMgPSBmdW5jO1xyXG5cdFx0ZnVuYyA9IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdG9sZF9mdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHR9IFxyXG5cdH1cclxuXHRcclxuXHRpZihBcnJheS5pc0FycmF5KG5hbWVfZXZlbnQpKXtcclxuXHRcdG5hbWVfZXZlbnQuZm9yRWFjaChuYW1lID0+IGdldE5vZGUoaWQpLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZnVuYykpO1xyXG5cdH1cclxuXHRlbHNlIGdldE5vZGUoaWQpLmFkZEV2ZW50TGlzdGVuZXIobmFtZV9ldmVudCwgZnVuYyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFN1Ym1pdChmdW5jKXtcclxuXHRyZXR1cm4gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE5vZGUoaWQpe1xyXG5cdHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cdGlmKCFlbGVtKSB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtIGlzIG5vdCBmaW5kIVwiKTtcclxuXHRyZXR1cm4gZWxlbTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJZEV2ZW50O1xyXG4iLCJjb25zdCBGaWxlcyA9IHJlcXVpcmUoXCIuL1N5c0ZpbGVzLmpzXCIpO1xyXG5cclxudmFyIFRpbGVzZXRzID0gW107XHJcbnZhciBHcm91bmQgPSBBcnJheS5jcmVhdGUoQXJyYXkuY3JlYXRlLmJpbmQobnVsbCwgbnVsbCwgMjApLCAyMCk7XHJcbnZhciBPYmplY3RzID0gQXJyYXkuY3JlYXRlKEFycmF5LmNyZWF0ZS5iaW5kKG51bGwsIG51bGwsIDIwKSwgMjApO1xyXG5cclxuZnVuY3Rpb24gQ3JMb2dpYyhEcmF3KXtcclxuXHR2YXIgY3VycmVudF90aWxlID0gbnVsbDtcclxuXHR2YXIgY3VycmVudF9vYmpzID0gbnVsbDtcclxuXHJcblx0dmFyIHN3aXRjaFNwYWNlID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy5hZGRUaWxlc2V0ID0gZnVuY3Rpb24oZmlsZSl7XHJcblx0XHRGaWxlcy5vcGVuKGZpbGUsIGZ1bmN0aW9uKGZpbGUpe1xyXG5cdFx0XHR2YXIgdGlsZXNldCA9IEpTT04ucGFyc2UoZmlsZS5jb250ZW50KTtcclxuXHRcdFx0dGlsZXNldC5uYW1lID0gZmlsZS5uYW1lO1xyXG5cdFx0XHRhZGRUaWxlc2V0KHRpbGVzZXQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLnN3aXRjaFNwYWNlID0gZnVuY3Rpb24oKXtcclxuXHRcdHN3aXRjaFNwYWNlID0gIXN3aXRjaFNwYWNlO1xyXG5cclxuXHRcdGlmKCFzd2l0Y2hTcGFjZSAmJiBjdXJyZW50X3RpbGUpXHJcblx0XHRcdERyYXcucGFsbGV0LmNoYW5nZShjdXJyZW50X3RpbGUpO1xyXG5cdFx0ZWxzZSBpZihjdXJyZW50X29ianMpIFxyXG5cdFx0XHREcmF3LnBhbGxldC5jaGFuZ2UoY3VycmVudF9vYmpzKTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5jaGFuZ2VUaWxlID0gZnVuY3Rpb24oaWRfY2F0ZWcsIGlkX3RpbGUpe1xyXG5cdFx0Y3VycmVudF90aWxlID0gVGlsZXNldHNbaWRfY2F0ZWddLnRpbGVzW2lkX3RpbGVdO1xyXG5cdFx0XHJcblx0XHRkZWZTaXplKGN1cnJlbnRfdGlsZSwgaWRfY2F0ZWcpXHJcblx0XHREcmF3LnBhbGxldC5jaGFuZ2UoY3VycmVudF90aWxlKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuY2hhbmdlT2JqcyA9IGZ1bmN0aW9uKGlkX2NhdGVnLCBpZF90aWxlKXtcclxuXHRcdGN1cnJlbnRfb2JqcyA9IFRpbGVzZXRzW2lkX2NhdGVnXS50aWxlc1tpZF90aWxlXTtcclxuXHRcdFxyXG5cdFx0ZGVmU2l6ZShjdXJyZW50X29ianMsIGlkX2NhdGVnKTtcclxuXHRcdERyYXcucGFsbGV0LmNoYW5nZShjdXJyZW50X29ianMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGVmU2l6ZSh0aWxlLCBpZF9jYXRlZyl7XHJcblx0XHRpZighdGlsZS53aWR0aCkgdGlsZS53aWR0aCA9IFRpbGVzZXRzW2lkX2NhdGVnXS53aWR0aDtcclxuXHRcdGlmKCF0aWxlLmhlaWdodCkgdGlsZS5oZWlnaHQgPSBUaWxlc2V0c1tpZF9jYXRlZ10uaGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLmRyYXcgPSBmdW5jdGlvbihiZWcsIGVuZCl7XHJcblx0XHRpZighc3dpdGNoU3BhY2UgJiYgY3VycmVudF90aWxlKVxyXG5cdFx0XHRmaWxsKEdyb3VuZCwgY3VycmVudF90aWxlLCBiZWcsIGVuZCk7XHJcblx0XHJcblx0XHRlbHNlIGlmKGlzX2VtcHR5KE9iamVjdHMsIGJlZywgZW5kKSAmJiBjdXJyZW50X29ianMpXHJcblx0XHRcdGZpbGwoT2JqZWN0cywgY3VycmVudF9vYmpzLCBiZWcsIGVuZCk7XHJcblxyXG5cdH1cclxuXHR0aGlzLmNsZWFyID0gZnVuY3Rpb24oYmVnLCBlbmQpe1xyXG5cdFx0aWYoIXN3aXRjaFNwYWNlKVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcIiEhISEhISEhXCIpO1xyXG5cdFx0ZWxzZSBcclxuXHRcdFx0Y2xlYXIoT2JqZWN0cywgYmVnLCBlbmQpO1xyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGFkZFRpbGVzZXQoVGlsZXNldCl7XHJcblx0XHR2YXIgb2JqcyA9IFtdO1xyXG5cdFx0dmFyIHRpbGVzID0gW107XHJcblxyXG5cdFx0VGlsZXNldC50aWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUsIGlkKXtcclxuXHRcdFx0aWYodGlsZS50eXBlICE9IFwicGhpc2ljXCIpXHJcblx0XHRcdFx0dGlsZS5pZCA9IHRpbGVzLnB1c2godGlsZSkgLSAxO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGlsZS5pZCA9IG9ianMucHVzaCh0aWxlKSAtIDE7XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgT2JqU2V0ID0gT2JqZWN0LmFzc2lnbih7fSwgVGlsZXNldCk7XHJcblx0XHRPYmpTZXQudGlsZXMgPSBvYmpzO1xyXG5cclxuXHRcdFRpbGVzZXQudGlsZXMgPSB0aWxlcztcclxuXHJcblx0XHRjb25zb2xlLmxvZyhUaWxlc2V0LCBPYmpTZXQpO1xyXG5cclxuXHRcdFRpbGVzZXQuaWQgPSBUaWxlc2V0cy5hZGQoVGlsZXNldCk7XHJcblx0XHREcmF3LnRpbGVzLmFkZChUaWxlc2V0KTtcclxuXHJcblx0XHRPYmpTZXQuaWQgPSBUaWxlc2V0cy5hZGQoT2JqU2V0KTtcclxuXHRcdERyYXcub2JqZWN0cy5hZGQoT2JqU2V0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZpbGwoTWFwLCB0aWxlLCBiZWcsIGVuZCl7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgaW5jX3ggPSB0aWxlLndpZHRoO1xyXG5cdFx0XHR2YXIgaW5jX3kgPSB0aWxlLmhlaWdodDtcclxuXHRcdFx0XHJcblx0XHRcdGZvcih2YXIgaSA9IGJlZ1swXTsgaSArIGluY194IDw9IGVuZFswXSArIDE7IGkgPSBpICsgaW5jX3gpe1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IGJlZ1sxXTsgaiArIGluY195IDw9IGVuZFsxXSArIDE7IGogPSBqICsgaW5jX3kpe1xyXG5cdFx0XHRcdFx0ZHJhd1RpbGUoTWFwLCBpLCBqLCB0aWxlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGNsZWFyKE1hcCwgYmVnLCBlbmQpe1xyXG5cdFx0XHRcclxuXHRcdGZvcih2YXIgaSA9IGJlZ1swXTsgaSA8PSBlbmRbMF07IGkrKyl7XHJcblx0XHRcdGZvcih2YXIgaiA9IGJlZ1sxXTsgaiA8PSBlbmRbMV07IGorKyl7XHJcblx0XHRcdFx0aWYoTWFwW2pdW2ldICE9PSBudWxsKXtcclxuXHRcdFx0XHRcdGRlbGxUaWxlKE1hcCwgTWFwW2pdW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpc19lbXB0eShNYXAsIGJlZywgZW5kKXtcclxuXHRcdHZhciBlbXB0eSA9IHRydWU7XHJcblxyXG5cdFx0Zm9yKHZhciBpID0gYmVnWzBdOyBpIDw9IGVuZFswXTsgaSsrKXtcclxuXHRcdFx0Zm9yKHZhciBqID0gYmVnWzFdOyBqIDw9IGVuZFsxXTsgaisrKXtcclxuXHRcdFx0XHRlbXB0eSA9IGVtcHR5ICYmIChNYXBbal1baV0gPT0gbnVsbCk7XHJcblx0XHRcdFx0aWYoIWVtcHR5KSByZXR1cm4gZW1wdHk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZW1wdHk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGRyYXdUaWxlKE1hcCwgeCwgeSwgdGlsZSl7XHJcblx0XHR4ID0gTWF0aC5mbG9vcih4KTtcclxuXHRcdHkgPSBNYXRoLmZsb29yKHkpO1xyXG5cclxuXHRcdHZhciBib3ggPSB7dGlsZTogdGlsZSwgeDogeCwgeTogeX07XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aWxlLndpZHRoOyBpKyspe1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGlsZS5oZWlnaHQ7IGorKyl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0TWFwW2oreV1baSt4XSA9IGJveDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHREcmF3LmFwcGVuZCh0aWxlLCB4LCB5KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGRlbGxUaWxlKE1hcCwgYm94KXtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGJveC50aWxlLndpZHRoOyBpKyspe1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgYm94LnRpbGUuaGVpZ2h0OyBqKyspe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdE1hcFtqK2JveC55XVtpK2JveC54XSA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0RHJhdy5yZW1vdmUoYm94KTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3JMb2dpYztcclxuIiwiZnVuY3Rpb24gQ3JTd2l0Y2gobmFtZV9jbGFzcywgaWRzKXtcblx0aWYoQXJyYXkuaXNBcnJheShpZHMpKXtcblx0XHR2YXIgZWxlbXMgPSBpZHMubWFwKGdldE5vZGUpO1xuXHRcdGVsZW1zID0gZWxlbXMubWFwKGVsZW0gPT4gZWxlbS5jbGFzc0xpc3QpO1xuXG5cdFx0cmV0dXJuIGFyclN3aWN0aC5iaW5kKG51bGwsIGVsZW1zLCBuYW1lX2NsYXNzKTtcblx0fVxuXHRlbHNlIGlmKHR5cGVvZiBpZHMgPT0gXCJvYmplY3RcIil7XG5cdFx0cmV0dXJuIG9ialN3aXRjaChpZHMsIG5hbWVfY2xhc3MpO1xuXHR9XG5cdGVsc2V7XG5cdFx0dmFyIGVsZW0gPSBnZXROb2RlKGlkcykuY2xhc3NMaXN0O1xuXHRcdHJldHVybiBvbmVTd2l0Y2guYmluZChudWxsLCBuYW1lX2NsYXNzLCBlbGVtKTtcblx0fVxuXHRcbn1cblxuZnVuY3Rpb24gb2JqU3dpdGNoKGlkX29iaiwgY2xhc3NfbmFtZSl7XG5cdGZvciAodmFyIGtleSBpbiBpZF9vYmope1xuXHRcdGlkX29ialtrZXldID0gZ2V0Tm9kZShpZF9vYmpba2V5XSkuY2xhc3NMaXN0O1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uKGlkKXtcblx0XHRmb3IgKHZhciBpIGluIGlkX29iail7XG5cdFx0XHRpZF9vYmpbaV0uYWRkKGNsYXNzX25hbWUpO1xuXHRcdH1cblx0XHRcblx0XHRpZF9vYmpbaWRdLnJlbW92ZShjbGFzc19uYW1lKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhcnJTd2ljdGgoZWxlbV9hcnIsIG5hbWVfY2xhc3Mpe1xuXHRlbGVtX2Fyci5mb3JFYWNoKG9uZVN3aXRjaC5iaW5kKG51bGwsIG5hbWVfY2xhc3MpKTtcbn1cblxuZnVuY3Rpb24gb25lU3dpdGNoKG5hbWVfY2xhc3MsIGVsZW0pe1xuXHRcdGVsZW0udG9nZ2xlKG5hbWVfY2xhc3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyU3dpdGNoO1xuXG5mdW5jdGlvbiBnZXROb2RlKGlkKXtcblx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdGlmKCFlbGVtKSB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtIGlzIG5vdCBmaW5kIVwiKTtcblx0cmV0dXJuIGVsZW07XG59IiwidmFyIEZpbGVTYXZlciA9IHJlcXVpcmUoJ2ZpbGUtc2F2ZXInKTtcblxuZnVuY3Rpb24gT3BlbihmaWxlLCBjYWxsYmFjayl7XG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdGZpbGUuY29udGVudCA9IGUudGFyZ2V0LnJlc3VsdDtcblx0XHRmaWxlLm5hbWUgPSBuYW1lO1xuXHRcdGNhbGxiYWNrKGZpbGUpO1xuXHR9O1xuXHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbn1cblxuZnVuY3Rpb24gU2F2ZShuYW1lLCB0ZXh0KXtcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHt0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtOFwifSk7XG5cdEZpbGVTYXZlci5zYXZlQXMoYmxvYiwgbmFtZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge3NhdmU6IFNhdmUsIG9wZW46IE9wZW59OyIsImNvbnN0IERyYXcgPSByZXF1aXJlKFwiLi9EcmF3LmpzXCIpO1xyXG5jb25zdCBDckxvZ2ljID0gcmVxdWlyZShcIi4vTG9naWMuanNcIik7XHJcbmNvbnN0IENyQ29udHIgPSByZXF1aXJlKFwiLi9Db250cm9sLmpzXCIpO1xyXG5cclxudmFyIExvZ2ljID0gbmV3IENyTG9naWMoRHJhdyk7XHJcbkNyQ29udHIoTG9naWMpO1xyXG4iLCJ2YXIgQ2hyb21hdGggPSByZXF1aXJlKCcuL3NyYy9jaHJvbWF0aC5qcycpO1xubW9kdWxlLmV4cG9ydHMgPSBDaHJvbWF0aDtcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG4vKlxuICAgQ2xhc3M6IENocm9tYXRoXG4qL1xuLy8gR3JvdXA6IENvbnN0cnVjdG9yc1xuLypcbiAgIENvbnN0cnVjdG9yOiBDaHJvbWF0aFxuICAgQ3JlYXRlIGEgbmV3IENocm9tYXRoIGluc3RhbmNlIGZyb20gYSBzdHJpbmcgb3IgaW50ZWdlclxuXG4gICBQYXJhbWV0ZXJzOlxuICAgbWl4ZWQgLSBUaGUgdmFsdWUgdG8gdXNlIGZvciBjcmVhdGluZyB0aGUgY29sb3JcblxuICAgUmV0dXJuczpcbiAgIDxDaHJvbWF0aD4gaW5zdGFuY2VcblxuICAgUHJvcGVydGllczpcbiAgIHIgLSBUaGUgcmVkIGNoYW5uZWwgb2YgdGhlIFJHQiByZXByZXNlbnRhdGlvbiBvZiB0aGUgQ2hyb21hdGguIEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMjU1LlxuICAgZyAtIFRoZSBncmVlbiBjaGFubmVsIG9mIHRoZSBSR0IgcmVwcmVzZW50YXRpb24gb2YgdGhlIENocm9tYXRoLiBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDI1NS5cbiAgIGIgLSBUaGUgYmx1ZSBjaGFubmVsIG9mIHRoZSBSR0IgcmVwcmVzZW50YXRpb24gb2YgdGhlIENocm9tYXRoLiBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDI1NS5cbiAgIGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBvZiB0aGUgQ2hyb21hdGguIEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMS5cbiAgIGggLSBUaGUgaHVlIG9mIHRoZSBDaHJvbWF0aC4gQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAzNjAuXG4gICBzbCAtIFRoZSBzYXR1cmF0aW9uIG9mIHRoZSBIU0wgcmVwcmVzZW50YXRpb24gb2YgdGhlIENocm9tYXRoLiBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEuXG4gICBzdiAtIFRoZSBzYXR1cmF0aW9uIG9mIHRoZSBIU1YvSFNCIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBDaHJvbWF0aC4gQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxLlxuICAgbCAtIFRoZSBsaWdodG5lc3Mgb2YgdGhlIEhTTCByZXByZXNlbnRhdGlvbiBvZiB0aGUgQ2hyb21hdGguIEEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMS5cbiAgIHYgLSBUaGUgbGlnaHRuZXNzIG9mIHRoZSBIU1YvSFNCIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBDaHJvbWF0aC4gQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxLlxuXG4gICBFeGFtcGxlczpcbiAgKHN0YXJ0IGNvZGUpXG4vLyBUaGVyZSBhcmUgbWFueSB3YXlzIHRvIGNyZWF0ZSBhIENocm9tYXRoIGluc3RhbmNlXG5uZXcgQ2hyb21hdGgoJyNGRjAwMDAnKTsgICAgICAgICAgICAgICAgICAvLyBIZXggKDYgY2hhcmFjdGVycyB3aXRoIGhhc2gpXG5uZXcgQ2hyb21hdGgoJ0ZGMDAwMCcpOyAgICAgICAgICAgICAgICAgICAvLyBIZXggKDYgY2hhcmFjdGVycyB3aXRob3V0IGhhc2gpXG5uZXcgQ2hyb21hdGgoJyNGMDAnKTsgICAgICAgICAgICAgICAgICAgICAvLyBIZXggKDMgY2hhcmFjdGVycyB3aXRoIGhhc2gpXG5uZXcgQ2hyb21hdGgoJ0YwMCcpOyAgICAgICAgICAgICAgICAgICAgICAvLyBIZXggKDMgY2hhcmFjdGVycyB3aXRob3V0IGhhc2gpXG5uZXcgQ2hyb21hdGgoJ3JlZCcpOyAgICAgICAgICAgICAgICAgICAgICAvLyBDU1MvU1ZHIENvbG9yIG5hbWVcbm5ldyBDaHJvbWF0aCgncmdiKDI1NSwgMCwgMCknKTsgICAgICAgICAgIC8vIFJHQiB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe3I6IDI1NSwgZzogMCwgYjogMH0pOyAgICAgICAvLyBSR0IgdmlhIG9iamVjdFxubmV3IENocm9tYXRoKCdyZ2JhKDI1NSwgMCwgMCwgMSknKTsgICAgICAgLy8gUkdCQSB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe3I6IDI1NSwgZzogMCwgYjogMCwgYTogMX0pOyAvLyBSR0JBIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgnaHNsKDAsIDEwMCUsIDUwJSknKTsgICAgICAgIC8vIEhTTCB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe2g6IDAsIHM6IDEsIGw6IDAuNX0pOyAgICAgICAvLyBIU0wgdmlhIG9iamVjdFxubmV3IENocm9tYXRoKCdoc2xhKDAsIDEwMCUsIDUwJSwgMSknKTsgICAgLy8gSFNMQSB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe2g6IDAsIHM6IDEsIGw6IDAuNSwgYTogMX0pOyAvLyBIU0xBIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgnaHN2KDAsIDEwMCUsIDEwMCUpJyk7ICAgICAgIC8vIEhTViB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe2g6IDAsIHM6IDEsIHY6IDF9KTsgICAgICAgICAvLyBIU1YgdmlhIG9iamVjdFxubmV3IENocm9tYXRoKCdoc3ZhKDAsIDEwMCUsIDEwMCUsIDEpJyk7ICAgLy8gSFNWQSB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe2g6IDAsIHM6IDEsIHY6IDEsIGE6IDF9KTsgICAvLyBIU1ZBIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgnaHNiKDAsIDEwMCUsIDEwMCUpJyk7ICAgICAgIC8vIEhTQiB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe2g6IDAsIHM6IDEsIGI6IDF9KTsgICAgICAgICAvLyBIU0IgdmlhIG9iamVjdFxubmV3IENocm9tYXRoKCdoc2JhKDAsIDEwMCUsIDEwMCUsIDEpJyk7ICAgLy8gSFNCQSB2aWEgQ1NTXG5uZXcgQ2hyb21hdGgoe2g6IDAsIHM6IDEsIGI6IDEsIGE6IDF9KTsgICAvLyBIU0JBIHZpYSBvYmplY3Rcbm5ldyBDaHJvbWF0aCgxNjcxMTY4MCk7ICAgICAgICAgICAgICAgICAgIC8vIFJHQiB2aWEgaW50ZWdlciAoYWxwaGEgY3VycmVudGx5IGlnbm9yZWQpXG4oZW5kIGNvZGUpXG4qL1xuZnVuY3Rpb24gQ2hyb21hdGgoIG1peGVkIClcbntcbiAgICB2YXIgY2hhbm5lbHMsIGNvbG9yLCBoc2wsIGhzdiwgcmdiO1xuXG4gICAgaWYgKHV0aWwuaXNTdHJpbmcobWl4ZWQpIHx8IHV0aWwuaXNOdW1iZXIobWl4ZWQpKSB7XG4gICAgICAgIGNoYW5uZWxzID0gQ2hyb21hdGgucGFyc2UobWl4ZWQpO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc0FycmF5KG1peGVkKSl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXJlIGhvdyB0byBwYXJzZSBhcnJheSBgJyttaXhlZCsnYCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJywgcGxlYXNlIHBhc3MgYW4gb2JqZWN0IG9yIENTUyBzdHlsZSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdvciB0cnkgQ2hyb21hdGgucmdiLCBDaHJvbWF0aC5oc2wsIG9yIENocm9tYXRoLmhzdidcbiAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKG1peGVkIGluc3RhbmNlb2YgQ2hyb21hdGgpIHtcbiAgICAgICAgY2hhbm5lbHMgPSB1dGlsLm1lcmdlKHt9LCBtaXhlZCk7XG4gICAgfSBlbHNlIGlmICh1dGlsLmlzT2JqZWN0KG1peGVkKSl7XG4gICAgICAgIGNoYW5uZWxzID0gdXRpbC5tZXJnZSh7fSwgbWl4ZWQpO1xuICAgIH1cblxuICAgIGlmICghIGNoYW5uZWxzKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBgJyttaXhlZCsnYCcpO1xuICAgIGVsc2UgaWYgKCFpc0Zpbml0ZShjaGFubmVscy5hKSlcbiAgICAgICAgY2hhbm5lbHMuYSA9IDE7XG5cbiAgICBpZiAoJ3InIGluIGNoYW5uZWxzICl7XG4gICAgICAgIHJnYiA9IHV0aWwucmdiLnNjYWxlZDAxKFtjaGFubmVscy5yLCBjaGFubmVscy5nLCBjaGFubmVscy5iXSk7XG4gICAgICAgIGhzbCA9IENocm9tYXRoLnJnYjJoc2wocmdiKTtcbiAgICAgICAgaHN2ID0gQ2hyb21hdGgucmdiMmhzdihyZ2IpO1xuICAgIH0gZWxzZSBpZiAoJ2gnIGluIGNoYW5uZWxzICl7XG4gICAgICAgIGlmICgnbCcgaW4gY2hhbm5lbHMpe1xuICAgICAgICAgICAgaHNsID0gdXRpbC5oc2wuc2NhbGVkKFtjaGFubmVscy5oLCBjaGFubmVscy5zLCBjaGFubmVscy5sXSk7XG4gICAgICAgICAgICByZ2IgPSBDaHJvbWF0aC5oc2wycmdiKGhzbCk7XG4gICAgICAgICAgICBoc3YgPSBDaHJvbWF0aC5yZ2IyaHN2KHJnYik7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3YnIGluIGNoYW5uZWxzIHx8ICdiJyBpbiBjaGFubmVscykge1xuICAgICAgICAgICAgaWYgKCdiJyBpbiBjaGFubmVscykgY2hhbm5lbHMudiA9IGNoYW5uZWxzLmI7XG4gICAgICAgICAgICBoc3YgPSB1dGlsLmhzbC5zY2FsZWQoW2NoYW5uZWxzLmgsIGNoYW5uZWxzLnMsIGNoYW5uZWxzLnZdKTtcbiAgICAgICAgICAgIHJnYiA9IENocm9tYXRoLmhzdjJyZ2IoaHN2KTtcbiAgICAgICAgICAgIGhzbCA9IENocm9tYXRoLnJnYjJoc2wocmdiKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdXRpbC5tZXJnZSh0aGlzLCB7XG4gICAgICAgIHI6ICByZ2JbMF0sICBnOiByZ2JbMV0sIGI6IHJnYlsyXSxcbiAgICAgICAgaDogIGhzbFswXSwgc2w6IGhzbFsxXSwgbDogaHNsWzJdLFxuICAgICAgICBzdjogaHN2WzFdLCAgdjogaHN2WzJdLCBhOiBjaGFubmVscy5hXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLypcbiAgQ29uc3RydWN0b3I6IENocm9tYXRoLnJnYlxuICBDcmVhdGUgYSBuZXcgPENocm9tYXRoPiBpbnN0YW5jZSBmcm9tIFJHQiB2YWx1ZXNcblxuICBQYXJhbWV0ZXJzOlxuICByIC0gTnVtYmVyLCAwLTI1NSwgcmVwcmVzZW50aW5nIHRoZSBncmVlbiBjaGFubmVsIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIHIsZyxiKSBvZiBSR0IgdmFsdWVzXG4gIGcgLSBOdW1iZXIsIDAtMjU1LCByZXByZXNlbnRpbmcgdGhlIGdyZWVuIGNoYW5uZWxcbiAgYiAtIE51bWJlciwgMC0yNTUsIHJlcHJlc2VudGluZyB0aGUgcmVkIGNoYW5uZWxcbiAgYSAtIChPcHRpb25hbCkgRmxvYXQsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBhbHBoYSBjaGFubmVsXG5cbiBSZXR1cm5zOlxuIDxDaHJvbWF0aD5cblxuIEV4YW1wbGVzOlxuID4gPiBuZXcgQ2hyb21hdGgucmdiKDEyMywgMjM0LCA1NikudG9TdHJpbmcoKVxuID4gXCIjN0JFQTM4XCJcblxuID4gPiBuZXcgQ2hyb21hdGgucmdiKFsxMjMsIDIzNCwgNTZdKS50b1N0cmluZygpXG4gPiBcIiM3QkVBMzhcIlxuXG4gPiA+IG5ldyBDaHJvbWF0aC5yZ2Ioe3I6IDEyMywgZzogMjM0LCBiOiA1Nn0pLnRvU3RyaW5nKClcbiA+IFwiIzdCRUEzOFwiXG4gKi9cbkNocm9tYXRoLnJnYiA9IGZ1bmN0aW9uIChyLCBnLCBiLCBhKVxue1xuICAgIHZhciByZ2JhID0gdXRpbC5yZ2IuZnJvbUFyZ3MociwgZywgYiwgYSk7XG4gICAgciA9IHJnYmFbMF0sIGcgPSByZ2JhWzFdLCBiID0gcmdiYVsyXSwgYSA9IHJnYmFbM107XG5cbiAgICByZXR1cm4gbmV3IENocm9tYXRoKHtyOiByLCBnOiBnLCBiOiBiLCBhOiBhfSk7XG59O1xuXG4vKlxuICBDb25zdHJ1Y3RvcjogQ2hyb21hdGgucmdiYVxuICBBbGlhcyBmb3IgPENocm9tYXRoLnJnYj5cbiovXG5DaHJvbWF0aC5yZ2JhID0gQ2hyb21hdGgucmdiO1xuXG4vKlxuICBDb25zdHJ1Y3RvcjogQ2hyb21hdGguaHNsXG4gIENyZWF0ZSBhIG5ldyBDaHJvbWF0aCBpbnN0YW5jZSBmcm9tIEhTTCB2YWx1ZXNcblxuICBQYXJhbWV0ZXJzOlxuICBoIC0gTnVtYmVyLCAtSW5maW5pdHkgLSBJbmZpbml0eSwgcmVwcmVzZW50aW5nIHRoZSBodWUgT1IgQXJyYXkgT1Igb2JqZWN0ICh3aXRoIGtleXMgaCxzLGwpIG9mIEhTTCB2YWx1ZXNcbiAgcyAtIE51bWJlciwgMC0xLCByZXByZXNlbnRpbmcgdGhlIHNhdHVyYXRpb25cbiAgbCAtIE51bWJlciwgMC0xLCByZXByZXNlbnRpbmcgdGhlIGxpZ2h0bmVzc1xuICBhIC0gKE9wdGlvbmFsKSBGbG9hdCwgMC0xLCByZXByZXNlbnRpbmcgdGhlIGFscGhhIGNoYW5uZWxcblxuICBSZXR1cm5zOlxuICA8Q2hyb21hdGg+XG5cbiAgRXhhbXBsZXM6XG4gID4gPiBuZXcgQ2hyb21hdGguaHNsKDI0MCwgMSwgMC41KS50b1N0cmluZygpXG4gID4gXCIjMDAwMEZGXCJcblxuICA+ID4gbmV3IENocm9tYXRoLmhzbChbMjQwLCAxLCAwLjVdKS50b1N0cmluZygpXG4gID4gXCIjMDAwMEZGXCJcblxuICA+IG5ldyBDaHJvbWF0aC5oc2woe2g6MjQwLCBzOjEsIGw6MC41fSkudG9TdHJpbmcoKVxuICA+IFwiIzAwMDBGRlwiXG4gKi9cbkNocm9tYXRoLmhzbCA9IGZ1bmN0aW9uIChoLCBzLCBsLCBhKVxue1xuICAgIHZhciBoc2xhID0gdXRpbC5oc2wuZnJvbUFyZ3MoaCwgcywgbCwgYSk7XG4gICAgaCA9IGhzbGFbMF0sIHMgPSBoc2xhWzFdLCBsID0gaHNsYVsyXSwgYSA9IGhzbGFbM107XG5cbiAgICByZXR1cm4gbmV3IENocm9tYXRoKHtoOiBoLCBzOiBzLCBsOiBsLCBhOiBhfSk7XG59O1xuXG4vKlxuICBDb25zdHJ1Y3RvcjogQ2hyb21hdGguaHNsYVxuICBBbGlhcyBmb3IgPENocm9tYXRoLmhzbD5cbiovXG5DaHJvbWF0aC5oc2xhID0gQ2hyb21hdGguaHNsO1xuXG4vKlxuICBDb25zdHJ1Y3RvcjogQ2hyb21hdGguaHN2XG4gIENyZWF0ZSBhIG5ldyBDaHJvbWF0aCBpbnN0YW5jZSBmcm9tIEhTViB2YWx1ZXNcblxuICBQYXJhbWV0ZXJzOlxuICBoIC0gTnVtYmVyLCAtSW5maW5pdHkgLSBJbmZpbml0eSwgcmVwcmVzZW50aW5nIHRoZSBodWUgT1IgQXJyYXkgT1Igb2JqZWN0ICh3aXRoIGtleXMgaCxzLGwpIG9mIEhTViB2YWx1ZXNcbiAgcyAtIE51bWJlciwgMC0xLCByZXByZXNlbnRpbmcgdGhlIHNhdHVyYXRpb25cbiAgdiAtIE51bWJlciwgMC0xLCByZXByZXNlbnRpbmcgdGhlIGxpZ2h0bmVzc1xuICBhIC0gKE9wdGlvbmFsKSBGbG9hdCwgMC0xLCByZXByZXNlbnRpbmcgdGhlIGFscGhhIGNoYW5uZWxcblxuICBSZXR1cm5zOlxuICA8Q2hyb21hdGg+XG5cbiAgRXhhbXBsZXM6XG4gID4gPiBuZXcgQ2hyb21hdGguaHN2KDI0MCwgMSwgMSkudG9TdHJpbmcoKVxuICA+IFwiIzAwMDBGRlwiXG5cbiAgPiA+IG5ldyBDaHJvbWF0aC5oc3YoWzI0MCwgMSwgMV0pLnRvU3RyaW5nKClcbiAgPiBcIiMwMDAwRkZcIlxuXG4gID4gPiBuZXcgQ2hyb21hdGguaHN2KHtoOjI0MCwgczoxLCB2OjF9KS50b1N0cmluZygpXG4gID4gXCIjMDAwMEZGXCJcbiAqL1xuQ2hyb21hdGguaHN2ID0gZnVuY3Rpb24gKGgsIHMsIHYsIGEpXG57XG4gICAgdmFyIGhzdmEgPSB1dGlsLmhzbC5mcm9tQXJncyhoLCBzLCB2LCBhKTtcbiAgICBoID0gaHN2YVswXSwgcyA9IGhzdmFbMV0sIHYgPSBoc3ZhWzJdLCBhID0gaHN2YVszXTtcblxuICAgIHJldHVybiBuZXcgQ2hyb21hdGgoe2g6IGgsIHM6IHMsIHY6IHYsIGE6IGF9KTtcbn07XG5cbi8qXG4gIENvbnN0cnVjdG9yOiBDaHJvbWF0aC5oc3ZhXG4gIEFsaWFzIGZvciA8Q2hyb21hdGguaHN2PlxuKi9cbkNocm9tYXRoLmhzdmEgPSBDaHJvbWF0aC5oc3Y7XG5cbi8qXG4gIENvbnN0cnVjdG9yOiBDaHJvbWF0aC5oc2JcbiAgQWxpYXMgZm9yIDxDaHJvbWF0aC5oc3Y+XG4gKi9cbkNocm9tYXRoLmhzYiA9IENocm9tYXRoLmhzdjtcblxuLypcbiAgIENvbnN0cnVjdG9yOiBDaHJvbWF0aC5oc2JhXG4gICBBbGlhcyBmb3IgPENocm9tYXRoLmhzdmE+XG4gKi9cbkNocm9tYXRoLmhzYmEgPSBDaHJvbWF0aC5oc3ZhO1xuXG4vLyBHcm91cDogU3RhdGljIG1ldGhvZHMgLSByZXByZXNlbnRhdGlvblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC50b0ludGVnZXJcbiAgQ29udmVydCBhIGNvbG9yIGludG8gYW4gaW50ZWdlciAoYWxwaGEgY2hhbm5lbCBjdXJyZW50bHkgb21pdHRlZClcblxuICBQYXJhbWV0ZXJzOlxuICBjb2xvciAtIEFjY2VwdHMgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBDaHJvbWF0aCBjb25zdHJ1Y3RvclxuXG4gIFJldHVybnM6XG4gIGludGVnZXJcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLnRvSW50ZWdlcignZ3JlZW4nKTtcbiAgPiAzMjc2OFxuXG4gID4gPiBDaHJvbWF0aC50b0ludGVnZXIoJ3doaXRlJyk7XG4gID4gMTY3NzcyMTVcbiovXG5DaHJvbWF0aC50b0ludGVnZXIgPSBmdW5jdGlvbiAoY29sb3IpXG57XG4gICAgLy8gY3JlYXRlIHNvbWV0aGluZyBsaWtlICcwMDgwMDAnIChncmVlbilcbiAgICB2YXIgaGV4NiA9IG5ldyBDaHJvbWF0aChjb2xvcikuaGV4KCkuam9pbignJyk7XG5cbiAgICAvLyBBcmd1bWVudHMgYmVnaW5uaW5nIHdpdGggYDB4YCBhcmUgdHJlYXRlZCBhcyBoZXggdmFsdWVzXG4gICAgcmV0dXJuIE51bWJlcignMHgnICsgaGV4Nik7XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLnRvTmFtZVxuICBSZXR1cm4gdGhlIFczQyBjb2xvciBuYW1lIG9mIHRoZSBjb2xvciBpdCBtYXRjaGVzXG5cbiAgUGFyYW1ldGVyczpcbiAgY29tcGFyaXNvblxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGgudG9OYW1lKCdyZ2IoMjU1LCAwLCAyNTUpJyk7XG4gID4gJ2Z1Y2hzaWEnXG5cbiAgPiA+IENocm9tYXRoLnRvTmFtZSg2NTUzNSk7XG4gID4gJ2FxdWEnXG4qL1xuQ2hyb21hdGgudG9OYW1lID0gZnVuY3Rpb24gKGNvbXBhcmlzb24pXG57XG4gICAgY29tcGFyaXNvbiA9ICtuZXcgQ2hyb21hdGgoY29tcGFyaXNvbik7XG4gICAgZm9yICh2YXIgY29sb3IgaW4gQ2hyb21hdGguY29sb3JzKSBpZiAoK0Nocm9tYXRoW2NvbG9yXSA9PSBjb21wYXJpc29uKSByZXR1cm4gY29sb3I7XG59O1xuXG4vLyBHcm91cDogU3RhdGljIG1ldGhvZHMgLSBjb2xvciBjb252ZXJzaW9uXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLnJnYjJoZXhcbiAgQ29udmVydCBhbiBSR0IgdmFsdWUgdG8gYSBIZXggdmFsdWVcblxuICBSZXR1cm5zOiBhcnJheVxuXG4gIEV4YW1wbGU6XG4gID4gPiBDaHJvbWF0aC5yZ2IyaGV4KDUwLCAxMDAsIDE1MClcbiAgPiBcIlszMiwgNjQsIDk2XVwiXG4gKi9cbkNocm9tYXRoLnJnYjJoZXggPSBmdW5jdGlvbiByZ2IyaGV4KHIsIGcsIGIpXG57XG4gICAgdmFyIHJnYiA9IHV0aWwucmdiLnNjYWxlZDAxKHIsIGcsIGIpO1xuICAgIHZhciBoZXggPSByZ2IubWFwKGZ1bmN0aW9uIChwY3QpIHtcbiAgICAgIHZhciBkZWMgPSBNYXRoLnJvdW5kKHBjdCAqIDI1NSk7XG4gICAgICB2YXIgaGV4ID0gZGVjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICAgICAgcmV0dXJuIHV0aWwubHBhZChoZXgsIDIsIDApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhleDtcbn07XG5cbi8vIENvbnZlcnRlZCBmcm9tIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFNMX2FuZF9IU1YjR2VuZXJhbF9hcHByb2FjaFxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5yZ2IyaHNsXG4gIENvbnZlcnQgUkdCIHRvIEhTTFxuXG4gIFBhcmFtZXRlcnM6XG4gIHIgLSBOdW1iZXIsIDAtMjU1LCByZXByZXNlbnRpbmcgdGhlIGdyZWVuIGNoYW5uZWwgT1IgQXJyYXkgT1Igb2JqZWN0ICh3aXRoIGtleXMgcixnLGIpIG9mIFJHQiB2YWx1ZXNcbiAgZyAtIE51bWJlciwgMC0yNTUsIHJlcHJlc2VudGluZyB0aGUgZ3JlZW4gY2hhbm5lbFxuICBiIC0gTnVtYmVyLCAwLTI1NSwgcmVwcmVzZW50aW5nIHRoZSByZWQgY2hhbm5lbFxuXG4gIFJldHVybnM6IGFycmF5XG5cbiAgPiA+IENocm9tYXRoLnJnYjJoc2woMCwgMjU1LCAwKTtcbiAgPiBbIDEyMCwgMSwgMC41IF1cblxuICA+ID4gQ2hyb21hdGgucmdiMmhzbChbMCwgMCwgMjU1XSk7XG4gID4gWyAyNDAsIDEsIDAuNSBdXG5cbiAgPiA+IENocm9tYXRoLnJnYjJoc2woe3I6IDI1NSwgZzogMCwgYjogMH0pO1xuICA+IFsgMCwgMSwgMC41IF1cbiAqL1xuQ2hyb21hdGgucmdiMmhzbCA9IGZ1bmN0aW9uIHJnYjJoc2wociwgZywgYilcbntcbiAgICB2YXIgcmdiID0gdXRpbC5yZ2Iuc2NhbGVkMDEociwgZywgYik7XG4gICAgciA9IHJnYlswXSwgZyA9IHJnYlsxXSwgYiA9IHJnYlsyXTtcblxuICAgIHZhciBNID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIG0gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICB2YXIgQyA9IE0gLSBtO1xuICAgIHZhciBMID0gMC41KihNICsgbSk7XG4gICAgdmFyIFMgPSAoQyA9PT0gMCkgPyAwIDogQy8oMS1NYXRoLmFicygyKkwtMSkpO1xuXG4gICAgdmFyIGg7XG4gICAgaWYgKEMgPT09IDApIGggPSAwOyAvLyBzcGVjJ2QgYXMgdW5kZWZpbmVkLCBidXQgdXN1YWxseSBzZXQgdG8gMFxuICAgIGVsc2UgaWYgKE0gPT09IHIpIGggPSAoKGctYikvQykgJSA2O1xuICAgIGVsc2UgaWYgKE0gPT09IGcpIGggPSAoKGItcikvQykgKyAyO1xuICAgIGVsc2UgaWYgKE0gPT09IGIpIGggPSAoKHItZykvQykgKyA0O1xuXG4gICAgdmFyIEggPSA2MCAqIGg7XG5cbiAgICByZXR1cm4gW0gsIHBhcnNlRmxvYXQoUyksIHBhcnNlRmxvYXQoTCldO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5yZ2IyaHN2XG4gIENvbnZlcnQgUkdCIHRvIEhTVlxuXG4gIFBhcmFtZXRlcnM6XG4gIHIgLSBOdW1iZXIsIDAtMjU1LCByZXByZXNlbnRpbmcgdGhlIGdyZWVuIGNoYW5uZWwgT1IgQXJyYXkgT1Igb2JqZWN0ICh3aXRoIGtleXMgcixnLGIpIG9mIFJHQiB2YWx1ZXNcbiAgZyAtIE51bWJlciwgMC0yNTUsIHJlcHJlc2VudGluZyB0aGUgZ3JlZW4gY2hhbm5lbFxuICBiIC0gTnVtYmVyLCAwLTI1NSwgcmVwcmVzZW50aW5nIHRoZSByZWQgY2hhbm5lbFxuXG4gIFJldHVybnM6XG4gIEFycmF5XG5cbiAgPiA+IENocm9tYXRoLnJnYjJoc3YoMCwgMjU1LCAwKTtcbiAgPiBbIDEyMCwgMSwgMSBdXG5cbiAgPiA+IENocm9tYXRoLnJnYjJoc3YoWzAsIDAsIDI1NV0pO1xuICA+IFsgMjQwLCAxLCAxIF1cblxuICA+ID4gQ2hyb21hdGgucmdiMmhzdih7cjogMjU1LCBnOiAwLCBiOiAwfSk7XG4gID4gWyAwLCAxLCAxIF1cbiAqL1xuQ2hyb21hdGgucmdiMmhzdiA9IGZ1bmN0aW9uIHJnYjJoc3YociwgZywgYilcbntcbiAgICB2YXIgcmdiID0gdXRpbC5yZ2Iuc2NhbGVkMDEociwgZywgYik7XG4gICAgciA9IHJnYlswXSwgZyA9IHJnYlsxXSwgYiA9IHJnYlsyXTtcblxuICAgIHZhciBNID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIG0gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICB2YXIgQyA9IE0gLSBtO1xuICAgIHZhciBMID0gTTtcbiAgICB2YXIgUyA9IChDID09PSAwKSA/IDAgOiBDL007XG5cbiAgICB2YXIgaDtcbiAgICBpZiAoQyA9PT0gMCkgaCA9IDA7IC8vIHNwZWMnZCBhcyB1bmRlZmluZWQsIGJ1dCB1c3VhbGx5IHNldCB0byAwXG4gICAgZWxzZSBpZiAoTSA9PT0gcikgaCA9ICgoZy1iKS9DKSAlIDY7XG4gICAgZWxzZSBpZiAoTSA9PT0gZykgaCA9ICgoYi1yKS9DKSArIDI7XG4gICAgZWxzZSBpZiAoTSA9PT0gYikgaCA9ICgoci1nKS9DKSArIDQ7XG5cbiAgICB2YXIgSCA9IDYwICogaDtcblxuICAgIHJldHVybiBbSCwgcGFyc2VGbG9hdChTKSwgcGFyc2VGbG9hdChMKV07XG59O1xuXG4vKlxuICAgTWV0aG9kOiBDaHJvbWF0aC5yZ2IyaHNiXG4gICBBbGlhcyBmb3IgPENocm9tYXRoLnJnYjJoc3Y+XG4gKi9cbkNocm9tYXRoLnJnYjJoc2IgPSBDaHJvbWF0aC5yZ2IyaHN2O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmhzbDJyZ2JcbiAgQ29udmVydCBmcm9tIEhTTCB0byBSR0JcblxuICBQYXJhbWV0ZXJzOlxuICBoIC0gTnVtYmVyLCAtSW5maW5pdHkgLSBJbmZpbml0eSwgcmVwcmVzZW50aW5nIHRoZSBodWUgT1IgQXJyYXkgT1Igb2JqZWN0ICh3aXRoIGtleXMgaCxzLGwpIG9mIEhTTCB2YWx1ZXNcbiAgcyAtIE51bWJlciwgMC0xLCByZXByZXNlbnRpbmcgdGhlIHNhdHVyYXRpb25cbiAgbCAtIE51bWJlciwgMC0xLCByZXByZXNlbnRpbmcgdGhlIGxpZ2h0bmVzc1xuXG4gIFJldHVybnM6XG4gIGFycmF5XG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC5oc2wycmdiKDM2MCwgMSwgMC41KTtcbiAgPiBbIDI1NSwgMCwgMCBdXG5cbiAgPiA+IENocm9tYXRoLmhzbDJyZ2IoWzAsIDEsIDAuNV0pO1xuICA+IFsgMjU1LCAwLCAwIF1cblxuICA+ID4gQ2hyb21hdGguaHNsMnJnYih7aDogMjEwLCBzOjEsIHY6IDAuNX0pO1xuICA+IFsgMCwgMTI3LjUsIDI1NSBdXG4gKi9cbi8vIFRPRE86IENhbiBJICU9IGhwIGFuZCB0aGVuIGRvIGEgc3dpdGNoP1xuQ2hyb21hdGguaHNsMnJnYiA9IGZ1bmN0aW9uIGhzbDJyZ2IoaCwgcywgbClcbntcbiAgICB2YXIgaHNsID0gdXRpbC5oc2wuc2NhbGVkKGgsIHMsIGwpO1xuICAgIGg9aHNsWzBdLCBzPWhzbFsxXSwgbD1oc2xbMl07XG5cbiAgICB2YXIgQyA9ICgxIC0gTWF0aC5hYnMoMipsLTEpKSAqIHM7XG4gICAgdmFyIGhwID0gaC82MDtcbiAgICB2YXIgWCA9IEMgKiAoMS1NYXRoLmFicyhocCUyLTEpKTtcbiAgICB2YXIgcmdiLCBtO1xuXG4gICAgc3dpdGNoIChNYXRoLmZsb29yKGhwKSl7XG4gICAgY2FzZSAwOiAgcmdiID0gW0MsWCwwXTsgYnJlYWs7XG4gICAgY2FzZSAxOiAgcmdiID0gW1gsQywwXTsgYnJlYWs7XG4gICAgY2FzZSAyOiAgcmdiID0gWzAsQyxYXTsgYnJlYWs7XG4gICAgY2FzZSAzOiAgcmdiID0gWzAsWCxDXTsgYnJlYWs7XG4gICAgY2FzZSA0OiAgcmdiID0gW1gsMCxDXTsgYnJlYWs7XG4gICAgY2FzZSA1OiAgcmdiID0gW0MsMCxYXTsgYnJlYWs7XG4gICAgZGVmYXVsdDogcmdiID0gWzAsMCwwXTtcbiAgICB9XG5cbiAgICBtID0gbCAtIChDLzIpO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgKHJnYlswXSttKSxcbiAgICAgICAgKHJnYlsxXSttKSxcbiAgICAgICAgKHJnYlsyXSttKVxuICAgIF07XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmhzdjJyZ2JcbiAgQ29udmVydCBIU1YgdG8gUkdCXG5cbiAgUGFyYW1ldGVyczpcbiAgaCAtIE51bWJlciwgLUluZmluaXR5IC0gSW5maW5pdHksIHJlcHJlc2VudGluZyB0aGUgaHVlIE9SIEFycmF5IE9SIG9iamVjdCAod2l0aCBrZXlzIGgscyx2IG9yIGgscyxiKSBvZiBIU1YgdmFsdWVzXG4gIHMgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBzYXR1cmF0aW9uXG4gIHYgLSBOdW1iZXIsIDAtMSwgcmVwcmVzZW50aW5nIHRoZSBsaWdodG5lc3NcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLmhzdjJyZ2IoMzYwLCAxLCAxKTtcbiAgPiBbIDI1NSwgMCwgMCBdXG5cbiAgPiA+IENocm9tYXRoLmhzdjJyZ2IoWzAsIDEsIDAuNV0pO1xuICA+IFsgMTI3LjUsIDAsIDAgXVxuXG4gID4gPiBDaHJvbWF0aC5oc3YycmdiKHtoOiAyMTAsIHM6IDAuNSwgdjogMX0pO1xuICA+IFsgMTI3LjUsIDE5MS4yNSwgMjU1IF1cbiAqL1xuQ2hyb21hdGguaHN2MnJnYiA9IGZ1bmN0aW9uIGhzdjJyZ2IoaCwgcywgdilcbntcbiAgICB2YXIgaHN2ID0gdXRpbC5oc2wuc2NhbGVkKGgsIHMsIHYpO1xuICAgIGg9aHN2WzBdLCBzPWhzdlsxXSwgdj1oc3ZbMl07XG5cbiAgICB2YXIgQyA9IHYgKiBzO1xuICAgIHZhciBocCA9IGgvNjA7XG4gICAgdmFyIFggPSBDKigxLU1hdGguYWJzKGhwJTItMSkpO1xuICAgIHZhciByZ2IsIG07XG5cbiAgICBpZiAoaCA9PSB1bmRlZmluZWQpICAgICAgICAgcmdiID0gWzAsMCwwXTtcbiAgICBlbHNlIGlmICgwIDw9IGhwICYmIGhwIDwgMSkgcmdiID0gW0MsWCwwXTtcbiAgICBlbHNlIGlmICgxIDw9IGhwICYmIGhwIDwgMikgcmdiID0gW1gsQywwXTtcbiAgICBlbHNlIGlmICgyIDw9IGhwICYmIGhwIDwgMykgcmdiID0gWzAsQyxYXTtcbiAgICBlbHNlIGlmICgzIDw9IGhwICYmIGhwIDwgNCkgcmdiID0gWzAsWCxDXTtcbiAgICBlbHNlIGlmICg0IDw9IGhwICYmIGhwIDwgNSkgcmdiID0gW1gsMCxDXTtcbiAgICBlbHNlIGlmICg1IDw9IGhwICYmIGhwIDwgNikgcmdiID0gW0MsMCxYXTtcblxuICAgIG0gPSB2IC0gQztcblxuICAgIHJldHVybiBbXG4gICAgICAgIChyZ2JbMF0rbSksXG4gICAgICAgIChyZ2JbMV0rbSksXG4gICAgICAgIChyZ2JbMl0rbSlcbiAgICBdO1xufTtcblxuLypcbiAgIE1ldGhvZDogQ2hyb21hdGguaHNiMnJnYlxuICAgQWxpYXMgZm9yIDxDaHJvbWF0aC5oc3YycmdiPlxuICovXG5DaHJvbWF0aC5oc2IycmdiID0gQ2hyb21hdGguaHN2MnJnYjtcblxuLypcbiAgICBQcm9wZXJ0eTogQ2hyb21hdGguY29udmVydFxuICAgIEFsaWFzZXMgZm9yIHRoZSBDaHJvbWF0aC54MnkgZnVuY3Rpb25zLlxuICAgIFVzZSBsaWtlIENocm9tYXRoLmNvbnZlcnRbeF1beV0oYXJncykgb3IgQ2hyb21hdGguY29udmVydC54LnkoYXJncylcbiovXG5DaHJvbWF0aC5jb252ZXJ0ID0ge1xuICAgIHJnYjoge1xuICAgICAgICBoZXg6IENocm9tYXRoLmhzdjJyZ2IsXG4gICAgICAgIGhzbDogQ2hyb21hdGgucmdiMmhzbCxcbiAgICAgICAgaHN2OiBDaHJvbWF0aC5yZ2IyaHN2XG4gICAgfSxcbiAgICBoc2w6IHtcbiAgICAgICAgcmdiOiBDaHJvbWF0aC5oc2wycmdiXG4gICAgfSxcbiAgICBoc3Y6IHtcbiAgICAgICAgcmdiOiBDaHJvbWF0aC5oc3YycmdiXG4gICAgfVxufTtcblxuLyogR3JvdXA6IFN0YXRpYyBtZXRob2RzIC0gY29sb3Igc2NoZW1lICovXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmNvbXBsZW1lbnRcbiAgUmV0dXJuIHRoZSBjb21wbGVtZW50IG9mIHRoZSBnaXZlbiBjb2xvclxuXG4gIFJldHVybnM6IDxDaHJvbWF0aD5cblxuICA+ID4gQ2hyb21hdGguY29tcGxlbWVudChuZXcgQ2hyb21hdGgoJ3JlZCcpKTtcbiAgPiB7IHI6IDAsIGc6IDI1NSwgYjogMjU1LCBhOiAxLCBoOiAxODAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH1cblxuICA+ID4gQ2hyb21hdGguY29tcGxlbWVudChuZXcgQ2hyb21hdGgoJ3JlZCcpKS50b1N0cmluZygpO1xuICA+ICcjMDBGRkZGJ1xuICovXG5DaHJvbWF0aC5jb21wbGVtZW50ID0gZnVuY3Rpb24gKGNvbG9yKVxue1xuICAgIHZhciBjID0gbmV3IENocm9tYXRoKGNvbG9yKTtcbiAgICB2YXIgaHNsID0gYy50b0hTTE9iamVjdCgpO1xuXG4gICAgaHNsLmggPSAoaHNsLmggKyAxODApICUgMzYwO1xuXG4gICAgcmV0dXJuIG5ldyBDaHJvbWF0aChoc2wpO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC50cmlhZFxuICBDcmVhdGUgYSB0cmlhZCBjb2xvciBzY2hlbWUgZnJvbSB0aGUgZ2l2ZW4gQ2hyb21hdGguXG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC50cmlhZChDaHJvbWF0aC55ZWxsb3cpXG4gID4gWyB7IHI6IDI1NSwgZzogMjU1LCBiOiAwLCBhOiAxLCBoOiA2MCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjU1LCBiOiAyNTUsIGE6IDEsIGg6IDE4MCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMjU1LCBnOiAwLCBiOiAyNTUsIGE6IDEsIGg6IDMwMCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSBdXG5cbiA+ID4gQ2hyb21hdGgudHJpYWQoQ2hyb21hdGgueWVsbG93KS50b1N0cmluZygpO1xuID4gJyNGRkZGMDAsIzAwRkZGRiwjRkYwMEZGJ1xuKi9cbkNocm9tYXRoLnRyaWFkID0gZnVuY3Rpb24gKGNvbG9yKVxue1xuICAgIHZhciBjID0gbmV3IENocm9tYXRoKGNvbG9yKTtcblxuICAgIHJldHVybiBbXG4gICAgICAgIGMsXG4gICAgICAgIG5ldyBDaHJvbWF0aCh7cjogYy5iLCBnOiBjLnIsIGI6IGMuZ30pLFxuICAgICAgICBuZXcgQ2hyb21hdGgoe3I6IGMuZywgZzogYy5iLCBiOiBjLnJ9KVxuICAgIF07XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLnRldHJhZFxuICBDcmVhdGUgYSB0ZXRyYWQgY29sb3Igc2NoZW1lIGZyb20gdGhlIGdpdmVuIENocm9tYXRoLlxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGgudGV0cmFkKENocm9tYXRoLmN5YW4pXG4gID4gWyB7IHI6IDAsIGc6IDI1NSwgYjogMjU1LCBhOiAxLCBoOiAxODAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0sXG4gID4gICB7IHI6IDI1NSwgZzogMCwgYjogMjU1LCBhOiAxLCBoOiAzMDAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0sXG4gID4gICB7IHI6IDI1NSwgZzogMjU1LCBiOiAwLCBhOiAxLCBoOiA2MCwgc2w6IDEsIHN2OiAxLCBsOiAwLjUsIHY6IDEgfSxcbiAgPiAgIHsgcjogMCwgZzogMjU1LCBiOiAwLCBhOiAxLCBoOiAxMjAsIHNsOiAxLCBzdjogMSwgbDogMC41LCB2OiAxIH0gXVxuXG4gID4gPiBDaHJvbWF0aC50ZXRyYWQoQ2hyb21hdGguY3lhbikudG9TdHJpbmcoKTtcbiAgPiAnIzAwRkZGRiwjRkYwMEZGLCNGRkZGMDAsIzAwRkYwMCdcbiovXG5DaHJvbWF0aC50ZXRyYWQgPSBmdW5jdGlvbiAoY29sb3IpXG57XG4gICAgdmFyIGMgPSBuZXcgQ2hyb21hdGgoY29sb3IpO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgYyxcbiAgICAgICAgbmV3IENocm9tYXRoKHtyOiBjLmIsIGc6IGMuciwgYjogYy5ifSksXG4gICAgICAgIG5ldyBDaHJvbWF0aCh7cjogYy5iLCBnOiBjLmcsIGI6IGMucn0pLFxuICAgICAgICBuZXcgQ2hyb21hdGgoe3I6IGMuciwgZzogYy5iLCBiOiBjLnJ9KVxuICAgIF07XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLmFuYWxvZ291c1xuICBGaW5kIGFuYWxvZ291cyBjb2xvcnMgZnJvbSBhIGdpdmVuIGNvbG9yXG5cbiAgUGFyYW1ldGVyczpcbiAgbWl4ZWQgLSBBbnkgYXJndW1lbnQgd2hpY2ggaXMgcGFzc2VkIHRvIDxDaHJvbWF0aD5cbiAgcmVzdWx0cyAtIEhvdyBtYW55IGNvbG9ycyB0byByZXR1cm4gKGRlZmF1bHQgPSAzKVxuICBzbGljZXMgLSBIb3cgbWFueSBwaWVjZXMgYXJlIGluIHRoZSBjb2xvciB3aGVlbCAoZGVmYXVsdCA9IDEyKVxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguYW5hbG9nb3VzKG5ldyBDaHJvbWF0aCgncmdiKDAsIDI1NSwgMjU1KScpKVxuICA+IFsgeyByOiAwLCBnOiAyNTUsIGI6IDI1NSwgYTogMSwgaDogMTgwLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAyNTUsIGI6IDEwMSwgYTogMSwgaDogMTQ0LCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAyNTUsIGI6IDE1MywgYTogMSwgaDogMTU2LCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAyNTUsIGI6IDIwMywgYTogMSwgaDogMTY4LCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAyNTUsIGI6IDI1NSwgYTogMSwgaDogMTgwLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAyMDMsIGI6IDI1NSwgYTogMSwgaDogMTkyLCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAxNTMsIGI6IDI1NSwgYTogMSwgaDogMjA0LCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9LFxuICA+ICAgeyByOiAwLCBnOiAxMDEsIGI6IDI1NSwgYTogMSwgaDogMjE2LCBzbDogMSwgc3Y6IDEsIGw6IDAuNSwgdjogMSB9IF1cblxuICA+ID4gQ2hyb21hdGguYW5hbG9nb3VzKG5ldyBDaHJvbWF0aCgncmdiKDAsIDI1NSwgMjU1KScpKS50b1N0cmluZygpXG4gID4gJyMwMEZGRkYsIzAwRkY2NSwjMDBGRjk5LCMwMEZGQ0IsIzAwRkZGRiwjMDBDQkZGLCMwMDk5RkYsIzAwNjVGRidcbiAqL1xuQ2hyb21hdGguYW5hbG9nb3VzID0gZnVuY3Rpb24gKGNvbG9yLCByZXN1bHRzLCBzbGljZXMpXG57XG4gICAgaWYgKCFpc0Zpbml0ZShyZXN1bHRzKSkgcmVzdWx0cyA9IDM7XG4gICAgaWYgKCFpc0Zpbml0ZShzbGljZXMpKSBzbGljZXMgPSAxMjtcblxuICAgIHZhciBjID0gbmV3IENocm9tYXRoKGNvbG9yKTtcbiAgICB2YXIgaHN2ID0gYy50b0hTVk9iamVjdCgpO1xuICAgIHZhciBzbGljZSA9IDM2MCAvIHNsaWNlcztcbiAgICB2YXIgcmV0ID0gWyBjIF07XG5cbiAgICBoc3YuaCA9ICgoaHN2LmggLSAoc2xpY2VzICogcmVzdWx0cyA+PiAxKSkgKyA3MjApICUgMzYwO1xuICAgIHdoaWxlICgtLXJlc3VsdHMpIHtcbiAgICAgICAgaHN2LmggPSAoaHN2LmggKyBzbGljZSkgJSAzNjA7XG4gICAgICAgIHJldC5wdXNoKG5ldyBDaHJvbWF0aChoc3YpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5tb25vY2hyb21hdGljXG4gIFJldHVybiBhIHNlcmllcyBvZiB0aGUgZ2l2ZW4gY29sb3IgYXQgdmFyaW91cyBsaWdodG5lc3Nlc1xuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGgubW9ub2Nocm9tYXRpYygncmdiKDAsIDEwMCwgMjU1KScpLmZvckVhY2goZnVuY3Rpb24gKGMpeyBjb25zb2xlLmxvZyhjLnRvSFNWU3RyaW5nKCkpOyB9KVxuICA+IGhzdigyMTYsMTAwJSwyMCUpXG4gID4gaHN2KDIxNiwxMDAlLDQwJSlcbiAgPiBoc3YoMjE2LDEwMCUsNjAlKVxuICA+IGhzdigyMTYsMTAwJSw4MCUpXG4gID4gaHN2KDIxNiwxMDAlLDEwMCUpXG4qL1xuQ2hyb21hdGgubW9ub2Nocm9tYXRpYyA9IGZ1bmN0aW9uIChjb2xvciwgcmVzdWx0cylcbntcbiAgICBpZiAoIXJlc3VsdHMpIHJlc3VsdHMgPSA1O1xuXG4gICAgdmFyIGMgPSBuZXcgQ2hyb21hdGgoY29sb3IpO1xuICAgIHZhciBoc3YgPSBjLnRvSFNWT2JqZWN0KCk7XG4gICAgdmFyIGluYyA9IDEgLyByZXN1bHRzO1xuICAgIHZhciByZXQgPSBbXSwgc3RlcCA9IDA7XG5cbiAgICB3aGlsZSAoc3RlcCsrIDwgcmVzdWx0cykge1xuICAgICAgICBoc3YudiA9IHN0ZXAgKiBpbmM7XG4gICAgICAgIHJldC5wdXNoKG5ldyBDaHJvbWF0aChoc3YpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5zcGxpdGNvbXBsZW1lbnRcbiAgR2VuZXJhdGUgYSBzcGxpdCBjb21wbGVtZW50IGNvbG9yIHNjaGVtZSBmcm9tIHRoZSBnaXZlbiBjb2xvclxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguc3BsaXRjb21wbGVtZW50KCdyZ2IoMCwgMTAwLCAyNTUpJylcbiAgPiBbIHsgcjogMCwgZzogMTAwLCBiOiAyNTUsIGg6IDIxNi40NzA1ODgyMzUyOTQxNCwgc2w6IDEsIGw6IDAuNSwgc3Y6IDEsIHY6IDEsIGE6IDEgfSxcbiAgPiAgIHsgcjogMjU1LCBnOiAxODMsIGI6IDAsIGg6IDQzLjE5OTk5OTk5OTk5OTk5LCBzbDogMSwgbDogMC41LCBzdjogMSwgdjogMSwgYTogMSB9LFxuICA+ICAgeyByOiAyNTUsIGc6IDczLCBiOiAwLCBoOiAxNy4yNzk5OTk5OTk5OTk5NzMsIHNsOiAxLCBsOiAwLjUsIHN2OiAxLCB2OiAxLCBhOiAxIH0gXVxuXG4gID4gPiBDaHJvbWF0aC5zcGxpdGNvbXBsZW1lbnQoJ3JnYigwLCAxMDAsIDI1NSknKS50b1N0cmluZygpXG4gID4gJyMwMDY0RkYsI0ZGQjcwMCwjRkY0OTAwJ1xuICovXG5DaHJvbWF0aC5zcGxpdGNvbXBsZW1lbnQgPSBmdW5jdGlvbiAoY29sb3IpXG57XG4gICAgdmFyIHJlZiA9IG5ldyBDaHJvbWF0aChjb2xvcik7XG4gICAgdmFyIGhzdiA9IHJlZi50b0hTVk9iamVjdCgpO1xuXG4gICAgdmFyIGEgPSBuZXcgQ2hyb21hdGguaHN2KHtcbiAgICAgICAgaDogKGhzdi5oICsgMTUwKSAlIDM2MCxcbiAgICAgICAgczogaHN2LnMsXG4gICAgICAgIHY6IGhzdi52XG4gICAgfSk7XG5cbiAgICB2YXIgYiA9IG5ldyBDaHJvbWF0aC5oc3Yoe1xuICAgICAgICBoOiAoaHN2LmggKyAyMTApICUgMzYwLFxuICAgICAgICBzOiBoc3YucyxcbiAgICAgICAgdjogaHN2LnZcbiAgICB9KTtcblxuICAgIHJldHVybiBbcmVmLCBhLCBiXTtcbn07XG5cbi8vR3JvdXA6IFN0YXRpYyBtZXRob2RzIC0gY29sb3IgYWx0ZXJhdGlvblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC50aW50XG4gIExpZ2h0ZW4gYSBjb2xvciBieSBhZGRpbmcgYSBwZXJjZW50YWdlIG9mIHdoaXRlIHRvIGl0XG5cbiAgUmV0dXJucyA8Q2hyb21hdGg+XG5cbiAgPiA+IENocm9tYXRoLnRpbnQoJ3JnYigwLCAxMDAsIDI1NSknLCAwLjUpLnRvUkdCU3RyaW5nKCk7XG4gID4gJ3JnYigxMjcsMTc3LDI1NSknXG4qL1xuQ2hyb21hdGgudGludCA9IGZ1bmN0aW9uICggZnJvbSwgYnkgKVxue1xuICAgIHJldHVybiBDaHJvbWF0aC50b3dhcmRzKCBmcm9tLCAnI0ZGRkZGRicsIGJ5ICk7XG59O1xuXG4vKlxuICAgTWV0aG9kOiBDaHJvbWF0aC5saWdodGVuXG4gICBBbGlhcyBmb3IgPENocm9tYXRoLnRpbnQ+XG4qL1xuQ2hyb21hdGgubGlnaHRlbiA9IENocm9tYXRoLnRpbnQ7XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguc2hhZGVcbiAgRGFya2VuIGEgY29sb3IgYnkgYWRkaW5nIGEgcGVyY2VudGFnZSBvZiBibGFjayB0byBpdFxuXG4gIEV4YW1wbGU6XG4gID4gPiBDaHJvbWF0aC5kYXJrZW4oJ3JnYigwLCAxMDAsIDI1NSknLCAwLjUpLnRvUkdCU3RyaW5nKCk7XG4gID4gJ3JnYigwLDUwLDEyNyknXG4gKi9cbkNocm9tYXRoLnNoYWRlID0gZnVuY3Rpb24gKCBmcm9tLCBieSApXG57XG4gICAgcmV0dXJuIENocm9tYXRoLnRvd2FyZHMoIGZyb20sICcjMDAwMDAwJywgYnkgKTtcbn07XG5cbi8qXG4gICBNZXRob2Q6IENocm9tYXRoLmRhcmtlblxuICAgQWxpYXMgZm9yIDxDaHJvbWF0aC5zaGFkZT5cbiAqL1xuQ2hyb21hdGguZGFya2VuID0gQ2hyb21hdGguc2hhZGU7XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguZGVzYXR1cmF0ZVxuICBEZXNhdHVyYXRlIGEgY29sb3IgdXNpbmcgYW55IG9mIDMgYXBwcm9hY2hlc1xuXG4gIFBhcmFtZXRlcnM6XG4gIGNvbG9yIC0gYW55IGFyZ3VtZW50IGFjY2VwdGVkIGJ5IHRoZSA8Q2hyb21hdGg+IGNvbnN0cnVjdG9yXG4gIGZvcm11bGEgLSBUaGUgZm9ybXVsYSB0byB1c2UgKGZyb20gPHhhcmcncyBncmV5ZmlsdGVyIGF0IGh0dHA6Ly93d3cueGFyZy5vcmcvcHJvamVjdC9qcXVlcnktY29sb3ItcGx1Z2luLXhjb2xvcj4pXG4gIC0gMSAtIHhhcmcncyBvd24gZm9ybXVsYVxuICAtIDIgLSBTdW4ncyBmb3JtdWxhOiAoMSAtIGF2ZykgLyAoMTAwIC8gMzUpICsgYXZnKVxuICAtIGVtcHR5IC0gVGhlIG9mdC1zZWVuIDMwJSByZWQsIDU5JSBncmVlbiwgMTElIGJsdWUgZm9ybXVsYVxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguZGVzYXR1cmF0ZSgncmVkJykudG9TdHJpbmcoKVxuICA+IFwiIzRDNEM0Q1wiXG5cbiAgPiA+IENocm9tYXRoLmRlc2F0dXJhdGUoJ3JlZCcsIDEpLnRvU3RyaW5nKClcbiAgPiBcIiMzNzM3MzdcIlxuXG4gID4gPiBDaHJvbWF0aC5kZXNhdHVyYXRlKCdyZWQnLCAyKS50b1N0cmluZygpXG4gID4gXCIjOTA5MDkwXCJcbiovXG5DaHJvbWF0aC5kZXNhdHVyYXRlID0gZnVuY3Rpb24gKGNvbG9yLCBmb3JtdWxhKVxue1xuICAgIHZhciBjID0gbmV3IENocm9tYXRoKGNvbG9yKSwgcmdiLCBhdmc7XG5cbiAgICBzd2l0Y2ggKGZvcm11bGEpIHtcbiAgICBjYXNlIDE6IC8vIHhhcmcncyBmb3JtdWxhXG4gICAgICAgIGF2ZyA9IC4zNSArIDEzICogKGMuciArIGMuZyArIGMuYikgLyA2MDsgYnJlYWs7XG4gICAgY2FzZSAyOiAvLyBTdW4ncyBmb3JtdWxhOiAoMSAtIGF2ZykgLyAoMTAwIC8gMzUpICsgYXZnKVxuICAgICAgICBhdmcgPSAoMTMgKiAoYy5yICsgYy5nICsgYy5iKSArIDUzNTUpIC8gNjA7IGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIGF2ZyA9IGMuciAqIC4zICsgYy5nICogLjU5ICsgYy5iICogLjExO1xuICAgIH1cblxuICAgIGF2ZyA9IHV0aWwuY2xhbXAoYXZnLCAwLCAyNTUpO1xuICAgIHJnYiA9IHtyOiBhdmcsIGc6IGF2ZywgYjogYXZnfTtcblxuICAgIHJldHVybiBuZXcgQ2hyb21hdGgocmdiKTtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguZ3JleXNjYWxlXG4gIEFsaWFzIGZvciA8Q2hyb21hdGguZGVzYXR1cmF0ZT5cbiovXG5DaHJvbWF0aC5ncmV5c2NhbGUgPSBDaHJvbWF0aC5kZXNhdHVyYXRlO1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLndlYnNhZmVcbiAgQ29udmVydCBhIGNvbG9yIHRvIG9uZSBvZiB0aGUgMjE2IFwid2Vic2FmZVwiIGNvbG9yc1xuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGgud2Vic2FmZSgnI0FCQ0RFRicpLnRvU3RyaW5nKClcbiAgPiAnIzk5Q0NGRidcblxuICA+ID4gQ2hyb21hdGgud2Vic2FmZSgnI0JCQ0RFRicpLnRvU3RyaW5nKClcbiAgPiAnI0NDQ0NGRidcbiAqL1xuQ2hyb21hdGgud2Vic2FmZSA9IGZ1bmN0aW9uIChjb2xvcilcbntcbiAgICBjb2xvciA9IG5ldyBDaHJvbWF0aChjb2xvcik7XG5cbiAgICBjb2xvci5yID0gTWF0aC5yb3VuZChjb2xvci5yIC8gNTEpICogNTE7XG4gICAgY29sb3IuZyA9IE1hdGgucm91bmQoY29sb3IuZyAvIDUxKSAqIDUxO1xuICAgIGNvbG9yLmIgPSBNYXRoLnJvdW5kKGNvbG9yLmIgLyA1MSkgKiA1MTtcblxuICAgIHJldHVybiBuZXcgQ2hyb21hdGgoY29sb3IpO1xufTtcblxuLy9Hcm91cDogU3RhdGljIG1ldGhvZHMgLSBjb2xvciBjb21iaW5hdGlvblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5hZGRpdGl2ZVxuICBDb21iaW5lIGFueSBudW1iZXIgY29sb3JzIHVzaW5nIGFkZGl0aXZlIGNvbG9yXG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC5hZGRpdGl2ZSgnI0YwMCcsICcjMEYwJykudG9TdHJpbmcoKTtcbiAgPiAnI0ZGRkYwMCdcblxuICA+ID4gQ2hyb21hdGguYWRkaXRpdmUoJyNGMDAnLCAnIzBGMCcpLnRvU3RyaW5nKCkgPT0gQ2hyb21hdGgueWVsbG93LnRvU3RyaW5nKCk7XG4gID4gdHJ1ZVxuXG4gID4gPiBDaHJvbWF0aC5hZGRpdGl2ZSgncmVkJywgJyMwRjAnLCAncmdiKDAsIDAsIDI1NSknKS50b1N0cmluZygpID09IENocm9tYXRoLndoaXRlLnRvU3RyaW5nKCk7XG4gID4gdHJ1ZVxuICovXG5DaHJvbWF0aC5hZGRpdGl2ZSA9IGZ1bmN0aW9uICgpXG57XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoLTIsIGk9LTEsIGEsIGI7XG4gICAgd2hpbGUgKGkrKyA8IGFyZ3Mpe1xuXG4gICAgICAgIGEgPSBhIHx8IG5ldyBDaHJvbWF0aChhcmd1bWVudHNbaV0pO1xuICAgICAgICBiID0gbmV3IENocm9tYXRoKGFyZ3VtZW50c1tpKzFdKTtcblxuICAgICAgICBpZiAoKGEuciArPSBiLnIpID4gMjU1KSBhLnIgPSAyNTU7XG4gICAgICAgIGlmICgoYS5nICs9IGIuZykgPiAyNTUpIGEuZyA9IDI1NTtcbiAgICAgICAgaWYgKChhLmIgKz0gYi5iKSA+IDI1NSkgYS5iID0gMjU1O1xuXG4gICAgICAgIGEgPSBuZXcgQ2hyb21hdGgoYSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLnN1YnRyYWN0aXZlXG4gIENvbWJpbmUgYW55IG51bWJlciBvZiBjb2xvcnMgdXNpbmcgc3VidHJhY3RpdmUgY29sb3JcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLnN1YnRyYWN0aXZlKCd5ZWxsb3cnLCAnbWFnZW50YScpLnRvU3RyaW5nKCk7XG4gID4gJyNGRjAwMDAnXG5cbiAgPiA+IENocm9tYXRoLnN1YnRyYWN0aXZlKCd5ZWxsb3cnLCAnbWFnZW50YScpLnRvU3RyaW5nKCkgPT09IENocm9tYXRoLnJlZC50b1N0cmluZygpO1xuICA+IHRydWVcblxuICA+ID4gQ2hyb21hdGguc3VidHJhY3RpdmUoJ2N5YW4nLCAnbWFnZW50YScsICd5ZWxsb3cnKS50b1N0cmluZygpO1xuICA+ICcjMDAwMDAwJ1xuXG4gID4gPiBDaHJvbWF0aC5zdWJ0cmFjdGl2ZSgncmVkJywgJyMwRjAnLCAncmdiKDAsIDAsIDI1NSknKS50b1N0cmluZygpO1xuICA+ICcjMDAwMDAwJ1xuKi9cbkNocm9tYXRoLnN1YnRyYWN0aXZlID0gZnVuY3Rpb24gKClcbntcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGgtMiwgaT0tMSwgYSwgYjtcbiAgICB3aGlsZSAoaSsrIDwgYXJncyl7XG5cbiAgICAgICAgYSA9IGEgfHwgbmV3IENocm9tYXRoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGIgPSBuZXcgQ2hyb21hdGgoYXJndW1lbnRzW2krMV0pO1xuXG4gICAgICAgIGlmICgoYS5yICs9IGIuciAtIDI1NSkgPCAwKSBhLnIgPSAwO1xuICAgICAgICBpZiAoKGEuZyArPSBiLmcgLSAyNTUpIDwgMCkgYS5nID0gMDtcbiAgICAgICAgaWYgKChhLmIgKz0gYi5iIC0gMjU1KSA8IDApIGEuYiA9IDA7XG5cbiAgICAgICAgYSA9IG5ldyBDaHJvbWF0aChhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGgubXVsdGlwbHlcbiAgTXVsdGlwbHkgYW55IG51bWJlciBvZiBjb2xvcnNcblxuICBFeGFtcGxlczpcbiAgPiA+IENocm9tYXRoLm11bHRpcGx5KENocm9tYXRoLmxpZ2h0Z29sZGVucm9keWVsbG93LCBDaHJvbWF0aC5saWdodGJsdWUpLnRvU3RyaW5nKCk7XG4gID4gXCIjQTlEM0JEXCJcblxuICA+ID4gQ2hyb21hdGgubXVsdGlwbHkoQ2hyb21hdGgub2xkbGFjZSwgQ2hyb21hdGgubGlnaHRibHVlLCBDaHJvbWF0aC5kYXJrYmx1ZSkudG9TdHJpbmcoKTtcbiAgPiBcIiMwMDAwNzBcIlxuKi9cbkNocm9tYXRoLm11bHRpcGx5ID0gZnVuY3Rpb24gKClcbntcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGgtMiwgaT0tMSwgYSwgYjtcbiAgICB3aGlsZSAoaSsrIDwgYXJncyl7XG5cbiAgICAgICAgYSA9IGEgfHwgbmV3IENocm9tYXRoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGIgPSBuZXcgQ2hyb21hdGgoYXJndW1lbnRzW2krMV0pO1xuXG4gICAgICAgIGEuciA9IChhLnIgLyAyNTUgKiBiLnIpfDA7XG4gICAgICAgIGEuZyA9IChhLmcgLyAyNTUgKiBiLmcpfDA7XG4gICAgICAgIGEuYiA9IChhLmIgLyAyNTUgKiBiLmIpfDA7XG5cbiAgICAgICAgYSA9IG5ldyBDaHJvbWF0aChhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbn07XG5cbi8qXG4gIE1ldGhvZDogQ2hyb21hdGguYXZlcmFnZVxuICBBdmVyYWdlcyBhbnkgbnVtYmVyIG9mIGNvbG9yc1xuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguYXZlcmFnZShDaHJvbWF0aC5saWdodGdvbGRlbnJvZHllbGxvdywgQ2hyb21hdGgubGlnaHRibHVlKS50b1N0cmluZygpXG4gID4gXCIjRDNFOURDXCJcblxuICA+ID4gQ2hyb21hdGguYXZlcmFnZShDaHJvbWF0aC5vbGRsYWNlLCBDaHJvbWF0aC5saWdodGJsdWUsIENocm9tYXRoLmRhcmtibHVlKS50b1N0cmluZygpXG4gID4gXCIjNkE3M0I4XCJcbiAqL1xuQ2hyb21hdGguYXZlcmFnZSA9IGZ1bmN0aW9uICgpXG57XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoLTIsIGk9LTEsIGEsIGI7XG4gICAgd2hpbGUgKGkrKyA8IGFyZ3Mpe1xuXG4gICAgICAgIGEgPSBhIHx8IG5ldyBDaHJvbWF0aChhcmd1bWVudHNbaV0pO1xuICAgICAgICBiID0gbmV3IENocm9tYXRoKGFyZ3VtZW50c1tpKzFdKTtcblxuICAgICAgICBhLnIgPSAoYS5yICsgYi5yKSA+PiAxO1xuICAgICAgICBhLmcgPSAoYS5nICsgYi5nKSA+PiAxO1xuICAgICAgICBhLmIgPSAoYS5iICsgYi5iKSA+PiAxO1xuXG4gICAgICAgIGEgPSBuZXcgQ2hyb21hdGgoYSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59O1xuXG4vKlxuICBNZXRob2Q6IENocm9tYXRoLm92ZXJsYXlcbiAgQWRkIG9uZSBjb2xvciBvbiB0b3Agb2YgYW5vdGhlciB3aXRoIGEgZ2l2ZW4gdHJhbnNwYXJlbmN5XG5cbiAgRXhhbXBsZXM6XG4gID4gPiBDaHJvbWF0aC5hdmVyYWdlKENocm9tYXRoLmxpZ2h0Z29sZGVucm9keWVsbG93LCBDaHJvbWF0aC5saWdodGJsdWUpLnRvU3RyaW5nKClcbiAgPiBcIiNEM0U5RENcIlxuXG4gID4gPiBDaHJvbWF0aC5hdmVyYWdlKENocm9tYXRoLm9sZGxhY2UsIENocm9tYXRoLmxpZ2h0Ymx1ZSwgQ2hyb21hdGguZGFya2JsdWUpLnRvU3RyaW5nKClcbiAgPiBcIiM2QTczQjhcIlxuICovXG5DaHJvbWF0aC5vdmVybGF5ID0gZnVuY3Rpb24gKHRvcCwgYm90dG9tLCBvcGFjaXR5KVxue1xuICAgIHZhciBhID0gbmV3IENocm9tYXRoKHRvcCk7XG4gICAgdmFyIGIgPSBuZXcgQ2hyb21hdGgoYm90dG9tKTtcblxuICAgIGlmIChvcGFjaXR5ID4gMSkgb3BhY2l0eSAvPSAxMDA7XG4gICAgb3BhY2l0eSA9IHV0aWwuY2xhbXAob3BhY2l0eSAtIDEgKyBiLmEsIDAsIDEpO1xuXG4gICAgcmV0dXJuIG5ldyBDaHJvbWF0aCh7XG4gICAgICAgIHI6IHV0aWwubGVycChhLnIsIGIuciwgb3BhY2l0eSksXG4gICAgICAgIGc6IHV0aWwubGVycChhLmcsIGIuZywgb3BhY2l0eSksXG4gICAgICAgIGI6IHV0aWwubGVycChhLmIsIGIuYiwgb3BhY2l0eSlcbiAgICB9KTtcbn07XG5cblxuLy9Hcm91cDogU3RhdGljIG1ldGhvZHMgLSBvdGhlclxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC50b3dhcmRzXG4gIE1vdmUgZnJvbSBvbmUgY29sb3IgdG93YXJkcyBhbm90aGVyIGJ5IHRoZSBnaXZlbiBwZXJjZW50YWdlICgwLTEsIDAtMTAwKVxuXG4gIFBhcmFtZXRlcnM6XG4gIGZyb20gLSBUaGUgc3RhcnRpbmcgY29sb3JcbiAgdG8gLSBUaGUgZGVzdGluYXRpb24gY29sb3JcbiAgYnkgLSBUaGUgcGVyY2VudGFnZSwgZXhwcmVzc2VkIGFzIGEgZmxvYXRpbmcgbnVtYmVyIGJldHdlZW4gMCBhbmQgMSwgdG8gbW92ZSB0b3dhcmRzIHRoZSBkZXN0aW5hdGlvbiBjb2xvclxuICBpbnRlcnBvbGF0b3IgLSBUaGUgZnVuY3Rpb24gdG8gdXNlIGZvciBpbnRlcnBvbGF0aW5nIGJldHdlZW4gdGhlIHR3byBwb2ludHMuIERlZmF1bHRzIHRvIExpbmVhciBJbnRlcnBvbGF0aW9uLiBGdW5jdGlvbiBoYXMgdGhlIHNpZ25hdHVyZSBgKGZyb20sIHRvLCBieSlgIHdpdGggdGhlIHBhcmFtZXRlcnMgaGF2aW5nIHRoZSBzYW1lIG1lYW5pbmcgYXMgdGhvc2UgaW4gYHRvd2FyZHNgLlxuXG4gID4gPiBDaHJvbWF0aC50b3dhcmRzKCdyZWQnLCAneWVsbG93JywgMC41KS50b1N0cmluZygpXG4gID4gXCIjRkY3RjAwXCJcbiovXG5DaHJvbWF0aC50b3dhcmRzID0gZnVuY3Rpb24gKGZyb20sIHRvLCBieSwgaW50ZXJwb2xhdG9yKVxue1xuICAgIGlmICghdG8pIHsgcmV0dXJuIGZyb207IH1cbiAgICBpZiAoIWlzRmluaXRlKGJ5KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlRXJyb3I6IGBieWAoJyArIGJ5ICArJykgc2hvdWxkIGJlIGJldHdlZW4gMCBhbmQgMScpO1xuICAgIGlmICghKGZyb20gaW5zdGFuY2VvZiBDaHJvbWF0aCkpIGZyb20gPSBuZXcgQ2hyb21hdGgoZnJvbSk7XG4gICAgaWYgKCEodG8gaW5zdGFuY2VvZiBDaHJvbWF0aCkpIHRvID0gbmV3IENocm9tYXRoKHRvIHx8ICcjRkZGRkZGJyk7XG4gICAgaWYgKCFpbnRlcnBvbGF0b3IpIGludGVycG9sYXRvciA9IHV0aWwubGVycDtcbiAgICBieSA9IHBhcnNlRmxvYXQoYnkpO1xuXG4gICAgcmV0dXJuIG5ldyBDaHJvbWF0aCh7XG4gICAgICAgIHI6IGludGVycG9sYXRvcihmcm9tLnIsIHRvLnIsIGJ5KSxcbiAgICAgICAgZzogaW50ZXJwb2xhdG9yKGZyb20uZywgdG8uZywgYnkpLFxuICAgICAgICBiOiBpbnRlcnBvbGF0b3IoZnJvbS5iLCB0by5iLCBieSksXG4gICAgICAgIGE6IGludGVycG9sYXRvcihmcm9tLmEsIHRvLmEsIGJ5KVxuICAgIH0pO1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5ncmFkaWVudFxuICBDcmVhdGUgYW4gYXJyYXkgb2YgQ2hyb21hdGggb2JqZWN0c1xuXG4gIFBhcmFtZXRlcnM6XG4gIGZyb20gLSBUaGUgYmVnaW5uaW5nIGNvbG9yIG9mIHRoZSBncmFkaWVudFxuICB0byAtIFRoZSBlbmQgY29sb3Igb2YgdGhlIGdyYWRpZW50XG4gIHNsaWNlcyAtIFRoZSBudW1iZXIgb2YgY29sb3JzIGluIHRoZSBhcnJheVxuICBzbGljZSAtIFRoZSBjb2xvciBhdCBhIHNwZWNpZmljLCAxLWJhc2VkLCBzbGljZSBpbmRleFxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguZ3JhZGllbnQoJ3JlZCcsICd5ZWxsb3cnKS5sZW5ndGg7XG4gID4gMjBcblxuICA+ID4gQ2hyb21hdGguZ3JhZGllbnQoJ3JlZCcsICd5ZWxsb3cnLCA1KS50b1N0cmluZygpO1xuICA+IFwiI0ZGMDAwMCwjRkYzRjAwLCNGRjdGMDAsI0ZGQkYwMCwjRkZGRjAwXCJcblxuICA+ID4gQ2hyb21hdGguZ3JhZGllbnQoJ3JlZCcsICd5ZWxsb3cnLCA1LCAyKS50b1N0cmluZygpO1xuICA+IFwiI0ZGN0YwMFwiXG5cbiAgPiA+IENocm9tYXRoLmdyYWRpZW50KCdyZWQnLCAneWVsbG93JywgNSlbMl0udG9TdHJpbmcoKTtcbiAgPiBcIiNGRjdGMDBcIlxuICovXG5DaHJvbWF0aC5ncmFkaWVudCA9IGZ1bmN0aW9uIChmcm9tLCB0bywgc2xpY2VzLCBzbGljZSlcbntcbiAgICB2YXIgZ3JhZGllbnQgPSBbXSwgc3RvcHM7XG5cbiAgICBpZiAoISBzbGljZXMpIHNsaWNlcyA9IDIwO1xuICAgIHN0b3BzID0gKHNsaWNlcy0xKTtcblxuICAgIGlmIChpc0Zpbml0ZShzbGljZSkpIHJldHVybiBDaHJvbWF0aC50b3dhcmRzKGZyb20sIHRvLCBzbGljZS9zdG9wcyk7XG4gICAgZWxzZSBzbGljZSA9IC0xO1xuXG4gICAgd2hpbGUgKCsrc2xpY2UgPCBzbGljZXMpe1xuICAgICAgICBncmFkaWVudC5wdXNoKENocm9tYXRoLnRvd2FyZHMoZnJvbSwgdG8sIHNsaWNlL3N0b3BzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyYWRpZW50O1xufTtcblxuLypcbiAgTWV0aG9kOiBDaHJvbWF0aC5wYXJzZVxuICBJdGVyYXRlIHRocm91Z2ggdGhlIG9iamVjdHMgc2V0IGluIENocm9tYXRoLnBhcnNlcnMgYW5kLCBpZiBhIG1hdGNoIGlzIG1hZGUsIHJldHVybiB0aGUgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBtYXRjaGluZyBwYXJzZXJzIGBwcm9jZXNzYCBmdW5jdGlvblxuXG4gIFBhcmFtZXRlcnM6XG4gIHN0cmluZyAtIFRoZSBzdHJpbmcgdG8gcGFyc2VcblxuICBFeGFtcGxlOlxuICA+ID4gQ2hyb21hdGgucGFyc2UoJ3JnYigwLCAxMjgsIDI1NSknKVxuICA+IHsgcjogMCwgZzogMTI4LCBiOiAyNTUsIGE6IHVuZGVmaW5lZCB9XG4gKi9cbkNocm9tYXRoLnBhcnNlID0gZnVuY3Rpb24gKHN0cmluZylcbntcbiAgICB2YXIgcGFyc2VycyA9IENocm9tYXRoLnBhcnNlcnMsIGksIGwsIHBhcnNlciwgcGFydHMsIGNoYW5uZWxzO1xuXG4gICAgZm9yIChpID0gMCwgbCA9IHBhcnNlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHBhcnNlciA9IHBhcnNlcnNbaV07XG4gICAgICAgIHBhcnRzID0gcGFyc2VyLnJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgaWYgKHBhcnRzICYmIHBhcnRzLmxlbmd0aCkgY2hhbm5lbHMgPSBwYXJzZXIucHJvY2Vzcy5hcHBseSh0aGlzLCBwYXJ0cyk7XG4gICAgICAgIGlmIChjaGFubmVscykgcmV0dXJuIGNoYW5uZWxzO1xuICAgIH1cbn07XG5cbi8vIEdyb3VwOiBTdGF0aWMgcHJvcGVydGllc1xuLypcbiAgUHJvcGVydHk6IENocm9tYXRoLnBhcnNlcnNcbiAgIEFuIGFycmF5IG9mIG9iamVjdHMgZm9yIGF0dGVtcHRpbmcgdG8gY29udmVydCBhIHN0cmluZyBkZXNjcmliaW5nIGEgY29sb3IgaW50byBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgdmFyaW91cyBjaGFubmVscy4gTm8gdXNlciBhY3Rpb24gaXMgcmVxdWlyZWQgYnV0IHBhcnNlcnMgY2FuIGJlXG5cbiAgIE9iamVjdCBwcm9wZXJ0aWVzOlxuICAgcmVnZXggLSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byB0ZXN0IHRoZSBzdHJpbmcgb3IgbnVtZXJpYyBpbnB1dFxuICAgcHJvY2VzcyAtIGZ1bmN0aW9uIHdoaWNoIGlzIHBhc3NlZCB0aGUgcmVzdWx0cyBvZiBgcmVnZXgubWF0Y2hgIGFuZCByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGVpdGhlciB0aGUgcmdiLCBoc2wsIGhzdiwgb3IgaHNiIGNoYW5uZWxzIG9mIHRoZSBDaHJvbWF0aC5cblxuICAgRXhhbXBsZXM6XG4oc3RhcnQgY29kZSlcbi8vIEFkZCBhIHBhcnNlclxuQ2hyb21hdGgucGFyc2Vycy5wdXNoKHtcbiAgICBleGFtcGxlOiBbMzU1NDQzMSwgMTY4MDk5ODRdLFxuICAgIHJlZ2V4OiAvXlxcZCskLyxcbiAgICBwcm9jZXNzOiBmdW5jdGlvbiAoY29sb3Ipe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogY29sb3IgPj4gMTYgJiAyNTUsXG4gICAgICAgICAgICBnOiBjb2xvciA+PiA4ICYgMjU1LFxuICAgICAgICAgICAgYjogY29sb3IgJiAyNTVcbiAgICAgICAgfTtcbiAgICB9XG59KTtcbihlbmQgY29kZSlcbihzdGFydCBjb2RlKVxuLy8gT3ZlcnJpZGUgZW50aXJlbHlcbkNocm9tYXRoLnBhcnNlcnMgPSBbXG4gICB7XG4gICAgICAgZXhhbXBsZTogWzM1NTQ0MzEsIDE2ODA5OTg0XSxcbiAgICAgICByZWdleDogL15cXGQrJC8sXG4gICAgICAgcHJvY2VzczogZnVuY3Rpb24gKGNvbG9yKXtcbiAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHI6IGNvbG9yID4+IDE2ICYgMjU1LFxuICAgICAgICAgICAgICAgZzogY29sb3IgPj4gOCAmIDI1NSxcbiAgICAgICAgICAgICAgIGI6IGNvbG9yICYgMjU1XG4gICAgICAgICAgIH07XG4gICAgICAgfVxuICAgfSxcblxuICAge1xuICAgICAgIGV4YW1wbGU6IFsnI2ZiMCcsICdmMGYnXSxcbiAgICAgICByZWdleDogL14jPyhbXFxkQS1GXXsxfSkoW1xcZEEtRl17MX0pKFtcXGRBLUZdezF9KSQvaSxcbiAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoaGV4LCByLCBnLCBiKXtcbiAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHI6IHBhcnNlSW50KHIgKyByLCAxNiksXG4gICAgICAgICAgICAgICBnOiBwYXJzZUludChnICsgZywgMTYpLFxuICAgICAgICAgICAgICAgYjogcGFyc2VJbnQoYiArIGIsIDE2KVxuICAgICAgICAgICB9O1xuICAgICAgIH1cbiAgIH1cbihlbmQgY29kZSlcbiAqL1xuQ2hyb21hdGgucGFyc2VycyA9IHJlcXVpcmUoJy4vcGFyc2VycycpLnBhcnNlcnM7XG5cbi8vIEdyb3VwOiBJbnN0YW5jZSBtZXRob2RzIC0gY29sb3IgcmVwcmVzZW50YXRpb25cbkNocm9tYXRoLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vcHJvdG90eXBlJykoQ2hyb21hdGgpO1xuXG4vKlxuICBQcm9wZXJ0eTogQ2hyb21hdGguY29sb3JzXG4gIE9iamVjdCwgaW5kZXhlZCBieSBTVkcvQ1NTIGNvbG9yIG5hbWUsIG9mIDxDaHJvbWF0aD4gaW5zdGFuY2VzXG4gIFRoZSBjb2xvciBuYW1lcyBmcm9tIENTUyBhbmQgU1ZHIDEuMFxuXG4gIEV4YW1wbGVzOlxuICA+ID4gQ2hyb21hdGguY29sb3JzLmFsaWNlYmx1ZS50b1JHQkFycmF5KClcbiAgPiBbMjQwLCAyNDgsIDI1NV1cblxuICA+ID4gQ2hyb21hdGguY29sb3JzLmJlaWdlLnRvU3RyaW5nKClcbiAgPiBcIiNGNUY1RENcIlxuXG4gID4gLy8gQ2FuIGFsc28gYmUgYWNjZXNzZWQgd2l0aG91dCBgLmNvbG9yYFxuICA+ID4gQ2hyb21hdGguYWxpY2VibHVlLnRvUkdCQXJyYXkoKVxuICA+IFsyNDAsIDI0OCwgMjU1XVxuXG4gID4gPiBDaHJvbWF0aC5iZWlnZS50b1N0cmluZygpXG4gID4gXCIjRjVGNURDXCJcbiovXG52YXIgY3NzMkNvbG9ycyAgPSByZXF1aXJlKCcuL2NvbG9ybmFtZXNfY3NzMicpO1xudmFyIGNzczNDb2xvcnMgID0gcmVxdWlyZSgnLi9jb2xvcm5hbWVzX2NzczMnKTtcbnZhciBhbGxDb2xvcnMgICA9IHV0aWwubWVyZ2Uoe30sIGNzczJDb2xvcnMsIGNzczNDb2xvcnMpO1xuQ2hyb21hdGguY29sb3JzID0ge307XG5mb3IgKHZhciBjb2xvck5hbWUgaW4gYWxsQ29sb3JzKSB7XG4gICAgLy8gZS5nLiwgQ2hyb21hdGgud2hlYXQgYW5kIENocm9tYXRoLmNvbG9ycy53aGVhdFxuICAgIENocm9tYXRoW2NvbG9yTmFtZV0gPSBDaHJvbWF0aC5jb2xvcnNbY29sb3JOYW1lXSA9IG5ldyBDaHJvbWF0aChhbGxDb2xvcnNbY29sb3JOYW1lXSk7XG59XG4vLyBhZGQgYSBwYXJzZXIgZm9yIHRoZSBjb2xvciBuYW1lc1xuQ2hyb21hdGgucGFyc2Vycy5wdXNoKHtcbiAgICBleGFtcGxlOiBbJ3JlZCcsICdidXJseXdvb2QnXSxcbiAgICByZWdleDogL15bYS16XSskL2ksXG4gICAgcHJvY2VzczogZnVuY3Rpb24gKGNvbG9yTmFtZSl7XG4gICAgICAgIGlmIChDaHJvbWF0aC5jb2xvcnNbY29sb3JOYW1lXSkgcmV0dXJuIENocm9tYXRoLmNvbG9yc1tjb2xvck5hbWVdO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENocm9tYXRoO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gZnJvbSBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtaHRtbDQwL3R5cGVzLmh0bWwjaC02LjVcbiAgICBhcXVhICAgIDoge3I6IDAsICAgZzogMjU1LCBiOiAyNTV9LFxuICAgIGJsYWNrICAgOiB7cjogMCwgICBnOiAwLCAgIGI6IDB9LFxuICAgIGJsdWUgICAgOiB7cjogMCwgICBnOiAwLCAgIGI6IDI1NX0sXG4gICAgZnVjaHNpYSA6IHtyOiAyNTUsIGc6IDAsICAgYjogMjU1fSxcbiAgICBncmF5ICAgIDoge3I6IDEyOCwgZzogMTI4LCBiOiAxMjh9LFxuICAgIGdyZWVuICAgOiB7cjogMCwgICBnOiAxMjgsIGI6IDB9LFxuICAgIGxpbWUgICAgOiB7cjogMCwgICBnOiAyNTUsIGI6IDB9LFxuICAgIG1hcm9vbiAgOiB7cjogMTI4LCBnOiAwLCAgIGI6IDB9LFxuICAgIG5hdnkgICAgOiB7cjogMCwgICBnOiAwLCAgIGI6IDEyOH0sXG4gICAgb2xpdmUgICA6IHtyOiAxMjgsIGc6IDEyOCwgYjogMH0sXG4gICAgcHVycGxlICA6IHtyOiAxMjgsIGc6IDAsICAgYjogMTI4fSxcbiAgICByZWQgICAgIDoge3I6IDI1NSwgZzogMCwgICBiOiAwfSxcbiAgICBzaWx2ZXIgIDoge3I6IDE5MiwgZzogMTkyLCBiOiAxOTJ9LFxuICAgIHRlYWwgICAgOiB7cjogMCwgICBnOiAxMjgsIGI6IDEyOH0sXG4gICAgd2hpdGUgICA6IHtyOiAyNTUsIGc6IDI1NSwgYjogMjU1fSxcbiAgICB5ZWxsb3cgIDoge3I6IDI1NSwgZzogMjU1LCBiOiAwfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29sb3IvI3N2Zy1jb2xvclxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL1NWRy90eXBlcy5odG1sI0NvbG9yS2V5d29yZHNcbiAgICBhbGljZWJsdWUgICAgICAgICAgICA6IHtyOiAyNDAsIGc6IDI0OCwgYjogMjU1fSxcbiAgICBhbnRpcXVld2hpdGUgICAgICAgICA6IHtyOiAyNTAsIGc6IDIzNSwgYjogMjE1fSxcbiAgICBhcXVhbWFyaW5lICAgICAgICAgICA6IHtyOiAxMjcsIGc6IDI1NSwgYjogMjEyfSxcbiAgICBhenVyZSAgICAgICAgICAgICAgICA6IHtyOiAyNDAsIGc6IDI1NSwgYjogMjU1fSxcbiAgICBiZWlnZSAgICAgICAgICAgICAgICA6IHtyOiAyNDUsIGc6IDI0NSwgYjogMjIwfSxcbiAgICBiaXNxdWUgICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDIyOCwgYjogMTk2fSxcbiAgICBibGFuY2hlZGFsbW9uZCAgICAgICA6IHtyOiAyNTUsIGc6IDIzNSwgYjogMjA1fSxcbiAgICBibHVldmlvbGV0ICAgICAgICAgICA6IHtyOiAxMzgsIGc6IDQzLCAgYjogMjI2fSxcbiAgICBicm93biAgICAgICAgICAgICAgICA6IHtyOiAxNjUsIGc6IDQyLCAgYjogNDJ9LFxuICAgIGJ1cmx5d29vZCAgICAgICAgICAgIDoge3I6IDIyMiwgZzogMTg0LCBiOiAxMzV9LFxuICAgIGNhZGV0Ymx1ZSAgICAgICAgICAgIDoge3I6IDk1LCAgZzogMTU4LCBiOiAxNjB9LFxuICAgIGNoYXJ0cmV1c2UgICAgICAgICAgIDoge3I6IDEyNywgZzogMjU1LCBiOiAwfSxcbiAgICBjaG9jb2xhdGUgICAgICAgICAgICA6IHtyOiAyMTAsIGc6IDEwNSwgYjogMzB9LFxuICAgIGNvcmFsICAgICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMTI3LCBiOiA4MH0sXG4gICAgY29ybmZsb3dlcmJsdWUgICAgICAgOiB7cjogMTAwLCBnOiAxNDksIGI6IDIzN30sXG4gICAgY29ybnNpbGsgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyNDgsIGI6IDIyMH0sXG4gICAgY3JpbXNvbiAgICAgICAgICAgICAgOiB7cjogMjIwLCBnOiAyMCwgIGI6IDYwfSxcbiAgICBjeWFuICAgICAgICAgICAgICAgICA6IHtyOiAwLCAgIGc6IDI1NSwgYjogMjU1fSxcbiAgICBkYXJrYmx1ZSAgICAgICAgICAgICA6IHtyOiAwLCAgIGc6IDAsICAgYjogMTM5fSxcbiAgICBkYXJrY3lhbiAgICAgICAgICAgICA6IHtyOiAwLCAgIGc6IDEzOSwgYjogMTM5fSxcbiAgICBkYXJrZ29sZGVucm9kICAgICAgICA6IHtyOiAxODQsIGc6IDEzNCwgYjogMTF9LFxuICAgIGRhcmtncmF5ICAgICAgICAgICAgIDoge3I6IDE2OSwgZzogMTY5LCBiOiAxNjl9LFxuICAgIGRhcmtncmVlbiAgICAgICAgICAgIDoge3I6IDAsICAgZzogMTAwLCBiOiAwfSxcbiAgICBkYXJrZ3JleSAgICAgICAgICAgICA6IHtyOiAxNjksIGc6IDE2OSwgYjogMTY5fSxcbiAgICBkYXJra2hha2kgICAgICAgICAgICA6IHtyOiAxODksIGc6IDE4MywgYjogMTA3fSxcbiAgICBkYXJrbWFnZW50YSAgICAgICAgICA6IHtyOiAxMzksIGc6IDAsICAgYjogMTM5fSxcbiAgICBkYXJrb2xpdmVncmVlbiAgICAgICA6IHtyOiA4NSwgIGc6IDEwNywgYjogNDd9LFxuICAgIGRhcmtvcmFuZ2UgICAgICAgICAgIDoge3I6IDI1NSwgZzogMTQwLCBiOiAwfSxcbiAgICBkYXJrb3JjaGlkICAgICAgICAgICA6IHtyOiAxNTMsIGc6IDUwLCAgYjogMjA0fSxcbiAgICBkYXJrcmVkICAgICAgICAgICAgICA6IHtyOiAxMzksIGc6IDAsICAgYjogMH0sXG4gICAgZGFya3NhbG1vbiAgICAgICAgICAgOiB7cjogMjMzLCBnOiAxNTAsIGI6IDEyMn0sXG4gICAgZGFya3NlYWdyZWVuICAgICAgICAgOiB7cjogMTQzLCBnOiAxODgsIGI6IDE0M30sXG4gICAgZGFya3NsYXRlYmx1ZSAgICAgICAgOiB7cjogNzIsICBnOiA2MSwgIGI6IDEzOX0sXG4gICAgZGFya3NsYXRlZ3JheSAgICAgICAgOiB7cjogNDcsICBnOiA3OSwgIGI6IDc5fSxcbiAgICBkYXJrc2xhdGVncmV5ICAgICAgICA6IHtyOiA0NywgIGc6IDc5LCAgYjogNzl9LFxuICAgIGRhcmt0dXJxdW9pc2UgICAgICAgIDoge3I6IDAsICAgZzogMjA2LCBiOiAyMDl9LFxuICAgIGRhcmt2aW9sZXQgICAgICAgICAgIDoge3I6IDE0OCwgZzogMCwgICBiOiAyMTF9LFxuICAgIGRlZXBwaW5rICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjAsICBiOiAxNDd9LFxuICAgIGRlZXBza3libHVlICAgICAgICAgIDoge3I6IDAsICAgZzogMTkxLCBiOiAyNTV9LFxuICAgIGRpbWdyYXkgICAgICAgICAgICAgIDoge3I6IDEwNSwgZzogMTA1LCBiOiAxMDV9LFxuICAgIGRpbWdyZXkgICAgICAgICAgICAgIDoge3I6IDEwNSwgZzogMTA1LCBiOiAxMDV9LFxuICAgIGRvZGdlcmJsdWUgICAgICAgICAgIDoge3I6IDMwLCAgZzogMTQ0LCBiOiAyNTV9LFxuICAgIGZpcmVicmljayAgICAgICAgICAgIDoge3I6IDE3OCwgZzogMzQsICBiOiAzNH0sXG4gICAgZmxvcmFsd2hpdGUgICAgICAgICAgOiB7cjogMjU1LCBnOiAyNTAsIGI6IDI0MH0sXG4gICAgZm9yZXN0Z3JlZW4gICAgICAgICAgOiB7cjogMzQsICBnOiAxMzksIGI6IDM0fSxcbiAgICBnYWluc2Jvcm8gICAgICAgICAgICA6IHtyOiAyMjAsIGc6IDIyMCwgYjogMjIwfSxcbiAgICBnaG9zdHdoaXRlICAgICAgICAgICA6IHtyOiAyNDgsIGc6IDI0OCwgYjogMjU1fSxcbiAgICBnb2xkICAgICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDIxNSwgYjogMH0sXG4gICAgZ29sZGVucm9kICAgICAgICAgICAgOiB7cjogMjE4LCBnOiAxNjUsIGI6IDMyfSxcbiAgICBncmVlbnllbGxvdyAgICAgICAgICA6IHtyOiAxNzMsIGc6IDI1NSwgYjogNDd9LFxuICAgIGdyZXkgICAgICAgICAgICAgICAgIDoge3I6IDEyOCwgZzogMTI4LCBiOiAxMjh9LFxuICAgIGhvbmV5ZGV3ICAgICAgICAgICAgIDoge3I6IDI0MCwgZzogMjU1LCBiOiAyNDB9LFxuICAgIGhvdHBpbmsgICAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMTA1LCBiOiAxODB9LFxuICAgIGluZGlhbnJlZCAgICAgICAgICAgIDoge3I6IDIwNSwgZzogOTIsICBiOiA5Mn0sXG4gICAgaW5kaWdvICAgICAgICAgICAgICAgOiB7cjogNzUsICBnOiAwLCAgIGI6IDEzMH0sXG4gICAgaXZvcnkgICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyNTUsIGI6IDI0MH0sXG4gICAga2hha2kgICAgICAgICAgICAgICAgOiB7cjogMjQwLCBnOiAyMzAsIGI6IDE0MH0sXG4gICAgbGF2ZW5kZXIgICAgICAgICAgICAgOiB7cjogMjMwLCBnOiAyMzAsIGI6IDI1MH0sXG4gICAgbGF2ZW5kZXJibHVzaCAgICAgICAgOiB7cjogMjU1LCBnOiAyNDAsIGI6IDI0NX0sXG4gICAgbGF3bmdyZWVuICAgICAgICAgICAgOiB7cjogMTI0LCBnOiAyNTIsIGI6IDB9LFxuICAgIGxlbW9uY2hpZmZvbiAgICAgICAgIDoge3I6IDI1NSwgZzogMjUwLCBiOiAyMDV9LFxuICAgIGxpZ2h0Ymx1ZSAgICAgICAgICAgIDoge3I6IDE3MywgZzogMjE2LCBiOiAyMzB9LFxuICAgIGxpZ2h0Y29yYWwgICAgICAgICAgIDoge3I6IDI0MCwgZzogMTI4LCBiOiAxMjh9LFxuICAgIGxpZ2h0Y3lhbiAgICAgICAgICAgIDoge3I6IDIyNCwgZzogMjU1LCBiOiAyNTV9LFxuICAgIGxpZ2h0Z29sZGVucm9keWVsbG93IDoge3I6IDI1MCwgZzogMjUwLCBiOiAyMTB9LFxuICAgIGxpZ2h0Z3JheSAgICAgICAgICAgIDoge3I6IDIxMSwgZzogMjExLCBiOiAyMTF9LFxuICAgIGxpZ2h0Z3JlZW4gICAgICAgICAgIDoge3I6IDE0NCwgZzogMjM4LCBiOiAxNDR9LFxuICAgIGxpZ2h0Z3JleSAgICAgICAgICAgIDoge3I6IDIxMSwgZzogMjExLCBiOiAyMTF9LFxuICAgIGxpZ2h0cGluayAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMTgyLCBiOiAxOTN9LFxuICAgIGxpZ2h0c2FsbW9uICAgICAgICAgIDoge3I6IDI1NSwgZzogMTYwLCBiOiAxMjJ9LFxuICAgIGxpZ2h0c2VhZ3JlZW4gICAgICAgIDoge3I6IDMyLCAgZzogMTc4LCBiOiAxNzB9LFxuICAgIGxpZ2h0c2t5Ymx1ZSAgICAgICAgIDoge3I6IDEzNSwgZzogMjA2LCBiOiAyNTB9LFxuICAgIGxpZ2h0c2xhdGVncmF5ICAgICAgIDoge3I6IDExOSwgZzogMTM2LCBiOiAxNTN9LFxuICAgIGxpZ2h0c2xhdGVncmV5ICAgICAgIDoge3I6IDExOSwgZzogMTM2LCBiOiAxNTN9LFxuICAgIGxpZ2h0c3RlZWxibHVlICAgICAgIDoge3I6IDE3NiwgZzogMTk2LCBiOiAyMjJ9LFxuICAgIGxpZ2h0eWVsbG93ICAgICAgICAgIDoge3I6IDI1NSwgZzogMjU1LCBiOiAyMjR9LFxuICAgIGxpbWVncmVlbiAgICAgICAgICAgIDoge3I6IDUwLCAgZzogMjA1LCBiOiA1MH0sXG4gICAgbGluZW4gICAgICAgICAgICAgICAgOiB7cjogMjUwLCBnOiAyNDAsIGI6IDIzMH0sXG4gICAgbWFnZW50YSAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAwLCAgIGI6IDI1NX0sXG4gICAgbWVkaXVtYXF1YW1hcmluZSAgICAgOiB7cjogMTAyLCBnOiAyMDUsIGI6IDE3MH0sXG4gICAgbWVkaXVtYmx1ZSAgICAgICAgICAgOiB7cjogMCwgICBnOiAwLCAgIGI6IDIwNX0sXG4gICAgbWVkaXVtb3JjaGlkICAgICAgICAgOiB7cjogMTg2LCBnOiA4NSwgIGI6IDIxMX0sXG4gICAgbWVkaXVtcHVycGxlICAgICAgICAgOiB7cjogMTQ3LCBnOiAxMTIsIGI6IDIxOX0sXG4gICAgbWVkaXVtc2VhZ3JlZW4gICAgICAgOiB7cjogNjAsICBnOiAxNzksIGI6IDExM30sXG4gICAgbWVkaXVtc2xhdGVibHVlICAgICAgOiB7cjogMTIzLCBnOiAxMDQsIGI6IDIzOH0sXG4gICAgbWVkaXVtc3ByaW5nZ3JlZW4gICAgOiB7cjogMCwgICBnOiAyNTAsIGI6IDE1NH0sXG4gICAgbWVkaXVtdHVycXVvaXNlICAgICAgOiB7cjogNzIsICBnOiAyMDksIGI6IDIwNH0sXG4gICAgbWVkaXVtdmlvbGV0cmVkICAgICAgOiB7cjogMTk5LCBnOiAyMSwgIGI6IDEzM30sXG4gICAgbWlkbmlnaHRibHVlICAgICAgICAgOiB7cjogMjUsICBnOiAyNSwgIGI6IDExMn0sXG4gICAgbWludGNyZWFtICAgICAgICAgICAgOiB7cjogMjQ1LCBnOiAyNTUsIGI6IDI1MH0sXG4gICAgbWlzdHlyb3NlICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyMjgsIGI6IDIyNX0sXG4gICAgbW9jY2FzaW4gICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyMjgsIGI6IDE4MX0sXG4gICAgbmF2YWpvd2hpdGUgICAgICAgICAgOiB7cjogMjU1LCBnOiAyMjIsIGI6IDE3M30sXG4gICAgb2xkbGFjZSAgICAgICAgICAgICAgOiB7cjogMjUzLCBnOiAyNDUsIGI6IDIzMH0sXG4gICAgb2xpdmVkcmFiICAgICAgICAgICAgOiB7cjogMTA3LCBnOiAxNDIsIGI6IDM1fSxcbiAgICBvcmFuZ2UgICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDE2NSwgYjogMH0sXG4gICAgb3JhbmdlcmVkICAgICAgICAgICAgOiB7cjogMjU1LCBnOiA2OSwgIGI6IDB9LFxuICAgIG9yY2hpZCAgICAgICAgICAgICAgIDoge3I6IDIxOCwgZzogMTEyLCBiOiAyMTR9LFxuICAgIHBhbGVnb2xkZW5yb2QgICAgICAgIDoge3I6IDIzOCwgZzogMjMyLCBiOiAxNzB9LFxuICAgIHBhbGVncmVlbiAgICAgICAgICAgIDoge3I6IDE1MiwgZzogMjUxLCBiOiAxNTJ9LFxuICAgIHBhbGV0dXJxdW9pc2UgICAgICAgIDoge3I6IDE3NSwgZzogMjM4LCBiOiAyMzh9LFxuICAgIHBhbGV2aW9sZXRyZWQgICAgICAgIDoge3I6IDIxOSwgZzogMTEyLCBiOiAxNDd9LFxuICAgIHBhcGF5YXdoaXAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjM5LCBiOiAyMTN9LFxuICAgIHBlYWNocHVmZiAgICAgICAgICAgIDoge3I6IDI1NSwgZzogMjE4LCBiOiAxODV9LFxuICAgIHBlcnUgICAgICAgICAgICAgICAgIDoge3I6IDIwNSwgZzogMTMzLCBiOiA2M30sXG4gICAgcGluayAgICAgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAxOTIsIGI6IDIwM30sXG4gICAgcGx1bSAgICAgICAgICAgICAgICAgOiB7cjogMjIxLCBnOiAxNjAsIGI6IDIyMX0sXG4gICAgcG93ZGVyYmx1ZSAgICAgICAgICAgOiB7cjogMTc2LCBnOiAyMjQsIGI6IDIzMH0sXG4gICAgcm9zeWJyb3duICAgICAgICAgICAgOiB7cjogMTg4LCBnOiAxNDMsIGI6IDE0M30sXG4gICAgcm95YWxibHVlICAgICAgICAgICAgOiB7cjogNjUsICBnOiAxMDUsIGI6IDIyNX0sXG4gICAgc2FkZGxlYnJvd24gICAgICAgICAgOiB7cjogMTM5LCBnOiA2OSwgIGI6IDE5fSxcbiAgICBzYWxtb24gICAgICAgICAgICAgICA6IHtyOiAyNTAsIGc6IDEyOCwgYjogMTE0fSxcbiAgICBzYW5keWJyb3duICAgICAgICAgICA6IHtyOiAyNDQsIGc6IDE2NCwgYjogOTZ9LFxuICAgIHNlYWdyZWVuICAgICAgICAgICAgIDoge3I6IDQ2LCAgZzogMTM5LCBiOiA4N30sXG4gICAgc2Vhc2hlbGwgICAgICAgICAgICAgOiB7cjogMjU1LCBnOiAyNDUsIGI6IDIzOH0sXG4gICAgc2llbm5hICAgICAgICAgICAgICAgOiB7cjogMTYwLCBnOiA4MiwgIGI6IDQ1fSxcbiAgICBza3libHVlICAgICAgICAgICAgICA6IHtyOiAxMzUsIGc6IDIwNiwgYjogMjM1fSxcbiAgICBzbGF0ZWJsdWUgICAgICAgICAgICA6IHtyOiAxMDYsIGc6IDkwLCAgYjogMjA1fSxcbiAgICBzbGF0ZWdyYXkgICAgICAgICAgICA6IHtyOiAxMTIsIGc6IDEyOCwgYjogMTQ0fSxcbiAgICBzbGF0ZWdyZXkgICAgICAgICAgICA6IHtyOiAxMTIsIGc6IDEyOCwgYjogMTQ0fSxcbiAgICBzbm93ICAgICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDI1MCwgYjogMjUwfSxcbiAgICBzcHJpbmdncmVlbiAgICAgICAgICA6IHtyOiAwLCAgIGc6IDI1NSwgYjogMTI3fSxcbiAgICBzdGVlbGJsdWUgICAgICAgICAgICA6IHtyOiA3MCwgIGc6IDEzMCwgYjogMTgwfSxcbiAgICB0YW4gICAgICAgICAgICAgICAgICA6IHtyOiAyMTAsIGc6IDE4MCwgYjogMTQwfSxcbiAgICB0aGlzdGxlICAgICAgICAgICAgICA6IHtyOiAyMTYsIGc6IDE5MSwgYjogMjE2fSxcbiAgICB0b21hdG8gICAgICAgICAgICAgICA6IHtyOiAyNTUsIGc6IDk5LCAgYjogNzF9LFxuICAgIHR1cnF1b2lzZSAgICAgICAgICAgIDoge3I6IDY0LCAgZzogMjI0LCBiOiAyMDh9LFxuICAgIHZpb2xldCAgICAgICAgICAgICAgIDoge3I6IDIzOCwgZzogMTMwLCBiOiAyMzh9LFxuICAgIHdoZWF0ICAgICAgICAgICAgICAgIDoge3I6IDI0NSwgZzogMjIyLCBiOiAxNzl9LFxuICAgIHdoaXRlc21va2UgICAgICAgICAgIDoge3I6IDI0NSwgZzogMjQ1LCBiOiAyNDV9LFxuICAgIHllbGxvd2dyZWVuICAgICAgICAgIDoge3I6IDE1NCwgZzogMjA1LCBiOiA1MH1cbn1cbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBhcnNlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgZXhhbXBsZTogWzM1NTQ0MzEsIDE2ODA5OTg0XSxcbiAgICAgICAgICAgIHJlZ2V4OiAvXlxcZCskLyxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChjb2xvcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hOiBjb2xvciA+PiAyNCAmIDI1NSxcbiAgICAgICAgICAgICAgICAgICAgcjogY29sb3IgPj4gMTYgJiAyNTUsXG4gICAgICAgICAgICAgICAgICAgIGc6IGNvbG9yID4+IDggJiAyNTUsXG4gICAgICAgICAgICAgICAgICAgIGI6IGNvbG9yICYgMjU1XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBleGFtcGxlOiBbJyNmYjAnLCAnZjBmJ10sXG4gICAgICAgICAgICByZWdleDogL14jPyhbXFxkQS1GXXsxfSkoW1xcZEEtRl17MX0pKFtcXGRBLUZdezF9KSQvaSxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChoZXgsIHIsIGcsIGIpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHI6IHBhcnNlSW50KHIgKyByLCAxNiksXG4gICAgICAgICAgICAgICAgICAgIGc6IHBhcnNlSW50KGcgKyBnLCAxNiksXG4gICAgICAgICAgICAgICAgICAgIGI6IHBhcnNlSW50KGIgKyBiLCAxNilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGV4YW1wbGU6IFsnIzAwZmYwMCcsICczMzY2OTknXSxcbiAgICAgICAgICAgIHJlZ2V4OiAvXiM/KFtcXGRBLUZdezJ9KShbXFxkQS1GXXsyfSkoW1xcZEEtRl17Mn0pJC9pLFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gKGhleCwgciwgZywgYil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcjogcGFyc2VJbnQociwgMTYpLFxuICAgICAgICAgICAgICAgICAgICBnOiBwYXJzZUludChnLCAxNiksXG4gICAgICAgICAgICAgICAgICAgIGI6IHBhcnNlSW50KGIsIDE2KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgZXhhbXBsZTogWydyZ2IoMTIzLCAyMzQsIDQ1KScsICdyZ2IoMjUsIDUwJSwgMTAwJSknLCAncmdiYSgxMiUsIDM0LCA1NiUsIDAuNzgpJ10sXG4gICAgICAgICAgICAvLyByZWdleDogL15yZ2JhKlxcKChcXGR7MSwzfVxcJSopLFxccyooXFxkezEsM31cXCUqKSxcXHMqKFxcZHsxLDN9XFwlKikoPzosXFxzKihbMC05Ll0rKSk/XFwpLyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXnJnYmEqXFwoKFswLTldKlxcLj9bMC05XStcXCUqKSxcXHMqKFswLTldKlxcLj9bMC05XStcXCUqKSxcXHMqKFswLTldKlxcLj9bMC05XStcXCUqKSg/OixcXHMqKFswLTkuXSspKT9cXCkvLFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gKHMscixnLGIsYSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByID0gciAmJiByLnNsaWNlKC0xKSA9PSAnJScgPyAoci5zbGljZSgwLC0xKSAvIDEwMCkgOiByKjE7XG4gICAgICAgICAgICAgICAgZyA9IGcgJiYgZy5zbGljZSgtMSkgPT0gJyUnID8gKGcuc2xpY2UoMCwtMSkgLyAxMDApIDogZyoxO1xuICAgICAgICAgICAgICAgIGIgPSBiICYmIGIuc2xpY2UoLTEpID09ICclJyA/IChiLnNsaWNlKDAsLTEpIC8gMTAwKSA6IGIqMTtcbiAgICAgICAgICAgICAgICBhID0gYSoxO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcjogdXRpbC5jbGFtcChyLCAwLCAyNTUpLFxuICAgICAgICAgICAgICAgICAgICBnOiB1dGlsLmNsYW1wKGcsIDAsIDI1NSksXG4gICAgICAgICAgICAgICAgICAgIGI6IHV0aWwuY2xhbXAoYiwgMCwgMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgYTogdXRpbC5jbGFtcChhLCAwLCAxKSB8fCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGV4YW1wbGU6IFsnaHNsKDEyMywgMzQlLCA0NSUpJywgJ2hzbGEoMjUsIDUwJSwgMTAwJSwgMC43NSknLCAnaHN2KDEyLCAzNCUsIDU2JSknXSxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmhzKFtidmxdKWEqXFwoKFxcZHsxLDN9XFwlKiksXFxzKihcXGR7MSwzfVxcJSopLFxccyooXFxkezEsM31cXCUqKSg/OixcXHMqKFswLTkuXSspKT9cXCkvLFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gKGMsbHYsaCxzLGwsYSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoICo9IDE7XG4gICAgICAgICAgICAgICAgcyA9IHMuc2xpY2UoMCwtMSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgbCA9IGwuc2xpY2UoMCwtMSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgYSAqPSAxO1xuXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgaDogdXRpbC5jbGFtcChoLCAwLCAzNjApLFxuICAgICAgICAgICAgICAgICAgICBhOiB1dGlsLmNsYW1wKGwsIDAsIDEpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAvLyBgc2AgaXMgdXNlZCBpbiBtYW55IGRpZmZlcmVudCBzcGFjZXMgKEhTTCwgSFNWLCBIU0IpXG4gICAgICAgICAgICAgICAgLy8gc28gd2UgdXNlIGBzbGAsIGBzdmAgYW5kIGBzYmAgdG8gZGlmZmVyZW50aWF0ZVxuICAgICAgICAgICAgICAgIG9ialsncycrbHZdID0gdXRpbC5jbGFtcChzLCAwLCAxKSxcbiAgICAgICAgICAgICAgICBvYmpbbHZdID0gdXRpbC5jbGFtcChsLCAwLCAxKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDaHJvbWF0aFByb3RvdHlwZShDaHJvbWF0aCkge1xuICByZXR1cm4ge1xuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9OYW1lXG4gICAgICAgICBDYWxsIDxDaHJvbWF0aC50b05hbWU+IG9uIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgICAgICA+ID4gdmFyIGNvbG9yID0gbmV3IENocm9tYXRoKCdyZ2IoMTczLCAyMTYsIDIzMCknKTtcbiAgICAgICAgID4gPiBjb2xvci50b05hbWUoKTtcbiAgICAgICAgID4gXCJsaWdodGJsdWVcIlxuICAgICAgKi9cbiAgICAgIHRvTmFtZTogZnVuY3Rpb24gKCl7IHJldHVybiBDaHJvbWF0aC50b05hbWUodGhpcyk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvU3RyaW5nXG4gICAgICAgICBEaXNwbGF5IHRoZSBpbnN0YW5jZSBhcyBhIHN0cmluZy4gRGVmYXVsdHMgdG8gPENocm9tYXRoLnRvSGV4U3RyaW5nPlxuICAgICAgICAgPiA+IHZhciBjb2xvciA9IENocm9tYXRoLnJnYig1NiwgNzgsIDkwKTtcbiAgICAgICAgID4gPiBDb2xvci50b0hleFN0cmluZygpO1xuICAgICAgICAgPiBcIiMzODRFNUFcIlxuICAgICAgKi9cbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHRoaXMudG9IZXhTdHJpbmcoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdmFsdWVPZlxuICAgICAgICAgRGlzcGxheSB0aGUgaW5zdGFuY2UgYXMgYW4gaW50ZWdlci4gRGVmYXVsdHMgdG8gPENocm9tYXRoLnRvSW50ZWdlcj5cbiAgICAgICAgID4gPiB2YXIgeWVsbG93ID0gbmV3IENocm9tYXRoKCd5ZWxsb3cnKTtcbiAgICAgICAgID4gPiB5ZWxsb3cudmFsdWVPZigpO1xuICAgICAgICAgPiAxNjc3Njk2MFxuICAgICAgICAgPiA+ICt5ZWxsb3dcbiAgICAgICAgID4gMTY3NzY5NjBcbiAgICAgICovXG4gICAgICB2YWx1ZU9mOiBmdW5jdGlvbiAoKXsgcmV0dXJuIENocm9tYXRoLnRvSW50ZWdlcih0aGlzKTsgfSxcblxuICAgIC8qXG4gICAgICAgTWV0aG9kOiByZ2JcbiAgICAgICBSZXR1cm4gdGhlIFJHQiBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICA+ID4gbmV3IENocm9tYXRoKCdyZWQnKS5yZ2IoKTtcbiAgICAgICA+IFsyNTUsIDAsIDBdXG4gICAgKi9cbiAgICAgIHJnYjogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvUkdCQXJyYXkoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9SR0JBcnJheVxuICAgICAgICAgUmV0dXJuIHRoZSBSR0IgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gQ2hyb21hdGguYnVybHl3b29kLnRvUkdCQXJyYXkoKTtcbiAgICAgICAgID4gWzI1NSwgMTg0LCAxMzVdXG4gICAgICAqL1xuICAgICAgdG9SR0JBcnJheTogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvUkdCQUFycmF5KCkuc2xpY2UoMCwzKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9SR0JPYmplY3RcbiAgICAgICAgIFJldHVybiB0aGUgUkdCIG9iamVjdCBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2J1cmx5d29vZCcpLnRvUkdCT2JqZWN0KCk7XG4gICAgICAgICA+IHtyOiAyNTUsIGc6IDE4NCwgYjogMTM1fVxuICAgICAgKi9cbiAgICAgIHRvUkdCT2JqZWN0OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnRvUkdCQXJyYXkoKTtcblxuICAgICAgICAgIHJldHVybiB7cjogcmdiWzBdLCBnOiByZ2JbMV0sIGI6IHJnYlsyXX07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b1JHQlN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBSR0Igc3RyaW5nIG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnYWxpY2VibHVlJykudG9SR0JTdHJpbmcoKTtcbiAgICAgICAgID4gXCJyZ2IoMjQwLDI0OCwyNTUpXCJcbiAgICAgICovXG4gICAgICB0b1JHQlN0cmluZzogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm4gXCJyZ2IoXCIrIHRoaXMudG9SR0JBcnJheSgpLmpvaW4oXCIsXCIpICtcIilcIjtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHJnYmFcbiAgICAgICAgIFJldHVybiB0aGUgUkdCQSBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ3JlZCcpLnJnYmEoKTtcbiAgICAgICAgID4gWzI1NSwgMCwgMCwgMV1cbiAgICAgICovXG4gICAgICByZ2JhOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHRoaXMudG9SR0JBQXJyYXkoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9SR0JBQXJyYXlcbiAgICAgICAgIFJldHVybiB0aGUgUkdCQSBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBDaHJvbWF0aC5saW1lLnRvUkdCQUFycmF5KCk7XG4gICAgICAgICA+IFswLCAyNTUsIDAsIDFdXG4gICAgICAqL1xuICAgICAgdG9SR0JBQXJyYXk6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgdmFyIHJnYmEgPSBbXG4gICAgICAgICAgICAgIE1hdGgucm91bmQodGhpcy5yKjI1NSksXG4gICAgICAgICAgICAgIE1hdGgucm91bmQodGhpcy5nKjI1NSksXG4gICAgICAgICAgICAgIE1hdGgucm91bmQodGhpcy5iKjI1NSksXG4gICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhpcy5hKVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICByZXR1cm4gcmdiYTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvUkdCQU9iamVjdFxuICAgICAgICAgUmV0dXJuIHRoZSBSR0JBIG9iamVjdCBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBDaHJvbWF0aC5jYWRldGJsdWUudG9SR0JBT2JqZWN0KCk7XG4gICAgICAgICA+IHtyOiA5NSwgZzogMTU4LCBiOiAxNjB9XG4gICAgICAqL1xuICAgICAgdG9SR0JBT2JqZWN0OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciByZ2JhID0gdGhpcy50b1JHQkFBcnJheSgpO1xuXG4gICAgICAgICAgcmV0dXJuIHtyOiByZ2JhWzBdLCBnOiByZ2JhWzFdLCBiOiByZ2JhWzJdLCBhOiByZ2JhWzNdfTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvUkdCQVN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBSR0JBIHN0cmluZyBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2RhcmtibHVlJykudG9SR0JBU3RyaW5nKCk7XG4gICAgICAgICA+IFwicmdiYSgwLDAsMTM5LDEpXCJcbiAgICAgICovXG4gICAgICB0b1JHQkFTdHJpbmc6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBcInJnYmEoXCIrIHRoaXMudG9SR0JBQXJyYXkoKS5qb2luKFwiLFwiKSArXCIpXCI7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBoZXhcbiAgICAgICAgIFJldHVybiB0aGUgaGV4IGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiBuZXcgQ2hyb21hdGgoJ2RhcmtncmVlbicpLmhleCgpXG4gICAgICAgICBbICcwMCcsICc2NCcsICcwMCcgXVxuICAgICAgKi9cbiAgICAgIGhleDogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvSGV4QXJyYXkoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgTWV0aG9kOiB0b0hleEFycmF5XG4gICAgICAgICBSZXR1cm4gdGhlIGhleCBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgPiA+IENocm9tYXRoLmZpcmVicmljay50b0hleEFycmF5KCk7XG4gICAgICAgID4gW1wiQjJcIiwgXCIyMlwiLCBcIjIyXCJdXG4gICAgICAqL1xuICAgICAgdG9IZXhBcnJheTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLnJnYjJoZXgodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hleE9iamVjdFxuICAgICAgICAgUmV0dXJuIHRoZSBoZXggb2JqZWN0IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IENocm9tYXRoLmdhaW5zYm9yby50b0hleE9iamVjdCgpO1xuICAgICAgICAgPiB7cjogXCJEQ1wiLCBnOiBcIkRDXCIsIGI6IFwiRENcIn1cbiAgICAgICovXG4gICAgICB0b0hleE9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICB2YXIgaGV4ID0gdGhpcy50b0hleEFycmF5KCk7XG5cbiAgICAgICAgICByZXR1cm4geyByOiBoZXhbMF0sIGc6IGhleFsxXSwgYjogaGV4WzJdIH07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICBNZXRob2Q6IHRvSGV4U3RyaW5nXG4gICAgICAgICBSZXR1cm4gdGhlIGhleCBzdHJpbmcgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgID4gPiBDaHJvbWF0aC5ob25leWRldy50b0hleFN0cmluZygpO1xuICAgICAgICA+IFwiI0YwRkZGMFwiXG4gICAgICAqL1xuICAgICAgdG9IZXhTdHJpbmc6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHZhciBoZXggPSB0aGlzLnRvSGV4QXJyYXkoKTtcblxuICAgICAgICAgIHJldHVybiAnIycgKyBoZXguam9pbignJyk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBoc2xcbiAgICAgICAgIFJldHVybiB0aGUgSFNMIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+bmV3IENocm9tYXRoKCdncmVlbicpLmhzbCgpO1xuICAgICAgICAgPiBbMTIwLCAxLCAwLjI1MDk4MDM5MjE1Njg2Mjc0XVxuICAgICAgKi9cbiAgICAgIGhzbDogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLnRvSFNMQXJyYXkoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0xBcnJheVxuICAgICAgICAgUmV0dXJuIHRoZSBIU0wgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdyZWQnKS50b0hTTEFycmF5KCk7XG4gICAgICAgICA+IFswLCAxLCAwLjVdXG4gICAgICAqL1xuICAgICAgdG9IU0xBcnJheTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudG9IU0xBQXJyYXkoKS5zbGljZSgwLDMpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0xPYmplY3RcbiAgICAgICAgIFJldHVybiB0aGUgSFNMIG9iamVjdCBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ3JlZCcpLnRvSFNMT2JqZWN0KCk7XG4gICAgICAgICBbaDowLCBzOjEsIGw6MC41XVxuICAgICAgKi9cbiAgICAgIHRvSFNMT2JqZWN0OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciBoc2wgPSB0aGlzLnRvSFNMQXJyYXkoKTtcblxuICAgICAgICAgIHJldHVybiB7aDogaHNsWzBdLCBzOiBoc2xbMV0sIGw6IGhzbFsyXX07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTTFN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBIU0wgc3RyaW5nIG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgncmVkJykudG9IU0xTdHJpbmcoKTtcbiAgICAgICAgID4gXCJoc2woMCwxLDAuNSlcIlxuICAgICAgKi9cbiAgICAgIHRvSFNMU3RyaW5nOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgaHNsYSA9IHRoaXMudG9IU0xBQXJyYXkoKTtcbiAgICAgICAgICB2YXIgdmFscyA9IFtcbiAgICAgICAgICAgICAgaHNsYVswXSxcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZChoc2xhWzFdKjEwMCkrJyUnLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKGhzbGFbMl0qMTAwKSsnJSdcbiAgICAgICAgICBdO1xuXG4gICAgICAgICAgcmV0dXJuICdoc2woJysgdmFscyArJyknO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgTWV0aG9kOiBoc2xhXG4gICAgICAgIFJldHVybiB0aGUgSFNMQSBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnZ3JlZW4nKS5oc2xhKCk7XG4gICAgICAgID4gWzEyMCwgMSwgMC4yNTA5ODAzOTIxNTY4NjI3NCwgMV1cbiAgICAgICovXG4gICAgICBoc2xhOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHRoaXMudG9IU0xBQXJyYXkoKTsgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0xBcnJheVxuICAgICAgICAgUmV0dXJuIHRoZSBIU0xBIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IENocm9tYXRoLmFudGlxdWV3aGl0ZS50b0hTTEFBcnJheSgpO1xuICAgICAgICAgPiBbMzQsIDAuNzc3Nzc3Nzc3Nzc3Nzc3MywgMC45MTE3NjQ3MDU4ODIzNTI5LCAxXVxuICAgICAgKi9cbiAgICAgIHRvSFNMQUFycmF5OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIE1hdGgucm91bmQodGhpcy5oKSxcbiAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLnNsKSxcbiAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLmwpLFxuICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMuYSlcbiAgICAgICAgICBdO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0xBT2JqZWN0XG4gICAgICAgICBSZXR1cm4gdGhlIEhTTEEgb2JqZWN0IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IENocm9tYXRoLmFudGlxdWV3aGl0ZS50b0hTTEFBcnJheSgpO1xuICAgICAgICAgPiB7aDozNCwgczowLjc3Nzc3Nzc3Nzc3Nzc3NzMsIGw6MC45MTE3NjQ3MDU4ODIzNTI5LCBhOjF9XG4gICAgICAqL1xuICAgICAgdG9IU0xBT2JqZWN0OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciBoc2xhID0gdGhpcy50b0hTTEFBcnJheSgpO1xuXG4gICAgICAgICAgcmV0dXJuIHtoOiBoc2xhWzBdLCBzOiBoc2xhWzFdLCBsOiBoc2xhWzJdLCBhOiBoc2xhWzNdfTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNMQVN0cmluZ1xuICAgICAgICAgUmV0dXJuIHRoZSBIU0xBIHN0cmluZyBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBDaHJvbWF0aC5hbnRpcXVld2hpdGUudG9IU0xBU3RyaW5nKCk7XG4gICAgICAgICA+IFwiaHNsYSgzNCwwLjc3Nzc3Nzc3Nzc3Nzc3NzMsMC45MTE3NjQ3MDU4ODIzNTI5LDEpXCJcbiAgICAgICovXG4gICAgICB0b0hTTEFTdHJpbmc6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHZhciBoc2xhID0gdGhpcy50b0hTTEFBcnJheSgpO1xuICAgICAgICAgIHZhciB2YWxzID0gW1xuICAgICAgICAgICAgICBoc2xhWzBdLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKGhzbGFbMV0qMTAwKSsnJScsXG4gICAgICAgICAgICAgIE1hdGgucm91bmQoaHNsYVsyXSoxMDApKyclJyxcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZChoc2xhWzNdKVxuICAgICAgICAgIF07XG5cbiAgICAgICAgICByZXR1cm4gJ2hzbGEoJysgdmFscyArJyknO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogaHN2XG4gICAgICAgICBSZXR1cm4gdGhlIEhTViBhcnJheSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2JsdWUnKS5oc3YoKTtcbiAgICAgICAgID4gWzI0MCwgMSwgMV1cbiAgICAgICovXG4gICAgICBoc3Y6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy50b0hTVkFycmF5KCk7IH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNWQXJyYXlcbiAgICAgICAgIFJldHVybiB0aGUgSFNWIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnbmF2YWpvd2hpdGUnKS50b0hTVkFycmF5KCk7XG4gICAgICAgICA+IFszNiwgMC4zMjE1Njg2Mjc0NTA5ODAzNiwgMV1cbiAgICAgICovXG4gICAgICB0b0hTVkFycmF5OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRvSFNWQUFycmF5KCkuc2xpY2UoMCwzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNWT2JqZWN0XG4gICAgICAgICBSZXR1cm4gdGhlIEhTViBvYmplY3Qgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCduYXZham93aGl0ZScpLnRvSFNWT2JqZWN0KCk7XG4gICAgICAgICA+IHtoMzYsIHM6MC4zMjE1Njg2Mjc0NTA5ODAzNiwgdjoxfVxuICAgICAgKi9cbiAgICAgIHRvSFNWT2JqZWN0OiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHZhciBoc3ZhID0gdGhpcy50b0hTVkFBcnJheSgpO1xuXG4gICAgICAgICAgcmV0dXJuIHtoOiBoc3ZhWzBdLCBzOiBoc3ZhWzFdLCB2OiBoc3ZhWzJdfTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNWU3RyaW5nXG4gICAgICAgICBSZXR1cm4gdGhlIEhTViBzdHJpbmcgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCduYXZham93aGl0ZScpLnRvSFNWU3RyaW5nKCk7XG4gICAgICAgICA+IFwiaHN2KDM2LDMyLjE1Njg2Mjc0NTA5ODA0JSwxMDAlKVwiXG4gICAgICAqL1xuICAgICAgdG9IU1ZTdHJpbmc6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgdmFyIGhzdiA9IHRoaXMudG9IU1ZBcnJheSgpO1xuICAgICAgICAgIHZhciB2YWxzID0gW1xuICAgICAgICAgICAgICBoc3ZbMF0sXG4gICAgICAgICAgICAgIE1hdGgucm91bmQoaHN2WzFdKjEwMCkrJyUnLFxuICAgICAgICAgICAgICBNYXRoLnJvdW5kKGhzdlsyXSoxMDApKyclJ1xuICAgICAgICAgIF07XG5cbiAgICAgICAgICByZXR1cm4gJ2hzdignKyB2YWxzICsnKSc7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBoc3ZhXG4gICAgICAgICBSZXR1cm4gdGhlIEhTVkEgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdibHVlJykuaHN2YSgpO1xuICAgICAgICAgPiBbMjQwLCAxLCAxLCAxXVxuICAgICAgKi9cbiAgICAgIGhzdmE6IGZ1bmN0aW9uICgpeyByZXR1cm4gdGhpcy50b0hTVkFBcnJheSgpOyB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTVkFBcnJheVxuICAgICAgICAgUmV0dXJuIHRoZSBIU1ZBIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnb2xpdmUnKS50b0hTVkFBcnJheSgpO1xuICAgICAgICAgPiBbNjAsIDEsIDAuNTAxOTYwNzg0MzEzNzI1NSwgMV1cbiAgICAgICovXG4gICAgICB0b0hTVkFBcnJheTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZCh0aGlzLmgpLFxuICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMuc3YpLFxuICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMudiksXG4gICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhpcy5hKVxuICAgICAgICAgIF07XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTVkFPYmplY3RcbiAgICAgICAgIFJldHVybiB0aGUgSFNWQSBvYmplY3Qgb2YgdGhlIGluc3RhbmNlXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCdvbGl2ZScpLnRvSFNWQUFycmF5KCk7XG4gICAgICAgICA+IHtoOjYwLCBzOiAxLCB2OjAuNTAxOTYwNzg0MzEzNzI1NSwgYToxfVxuICAgICAgKi9cbiAgICAgIHRvSFNWQU9iamVjdDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgdmFyIGhzdmEgPSB0aGlzLnRvSFNWQUFycmF5KCk7XG5cbiAgICAgICAgICByZXR1cm4ge2g6IGhzdmFbMF0sIHM6IGhzdmFbMV0sIGw6IGhzdmFbMl0sIGE6IGhzdmFbM119O1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU1ZBU3RyaW5nXG4gICAgICAgICBSZXR1cm4gdGhlIEhTVkEgc3RyaW5nIG9mIHRoZSBpbnN0YW5jZVxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnb2xpdmUnKS50b0hTVkFTdHJpbmcoKTtcbiAgICAgICAgID4gXCJoc3ZhKDYwLDEwMCUsNTAuMTk2MDc4NDMxMzcyNTUlLDEpXCJcbiAgICAgICovXG4gICAgICB0b0hTVkFTdHJpbmc6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgdmFyIGhzdmEgPSB0aGlzLnRvSFNWQUFycmF5KCk7XG4gICAgICAgICAgdmFyIHZhbHMgPSBbXG4gICAgICAgICAgICAgIGhzdmFbMF0sXG4gICAgICAgICAgICAgIE1hdGgucm91bmQoaHN2YVsxXSoxMDApKyclJyxcbiAgICAgICAgICAgICAgTWF0aC5yb3VuZChoc3ZhWzJdKjEwMCkrJyUnLFxuICAgICAgICAgICAgICBoc3ZhWzNdXG4gICAgICAgICAgXTtcblxuICAgICAgICAgIHJldHVybiAnaHN2YSgnKyB2YWxzICsnKSc7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBoc2JcbiAgICAgICAgIEFsaWFzIGZvciA8aHN2PlxuICAgICAgKi9cbiAgICAgIGhzYjogZnVuY3Rpb24gKCl7IHJldHVybiB0aGlzLmhzdigpOyB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTQkFycmF5XG4gICAgICAgICBBbGlhcyBmb3IgPHRvSFNCQXJyYXk+XG4gICAgICAqL1xuICAgICAgdG9IU0JBcnJheTogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b0hTVkFycmF5KCk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTQk9iamVjdFxuICAgICAgICAgQWxpYXMgZm9yIDx0b0hTVk9iamVjdD5cbiAgICAgICovXG4gICAgICB0b0hTQk9iamVjdDogZnVuY3Rpb24gKClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b0hTVk9iamVjdCgpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdG9IU0JTdHJpbmdcbiAgICAgICAgIEFsaWFzIGZvciA8dG9IU1ZTdHJpbmc+XG4gICAgICAqL1xuICAgICAgdG9IU0JTdHJpbmc6IGZ1bmN0aW9uICgpXG4gICAgICB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudG9IU1ZTdHJpbmcoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGhzYmFcbiAgICAgICAgIEFsaWFzIGZvciA8aHN2YT5cbiAgICAgICovXG4gICAgICBoc2JhOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHRoaXMuaHN2YSgpOyB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiB0b0hTQkFBcnJheVxuICAgICAgICAgQWxpYXMgZm9yIDx0b0hTVkFBcnJheT5cbiAgICAgICovXG4gICAgICB0b0hTQkFBcnJheTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudG9IU1ZBQXJyYXkoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNCQU9iamVjdFxuICAgICAgICAgQWxpYXMgZm9yIDx0b0hTVkFPYmplY3Q+XG4gICAgICAqL1xuICAgICAgdG9IU0JBT2JqZWN0OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b0hTVkFPYmplY3QoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvSFNCQVN0cmluZ1xuICAgICAgICAgQWxpYXMgZm9yIDx0b0hTVkFTdHJpbmc+XG4gICAgICAqL1xuICAgICAgdG9IU0JBU3RyaW5nOiBmdW5jdGlvbiAoKVxuICAgICAge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRvSFNWQVN0cmluZygpO1xuICAgICAgfSxcblxuICAgICAgLy9Hcm91cDogSW5zdGFuY2UgbWV0aG9kcyAtIGNvbG9yIHNjaGVtZVxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogY29tcGxlbWVudFxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLmNvbXBsZW1lbnQ+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gQ2hyb21hdGgucmVkLmNvbXBsZW1lbnQoKS5yZ2IoKTtcbiAgICAgICAgID4gWzAsIDI1NSwgMjU1XVxuICAgICAgKi9cbiAgICAgIGNvbXBsZW1lbnQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5jb21wbGVtZW50KHRoaXMpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdHJpYWRcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC50cmlhZD4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ2hzbCgwLCAxMDAlLCA1MCUpJykudHJpYWQoKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiNGRjAwMDAsIzAwRkYwMCwjMDAwMEZGXCJcbiAgICAgICovXG4gICAgICB0cmlhZDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLnRyaWFkKHRoaXMpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogdGV0cmFkXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgudGV0cmFkPiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IENocm9tYXRoLmhzYigyNDAsIDEsIDEpLnRyaWFkKCk7XG4gICAgICAgICA+IFtDaHJvbWF0aCwgQ2hyb21hdGgsIENocm9tYXRoXVxuICAgICAgKi9cbiAgICAgIHRldHJhZDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLnRldHJhZCh0aGlzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGFuYWxvZ291c1xuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLmFuYWxvZ291cz4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBDaHJvbWF0aC5oc2IoMTIwLCAxLCAxKS5hbmFsb2dvdXMoKTtcbiAgICAgICAgID4gW0Nocm9tYXRoLCBDaHJvbWF0aCwgQ2hyb21hdGgsIENocm9tYXRoLCBDaHJvbWF0aCwgQ2hyb21hdGgsIENocm9tYXRoLCBDaHJvbWF0aF1cblxuICAgICAgICAgPiA+IENocm9tYXRoLmhzYigxODAsIDEsIDEpLmFuYWxvZ291cyg1KS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiMwMEZGRkYsIzAwRkZCMiwjMDBGRkU1LCMwMEU1RkYsIzAwQjJGRlwiXG5cbiAgICAgICAgID4gPiBDaHJvbWF0aC5oc2IoMTgwLCAxLCAxKS5hbmFsb2dvdXMoNSwgMTApLnRvU3RyaW5nKCk7XG4gICAgICAgICA+IFwiIzAwRkZGRiwjMDBGRjE5LCMwMEZGQjIsIzAwQjJGRiwjMDAxOUZGXCJcbiAgICAgICovXG4gICAgICBhbmFsb2dvdXM6IGZ1bmN0aW9uIChyZXN1bHRzLCBzbGljZXMpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5hbmFsb2dvdXModGhpcywgcmVzdWx0cywgc2xpY2VzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgIE1ldGhvZDogbW9ub2Nocm9tYXRpY1xuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLm1vbm9jaHJvbWF0aWM+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgID4gPiBDaHJvbWF0aC5ibHVlLm1vbm9jaHJvbWF0aWMoKS50b1N0cmluZygpO1xuICAgICAgICA+IFwiIzAwMDAzMywjMDAwMDY2LCMwMDAwOTksIzAwMDBDQywjMDAwMEZGXCJcbiAgICAgICovXG4gICAgICBtb25vY2hyb21hdGljOiBmdW5jdGlvbiAocmVzdWx0cyl7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLm1vbm9jaHJvbWF0aWModGhpcywgcmVzdWx0cyk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBzcGxpdGNvbXBsZW1lbnRcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5zcGxpdGNvbXBsZW1lbnQ+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gQ2hyb21hdGguYmx1ZS5zcGxpdGNvbXBsZW1lbnQoKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiMwMDAwRkYsI0ZGQ0MwMCwjRkY1MTAwXCJcbiAgICAgICovXG4gICAgICBzcGxpdGNvbXBsZW1lbnQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5zcGxpdGNvbXBsZW1lbnQodGhpcyk7XG4gICAgICB9LFxuXG4gICAgICAvLyBHcm91cDogSW5zdGFuY2UgbWV0aG9kcyAtIGNvbG9yIGFsdGVyYXRpb25cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRpbnRcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC50aW50PiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgneWVsbG93JykudGludCgwLjI1KS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiNGRkZGM0ZcIlxuICAgICAgKi9cbiAgICAgIHRpbnQ6IGZ1bmN0aW9uIChieSkge1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC50aW50KHRoaXMsIGJ5KTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGxpZ2h0ZW5cbiAgICAgICAgIEFsaWFzIGZvciA8dGludD5cbiAgICAgICovXG4gICAgICBsaWdodGVuOiBmdW5jdGlvbiAoYnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGludChieSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICBNZXRob2Q6IHNoYWRlXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGguc2hhZGU+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ3llbGxvdycpLnNoYWRlKDAuMjUpLnRvU3RyaW5nKCk7XG4gICAgICAgID4gXCIjQkZCRjAwXCJcbiAgICAgICovXG4gICAgICBzaGFkZTogZnVuY3Rpb24gKGJ5KSB7XG4gICAgICAgICAgcmV0dXJuIENocm9tYXRoLnNoYWRlKHRoaXMsIGJ5KTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGRhcmtlblxuICAgICAgICAgQWxpYXMgZm9yIDxzaGFkZT5cbiAgICAgICovXG4gICAgICBkYXJrZW46IGZ1bmN0aW9uIChieSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaGFkZShieSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBkZXNhdHVyYXRlXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGguZGVzYXR1cmF0ZT4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICA+ID4gbmV3IENocm9tYXRoKCdvcmFuZ2UnKS5kZXNhdHVyYXRlKCkudG9TdHJpbmcoKTtcbiAgICAgICA+IFwiI0FEQURBRFwiXG5cbiAgICAgICA+ID4gbmV3IENocm9tYXRoKCdvcmFuZ2UnKS5kZXNhdHVyYXRlKDEpLnRvU3RyaW5nKCk7XG4gICAgICAgPiBcIiM1QjVCNUJcIlxuXG4gICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnb3JhbmdlJykuZGVzYXR1cmF0ZSgyKS50b1N0cmluZygpO1xuICAgICAgID4gXCIjQjRCNEI0XCJcbiAgICAgICAqL1xuICAgICAgZGVzYXR1cmF0ZTogZnVuY3Rpb24gKGZvcm11bGEpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5kZXNhdHVyYXRlKHRoaXMsIGZvcm11bGEpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgTWV0aG9kOiBncmV5c2NhbGVcbiAgICAgICAgQWxpYXMgZm9yIDxkZXNhdHVyYXRlPlxuICAgICAgKi9cbiAgICAgIGdyZXlzY2FsZTogZnVuY3Rpb24gKGZvcm11bGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzYXR1cmF0ZShmb3JtdWxhKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHdlYnNhZmVcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC53ZWJzYWZlPiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IENocm9tYXRoLnJnYigxMjMsIDIzNCwgNTYpLnRvU3RyaW5nKCk7XG4gICAgICAgICA+IFwiIzdCRUEzOFwiXG5cbiAgICAgICAgID4gQ2hyb21hdGgucmdiKDEyMywgMjM0LCA1Nikud2Vic2FmZSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICA+IFwiIzY2RkYzM1wiXG4gICAgICAgKi9cbiAgICAgIHdlYnNhZmU6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC53ZWJzYWZlKHRoaXMpO1xuICAgICAgfSxcblxuICAgICAgLy8gR3JvdXA6IEluc3RhbmNlIG1ldGhvZHMgLSBjb2xvciBjb21iaW5hdGlvblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogYWRkaXRpdmVcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5hZGRpdGl2ZT4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJ3JlZCcpLmFkZGl0aXZlKCcjMDBGRjAwJywgJ2JsdWUnKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiNGRkZGRkZcIlxuICAgICAgKi9cbiAgICAgIGFkZGl0aXZlOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguYWRkaXRpdmUuYXBwbHkoQ2hyb21hdGgsIFt0aGlzXS5jb25jYXQoYXJyKSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBzdWJ0cmFjdGl2ZVxuICAgICAgICAgQ2FsbHMgPENocm9tYXRoLnN1YnRyYWN0aXZlPiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnY3lhbicpLnN1YnRyYWN0aXZlKCdtYWdlbnRhJywgJ3llbGxvdycpLnRvU3RyaW5nKCk7XG4gICAgICAgICA+IFwiIzAwMDAwMFwiXG4gICAgICAqL1xuICAgICAgc3VidHJhY3RpdmU6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgIHZhciBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5zdWJ0cmFjdGl2ZS5hcHBseShDaHJvbWF0aCwgW3RoaXNdLmNvbmNhdChhcnIpKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IG11bHRpcGx5XG4gICAgICAgICBDYWxscyA8Q2hyb21hdGgubXVsdGlwbHk+IHdpdGggdGhlIGN1cnJlbnQgaW5zdGFuY2UgYXMgdGhlIGZpcnN0IHBhcmFtZXRlclxuXG4gICAgICAgICA+ID4gQ2hyb21hdGgubGlnaHRjeWFuLm11bHRpcGx5KENocm9tYXRoLmJyb3duKS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiM5MDJBMkFcIlxuICAgICAgKi9cbiAgICAgIG11bHRpcGx5OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGgubXVsdGlwbHkuYXBwbHkoQ2hyb21hdGgsIFt0aGlzXS5jb25jYXQoYXJyKSk7XG4gICAgICB9LFxuXG4gICAgICAvKlxuICAgICAgICAgTWV0aG9kOiBhdmVyYWdlXG4gICAgICAgICBDYWxscyA8Q2hyb21hdGguYXZlcmFnZT4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBDaHJvbWF0aC5ibGFjay5hdmVyYWdlKCd3aGl0ZScpLnJnYigpO1xuICAgICAgICAgPiBbMTI3LCAxMjcsIDEyN11cbiAgICAgICovXG4gICAgICBhdmVyYWdlOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICB2YXIgYXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGguYXZlcmFnZS5hcHBseShDaHJvbWF0aCwgW3RoaXNdLmNvbmNhdChhcnIpKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IG92ZXJsYXlcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5vdmVybGF5PiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgID4gPiBDaHJvbWF0aC5yZWQub3ZlcmxheSgnZ3JlZW4nLCAwLjQpLnRvU3RyaW5nKCk7XG4gICAgICAgPiBcIiM5OTMzMDBcIlxuXG4gICAgICAgPiA+IENocm9tYXRoLnJlZC5vdmVybGF5KCdncmVlbicsIDEpLnRvU3RyaW5nKCk7XG4gICAgICAgPiBcIiMwMDgwMDBcIlxuXG4gICAgICAgPiA+IENocm9tYXRoLnJlZC5vdmVybGF5KCdncmVlbicsIDApLnRvU3RyaW5nKCk7XG4gICAgICAgPiBcIiNGRjAwMDBcIlxuICAgICAgICovXG4gICAgICBvdmVybGF5OiBmdW5jdGlvbiAoYm90dG9tLCB0cmFuc3BhcmVuY3kpe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5vdmVybGF5KHRoaXMsIGJvdHRvbSwgdHJhbnNwYXJlbmN5KTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIEdyb3VwOiBJbnN0YW5jZSBtZXRob2RzIC0gb3RoZXJcbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IGNsb25lXG4gICAgICAgICBSZXR1cm4gYW4gaW5kZXBlbmRlbnQgY29weSBvZiB0aGUgaW5zdGFuY2VcbiAgICAgICovXG4gICAgICBjbG9uZTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgcmV0dXJuIG5ldyBDaHJvbWF0aCh0aGlzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qXG4gICAgICAgICBNZXRob2Q6IHRvd2FyZHNcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC50b3dhcmRzPiB3aXRoIHRoZSBjdXJyZW50IGluc3RhbmNlIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXJcblxuICAgICAgICAgPiA+IHZhciByZWQgPSBuZXcgQ2hyb21hdGgoJ3JlZCcpO1xuICAgICAgICAgPiA+IHJlZC50b3dhcmRzKCd5ZWxsb3cnLCAwLjU1KS50b1N0cmluZygpO1xuICAgICAgICAgPiBcIiNGRjhDMDBcIlxuICAgICAgKi9cbiAgICAgIHRvd2FyZHM6IGZ1bmN0aW9uICh0bywgYnkpIHtcbiAgICAgICAgICByZXR1cm4gQ2hyb21hdGgudG93YXJkcyh0aGlzLCB0bywgYnkpO1xuICAgICAgfSxcblxuICAgICAgLypcbiAgICAgICAgIE1ldGhvZDogZ3JhZGllbnRcbiAgICAgICAgIENhbGxzIDxDaHJvbWF0aC5ncmFkaWVudD4gd2l0aCB0aGUgY3VycmVudCBpbnN0YW5jZSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXG5cbiAgICAgICAgID4gPiBuZXcgQ2hyb21hdGgoJyNGMDAnKS5ncmFkaWVudCgnIzAwRicpLnRvU3RyaW5nKClcbiAgICAgICAgID4gXCIjRkYwMDAwLCNGMTAwMEQsI0U0MDAxQSwjRDYwMDI4LCNDOTAwMzUsI0JCMDA0MywjQUUwMDUwLCNBMTAwNUQsIzkzMDA2QiwjODYwMDc4LCM3ODAwODYsIzZCMDA5MywjNUQwMEExLCM1MDAwQUUsIzQzMDBCQiwjMzUwMEM5LCMyODAwRDYsIzFBMDBFNCwjMEQwMEYxLCMwMDAwRkZcIlxuXG4gICAgICAgICA+ID4gbmV3IENocm9tYXRoKCcjRjAwJykuZ3JhZGllbnQoJyMwMEYnLCA1KS50b1N0cmluZygpXG4gICAgICAgICA+IFwiI0ZGMDAwMCwjQkYwMDNGLCM3RjAwN0YsIzNGMDBCRiwjMDAwMEZGXCJcblxuICAgICAgICAgPiA+IG5ldyBDaHJvbWF0aCgnI0YwMCcpLmdyYWRpZW50KCcjMDBGJywgNSwgMykudG9TdHJpbmcoKVxuICAgICAgICAgPiBcIiMzRjAwQkZcIlxuICAgICAgKi9cbiAgICAgIGdyYWRpZW50OiBmdW5jdGlvbiAodG8sIHNsaWNlcywgc2xpY2Upe1xuICAgICAgICAgIHJldHVybiBDaHJvbWF0aC5ncmFkaWVudCh0aGlzLCB0bywgc2xpY2VzLCBzbGljZSk7XG4gICAgICB9XG4gIH07XG59O1xuIiwidmFyIHV0aWwgPSB7fTtcblxudXRpbC5jbGFtcCA9IGZ1bmN0aW9uICggdmFsLCBtaW4sIG1heCApIHtcbiAgICBpZiAodmFsID4gbWF4KSByZXR1cm4gbWF4O1xuICAgIGlmICh2YWwgPCBtaW4pIHJldHVybiBtaW47XG4gICAgcmV0dXJuIHZhbDtcbn07XG5cbnV0aWwubWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlc3QgPSBhcmd1bWVudHNbMF0sIGk9MSwgc291cmNlLCBwcm9wO1xuICAgIHdoaWxlIChzb3VyY2UgPSBhcmd1bWVudHNbaSsrXSlcbiAgICAgICAgZm9yIChwcm9wIGluIHNvdXJjZSkgZGVzdFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcblxuICAgIHJldHVybiBkZXN0O1xufTtcblxudXRpbC5pc0FycmF5ID0gZnVuY3Rpb24gKCB0ZXN0ICkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGVzdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG51dGlsLmlzU3RyaW5nID0gZnVuY3Rpb24gKCB0ZXN0ICkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGVzdCkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudXRpbC5pc051bWJlciA9IGZ1bmN0aW9uICggdGVzdCApIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRlc3QpID09PSAnW29iamVjdCBOdW1iZXJdJztcbn07XG5cbnV0aWwuaXNPYmplY3QgPSBmdW5jdGlvbiAoIHRlc3QgKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0ZXN0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuXG51dGlsLmxwYWQgPSBmdW5jdGlvbiAoIHZhbCwgbGVuLCBwYWQgKSB7XG4gICAgdmFsID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgaWYgKCFsZW4pIGxlbiA9IDI7XG4gICAgaWYgKCFwYWQpIHBhZCA9ICcwJztcblxuICAgIHdoaWxlICh2YWwubGVuZ3RoIDwgbGVuKSB2YWwgPSBwYWQrdmFsO1xuXG4gICAgcmV0dXJuIHZhbDtcbn07XG5cbnV0aWwubGVycCA9IGZ1bmN0aW9uIChmcm9tLCB0bywgYnkpIHtcbiAgICByZXR1cm4gZnJvbSArICh0by1mcm9tKSAqIGJ5O1xufTtcblxudXRpbC50aW1lcyA9IGZ1bmN0aW9uIChuLCBmbiwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByZXN1bHRzID0gW107IGkgPCBuOyBpKyspIHtcbiAgICAgICAgcmVzdWx0c1tpXSA9IGZuLmNhbGwoY29udGV4dCwgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xufTtcblxudXRpbC5yZ2IgPSB7XG4gICAgZnJvbUFyZ3M6IGZ1bmN0aW9uIChyLCBnLCBiLCBhKSB7XG4gICAgICAgIHZhciByZ2IgPSBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgaWYgKHV0aWwuaXNBcnJheShyZ2IpKXsgcj1yZ2JbMF07IGc9cmdiWzFdOyBiPXJnYlsyXTsgYT1yZ2JbM107IH1cbiAgICAgICAgaWYgKHV0aWwuaXNPYmplY3QocmdiKSl7IHI9cmdiLnI7IGc9cmdiLmc7IGI9cmdiLmI7IGE9cmdiLmE7ICB9XG5cbiAgICAgICAgcmV0dXJuIFtyLCBnLCBiLCBhXTtcbiAgICB9LFxuICAgIHNjYWxlZDAxOiBmdW5jdGlvbiAociwgZywgYikge1xuICAgICAgICBpZiAoIWlzRmluaXRlKGFyZ3VtZW50c1sxXSkpe1xuICAgICAgICAgICAgdmFyIHJnYiA9IHV0aWwucmdiLmZyb21BcmdzKHIsIGcsIGIpO1xuICAgICAgICAgICAgciA9IHJnYlswXSwgZyA9IHJnYlsxXSwgYiA9IHJnYlsyXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyID4gMSkgciAvPSAyNTU7XG4gICAgICAgIGlmIChnID4gMSkgZyAvPSAyNTU7XG4gICAgICAgIGlmIChiID4gMSkgYiAvPSAyNTU7XG5cbiAgICAgICAgcmV0dXJuIFtyLCBnLCBiXTtcbiAgICB9LFxuICAgIHBjdFdpdGhTeW1ib2w6IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIHZhciByZ2IgPSB0aGlzLnNjYWxlZDAxKHIsIGcsIGIpO1xuXG4gICAgICAgIHJldHVybiByZ2IubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh2ICogMjU1KSArICclJztcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxudXRpbC5oc2wgPSB7XG4gICAgZnJvbUFyZ3M6IGZ1bmN0aW9uIChoLCBzLCBsLCBhKSB7XG4gICAgICAgIHZhciBoc2wgPSBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgaWYgKHV0aWwuaXNBcnJheShoc2wpKXsgaD1oc2xbMF07IHM9aHNsWzFdOyBsPWhzbFsyXTsgYT1oc2xbM107IH1cbiAgICAgICAgaWYgKHV0aWwuaXNPYmplY3QoaHNsKSl7IGg9aHNsLmg7IHM9aHNsLnM7IGw9KGhzbC5sIHx8IGhzbC52KTsgYT1oc2wuYTsgfVxuXG4gICAgICAgIHJldHVybiBbaCwgcywgbCwgYV07XG4gICAgfSxcbiAgICBzY2FsZWQ6IGZ1bmN0aW9uIChoLCBzLCBsKSB7XG4gICAgICAgIGlmICghaXNGaW5pdGUoYXJndW1lbnRzWzFdKSl7XG4gICAgICAgICAgICB2YXIgaHNsID0gdXRpbC5oc2wuZnJvbUFyZ3MoaCwgcywgbCk7XG4gICAgICAgICAgICBoID0gaHNsWzBdLCBzID0gaHNsWzFdLCBsID0gaHNsWzJdO1xuICAgICAgICB9XG5cbiAgICAgICAgaCA9ICgoKGggJSAzNjApICsgMzYwKSAlIDM2MCk7XG4gICAgICAgIGlmIChzID4gMSkgcyAvPSAxMDA7XG4gICAgICAgIGlmIChsID4gMSkgbCAvPSAxMDA7XG5cbiAgICAgICAgcmV0dXJuIFtoLCBzLCBsXTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWw7XG4iLCIoZnVuY3Rpb24oYSxiKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGIpO2Vsc2UgaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHMpYigpO2Vsc2V7YigpLGEuRmlsZVNhdmVyPXtleHBvcnRzOnt9fS5leHBvcnRzfX0pKHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGEsYil7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGI/Yj17YXV0b0JvbTohMX06XCJvYmplY3RcIiE9dHlwZW9mIGImJihjb25zb2xlLndhcm4oXCJEZXByaWNhdGVkOiBFeHBlY3RlZCB0aGlyZCBhcmd1bWVudCB0byBiZSBhIG9iamVjdFwiKSxiPXthdXRvQm9tOiFifSksYi5hdXRvQm9tJiYvXlxccyooPzp0ZXh0XFwvXFxTKnxhcHBsaWNhdGlvblxcL3htbHxcXFMqXFwvXFxTKlxcK3htbClcXHMqOy4qY2hhcnNldFxccyo9XFxzKnV0Zi04L2kudGVzdChhLnR5cGUpP25ldyBCbG9iKFtcIlxcdUZFRkZcIixhXSx7dHlwZTphLnR5cGV9KTphfWZ1bmN0aW9uIGMoYixjLGQpe3ZhciBlPW5ldyBYTUxIdHRwUmVxdWVzdDtlLm9wZW4oXCJHRVRcIixiKSxlLnJlc3BvbnNlVHlwZT1cImJsb2JcIixlLm9ubG9hZD1mdW5jdGlvbigpe2EoZS5yZXNwb25zZSxjLGQpfSxlLm9uZXJyb3I9ZnVuY3Rpb24oKXtjb25zb2xlLmVycm9yKFwiY291bGQgbm90IGRvd25sb2FkIGZpbGVcIil9LGUuc2VuZCgpfWZ1bmN0aW9uIGQoYSl7dmFyIGI9bmV3IFhNTEh0dHBSZXF1ZXN0O3JldHVybiBiLm9wZW4oXCJIRUFEXCIsYSwhMSksYi5zZW5kKCksMjAwPD1iLnN0YXR1cyYmMjk5Pj1iLnN0YXR1c31mdW5jdGlvbiBlKGEpe3RyeXthLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiKSl9Y2F0Y2goYyl7dmFyIGI9ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtiLmluaXRNb3VzZUV2ZW50KFwiY2xpY2tcIiwhMCwhMCx3aW5kb3csMCwwLDAsODAsMjAsITEsITEsITEsITEsMCxudWxsKSxhLmRpc3BhdGNoRXZlbnQoYil9fXZhciBmPVwib2JqZWN0XCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdy53aW5kb3c9PT13aW5kb3c/d2luZG93Olwib2JqZWN0XCI9PXR5cGVvZiBzZWxmJiZzZWxmLnNlbGY9PT1zZWxmP3NlbGY6XCJvYmplY3RcIj09dHlwZW9mIGdsb2JhbCYmZ2xvYmFsLmdsb2JhbD09PWdsb2JhbD9nbG9iYWw6dm9pZCAwLGE9Zi5zYXZlQXN8fFwib2JqZWN0XCIhPXR5cGVvZiB3aW5kb3d8fHdpbmRvdyE9PWY/ZnVuY3Rpb24oKXt9OlwiZG93bmxvYWRcImluIEhUTUxBbmNob3JFbGVtZW50LnByb3RvdHlwZT9mdW5jdGlvbihiLGcsaCl7dmFyIGk9Zi5VUkx8fGYud2Via2l0VVJMLGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7Zz1nfHxiLm5hbWV8fFwiZG93bmxvYWRcIixqLmRvd25sb2FkPWcsai5yZWw9XCJub29wZW5lclwiLFwic3RyaW5nXCI9PXR5cGVvZiBiPyhqLmhyZWY9YixqLm9yaWdpbj09PWxvY2F0aW9uLm9yaWdpbj9lKGopOmQoai5ocmVmKT9jKGIsZyxoKTplKGosai50YXJnZXQ9XCJfYmxhbmtcIikpOihqLmhyZWY9aS5jcmVhdGVPYmplY3RVUkwoYiksc2V0VGltZW91dChmdW5jdGlvbigpe2kucmV2b2tlT2JqZWN0VVJMKGouaHJlZil9LDRFNCksc2V0VGltZW91dChmdW5jdGlvbigpe2Uoail9LDApKX06XCJtc1NhdmVPck9wZW5CbG9iXCJpbiBuYXZpZ2F0b3I/ZnVuY3Rpb24oZixnLGgpe2lmKGc9Z3x8Zi5uYW1lfHxcImRvd25sb2FkXCIsXCJzdHJpbmdcIiE9dHlwZW9mIGYpbmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IoYihmLGgpLGcpO2Vsc2UgaWYoZChmKSljKGYsZyxoKTtlbHNle3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2kuaHJlZj1mLGkudGFyZ2V0PVwiX2JsYW5rXCIsc2V0VGltZW91dChmdW5jdGlvbigpe2UoaSl9KX19OmZ1bmN0aW9uKGEsYixkLGUpe2lmKGU9ZXx8b3BlbihcIlwiLFwiX2JsYW5rXCIpLGUmJihlLmRvY3VtZW50LnRpdGxlPWUuZG9jdW1lbnQuYm9keS5pbm5lclRleHQ9XCJkb3dubG9hZGluZy4uLlwiKSxcInN0cmluZ1wiPT10eXBlb2YgYSlyZXR1cm4gYyhhLGIsZCk7dmFyIGc9XCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIj09PWEudHlwZSxoPS9jb25zdHJ1Y3Rvci9pLnRlc3QoZi5IVE1MRWxlbWVudCl8fGYuc2FmYXJpLGk9L0NyaU9TXFwvW1xcZF0rLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2lmKChpfHxnJiZoKSYmXCJvYmplY3RcIj09dHlwZW9mIEZpbGVSZWFkZXIpe3ZhciBqPW5ldyBGaWxlUmVhZGVyO2oub25sb2FkZW5kPWZ1bmN0aW9uKCl7dmFyIGE9ai5yZXN1bHQ7YT1pP2E6YS5yZXBsYWNlKC9eZGF0YTpbXjtdKjsvLFwiZGF0YTphdHRhY2htZW50L2ZpbGU7XCIpLGU/ZS5sb2NhdGlvbi5ocmVmPWE6bG9jYXRpb249YSxlPW51bGx9LGoucmVhZEFzRGF0YVVSTChhKX1lbHNle3ZhciBrPWYuVVJMfHxmLndlYmtpdFVSTCxsPWsuY3JlYXRlT2JqZWN0VVJMKGEpO2U/ZS5sb2NhdGlvbj1sOmxvY2F0aW9uLmhyZWY9bCxlPW51bGwsc2V0VGltZW91dChmdW5jdGlvbigpe2sucmV2b2tlT2JqZWN0VVJMKGwpfSw0RTQpfX07Zi5zYXZlQXM9YS5zYXZlQXM9YSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9YSl9KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RmlsZVNhdmVyLm1pbi5qcy5tYXAiLCIvKlxuICogIGJhc2U2NC5qc1xuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG4gKiAgICBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogIFJlZmVyZW5jZXM6XG4gKiAgICBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NFxuICovXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoZ2xvYmFsKVxuICAgICAgICA6IHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZFxuICAgICAgICA/IGRlZmluZShmYWN0b3J5KSA6IGZhY3RvcnkoZ2xvYmFsKVxufSgoXG4gICAgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZlxuICAgICAgICA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93XG4gICAgICAgIDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxcbjogdGhpc1xuKSwgZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIGV4aXN0aW5nIHZlcnNpb24gZm9yIG5vQ29uZmxpY3QoKVxuICAgIGdsb2JhbCA9IGdsb2JhbCB8fCB7fTtcbiAgICB2YXIgX0Jhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgdmFyIHZlcnNpb24gPSBcIjIuNS4xXCI7XG4gICAgLy8gaWYgbm9kZS5qcyBhbmQgTk9UIFJlYWN0IE5hdGl2ZSwgd2UgdXNlIEJ1ZmZlclxuICAgIHZhciBidWZmZXI7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBidWZmZXIgPSBldmFsKFwicmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zdGFudHNcbiAgICB2YXIgYjY0Y2hhcnNcbiAgICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4gICAgdmFyIGI2NHRhYiA9IGZ1bmN0aW9uKGJpbikge1xuICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJpbi5sZW5ndGg7IGkgPCBsOyBpKyspIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIHJldHVybiBjYyA8IDB4ODAgPyBjXG4gICAgICAgICAgICAgICAgOiBjYyA8IDB4ODAwID8gKGZyb21DaGFyQ29kZSgweGMwIHwgKGNjID4+PiA2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8IChjYyAmIDB4M2YpKSlcbiAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAgNikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjYyA9IDB4MTAwMDBcbiAgICAgICAgICAgICAgICArIChjLmNoYXJDb2RlQXQoMCkgLSAweEQ4MDApICogMHg0MDBcbiAgICAgICAgICAgICAgICArIChjLmNoYXJDb2RlQXQoMSkgLSAweERDMDApO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoMHhmMCB8ICgoY2MgPj4+IDE4KSAmIDB4MDcpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gMTIpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAgNikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICggY2MgICAgICAgICAmIDB4M2YpKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciByZV91dG9iID0gL1tcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRkZdfFteXFx4MDAtXFx4N0ZdL2c7XG4gICAgdmFyIHV0b2IgPSBmdW5jdGlvbih1KSB7XG4gICAgICAgIHJldHVybiB1LnJlcGxhY2UocmVfdXRvYiwgY2JfdXRvYik7XG4gICAgfTtcbiAgICB2YXIgY2JfZW5jb2RlID0gZnVuY3Rpb24oY2NjKSB7XG4gICAgICAgIHZhciBwYWRsZW4gPSBbMCwgMiwgMV1bY2NjLmxlbmd0aCAlIDNdLFxuICAgICAgICBvcmQgPSBjY2MuY2hhckNvZGVBdCgwKSA8PCAxNlxuICAgICAgICAgICAgfCAoKGNjYy5sZW5ndGggPiAxID8gY2NjLmNoYXJDb2RlQXQoMSkgOiAwKSA8PCA4KVxuICAgICAgICAgICAgfCAoKGNjYy5sZW5ndGggPiAyID8gY2NjLmNoYXJDb2RlQXQoMikgOiAwKSksXG4gICAgICAgIGNoYXJzID0gW1xuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KCBvcmQgPj4+IDE4KSxcbiAgICAgICAgICAgIGI2NGNoYXJzLmNoYXJBdCgob3JkID4+PiAxMikgJiA2MyksXG4gICAgICAgICAgICBwYWRsZW4gPj0gMiA/ICc9JyA6IGI2NGNoYXJzLmNoYXJBdCgob3JkID4+PiA2KSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAxID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KG9yZCAmIDYzKVxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gICAgfTtcbiAgICB2YXIgYnRvYSA9IGdsb2JhbC5idG9hID8gZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmJ0b2EoYik7XG4gICAgfSA6IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGIucmVwbGFjZSgvW1xcc1xcU117MSwzfS9nLCBjYl9lbmNvZGUpO1xuICAgIH07XG4gICAgdmFyIF9lbmNvZGUgPSBidWZmZXIgP1xuICAgICAgICBidWZmZXIuZnJvbSAmJiBVaW50OEFycmF5ICYmIGJ1ZmZlci5mcm9tICE9PSBVaW50OEFycmF5LmZyb21cbiAgICAgICAgPyBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgcmV0dXJuICh1LmNvbnN0cnVjdG9yID09PSBidWZmZXIuY29uc3RydWN0b3IgPyB1IDogYnVmZmVyLmZyb20odSkpXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICB9XG4gICAgICAgIDogIGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gKHUuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvciA/IHUgOiBuZXcgIGJ1ZmZlcih1KSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gYnRvYSh1dG9iKHUpKSB9XG4gICAgO1xuICAgIHZhciBlbmNvZGUgPSBmdW5jdGlvbih1LCB1cmlzYWZlKSB7XG4gICAgICAgIHJldHVybiAhdXJpc2FmZVxuICAgICAgICAgICAgPyBfZW5jb2RlKFN0cmluZyh1KSlcbiAgICAgICAgICAgIDogX2VuY29kZShTdHJpbmcodSkpLnJlcGxhY2UoL1srXFwvXS9nLCBmdW5jdGlvbihtMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtMCA9PSAnKycgPyAnLScgOiAnXyc7XG4gICAgICAgICAgICB9KS5yZXBsYWNlKC89L2csICcnKTtcbiAgICB9O1xuICAgIHZhciBlbmNvZGVVUkkgPSBmdW5jdGlvbih1KSB7IHJldHVybiBlbmNvZGUodSwgdHJ1ZSkgfTtcbiAgICAvLyBkZWNvZGVyIHN0dWZmXG4gICAgdmFyIHJlX2J0b3UgPSBuZXcgUmVnRXhwKFtcbiAgICAgICAgJ1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdJyxcbiAgICAgICAgJ1tcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9JyxcbiAgICAgICAgJ1tcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9J1xuICAgIF0uam9pbignfCcpLCAnZycpO1xuICAgIHZhciBjYl9idG91ID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICBzd2l0Y2goY2NjYy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdmFyIGNwID0gKCgweDA3ICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCAxOClcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgxKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgfCAgICAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMikpIDw8ICA2KVxuICAgICAgICAgICAgICAgIHwgICAgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDMpKSxcbiAgICAgICAgICAgIG9mZnNldCA9IGNwIC0gMHgxMDAwMDtcbiAgICAgICAgICAgIHJldHVybiAoZnJvbUNoYXJDb2RlKChvZmZzZXQgID4+PiAxMCkgKyAweEQ4MDApXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKChvZmZzZXQgJiAweDNGRikgKyAweERDMDApKTtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MGYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDEyKVxuICAgICAgICAgICAgICAgICAgICB8ICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgxKSkgPDwgNilcbiAgICAgICAgICAgICAgICAgICAgfCAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMikpXG4gICAgICAgICAgICApO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICBmcm9tQ2hhckNvZGUoXG4gICAgICAgICAgICAgICAgKCgweDFmICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgxKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBidG91ID0gZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5yZXBsYWNlKHJlX2J0b3UsIGNiX2J0b3UpO1xuICAgIH07XG4gICAgdmFyIGNiX2RlY29kZSA9IGZ1bmN0aW9uKGNjY2MpIHtcbiAgICAgICAgdmFyIGxlbiA9IGNjY2MubGVuZ3RoLFxuICAgICAgICBwYWRsZW4gPSBsZW4gJSA0LFxuICAgICAgICBuID0gKGxlbiA+IDAgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMCldIDw8IDE4IDogMClcbiAgICAgICAgICAgIHwgKGxlbiA+IDEgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMSldIDw8IDEyIDogMClcbiAgICAgICAgICAgIHwgKGxlbiA+IDIgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMildIDw8ICA2IDogMClcbiAgICAgICAgICAgIHwgKGxlbiA+IDMgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMyldICAgICAgIDogMCksXG4gICAgICAgIGNoYXJzID0gW1xuICAgICAgICAgICAgZnJvbUNoYXJDb2RlKCBuID4+PiAxNiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoKG4gPj4+ICA4KSAmIDB4ZmYpLFxuICAgICAgICAgICAgZnJvbUNoYXJDb2RlKCBuICAgICAgICAgJiAweGZmKVxuICAgICAgICBdO1xuICAgICAgICBjaGFycy5sZW5ndGggLT0gWzAsIDAsIDIsIDFdW3BhZGxlbl07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBfYXRvYiA9IGdsb2JhbC5hdG9iID8gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmF0b2IoYSk7XG4gICAgfSA6IGZ1bmN0aW9uKGEpe1xuICAgICAgICByZXR1cm4gYS5yZXBsYWNlKC9cXFN7MSw0fS9nLCBjYl9kZWNvZGUpO1xuICAgIH07XG4gICAgdmFyIGF0b2IgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIHJldHVybiBfYXRvYihTdHJpbmcoYSkucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9dL2csICcnKSk7XG4gICAgfTtcbiAgICB2YXIgX2RlY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICA/IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IGJ1ZmZlci5mcm9tKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IG5ldyBidWZmZXIoYSwgJ2Jhc2U2NCcpKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gYnRvdShfYXRvYihhKSkgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKFxuICAgICAgICAgICAgU3RyaW5nKGEpLnJlcGxhY2UoL1stX10vZywgZnVuY3Rpb24obTApIHsgcmV0dXJuIG0wID09ICctJyA/ICcrJyA6ICcvJyB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL10vZywgJycpXG4gICAgICAgICk7XG4gICAgfTtcbiAgICB2YXIgbm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NCA9IF9CYXNlNjQ7XG4gICAgICAgIHJldHVybiBCYXNlNjQ7XG4gICAgfTtcbiAgICAvLyBleHBvcnQgQmFzZTY0XG4gICAgZ2xvYmFsLkJhc2U2NCA9IHtcbiAgICAgICAgVkVSU0lPTjogdmVyc2lvbixcbiAgICAgICAgYXRvYjogYXRvYixcbiAgICAgICAgYnRvYTogYnRvYSxcbiAgICAgICAgZnJvbUJhc2U2NDogZGVjb2RlLFxuICAgICAgICB0b0Jhc2U2NDogZW5jb2RlLFxuICAgICAgICB1dG9iOiB1dG9iLFxuICAgICAgICBlbmNvZGU6IGVuY29kZSxcbiAgICAgICAgZW5jb2RlVVJJOiBlbmNvZGVVUkksXG4gICAgICAgIGJ0b3U6IGJ0b3UsXG4gICAgICAgIGRlY29kZTogZGVjb2RlLFxuICAgICAgICBub0NvbmZsaWN0OiBub0NvbmZsaWN0LFxuICAgICAgICBfX2J1ZmZlcl9fOiBidWZmZXJcbiAgICB9O1xuICAgIC8vIGlmIEVTNSBpcyBhdmFpbGFibGUsIG1ha2UgQmFzZTY0LmV4dGVuZFN0cmluZygpIGF2YWlsYWJsZVxuICAgIGlmICh0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBub0VudW0gPSBmdW5jdGlvbih2KXtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6dixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9O1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWwuQmFzZTY0LmV4dGVuZFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAnZnJvbUJhc2U2NCcsIG5vRW51bShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGUodGhpcylcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICh1cmlzYWZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdXJpc2FmZSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0VVJJJywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyBleHBvcnQgQmFzZTY0IHRvIHRoZSBuYW1lc3BhY2VcbiAgICAvL1xuICAgIGlmIChnbG9iYWxbJ01ldGVvciddKSB7IC8vIE1ldGVvci5qc1xuICAgICAgICBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIH1cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBhbmQgQU1EIGFyZSBtdXR1YWxseSBleGNsdXNpdmUuXG4gICAgLy8gbW9kdWxlLmV4cG9ydHMgaGFzIHByZWNlZGVuY2UuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLkJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKXsgcmV0dXJuIGdsb2JhbC5CYXNlNjQgfSk7XG4gICAgfVxuICAgIC8vIHRoYXQncyBpdCFcbiAgICByZXR1cm4ge0Jhc2U2NDogZ2xvYmFsLkJhc2U2NH1cbn0pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLy9DcmFmdCBvYmplY3QucHJvdHlwZVxyXG4oZnVuY3Rpb24oKXtcclxuXHRpZiggdHlwZW9mKE9iamVjdC5hZGRDb25zdFByb3ApID09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGZ1bmN0aW9uIGNvbnN0UHJvcChuYW1lX3Byb3AsIHZhbHVlLCB2aXMpe1xyXG5cdFx0aWYodmlzID09PSB1bmRlZmluZWQpIHZpcyA9IHRydWU7XHJcblx0XHRpZih0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIE9iamVjdC5mcmVlemUodmFsdWUpO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWVfcHJvcCwge1xyXG5cdFx0XHRcdHZhbHVlOiB2YWx1ZSxcclxuXHRcdFx0XHRlbnVtZXJhYmxlOiB2aXNcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGdldFNldChuYW1lLCBnZXR0ZXIsIHNldHRlcil7XHJcblx0XHRpZih0eXBlb2Ygc2V0dGVyID09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XHJcblx0XHRcdFx0Z2V0OiBnZXR0ZXIsXHJcblx0XHRcdFx0c2V0OiBzZXR0ZXIsXHJcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcclxuXHRcdFx0XHRnZXQ6IGdldHRlcixcclxuXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y29uc3RQcm9wLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgJ2FkZENvbnN0UHJvcCcsIGNvbnN0UHJvcCwgZmFsc2UpO1xyXG5cdE9iamVjdC5wcm90b3R5cGUuYWRkQ29uc3RQcm9wKCdhZGRHZXRTZXQnLCBnZXRTZXQsIGZhbHNlKTtcclxuXHRcclxuXHRcclxuXHRpZih0eXBlb2YoT2JqZWN0LnByb3RvdHlwZS50b1NvdXJjZSkgIT09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU291cmNlJyx7XHJcblx0XHRcdHZhbHVlOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dmFyIHN0ciA9ICd7JztcclxuXHRcdFx0XHRcdGZvcih2YXIga2V5IGluIHRoaXMpe1xyXG5cdFx0XHRcdFx0XHRzdHIgKz0gJyAnICsga2V5ICsgJzogJyArIHRoaXNba2V5XSArICcsJztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHN0ci5sZW5ndGggPiAyKSBzdHIgPSBzdHIuc2xpY2UoMCwgLTEpICsgJyAnO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHN0ciArICd9JztcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRlbnVtZXJhYmxlOiBmYWxzZVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGlmKHR5cGVvZihPYmplY3QudmFsdWVzKSAhPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdHZhciB2YWxfT2JqID0gZnVuY3Rpb24ob2JqKXtcclxuXHRcdFx0dmFyIHZhbHMgPSBbXTtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuXHRcdFx0XHR2YWxzLnB1c2gob2JqW2tleV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gdmFscztcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdCBPYmplY3QuYWRkQ29uc3RQcm9wKCd2YWx1ZXMnLCB2YWxfT2JqLmJpbmQoT2JqZWN0KSk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIHJhbmRJbmRleCgpe1xyXG5cdFx0dmFyIHJhbmQgPSBNYXRoLnJvdW5kKCh0aGlzLmxlbmd0aCAtIDEpICogTWF0aC5yYW5kb20oKSk7XHJcblx0XHRyZXR1cm4gdGhpc1tyYW5kXTtcclxuXHR9XHJcblx0QXJyYXkucHJvdG90eXBlLmFkZENvbnN0UHJvcCgncmFuZF9pJywgcmFuZEluZGV4KTtcclxuXHRcclxuXHRcclxuXHRmdW5jdGlvbiBjcmVhdGVBcnIodmFsLCBsZW5ndGgsIGlzX2NhbGwpe1xyXG5cdFx0dmFyIGFyciA9IFtdO1xyXG5cdFx0XHJcblx0XHRpZighbGVuZ3RoKSBsZW5ndGggPSAxO1xyXG5cdFx0aWYoaXNfY2FsbCA9PT0gdW5kZWZpbmVkKSBpc19jYWxsID0gdHJ1ZTtcclxuXHRcdFxyXG5cdFx0aWYodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nICYmIGlzX2NhbGwpe1xyXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdGFyci5wdXNoKHZhbChpLCBhcnIpKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdGFyci5wdXNoKHZhbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblx0XHJcblx0QXJyYXkucHJvdG90eXBlLmFkZENvbnN0UHJvcCgnYWRkJywgZnVuY3Rpb24odmFsKXtcclxuXHRcdGlmKCF0aGlzLl9udWxscykgdGhpcy5fbnVsbHMgPSBbXTtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy5fbnVsbHMubGVuZ3RoKXtcclxuXHRcdFx0dmFyIGluZCA9IHRoaXMuX251bGxzLnBvcCgpO1xyXG5cdFx0XHR0aGlzW2luZF0gPSB2YWw7XHJcblx0XHRcdHJldHVybiBpbmQ7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHVzaCh2YWwpIC0gMTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHRBcnJheS5wcm90b3R5cGUuYWRkQ29uc3RQcm9wKCdkZWxsJywgZnVuY3Rpb24oaW5kKXtcclxuXHRcdGlmKGluZCA+IHRoaXMubGVuZ3RoIC0xKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcclxuXHRcdGlmKGluZCA9PSB0aGlzLmxlbmd0aCAtMSl7XHJcblx0XHRcdHRoaXMucG9wKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYoIXRoaXMuX251bGxzKSB0aGlzLl9udWxscyA9IFtdO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpc1tpbmRdID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR0aGlzLl9udWxscy5wdXNoKGluZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0cnVlO1x0XHJcblx0fSk7XHJcblx0XHJcblx0QXJyYXkuYWRkQ29uc3RQcm9wKCdjcmVhdGUnLCBjcmVhdGVBcnIpO1xyXG5cdFxyXG5cdFxyXG5cdGlmKFJlZ0V4cC5wcm90b3R5cGUudG9KU09OICE9PSBcImZ1bmN0aW9uXCIpe1xyXG5cdFx0UmVnRXhwLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5zb3VyY2U7IH07XHJcblx0fVxyXG5cclxufSkoKTtcclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxubmV3IChmdW5jdGlvbigpe1xyXG5cdGlmKHR5cGVvZihPYmplY3QuYWRkQ29uc3RQcm9wKSAhPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGUgPT0gXCJvYmplY3RcIil7XHJcblx0XHRcdHJlcXVpcmUoXCIuL21vZi5qc1wiKTtcclxuXHRcdH1lbHNlIHRocm93IG5ldyBFcnJvcihcItCi0YDQtdCx0YPQtdGC0YzRgdGPINCx0LjQsdC70LjQvtGC0LXQutCwIG1vZi5qc1wiKTtcclxuXHR9XHJcblxyXG5cdGlmKHR5cGVvZihPYmplY3QudHlwZXMpID09IFwib2JqZWN0XCIpe1xyXG5cdFx0cmV0dXJuIE9iamVjdC50eXBlcztcclxuXHR9XHJcblxyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgRG9jID0ge1xyXG5cdFx0dHlwZXM6e1xyXG5cdFx0XHQnYm9vbCc6e1xyXG5cdFx0XHRcdG5hbWU6IFwiQm9vbGVhblwiLFxyXG5cdFx0XHRcdGFyZzogW11cclxuXHRcdFx0fSxcclxuXHRcdFx0J2NvbnN0Jzoge1xyXG5cdFx0XHRcdG5hbWU6IFwiQ29uc3RhbnRcIixcclxuXHRcdFx0XHRhcmc6IFtcInZhbHVlXCJdLFxyXG5cdFx0XHRcdHBhcmFtczogeyB2YWx1ZToge3R5cGU6IFwiU29tZXRoaW5nXCIsIGRlZmF1bHRfdmFsdWU6IG51bGx9fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQncG9zJzoge1xyXG5cdFx0XHRcdG5hbWU6IFwiUG9zaXRpb25cIixcclxuXHRcdFx0XHRhcmc6IFsnbWF4J10sXHJcblx0XHRcdFx0cGFyYW1zOiB7bWF4OiB7dHlwZTogJ3BvcycsIGRlZmF1bHRfdmFsdWU6ICsyMTQ3NDgzNjQ3fX1cclxuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnaW50Jzoge1xyXG5cdFx0XHRcdG5hbWU6IFwiSW50ZWdlclwiLFxyXG5cdFx0XHRcdGFyZzogW1wibWF4XCIsIFwibWluXCIsIFwic3RlcFwiXSxcclxuXHRcdFx0XHRwYXJhbXM6IHtcclxuXHRcdFx0XHRcdFx0bWF4OiB7dHlwZTogJ2ludCcsIGRlZmF1bHRfdmFsdWU6ICsyMTQ3NDgzNjQ3fSxcclxuXHRcdFx0XHRcdFx0bWluOiB7dHlwZTogJ2ludCcsIGRlZmF1bHRfdmFsdWU6IC0yMTQ3NDgzNjQ4fSxcclxuXHRcdFx0XHRcdFx0c3RlcDoge3R5cGU6ICdwb3MnLCBkZWZhdWx0X3ZhbHVlOiAxfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J251bSc6IHtcclxuXHRcdFx0XHRuYW1lOiBcIk51bWJlclwiLFxyXG5cdFx0XHRcdGFyZzogW1wibWF4XCIsIFwibWluXCIsIFwicHJlY2lzXCJdLFxyXG5cdFx0XHRcdHBhcmFtczoge1xyXG5cdFx0XHRcdFx0XHRtYXg6IHt0eXBlOiAnbnVtJywgZGVmYXVsdF92YWx1ZTogKzIxNDc0ODM2NDd9LFxyXG5cdFx0XHRcdFx0XHRtaW46IHt0eXBlOiAnbnVtJywgZGVmYXVsdF92YWx1ZTogLTIxNDc0ODM2NDh9LFxyXG5cdFx0XHRcdFx0XHRwcmVjaXM6IHt0eXBlOiAncG9zJywgZGVmYXVsdF92YWx1ZTogOX1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0J2Fycic6IHtcclxuXHRcdFx0XHRuYW1lOiBcIkFycmF5XCIsXHJcblx0XHRcdFx0YXJnOiBbXCJ0eXBlc1wiLCBcInNpemVcIiwgXCJmaXhlZFwiXSxcclxuXHRcdFx0XHRwYXJhbXM6IHtcclxuXHRcdFx0XHRcdFx0dHlwZXM6IHt0eXBlOiBcIlR5cGUgfHwgW1R5cGUsIFR5cGUuLi5dXCIsIGdldCBkZWZhdWx0X3ZhbHVlKCl7cmV0dXJuIFQucG9zfX0sXHJcblx0XHRcdFx0XHRcdHNpemU6IHt0eXBlOiAncG9zJywgZGVmYXVsdF92YWx1ZTogN30sXHJcblx0XHRcdFx0XHRcdGZpeGVkOiB7dHlwZTogJ2Jvb2wnLCBkZWZhdWx0X3ZhbHVlOiB0cnVlfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnYW55Jzoge1xyXG5cdFx0XHRcdG5hbWU6IFwiTWl4VHlwZVwiLFxyXG5cdFx0XHRcdGFyZzogW1widHlwZXNcIl0sXHJcblx0XHRcdFx0cGFyYW1zOiB7XHJcblx0XHRcdFx0XHRcdHR5cGVzOiB7dHlwZTogXCJUeXBlLCBUeXBlLi4uIHx8IFtUeXBlLCBUeXBlLi4uXVwiLCBnZXQgZGVmYXVsdF92YWx1ZSgpe3JldHVybiBbVC5wb3MsIFQuc3RyXX19XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdCdvYmonOiB7XHJcblx0XHRcdFx0bmFtZTogXCJPYmplY3RcIixcclxuXHRcdFx0XHRhcmc6IFtcInR5cGVzXCJdLFxyXG5cdFx0XHRcdHBhcmFtczoge3R5cGVzOiB7dHlwZTogXCJPYmplY3RcIiwgZGVmYXVsdF92YWx1ZToge319fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Z2V0Q29uc3Q6IGZ1bmN0aW9uKG5hbWVfdHlwZSwgbmFtZV9saW1pdCl7XHJcblx0XHRcdHJldHVybiB0aGlzLnR5cGVzW25hbWVfdHlwZV0ucGFyYW1zW25hbWVfbGltaXRdLmRlZmF1bHRfdmFsdWU7XHJcblx0XHR9XHJcblx0fTtcclxuXHR0aGlzLmRvYyA9IHt9O1xyXG5cdHRoaXMuZG9jLmpzb24gPSBKU09OLnN0cmluZ2lmeShEb2MsIFwiXCIsIDIpO1xyXG5cclxuXHREb2MuZ2VuRG9jID0gKGZ1bmN0aW9uKG5hbWUsIHBhcmFtcyl7cmV0dXJuIHtuYW1lOiB0aGlzLnR5cGVzW25hbWVdLm5hbWUsIHBhcmFtczogcGFyYW1zfX0pLmJpbmQoRG9jKTtcclxuXHR0aGlzLmRvYy5nZW4gPSBEb2MuZ2VuRG9jO1xyXG5cclxuXHJcblxyXG5cclxuXHQvL0Vycm9zXHJcblx0ZnVuY3Rpb24gYXJnVHlwZUVycm9yKHdyb25nX2FyZywgbWVzcyl7XHJcblx0XHRpZihtZXNzID09PSB1bmRlZmluZWQpIG1lc3MgPSAnJztcclxuXHRcdHZhciBFUiA9IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IHR5cGUgaXMgd3JvbmchIEFyZ3VtZW50cygnICsgZm9yQXJnKHdyb25nX2FyZykgKyAnKTsnICsgbWVzcyk7XHJcblx0XHRFUi53cm9uZ19hcmcgPSB3cm9uZ19hcmc7XHJcblxyXG5cdFx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XHJcblx0XHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKEVSLCBhcmdUeXBlRXJyb3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBFUjtcclxuXHJcblx0XHRmdW5jdGlvbiBmb3JBcmcoYXJncyl7XHJcblx0XHRcdHZhciBzdHJfYXJncyA9ICcnO1xyXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0c3RyX2FyZ3MgKz0gdHlwZW9mKGFyZ3NbaV0pICsgJzogJyArIGFyZ3NbaV0gKyAnOyAnO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzdHJfYXJncztcclxuXHRcdH1cclxuXHR9XHJcblx0VC5lcnJvciA9IGFyZ1R5cGVFcnJvcjtcclxuXHJcblx0ZnVuY3Rpb24gdHlwZVN5bnRheEVycm9yKHdyb25nX3N0ciwgbWVzcyl7XHJcblx0XHRpZihtZXNzID09PSB1bmRlZmluZWQpIG1lc3MgPSAnJztcclxuXHRcdHZhciBFUiA9IG5ldyBTeW50YXhFcnJvcignTGluZTogJyArIHdyb25nX3N0ciArICc7ICcgKyBtZXNzKTtcclxuXHRcdEVSLndyb25nX2FyZyA9IHdyb25nX3N0cjtcclxuXHJcblx0XHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcclxuXHRcdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoRVIsIHR5cGVTeW50YXhFcnJvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIEVSO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRmdW5jdGlvbiBDcmVhdGVDcmVhdG9yKE5ldywgdGVzdCwgcmFuZCwgZG9jKXtcclxuXHRcdHZhciBjcmVhdG9yO1xyXG5cdFx0aWYodHlwZW9mIE5ldyA9PT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0Y3JlYXRvciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHRtcF9vYmogPSBOZXcuYXBwbHkoe30sIGFyZ3VtZW50cyk7XHJcblx0XHRcdFx0dmFyIG5ld19jcmVhdG9yID0gbmV3IENyZWF0ZUNyZWF0b3IoTmV3KTtcclxuXHRcdFx0XHRmb3IodmFyIGtleSBpbiB0bXBfb2JqKXtcclxuXHRcdFx0XHRcdG5ld19jcmVhdG9yLmFkZENvbnN0UHJvcChrZXksIHRtcF9vYmpba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBuZXdfY3JlYXRvcjtcclxuXHRcdFx0fTtcclxuXHRcdH1lbHNlIGNyZWF0b3IgPSBmdW5jdGlvbigpe3JldHVybiBjcmVhdG9yfTtcclxuXHJcblx0XHRjcmVhdG9yLmFkZENvbnN0UHJvcCgnaXNfY3JlYXRvcicsIHRydWUpO1xyXG5cdFx0aWYodHlwZW9mIHRlc3QgPT09IFwiZnVuY3Rpb25cIikgY3JlYXRvci5hZGRDb25zdFByb3AoJ3Rlc3QnLCB0ZXN0KTtcclxuXHRcdGlmKHR5cGVvZiByYW5kID09PSBcImZ1bmN0aW9uXCIpIGNyZWF0b3IuYWRkQ29uc3RQcm9wKCdyYW5kJywgcmFuZCk7XHJcblx0XHRpZih0eXBlb2YgZG9jID09PSBcImZ1bmN0aW9uXCIpIGNyZWF0b3IuYWRkQ29uc3RQcm9wKCdkb2MnLCBkb2MpO1xyXG5cclxuXHRcdHJldHVybiBjcmVhdG9yO1xyXG5cdH1cclxuXHR0aGlzLm5ld1R5cGUgPSBmdW5jdGlvbihrZXksIGRlc2MsIG5ld190eXBlKXtcclxuXHRcdERvYy50eXBlc1trZXldID0gZGVzYztcclxuXHRcdFQubmFtZXNbZGVzYy5uYW1lXSA9IGtleTtcclxuXHRcdHRoaXMuZG9jLmpzb24gPSBKU09OLnN0cmluZ2lmeShEb2MsIFwiXCIsIDIpO1xyXG5cclxuXHRcdHRoaXNba2V5XSA9IG5ldyBDcmVhdGVDcmVhdG9yKG5ld190eXBlLk5ldywgbmV3X3R5cGUudGVzdCwgbmV3X3R5cGUucmFuZCwgbmV3X3R5cGUuZG9jKTtcclxuXHR9XHJcblx0dGhpcy5uZXdUeXBlLmRvYyA9ICcobmFtZSwgY29uc3RydWN0b3IsIGZ1bmNUZXN0LCBmdW5jUmFuZCwgZnVuY0RvYyknO1xyXG5cclxuXHJcblxyXG5cdC8vQ3JhZnQgQm9vbGVhblxyXG5cdFx0dGhpcy5ib29sID0gbmV3IENyZWF0ZUNyZWF0b3IoXHJcblx0XHRcdG51bGwsXHJcblx0XHRcdGZ1bmN0aW9uKHZhbHVlKXtcclxuXHRcdFx0XHRpZih0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJyl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kb2MoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICEoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdERvYy5nZW5Eb2MuYmluZChudWxsLCBcImJvb2xcIilcclxuXHRcdCk7XHJcblxyXG5cclxuXHJcblx0Ly9DcmFmdCBDb25zdFxyXG5cdFx0ZnVuY3Rpb24gZG9jQ29uc3QodmFsKXtcclxuXHJcblx0XHRcdGlmKHR5cGVvZih2YWwpID09PSBcIm9iamVjdFwiICYmIHZhbCAhPT0gbnVsbCl7XHJcblx0XHRcdFx0dmFsID0gJ09iamVjdCc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodHlwZW9mKHZhbCkgPT09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdFx0dmFsID0gdmFsLnRvU3RyaW5nKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIERvYy5nZW5Eb2MuYmluZChudWxsLFwiY29uc3RcIiwge3ZhbHVlOiB2YWx9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG5ld0NvbnN0KHZhbCl7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmFuZDogZnVuY3Rpb24oKXtyZXR1cm4gdmFsfSxcclxuXHRcdFx0XHR0ZXN0OiBmdW5jdGlvbih2KXtcclxuXHRcdFx0XHRcdGlmKHZhbCAhPT0gdikgcmV0dXJuIHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRkb2M6IGRvY0NvbnN0KHZhbClcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHZhciBkZWZfY29uc3QgPSBuZXdDb25zdChEb2MuZ2V0Q29uc3QoJ2NvbnN0JywgJ3ZhbHVlJykpO1xyXG5cdFx0dGhpcy5jb25zdCA9IG5ldyBDcmVhdGVDcmVhdG9yKG5ld0NvbnN0LCBkZWZfY29uc3QudGVzdCwgZGVmX2NvbnN0LnJhbmQsIGRlZl9jb25zdC5kb2MpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHRDb25zdChUeXBlKXtcclxuXHRcdFx0aWYodHlwZW9mIChUeXBlKSAhPT0gXCJmdW5jdGlvblwiIHx8ICFUeXBlLmlzX2NyZWF0b3Ipe1xyXG5cdFx0XHRcdGlmKEFycmF5LmlzQXJyYXkoVHlwZSkpe1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiBULmFycihUeXBlKTtcclxuXHJcblx0XHRcdFx0fWVsc2UgaWYodHlwZW9mKFR5cGUpID09IFwib2JqZWN0XCIgJiYgVHlwZSAhPT0gbnVsbCl7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIFQub2JqKFR5cGUpO1xyXG5cclxuXHRcdFx0XHR9ZWxzZSByZXR1cm4gVC5jb25zdChUeXBlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cmV0dXJuIFR5cGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdC8vQ3JhZnQgTnVtYmVyXHJcblx0XHR2YXIgcmFuZE51bSA9IGZ1bmN0aW9uKG1heCwgbWluLCBwcmVjaXMpe1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gKygoKG1heCAtIG1pbikqTWF0aC5yYW5kb20oKSArICBtaW4pLnRvRml4ZWQocHJlY2lzKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIHRlc3ROdW0gPSBmdW5jdGlvbihtYXgsIG1pbiwgcHJlY2lzKXtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKG4pe1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCAhaXNGaW5pdGUobikpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZigobiA+IG1heClcclxuXHRcdFx0XHRcdHx8KG4gPCBtaW4pXHJcblx0XHRcdFx0XHR8fCAobi50b0ZpeGVkKHByZWNpcykgIT0gbiAmJiBuICE9PSAwKSApe1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRvYygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdCAgfTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGRvY051bSA9IGZ1bmN0aW9uKG1heCwgbWluLCBwcmVjaXMpe1xyXG5cdFx0XHRyZXR1cm4gRG9jLmdlbkRvYy5iaW5kKG51bGwsIFwibnVtXCIsIHtcIm1heFwiOiBtYXgsIFwibWluXCI6IG1pbiwgXCJwcmVjaXNcIjogcHJlY2lzfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1heF9kZWZfbiA9IERvYy5nZXRDb25zdCgnbnVtJywgJ21heCcpO1xyXG5cdFx0dmFyIG1pbl9kZWZfbiA9IERvYy5nZXRDb25zdCgnbnVtJywgJ21pbicpO1xyXG5cdFx0dmFyIHByZWNpc19kZWYgPSBEb2MuZ2V0Q29uc3QoJ251bScsICdwcmVjaXMnKTtcclxuXHJcblx0XHR0aGlzLm51bSA9IG5ldyBDcmVhdGVDcmVhdG9yKFxyXG5cdFx0XHRmdW5jdGlvbihtYXgsIG1pbiwgcHJlY2lzKXtcclxuXHRcdFx0XHRpZihtYXggPT09IG51bGwpIG1heCA9IG1heF9kZWZfbjtcclxuXHRcdFx0XHRpZihtaW4gPT09IHVuZGVmaW5lZHx8bWluID09PSBudWxsKSBtaW4gPSBtaW5fZGVmX247XHJcblx0XHRcdFx0aWYocHJlY2lzID09PSB1bmRlZmluZWQpIHByZWNpcyA9IHByZWNpc19kZWY7XHJcblxyXG5cdFx0XHRcdGlmKCh0eXBlb2YgbWluICE9PSAnbnVtYmVyJyB8fCAhaXNGaW5pdGUobWluKSlcclxuXHRcdFx0XHRcdHx8KHR5cGVvZiBtYXggIT09ICdudW1iZXInIHx8ICFpc0Zpbml0ZShtYXgpKVxyXG5cdFx0XHRcdFx0fHwodHlwZW9mIHByZWNpcyAhPT0gJ251bWJlcicgfHwgIWlzRmluaXRlKHByZWNpcykpXHJcblx0XHRcdFx0XHR8fChwcmVjaXMgPCAwKVxyXG5cdFx0XHRcdFx0fHwocHJlY2lzID4gOSlcclxuXHRcdFx0XHRcdHx8KHByZWNpcyAlIDEgIT09IDApKXtcclxuXHRcdFx0XHRcdHRocm93IGFyZ1R5cGVFcnJvcihhcmd1bWVudHMsICdXYWl0IGFyZ3VtZW50czogbWluKG51bWJlciksIG1heChudW1iZXIpLCBwcmVjaXMoMDw9bnVtYmVyPDkpJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG1pbiA+IG1heCl7XHJcblx0XHRcdFx0XHR2YXIgdCA9IG1pbjtcclxuXHRcdFx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0XHRcdG1heCA9IHQ7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0dGVzdDogdGVzdE51bShtYXgsIG1pbiwgcHJlY2lzKSxcclxuXHRcdFx0XHRcdHJhbmQ6IHJhbmROdW0obWF4LCBtaW4sIHByZWNpcyksXHJcblx0XHRcdFx0XHRkb2M6IGRvY051bShtYXgsIG1pbiwgcHJlY2lzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0dGVzdE51bShtYXhfZGVmX24sIG1pbl9kZWZfbiwgcHJlY2lzX2RlZiksXHJcblx0XHRcdHJhbmROdW0obWF4X2RlZl9uLCBtaW5fZGVmX24sIHByZWNpc19kZWYpLFxyXG5cdFx0XHRkb2NOdW0obWF4X2RlZl9uLCBtaW5fZGVmX24sIHByZWNpc19kZWYpXHJcblx0XHQpO1xyXG5cclxuXHRcdHZhciByYW5kSW50ID0gZnVuY3Rpb24obWF4LCBtaW4sIHByZWNpcyl7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiBNYXRoLmZsb29yKCAoKG1heCAtIChtaW4gKyAwLjEpKS9wcmVjaXMpKk1hdGgucmFuZG9tKCkgKSAqIHByZWNpcyArICBtaW47XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0IHZhciB0ZXN0SW50ID0gZnVuY3Rpb24obWF4LCBtaW4sIHByZWNpcyl7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbihuKXtcclxuXHRcdFx0XHRpZih0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgIWlzRmluaXRlKG4pKXtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRvYygpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoKG4gPj0gbWF4KVxyXG5cdFx0XHRcdFx0fHwobiA8IG1pbilcclxuXHRcdFx0XHRcdHx8KCgobiAtIG1pbikgJSBwcmVjaXMpICE9PSAwKSApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0ICB9O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZG9jSW50ID0gZnVuY3Rpb24obWF4LCBtaW4sIHN0ZXApe1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gRG9jLmdlbkRvYy5iaW5kKG51bGwsIFwiaW50XCIsIHtcIm1heFwiOiBtYXgsIFwibWluXCI6IG1pbiwgXCJzdGVwXCI6IHN0ZXB9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1heF9kZWYgPSBEb2MuZ2V0Q29uc3QoJ2ludCcsICdtYXgnKTtcclxuXHRcdHZhciBtaW5fZGVmID0gRG9jLmdldENvbnN0KCdpbnQnLCAnbWluJyk7XHJcblx0XHR2YXIgc3RlcF9kZWYgPSBEb2MuZ2V0Q29uc3QoJ2ludCcsICdzdGVwJyk7XHJcblxyXG5cdFx0dGhpcy5pbnQgPSBuZXcgQ3JlYXRlQ3JlYXRvcihcclxuXHRcdFx0ZnVuY3Rpb24obWF4LCBtaW4sIHN0ZXApe1xyXG5cclxuXHRcdFx0XHRpZihtYXggPT09IG51bGwpIG1heCA9IG1heF9kZWY7XHJcblx0XHRcdFx0aWYobWluID09PSB1bmRlZmluZWR8fG1pbiA9PT0gbnVsbCkgbWluID0gbWluX2RlZjtcclxuXHRcdFx0XHRpZihzdGVwID09PSB1bmRlZmluZWQpIHN0ZXAgPSBzdGVwX2RlZjtcclxuXHJcblx0XHRcdFx0aWYoKHR5cGVvZiBtaW4gIT09ICdudW1iZXInIHx8ICFpc0Zpbml0ZShtaW4pKVxyXG5cdFx0XHRcdFx0fHwodHlwZW9mIG1heCAhPT0gJ251bWJlcicgfHwgIWlzRmluaXRlKG1heCkpXHJcblx0XHRcdFx0XHR8fChNYXRoLnJvdW5kKG1pbikgIT09IG1pbilcclxuXHRcdFx0XHRcdHx8KE1hdGgucm91bmQobWF4KSAhPT0gbWF4KVxyXG5cdFx0XHRcdFx0fHwoc3RlcCA8PSAwKVxyXG5cdFx0XHRcdFx0fHwoTWF0aC5yb3VuZChzdGVwKSAhPT0gc3RlcCkpe1xyXG5cdFx0XHRcdFx0dGhyb3cgYXJnVHlwZUVycm9yKGFyZ3VtZW50cywgJ1dhaXQgYXJndW1lbnRzOiBtaW4oaW50KSwgbWF4KGludCksIHN0ZXAoaW50PjApJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG1pbiA+IG1heCl7XHJcblx0XHRcdFx0XHR2YXIgdCA9IG1pbjtcclxuXHRcdFx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0XHRcdG1heCA9IHQ7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0dGVzdDogdGVzdEludChtYXgsIG1pbiwgc3RlcCksXHJcblx0XHRcdFx0XHRyYW5kOiByYW5kSW50KG1heCwgbWluLCBzdGVwKSxcclxuXHRcdFx0XHRcdGRvYzogZG9jSW50KG1heCwgbWluLCBzdGVwKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0dGVzdEludChtYXhfZGVmLCBtaW5fZGVmLCBzdGVwX2RlZiksXHJcblx0XHRcdHJhbmRJbnQobWF4X2RlZiwgbWluX2RlZiwgc3RlcF9kZWYpLFxyXG5cdFx0XHRkb2NJbnQobWF4X2RlZiwgbWluX2RlZiwgc3RlcF9kZWYpXHJcblx0XHQpO1xyXG5cclxuXHRcdHZhciBkb2NQb3MgPSBmdW5jdGlvbihtYXgsIG1pbiwgc3RlcCl7XHJcblxyXG5cdFx0XHRcdHJldHVybiBEb2MuZ2VuRG9jLmJpbmQobnVsbCwgXCJwb3NcIiwge1wibWF4XCI6IG1heH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWF4X2RlZl9wID0gRG9jLmdldENvbnN0KCdwb3MnLCAnbWF4JylcclxuXHRcdHRoaXMucG9zID0gbmV3IENyZWF0ZUNyZWF0b3IoXHJcblx0XHRcdGZ1bmN0aW9uKG1heCl7XHJcblxyXG5cdFx0XHRcdGlmKG1heCA9PT0gbnVsbCkgbWF4ID0gbWF4X2RlZl9wO1xyXG5cclxuXHRcdFx0XHRpZigodHlwZW9mIG1heCAhPT0gJ251bWJlcicgfHwgIWlzRmluaXRlKG1heCkpXHJcblx0XHRcdFx0XHR8fChtYXggPCAwKSl7XHJcblx0XHRcdFx0XHR0aHJvdyBhcmdUeXBlRXJyb3IoYXJndW1lbnRzLCAnV2FpdCBhcmd1bWVudHM6IG1pbihwb3MpLCBtYXgocG9zKSwgc3RlcChwb3M+MCknKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHR0ZXN0OiB0ZXN0SW50KG1heCwgMCwgMSksXHJcblx0XHRcdFx0XHRyYW5kOiByYW5kSW50KG1heCwgMCwgMSksXHJcblx0XHRcdFx0XHRkb2M6IGRvY1BvcyhtYXgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZXN0SW50KG1heF9kZWZfcCwgMCwgMSksXHJcblx0XHRcdHJhbmRJbnQobWF4X2RlZl9wLCAwLCAxKSxcclxuXHRcdFx0ZG9jUG9zKG1heF9kZWZfcClcclxuXHRcdCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvL0NyYWZ0IEFueVxyXG5cdFx0ZnVuY3Rpb24gcmFuZEFueShhcnIpe1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gYXJyLnJhbmRfaSgpLnJhbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRlc3RBbnkoYXJyKXtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZhbCl7XHJcblx0XHRcdFx0aWYoYXJyLmV2ZXJ5KGZ1bmN0aW9uKGkpe3JldHVybiBpLnRlc3QodmFsKX0pKXtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRvYygpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9jQW55KFR5cGVzKXtcclxuXHJcblx0XHRcdHZhciBjb250ID0gVHlwZXMubGVuZ3RoO1xyXG5cdFx0XHR2YXIgdHlwZV9kb2NzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjb250OyBpKyspe1xyXG5cdFx0XHRcdHR5cGVfZG9jcy5wdXNoKFR5cGVzW2ldLmRvYygpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIERvYy5nZW5Eb2MuYmluZChudWxsLCBcImFueVwiLCB7dHlwZXM6IHR5cGVfZG9jc30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBkZWZfdHlwZXMgPSBEb2MuZ2V0Q29uc3QoJ2FycicsICd0eXBlcycpO1xyXG5cdFx0ZnVuY3Rpb24gbmV3QW55KGFycil7XHJcblx0XHRcdGlmKCFBcnJheS5pc0FycmF5KGFycikgfHwgYXJndW1lbnRzLmxlbmd0aCA+IDEpIGFyciA9IGFyZ3VtZW50cztcclxuXHJcblx0XHRcdHZhciBsZW4gPSBhcnIubGVuZ3RoO1xyXG5cdFx0XHR2YXIgYXJyX3R5cGVzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKyl7XHJcblx0XHRcdFx0YXJyX3R5cGVzW2ldID0gdENvbnN0KGFycltpXSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybntcclxuXHRcdFx0XHR0ZXN0OiB0ZXN0QW55KGFycl90eXBlcyksXHJcblx0XHRcdFx0cmFuZDogcmFuZEFueShhcnJfdHlwZXMpLFxyXG5cdFx0XHRcdGRvYzogZG9jQW55KGFycl90eXBlcylcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYW55ID0gbmV3IENyZWF0ZUNyZWF0b3IoXHJcblx0XHRcdG5ld0FueSxcclxuXHRcdFx0dGVzdEFueShkZWZfdHlwZXMpLFxyXG5cdFx0XHRyYW5kQW55KGRlZl90eXBlcyksXHJcblx0XHRcdGRvY0FueShkZWZfdHlwZXMpXHJcblx0XHQpO1xyXG5cclxuXHJcblxyXG5cdC8vQ3JhZnQgQXJyYXlcclxuXHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHJhbmRBcnJheShUeXBlLCBzaXplLCBpc19maXhlZCl7XHJcblx0XHRcdHZhciByYW5kU2l6ZSA9IGZ1bmN0aW9uICgpe3JldHVybiBzaXplfTtcclxuXHRcdFx0aWYoIWlzX2ZpeGVkKXtcclxuXHRcdFx0XHRyYW5kU2l6ZSA9IFQucG9zKHNpemUpLnJhbmQ7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRpZihBcnJheS5pc0FycmF5KFR5cGUpKXtcclxuXHRcdFx0XHR2YXIgbm93X3NpemUgPSByYW5kU2l6ZSgpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhciBhcnIgPSBbXTtcclxuXHJcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwLCBqID0gMDsgaSA8IG5vd19zaXplOyBpKyspe1xyXG5cclxuXHRcdFx0XHRcdFx0YXJyLnB1c2goVHlwZVtqXS5yYW5kKCkpO1xyXG5cclxuXHRcdFx0XHRcdFx0aisrO1xyXG5cdFx0XHRcdFx0XHRpZihqID49IFR5cGUubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0XHRqID0gMDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGFycjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGFyciA9IFtdO1xyXG5cclxuXHRcdFx0XHR2YXIgbm93X3NpemUgPSByYW5kU2l6ZSgpO1xyXG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBub3dfc2l6ZTsgaSsrKXtcclxuXHRcdFx0XHRcdGFyci5wdXNoKFR5cGUucmFuZChpLCBhcnIpKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBhcnI7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdGVzdEFycmF5KFR5cGUsIHNpemUsIGlzX2ZpeGVkKXtcclxuXHJcblx0XHRcdGlmKEFycmF5LmlzQXJyYXkoVHlwZSkpe1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbihhcnIpe1xyXG5cclxuXHRcdFx0XHRcdGlmKCFBcnJheS5pc0FycmF5KGFycikpe1xyXG5cdFx0XHRcdFx0XHR2YXIgZXJyID0gdGhpcy5kb2MoKTtcclxuXHRcdFx0XHRcdFx0ZXJyLnBhcmFtcyA9IFwiVmFsdWUgaXMgbm90IGFycmF5IVwiO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmKChhcnIubGVuZ3RoID4gc2l6ZSkgfHwgKGlzX2ZpeGVkICYmIChhcnIubGVuZ3RoICE9PSBzaXplKSkpe1xyXG5cdFx0XHRcdFx0XHR2YXIgZXJyID0gdGhpcy5kb2MoKTtcclxuXHRcdFx0XHRcdFx0ZXJyLnBhcmFtcyA9IFwiQXJyYXkgbGVuZ2h0IGlzIHdyb25nIVwiO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGZvcih2YXIgaSA9IDAsIGogPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKXtcclxuXHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlcyA9IFR5cGVbal0udGVzdChhcnJbaV0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHJlcyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlcnIgPSB0aGlzLmRvYygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlcnIucGFyYW1zID0ge2luZGV4OiBpLCB3cm9uZ19pdGVtOiByZXN9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aisrO1xyXG5cdFx0XHRcdFx0XHRcdGlmKGogPj0gVHlwZS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aiA9IDA7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbihhcnIpe1xyXG5cdFx0XHRcdGlmKCFBcnJheS5pc0FycmF5KGFycikpe1xyXG5cdFx0XHRcdFx0dmFyIGVyciA9IHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0XHRlcnIucGFyYW1zID0gXCJWYWx1ZSBpcyBub3QgYXJyYXkhXCI7XHJcblx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoKGFyci5sZW5ndGggPiBzaXplKSB8fCAoaXNfZml4ZWQgJiYgKGFyci5sZW5ndGggIT09IHNpemUpKSl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhcnIubGVuZ3RoLCBzaXplKVxyXG5cdFx0XHRcdFx0dmFyIGVyciA9IHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0XHRlcnIucGFyYW1zID0gXCJBcnJheTogbGVuZ2h0IGlzIHdyb25nIVwiO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVycjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBlcnJfYXJyID0gYXJyLmZpbHRlcihUeXBlLnRlc3QpO1xyXG5cdFx0XHRcdGlmKGVycl9hcnIubGVuZ3RoICE9IDApe1xyXG5cdFx0XHRcdFx0dmFyIGVyciA9IHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0XHRlcnIucGFyYW1zID0gZXJyX2FycjtcclxuXHRcdFx0XHRcdHJldHVybiBlcnI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkb2NBcnJheShUeXBlLCBzaXplLCBpc19maXhlZCl7XHJcblx0XHRcdHZhciB0eXBlX2RvY3MgPSBbXTtcclxuXHRcdFx0aWYoQXJyYXkuaXNBcnJheShUeXBlKSl7XHJcblx0XHRcdFx0dmFyIGNvbnQgPSBUeXBlLmxlbmd0aDtcclxuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29udDsgaSsrKXtcclxuXHRcdFx0XHRcdHR5cGVfZG9jcy5wdXNoKFR5cGVbaV0uZG9jKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dHlwZV9kb2NzID0gVHlwZS5kb2MoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIERvYy5nZW5Eb2MuYmluZChudWxsLCBcImFyclwiLCB7dHlwZXM6IHR5cGVfZG9jcywgc2l6ZTogc2l6ZSwgZml4ZWQ6IGlzX2ZpeGVkfSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR2YXIgZGVmX1R5cGUgPSBEb2MuZ2V0Q29uc3QoJ2FycicsICd0eXBlcycpO1xyXG5cdFx0dmFyIGRlZl9TaXplID0gRG9jLmdldENvbnN0KCdhcnInLCAnc2l6ZScpO1xyXG5cdFx0dmFyIGRlZl9maXhlZCA9IERvYy5nZXRDb25zdCgnYXJyJywgJ2ZpeGVkJyk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gbmV3QXJyYXkoVHlwZSwgc2l6ZSwgaXNfZml4ZWQpe1xyXG5cdFx0XHRpZihUeXBlID09PSBudWxsKSBUeXBlID0gZGVmX1R5cGU7XHJcblx0XHRcdGlmKGlzX2ZpeGVkID09PSB1bmRlZmluZWQpIGlzX2ZpeGVkID0gZGVmX2ZpeGVkO1xyXG5cclxuXHRcdFx0aWYoQXJyYXkuaXNBcnJheShUeXBlKSl7XHJcblx0XHRcdFx0aWYoc2l6ZSA9PT0gdW5kZWZpbmVkfHxzaXplID09PSBudWxsKSBzaXplID0gVHlwZS5sZW5ndGg7XHJcblxyXG5cdFx0XHRcdFR5cGUgPSBUeXBlLm1hcChmdW5jdGlvbihpdGVtKXtyZXR1cm4gdENvbnN0KGl0ZW0pO30pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZihzaXplID09PSB1bmRlZmluZWR8fHNpemUgPT09IG51bGwpIHNpemUgPSAxO1xyXG5cdFx0XHRcdFR5cGUgPSB0Q29uc3QoVHlwZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKFQucG9zLnRlc3Qoc2l6ZSkpe1xyXG5cdFx0XHRcdFx0dGhyb3cgYXJnVHlwZUVycm9yKGFyZ3VtZW50cywgJ1dhaXQgYXJndW1lbnRzOiAnICsgSlNPTi5zdHJpbmdpZnkoVC5wb3MudGVzdChzaXplKSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHRlc3Q6IHRlc3RBcnJheShUeXBlLCBzaXplLCBpc19maXhlZCksXHJcblx0XHRcdFx0cmFuZDogcmFuZEFycmF5KFR5cGUsIHNpemUsIGlzX2ZpeGVkKSxcclxuXHRcdFx0XHRkb2M6IGRvY0FycmF5KFR5cGUsIHNpemUsIGlzX2ZpeGVkKVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYXJyID0gbmV3IENyZWF0ZUNyZWF0b3IoXHJcblx0XHRcdG5ld0FycmF5LFxyXG5cdFx0XHR0ZXN0QXJyYXkoZGVmX1R5cGUsIGRlZl9TaXplLCBkZWZfZml4ZWQpLFxyXG5cdFx0XHRyYW5kQXJyYXkoZGVmX1R5cGUsIGRlZl9TaXplLCBkZWZfZml4ZWQpLFxyXG5cdFx0XHRkb2NBcnJheShkZWZfVHlwZSwgZGVmX1NpemUsIGRlZl9maXhlZClcclxuXHRcdCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdC8vQ3JhZnQgT2JqZWN0XHJcblxyXG5cdFx0ZnVuY3Rpb24gcmFuZE9iaihmdW5jT2JqKXtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG9iaiA9IHt9O1xyXG5cdFx0XHRcdGZvcih2YXIga2V5IGluIGZ1bmNPYmope1xyXG5cdFx0XHRcdFx0b2JqW2tleV0gPSBmdW5jT2JqW2tleV0ucmFuZCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRlc3RPYmooZnVuY09iail7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbihvYmope1xyXG5cclxuXHRcdFx0XHRpZih0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiICYmIG9iaiA9PT0gbnVsbCl7XHJcblx0XHRcdFx0XHR2YXIgZXJyID0gdGhpcy5kb2MoKTtcclxuXHRcdFx0XHRcdGVyci5wYXJhbXMgPSBcIlZhbHVlIGlzIG5vdCBvYmplY3QhXCI7XHJcblx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yKHZhciBrZXkgaW4gZnVuY09iail7XHJcblx0XHRcdFx0XHR2YXIgcmVzID0gZnVuY09ialtrZXldLnRlc3Qob2JqW2tleV0pO1xyXG5cdFx0XHRcdFx0aWYocmVzKXtcclxuXHRcdFx0XHRcdFx0dmFyIGVyciA9IHRoaXMuZG9jKCk7XHJcblx0XHRcdFx0XHRcdGVyci5wYXJhbXMgPSB7fTtcclxuXHRcdFx0XHRcdFx0ZXJyLnBhcmFtc1trZXldID0gcmVzO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGRvY09iKGZ1bmNPYmope1xyXG5cdFx0XHR2YXIgZG9jX29iaiA9IHt9O1xyXG5cclxuXHRcdFx0Zm9yKHZhciBrZXkgaW4gZnVuY09iail7XHJcblx0XHRcdFx0XHRkb2Nfb2JqW2tleV0gPSBmdW5jT2JqW2tleV0uZG9jKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBEb2MuZ2VuRG9jLmJpbmQobnVsbCwgXCJvYmpcIiwge3R5cGVzOiBkb2Nfb2JqfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gTmV3T2JqKHRlbXBPYmope1xyXG5cdFx0XHRpZih0eXBlb2YgdGVtcE9iaiAhPT0gJ29iamVjdCcpIHRocm93IGFyZ1R5cGVFcnJvcihhcmd1bWVudHMsICdXYWl0IGFyZ3VtZW50czogdGVtcE9iaihPYmplY3QpJyk7XHJcblxyXG5cdFx0XHR2YXIgYmVnT2JqID0ge307XHJcblx0XHRcdHZhciBmdW5jT2JqID0ge307XHJcblx0XHRcdGZvcih2YXIga2V5IGluIHRlbXBPYmope1xyXG5cdFx0XHRcdGZ1bmNPYmpba2V5XSA9IHRDb25zdCh0ZW1wT2JqW2tleV0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm57XHJcblx0XHRcdFx0dGVzdDogdGVzdE9iaihmdW5jT2JqKSxcclxuXHRcdFx0XHRyYW5kOiByYW5kT2JqKGZ1bmNPYmopLFxyXG5cdFx0XHRcdGRvYzogZG9jT2IoZnVuY09iailcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5vYmogPSBuZXcgQ3JlYXRlQ3JlYXRvcihOZXdPYmosXHJcblx0XHRcdGZ1bmN0aW9uKG9iail7cmV0dXJuIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCJ9LFxyXG5cdFx0XHRyYW5kT2JqKHt9KSxcclxuXHRcdFx0RG9jLmdlbkRvYy5iaW5kKG51bGwsIFwib2JqXCIpXHJcblx0XHQpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vQ3JhZnQgVHlwZSBvdXQgdG8gIERvY3VtZW50XHJcblxyXG5cdFQubmFtZXMgPSB7fTtcclxuXHRmb3IodmFyIGtleSBpbiBEb2MudHlwZXMpe1xyXG5cdFx0VC5uYW1lc1tEb2MudHlwZXNba2V5XS5uYW1lXSA9IGtleTtcclxuXHR9XHJcblxyXG5cdHRoaXMub3V0RG9jID0gZnVuY3Rpb24odG1wKXtcclxuXHRcdGlmKCh0eXBlb2YgdG1wID09PSBcImZ1bmN0aW9uXCIpICYmIHRtcC5pc19jcmVhdG9yKSByZXR1cm4gdG1wO1xyXG5cclxuXHRcdGlmKCEoJ25hbWUnIGluIHRtcCkpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH1cclxuXHRcdHZhciB0eXBlID0gdG1wLm5hbWU7XHJcblxyXG5cdFx0aWYoJ3BhcmFtcycgaW4gdG1wKXtcclxuXHRcdFx0dmFyIHBhcmFtcyA9IHRtcC5wYXJhbXM7XHJcblx0XHRcdHN3aXRjaChULm5hbWVzW3R5cGVdKXtcclxuXHRcdFx0XHRjYXNlICdvYmonOiB7XHJcblx0XHRcdFx0XHR2YXIgbmV3X29iaiA9IHt9O1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBrZXkgaW4gcGFyYW1zLnR5cGVzKXtcclxuXHRcdFx0XHRcdFx0bmV3X29ialtrZXldID0gVC5vdXREb2MocGFyYW1zLnR5cGVzW2tleV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cGFyYW1zLnR5cGVzID0gbmV3X29iajtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXNlICdhbnknOlxyXG5cdFx0XHRcdGNhc2UgJ2Fycic6IHtcclxuXHRcdFx0XHRcdGlmKEFycmF5LmlzQXJyYXkocGFyYW1zLnR5cGVzKSl7XHJcblx0XHRcdFx0XHRcdHBhcmFtcy50eXBlcyA9IHBhcmFtcy50eXBlcy5tYXAoVC5vdXREb2MuYmluZChUKSk7XHJcblx0XHRcdFx0XHR9ZWxzZSBwYXJhbXMudHlwZXMgPSBULm91dERvYyhwYXJhbXMudHlwZXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ2V0U2ltcGxlVHlwZShULm5hbWVzW3R5cGVdLCBwYXJhbXMpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGdldFNpbXBsZVR5cGUoVC5uYW1lc1t0eXBlXSwge30pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0U2ltcGxlVHlwZShuYW1lLCBwYXJhbXMpe1xyXG5cdFx0dmFyIGFyZyA9IFtdO1xyXG5cdFx0RG9jLnR5cGVzW25hbWVdLmFyZy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaSl7YXJnW2ldID0gcGFyYW1zW2tleV07fSk7XHJcblx0XHRyZXR1cm4gVFtuYW1lXS5hcHBseShULCBhcmcpO1xyXG5cdH07XHJcblxyXG4vL1N1cHBvcnQgRGVjbGFyYXRlIEZ1bmN0aW9uXHJcblxyXG5cdGZ1bmN0aW9uIGZpbmRlUGFyc2Uoc3RyLCBiZWcsIGVuZCl7XHJcblx0XHR2YXIgcG9pbnRfYmVnID0gc3RyLmluZGV4T2YoYmVnKTtcclxuXHRcdGlmKH5wb2ludF9iZWcpe1xyXG5cclxuXHRcdFx0dmFyIHBvaW50X2VuZCA9IHBvaW50X2JlZztcclxuXHRcdFx0dmFyIHBvaW50X3RlbXAgPSBwb2ludF9iZWc7XHJcblx0XHRcdHZhciBsZXZlbCA9IDE7XHJcblx0XHRcdHZhciBicmVha1doaWxlID0gZmFsc2U7XHJcblx0XHRcdHdoaWxlKCFicmVha1doaWxlKXtcclxuXHRcdFx0XHRicmVha1doaWxlID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0aWYofnBvaW50X3RlbXApIHBvaW50X3RlbXAgPSBzdHIuaW5kZXhPZihiZWcsIHBvaW50X3RlbXAgKyAxKTtcclxuXHRcdFx0XHRpZih+cG9pbnRfZW5kKSBwb2ludF9lbmQgPSBzdHIuaW5kZXhPZihlbmQsIHBvaW50X2VuZCArIDEpO1xyXG5cclxuXHRcdFx0XHRpZihwb2ludF90ZW1wIDwgcG9pbnRfZW5kKXtcclxuXHJcblx0XHRcdFx0XHRpZihwb2ludF90ZW1wID4gMCl7XHJcblx0XHRcdFx0XHRcdGJyZWFrV2hpbGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0aWYoc3RyW3BvaW50X3RlbXAgLSAxXSAhPT0gJ1xcXFwnKSBsZXZlbCA9IGxldmVsKzE7XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRpZihwb2ludF9lbmQgPiAwKXtcclxuXHRcdFx0XHRcdFx0YnJlYWtXaGlsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRpZihzdHJbcG9pbnRfZW5kIC0gMV0gIT09ICdcXFxcJykgbGV2ZWwgPSBsZXZlbC0xO1xyXG5cdFx0XHRcdFx0XHRpZihsZXZlbCA9PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gW3BvaW50X2JlZywgcG9pbnRfZW5kXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0aWYocG9pbnRfZW5kID4gMCl7XHJcblx0XHRcdFx0XHRcdGJyZWFrV2hpbGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0aWYoc3RyW3BvaW50X2VuZCAtIDFdICE9PSAnXFxcXCcpIGxldmVsID0gbGV2ZWwtMTtcclxuXHRcdFx0XHRcdFx0aWYobGV2ZWwgPT0gMCl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFtwb2ludF9iZWcsIHBvaW50X2VuZF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZihwb2ludF90ZW1wID4gMCl7XHJcblx0XHRcdFx0XHRcdGJyZWFrV2hpbGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0aWYoc3RyW3BvaW50X3RlbXAgLSAxXSAhPT0gJ1xcXFwnKSBsZXZlbCA9IGxldmVsKzE7XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0LnR5cGVzID0gVDtcclxufSkoKTtcclxuIl19
