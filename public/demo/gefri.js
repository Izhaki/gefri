(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gefri = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var view = require('./view/view.ns');
exports.view = view;

},{"./view/view.ns":6}],2:[function(require,module,exports){
"use strict";
var Control = (function () {
    function Control(aContainer) {
        this.container = aContainer;
        this.canvas = this.createCanvas(aContainer);
    }
    Control.prototype.createCanvas = function (aContainer) {
        var iCanvas = document.createElement('CANVAS');
        iCanvas.setAttribute('width', aContainer.offsetWidth.toString());
        iCanvas.setAttribute('height', aContainer.offsetHeight.toString());
        aContainer.appendChild(iCanvas);
        return iCanvas;
    };
    Control.prototype.setContents = function (aViewee) {
        var iContext = this.canvas.getContext('2d');
        iContext.fillStyle = '#1ABC9C';
        iContext.lineWidth = 1;
        iContext.strokeStyle = 'black';
        aViewee.paint(iContext);
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
var geometry = require('./geometry/geometry.ns');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;
var Rectangle_1 = require('./viewees/shapes/Rectangle');
exports.Rectangle = Rectangle_1.Rectangle;

},{"./Control":2,"./geometry/geometry.ns":5,"./viewees/shapes/Rectangle":8}],7:[function(require,module,exports){
"use strict";
var Viewee = (function () {
    function Viewee() {
    }
    return Viewee;
}());
exports.Viewee = Viewee;

},{}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Viewee_1 = require('./../Viewee');
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(aRect) {
        _super.call(this);
        this.rect = aRect;
    }
    Rectangle.prototype.paint = function (aContext) {
        var r = this.rect;
        aContext.beginPath();
        aContext.rect(r.x, r.y, r.w, r.h);
        aContext.fill();
        aContext.stroke();
    };
    return Rectangle;
}(Viewee_1.Viewee));
exports.Rectangle = Rectangle;

},{"./../Viewee":7}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy92aWV3Lm5zLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9WaWV3ZWUudHMiLCJzcmMvdmlldy92aWV3ZWVzL3NoYXBlcy9SZWN0YW5nbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsSUFBWSxJQUFJLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMvQixZQUFJO0FBQUU7OztBQ0NkO0lBS0ksaUJBQWEsVUFBdUI7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFFLFVBQVUsQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFFTyw4QkFBWSxHQUFwQixVQUFzQixVQUF1QjtRQUN6QyxJQUFJLE9BQU8sR0FBMEMsUUFBUSxDQUFDLGFBQWEsQ0FBRSxRQUFRLENBQUUsQ0FBQztRQUN4RixPQUFPLENBQUMsWUFBWSxDQUFFLE9BQU8sRUFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFHLENBQUM7UUFDckUsT0FBTyxDQUFDLFlBQVksQ0FBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBRSxDQUFDO1FBQ3JFLFVBQVUsQ0FBQyxXQUFXLENBQUUsT0FBTyxDQUFFLENBQUM7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU0sNkJBQVcsR0FBbEIsVUFBb0IsT0FBZTtRQUMvQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMs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QTtJQUtBLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFKYyxjQUFNLFNBSXBCLENBQUE7Ozs7Ozs7OztBQ0xELHVCQUF1QixhQUFhLENBQUMsQ0FBQTtBQUdyQztJQUN3Qiw2QkFBTTtJQUcxQixtQkFBYSxLQUFXO1FBQ3BCLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQseUJBQUssR0FBTCxVQUFPLFFBQVE7UUFDWCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRWxCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQixRQUFRLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUNwQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTCxnQkFBQztBQUFELENBbEJBLEFBa0JDLENBakJ1QixlQUFNLEdBaUI3QjtBQWpCSyxpQkFBUyxZQWlCZCxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIHZpZXcgZnJvbSAnLi92aWV3L3ZpZXcubnMnO1xuZXhwb3J0IHt2aWV3fTtcbiIsImltcG9ydCB7IFZpZXdlZSB9IGZyb20gJy4vdmlld2Vlcy9WaWV3ZWUnO1xuXG5leHBvcnRcbmNsYXNzIENvbnRyb2wge1xuICAgIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgICBwdWJsaWMgIGNhbnZhczogICAgSFRNTENhbnZhc0VsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gYUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lciApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIDogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICB2YXIgaUNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdDQU5WQVMnICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCAgYUNvbnRhaW5lci5vZmZzZXRXaWR0aC50b1N0cmluZygpICApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ2hlaWdodCcsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0LnRvU3RyaW5nKCkgKTtcbiAgICAgICAgYUNvbnRhaW5lci5hcHBlbmRDaGlsZCggaUNhbnZhcyApO1xuICAgICAgICByZXR1cm4gaUNhbnZhcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29udGVudHMoIGFWaWV3ZWU6IFZpZXdlZSApIHtcbiAgICAgICAgdmFyIGlDb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xuXG4gICAgICAgIC8vIFByZXZlbnRzIGFudGlhbGlhc2luZyBlZmZlY3QuXG4gICAgICAgIC8vIGlDb250ZXh0LnRyYW5zbGF0ZSggMC41LCAwLjUgKTtcblxuICAgICAgICBpQ29udGV4dC5maWxsU3R5bGUgPSAnIzFBQkM5Qyc7XG4gICAgICAgIGlDb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgICAgIGlDb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblxuICAgICAgICBhVmlld2VlLnBhaW50KCBpQ29udGV4dCApXG4gICAgfVxufVxuIiwiZXhwb3J0XG5jbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy54LCB0aGlzLnkgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFJlY3Qge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgdzogbnVtYmVyO1xuICAgIGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyLCBhVzogbnVtYmVyLCBhSDogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgICAgIHRoaXMudyA9IGFXO1xuICAgICAgICB0aGlzLmggPSBhSDtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCggdGhpcy54LCB0aGlzLnksIHRoaXMudywgdGhpcy5oICk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54IDogdGhpcy54ICsgdGhpcy53O1xuICAgIH1cblxuICAgIGdldFJpZ2h0KCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggKyB0aGlzLncgOiB0aGlzLng7XG4gICAgfVxuXG4gICAgZ2V0VG9wKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgOiB0aGlzLnkgKyB0aGlzLmg7XG4gICAgfVxuXG4gICAgZ2V0Qm90dG9tKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgKyB0aGlzLmggOiB0aGlzLnk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdFRvcCgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLmdldExlZnQoKSwgdGhpcy5nZXRUb3AoKSApO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IFJlY3QgfSBmcm9tICcuL1JlY3QnO1xuIiwiaW1wb3J0ICogYXMgZ2VvbWV0cnkgZnJvbSAnLi9nZW9tZXRyeS9nZW9tZXRyeS5ucyc7XG5leHBvcnQgeyBnZW9tZXRyeSB9O1xuXG5leHBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9Db250cm9sJztcbmV4cG9ydCB7IFJlY3RhbmdsZSB9IGZyb20gJy4vdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlJztcbiIsImV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgVmlld2VlIHtcblxuICAgIGFic3RyYWN0IHBhaW50KCBhQ29udGV4dCApO1xuXG59XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSBmcm9tICcuLy4uL1ZpZXdlZSc7XG5pbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi8uLi8uLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBWaWV3ZWUge1xuICAgIHJlY3Q6IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVjdCA9IGFSZWN0O1xuICAgIH1cblxuICAgIHBhaW50KCBhQ29udGV4dCApIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLnJlY3Q7XG5cbiAgICAgICAgYUNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGFDb250ZXh0LnJlY3QoIHIueCwgci55LCByLncsIHIuaCApO1xuICAgICAgICBhQ29udGV4dC5maWxsKCk7XG4gICAgICAgIGFDb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxufVxuIl19
