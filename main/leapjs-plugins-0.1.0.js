/*!    
 * LeapJS-Plugins  - v0.1.0 - 2014-01-27    
 * http://github.com/leapmotion/leapjs-plugins/    
 *    
 * Copyright 2014 LeapMotion, Inc. and other contributors    
 * Released under the BSD-2-Clause license    
 * http://github.com/leapmotion/leapjs-plugins/blob/master/LICENSE    
 */    

//Filename: 'main/hand-entry/leap-hand-entry.js'
(function() {
  Leap.Controller.plugin('handEntry', function() {
    var previousHandIds;
    previousHandIds = [];
    previousHandIds.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };
    this.on("deviceDisconnected", function() {
      var id, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = previousHandIds.length; _i < _len; _i++) {
        id = previousHandIds[_i];
        _results.push(this.emit('handLost', this.lastConnectionFrame.hand(id)));
      }
      return _results;
    });
    return {
      frame: function(frame) {
        var id, newValidHandIds, _i, _j, _len, _len1, _results;
        newValidHandIds = frame.hands.map(function(hand) {
          return hand.id;
        });
        for (_i = 0, _len = previousHandIds.length; _i < _len; _i++) {
          id = previousHandIds[_i];
          if (newValidHandIds.indexOf(id) === -1) {
            previousHandIds.remove(id);
            this.emit('handLost', frame.hand(id));
          }
        }
        _results = [];
        for (_j = 0, _len1 = newValidHandIds.length; _j < _len1; _j++) {
          id = newValidHandIds[_j];
          if (previousHandIds.indexOf(id) === -1) {
            previousHandIds.push(id);
            _results.push(this.emit('handFound', frame.hand(id)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
  });

}).call(this);


//Filename: 'main/hand-holding/leap-hand-holding.js'
(function() {
  Leap.Controller.plugin('handHolding', function() {
    var extraHandData;
    extraHandData = {};
    return {
      hand: {
        data: function(hashOrKey, value) {
          var key, _name, _results;
          extraHandData[_name = this.id] || (extraHandData[_name] = []);
          if (value) {
            return extraHandData[this.id][hashOrKey] = value;
          } else if (toString.call(hashOrKey) === '[object String]') {
            return extraHandData[this.id][hashOrKey];
          } else {
            _results = [];
            for (key in hashOrKey) {
              value = hashOrKey[key];
              if (value === void 0) {
                _results.push(delete extraHandData[this.id][key]);
              } else {
                _results.push(extraHandData[this.id][key] = value);
              }
            }
            return _results;
          }
        },
        hold: function(object) {
          if (object) {
            return this.data({
              holding: object
            });
          } else {
            return this.hold(this.hovering());
          }
        },
        holding: function() {
          return this.data('holding');
        },
        release: function() {
          var release;
          release = this.data('holding');
          this.data({
            holding: void 0
          });
          return release;
        },
        hoverFn: function(getHover) {
          return this.data({
            getHover: getHover
          });
        },
        hovering: function() {
          var getHover;
          if (getHover = this.data('getHover')) {
            return this._hovering || (this._hovering = getHover.call(this));
          }
        }
      }
    };
  });

}).call(this);