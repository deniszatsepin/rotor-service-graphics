var _ 			= require('lodash');
var webglew = require("webglew");
/**
 * GraphicsService for the RotorWeb engine.
 * @constructor
 */
function GraphicsService(container) {
  if (GraphicsService._instance === null) {
    GraphicsService.prototype.init.apply(this, arguments);
    GraphicsService._instance = this;
  } else {
    return GraphicsService._instance;
  }
}

var proto = GraphicsService.prototype;

proto.init = function() {
	this._canvas = document.createElement('canvas');
	this._realized = false;
};

proto.initialize = function(params) {
	params = params || {};
  this._container = params.container || document.body;

	var extensions = params.extensions || [];
	var canvas = this._canvas;
	var opts = params.glOptions;

	var gl = this._gl = (
    canvas.getContext('webgl', opts) ||
    canvas.getContext('webgl-experimental', opts) ||
    canvas.getContext('experimental-webgl', opts)
  );
  if (!gl) {
  	this._game.emit('gl-error', new Error("Unable to initialize WebGL"));
  	return;
  }

  var ext = webgl(gl);
  for (var i = 0, len = extensions.length; i < len; i += 1) {
  	if (!(extensions[i] in ext)) {
  		this._game.emit('gl-error', new Error('Missin extension: ' + extensions[i]));
  		return;
  	}
  }

  this.scale = params.scale || 1;

  //Load default parameters
  this.clearFlags = params.clearFlags === undefined ? (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) : params.clearFlags;
  this.clearColor = params.clearColor || [0,0,0,0];
  this.clearDepth = params.clearDepth || 1.0;
  this.clearStencil = params.clearStencil || 0;

	//Set canvas style
	canvas.style.position = "absolute";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
  this._container.appendChild(canvas);
};

proto.update = function() {
	var gl = this._gl;
	//Bind default framebuffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  //Set viewport
  gl.viewport(0, 0, (this._width / this.scale)|0, (this._height / this.scale)|0);

  //Clear buffers
  if(this.clearFlags & gl.STENCIL_BUFFER_BIT) {
  	gl.clearStencil(this.clearStencil);
  }
  if(this.clearFlags & gl.COLOR_BUFFER_BIT) {
  	gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
  }
  if(this.clearFlags & gl.DEPTH_BUFFER_BIT) {
  	gl.clearDepth(this.clearDepth);
  }
  if(this.clearFlags) {
  	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  }

  //Render frame
  this.render();
};

proto.render = function() {

};

//Static
GraphicsService._instance = null;
GraphicsService.getInstance = function() {
  return GraphicsService._instance;
};

module.exports = GraphicsService;