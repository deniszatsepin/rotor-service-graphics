var _ 		    = require('lodash');
var webglew   = require("webglew");
var glMatrix  = require('gl-matrix');
var mat4      = glMatrix.mat4;
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
  this.projectionMatrix = mat4.create();
};

proto.initialize = function(params) {
	params = params || {};
  this._container = this.makeContainer(params.container);
  this._width = this._container.clientWidth;
  this._height = this._container.clientHeight;

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

  var ext = webglew(gl);
  for (var i = 0, len = extensions.length; i < len; i += 1) {
  	if (!(extensions[i] in ext)) {
  		this._game.emit('gl-error', new Error('Missing extension: ' + extensions[i]));
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
  canvas.width = (this._width / this.scale) | 0;
  canvas.height = (this._height / this.scale) | 0;
  this._container.appendChild(canvas);

  mat4.perspective(this.projectionMatrix
    , Math.PI / 4
    , this._width / this._height
    , 0.001
    , 10000
  );

  this._realized = true;
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

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  //Render frame
  this.render();
};

proto.render = function() {
  var game = this.__game;
  //game.traverse(function(entity) {

  //});
};

proto.makeDefaultContainer = function() {
  var container = document.createElement('div');
  container.tabindex = 1;
  container.style.position = 'absolute';
  container.style.left = '0px';
  container.style.right = '0px';
  container.style.top = '0px';
  container.style.bottom = '0px';
  container.style.height = '100%';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden'; //Prevent bounce
  document.body.style.height = '100%';
  return container;
};

proto.makeContainer = function(element) {
  var container = null;
  if(typeof element === 'string') {
    var e = document.querySelector(element);
    if(!e) {
      e = document.getElementById(element);
    }
    if(!e) {
      e = document.getElementsByClassName(element)[0];
    }
    if(!e) {
      e = this.makeDefaultContainer();
    }
    container = e;
  } else if(typeof element === 'object' && !!element) {
    container = element;
  } else if(typeof element === 'function') {
    container = element();
  } else {
    container = this.makeDefaultContainer();
  }

  //Disable user-select
  if(container.style) {
    container.style['-webkit-touch-callout'] = 'none';
    container.style['-webkit-user-select'] = 'none';
    container.style['-khtml-user-select'] = 'none';
    container.style['-moz-user-select'] = 'none';
    container.style['-ms-user-select'] = 'none';
    container.style['user-select'] = 'none';
  }
  return container;
};


//Static
GraphicsService._instance = null;
GraphicsService.getInstance = function() {
  return GraphicsService._instance;
};

module.exports = GraphicsService;
