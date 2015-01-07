var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var expect    = chai.expect;

chai.should();
chai.use(sinonChai);

var GraphicsService = require('../lib/graphics');

describe('GraphicsService tests:', function() {
  describe('GraphicsService', function() {
    var graphicsService;
    var game = {};

    before(function() {
      graphicsService = new GraphicsService();
    });

    it('should have link to the game intstance', function() {
    });

  });
});
