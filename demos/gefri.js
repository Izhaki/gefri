(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gefri = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var view = require('./view/view');
exports.view = view;

},{"./view/view":6}],2:[function(require,module,exports){
"use strict";
var Control = (function () {
    function Control(aContainer) {
        this.container = aContainer;
        this.createCanvas(aContainer);
    }
    Control.prototype.createCanvas = function (aContainer) {
        var iCanvas = document.createElement('CANVAS');
        iCanvas.setAttribute('width', aContainer.offsetWidth.toString());
        iCanvas.setAttribute('height', aContainer.offsetHeight.toString());
        aContainer.appendChild(iCanvas);
    };
    return Control;
}());
exports.Control = Control;

},{}],3:[function(require,module,exports){
"use strict";
var Point = (function () {
    function Point(aX, aY) {
        this.x = aX;
        this.y = aY;
    }
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    return Point;
}());
exports.Point = Point;

},{}],4:[function(require,module,exports){
"use strict";
var Point_1 = require('./Point');
var Rect = (function () {
    function Rect(aX, aY, aW, aH) {
        this.x = aX;
        this.y = aY;
        this.w = aW;
        this.h = aH;
    }
    Rect.prototype.clone = function () {
        return new Rect(this.x, this.y, this.w, this.h);
    };
    Rect.prototype.getLeft = function () {
        return this.w >= 0 ? this.x : this.x + this.w;
    };
    Rect.prototype.getRight = function () {
        return this.w >= 0 ? this.x + this.w : this.x;
    };
    Rect.prototype.getTop = function () {
        return this.h >= 0 ? this.y : this.y + this.h;
    };
    Rect.prototype.getBottom = function () {
        return this.h >= 0 ? this.y + this.h : this.y;
    };
    Rect.prototype.getLeftTop = function () {
        return new Point_1.Point(this.getLeft(), this.getTop());
    };
    return Rect;
}());
exports.Rect = Rect;

},{"./Point":3}],5:[function(require,module,exports){
"use strict";
var Point_1 = require('./Point');
exports.Point = Point_1.Point;
var Rect_1 = require('./Rect');
exports.Rect = Rect_1.Rect;

},{"./Point":3,"./Rect":4}],6:[function(require,module,exports){
"use strict";
var geometry = require('./geometry/geometry');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;

},{"./Control":2,"./geometry/geometry":5}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2VmcmkudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkudHMiLCJzcmMvdmlldy92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQVksSUFBSSxXQUFNLGFBQWEsQ0FBQyxDQUFBO0FBQzVCLFlBQUk7QUFBRTs7O0FDRGQ7SUFLSSxpQkFBYSxVQUF1QjtRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxDQUFFLFVBQVUsQ0FBRSxDQUFDO0lBQ3BDLENBQUM7SUFFTyw4QkFBWSxHQUFwQixVQUFzQixVQUF1QjtRQUN6QyxJQUFJLE9BQU8sR0FBMEMsUUFBUSxDQUFDLGFBQWEsQ0FBRSxRQUFRLENBQUUsQ0FBQztRQUN4RixPQUFPLENBQUMsWUFBWSxDQUFFLE9BQU8sRUFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFHLENBQUM7UUFDckUsT0FBTyxDQUFDLFlBQVksQ0FBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBRSxDQUFDO1FBQ3JFLFVBQVUsQ0FBQyxXQUFXLENBQUUsT0FBTyxDQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNMLGNBQUM7QUFBRCxDQWhCQSxBQWdCQyxJQUFBO0FBZkssZUFBTyxVQWVaLENBQUE7Ozs7QUNoQkQ7SUFLSSxlQUFhLEVBQVUsRUFBRSxFQUFVO1FBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELHFCQUFLLEdBQUw7UUFDSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFDdkMsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTtBQVpLLGFBQUssUUFZVixDQUFBOzs7O0FDYkQsc0JBQXNCLFNBQVMsQ0FBQyxDQUFBO0FBRWhDO0lBT0ksY0FBYSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO1FBQ3ZELElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxvQkFBSyxHQUFMO1FBQ0ksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsc0JBQU8sR0FBUDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsdUJBQVEsR0FBUjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQscUJBQU0sR0FBTjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsd0JBQVMsR0FBVDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQseUJBQVUsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLGFBQUssQ0FBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVMLFdBQUM7QUFBRCxDQXRDQSxBQXNDQyxJQUFBO0FBckNLLFlBQUksT0FxQ1QsQ0FBQTs7OztBQ3hDRCxzQkFBc0IsU0FBUyxDQUFDO0FBQXZCLDhCQUF1QjtBQUNoQyxxQkFBcUIsUUFBUSxDQUFDO0FBQXJCLDJCQUFxQjs7OztBQ0Q5QixJQUFZLFFBQVEsV0FBTSxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3hDLGdCQUFRO0FBRWhCLHdCQUF3QixXQUFXLENBQUM7QUFBM0Isb0NBQTJCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIHZpZXcgZnJvbSAnLi92aWV3L3ZpZXcnO1xuZXhwb3J0IHt2aWV3fTtcbiIsImV4cG9ydFxuY2xhc3MgQ29udHJvbCB7XG4gICAgcHJpdmF0ZSAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJvdGVjdGVkIGxheWVyOiAgICAgRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBhQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lciApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIHtcbiAgICAgICAgdmFyIGlDYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnQ0FOVkFTJyApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ3dpZHRoJywgIGFDb250YWluZXIub2Zmc2V0V2lkdGgudG9TdHJpbmcoKSAgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICdoZWlnaHQnLCBhQ29udGFpbmVyLm9mZnNldEhlaWdodC50b1N0cmluZygpICk7XG4gICAgICAgIGFDb250YWluZXIuYXBwZW5kQ2hpbGQoIGlDYW52YXMgKTtcbiAgICB9XG59IiwiZXhwb3J0XG5jbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy54LCB0aGlzLnkgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFJlY3Qge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgdzogbnVtYmVyO1xuICAgIGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyLCBhVzogbnVtYmVyLCBhSDogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgICAgIHRoaXMudyA9IGFXO1xuICAgICAgICB0aGlzLmggPSBhSDtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCggdGhpcy54LCB0aGlzLnksIHRoaXMudywgdGhpcy5oICk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54IDogdGhpcy54ICsgdGhpcy53O1xuICAgIH1cblxuICAgIGdldFJpZ2h0KCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggKyB0aGlzLncgOiB0aGlzLng7XG4gICAgfVxuXG4gICAgZ2V0VG9wKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgOiB0aGlzLnkgKyB0aGlzLmg7XG4gICAgfVxuXG4gICAgZ2V0Qm90dG9tKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgKyB0aGlzLmggOiB0aGlzLnk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdFRvcCgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLmdldExlZnQoKSwgdGhpcy5nZXRUb3AoKSApO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IFJlY3QgfSBmcm9tICcuL1JlY3QnO1xuIiwiaW1wb3J0ICogYXMgZ2VvbWV0cnkgZnJvbSAnLi9nZW9tZXRyeS9nZW9tZXRyeSc7XG5leHBvcnQge2dlb21ldHJ5fTtcblxuZXhwb3J0IHsgQ29udHJvbCB9IGZyb20gJy4vQ29udHJvbCc7Il19
