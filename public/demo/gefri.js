(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gefri = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var view = require('./view/view.ns');
exports.view = view;

},{"./view/view.ns":7}],2:[function(require,module,exports){
"use strict";
var Painter_1 = require('./painters/Painter');
var Control = (function () {
    function Control(aContainer) {
        this.container = aContainer;
        this.canvas = this.createCanvas(aContainer);
        this.context = this.getContext(this.canvas);
        this.painter = new Painter_1.Painter(this.context);
    }
    Control.prototype.createCanvas = function (aContainer) {
        var iCanvas = document.createElement('CANVAS');
        iCanvas.setAttribute('width', aContainer.offsetWidth.toString());
        iCanvas.setAttribute('height', aContainer.offsetHeight.toString());
        aContainer.appendChild(iCanvas);
        return iCanvas;
    };
    Control.prototype.getContext = function (aCanvas) {
        var context = this.canvas.getContext('2d');
        context.fillStyle = '#1ABC9C';
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        return context;
    };
    Control.prototype.setContents = function (aViewee) {
        aViewee.paint(this.painter);
    };
    return Control;
}());
exports.Control = Control;

},{"./painters/Painter":6}],3:[function(require,module,exports){
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
var Painter = (function () {
    function Painter(aContext) {
        this.context = aContext;
    }
    Painter.prototype.drawRectangle = function (aRect) {
        var context = this.context;
        context.beginPath();
        context.rect(aRect.x, aRect.y, aRect.w, aRect.h);
        context.fill();
        context.stroke();
    };
    return Painter;
}());
exports.Painter = Painter;

},{}],7:[function(require,module,exports){
"use strict";
var geometry = require('./geometry/geometry.ns');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;
var Rectangle_1 = require('./viewees/shapes/Rectangle');
exports.Rectangle = Rectangle_1.Rectangle;

},{"./Control":2,"./geometry/geometry.ns":5,"./viewees/shapes/Rectangle":9}],8:[function(require,module,exports){
"use strict";
var Viewee = (function () {
    function Viewee() {
    }
    return Viewee;
}());
exports.Viewee = Viewee;

},{}],9:[function(require,module,exports){
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
    Rectangle.prototype.paint = function (aPainter) {
        aPainter.drawRectangle(this.rect);
    };
    return Rectangle;
}(Viewee_1.Viewee));
exports.Rectangle = Rectangle;

},{"./../Viewee":8}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9QYWludGVyLnRzIiwic3JjL3ZpZXcvdmlldy5ucy50cyIsInNyYy92aWV3L3ZpZXdlZXMvVmlld2VlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQVksSUFBSSxXQUFNLGdCQUFnQixDQUFDLENBQUE7QUFDL0IsWUFBSTtBQUFFOzs7QUNBZCx3QkFBd0Isb0JBQW9CLENBQUMsQ0FBQTtBQUU3QztJQU9JLGlCQUFhLFVBQXVCO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQU0sSUFBSSxDQUFDLFlBQVksQ0FBRSxVQUFVLENBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFLLElBQUksQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUssSUFBSSxpQkFBTyxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRU8sOEJBQVksR0FBcEIsVUFBc0IsVUFBdUI7UUFDekMsSUFBSSxPQUFPLEdBQXlDLFFBQVEsQ0FBQyxhQUFhLENBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkYsT0FBTyxDQUFDLFlBQVksQ0FBRSxPQUFPLEVBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBRyxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxZQUFZLENBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUUsQ0FBQztRQUNyRSxVQUFVLENBQUMsV0FBVyxDQUFFLE9BQU8sQ0FBRSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLDRCQUFVLEdBQWxCLFVBQW9CLE9BQTBCO1FBQzFDLElBQUksT0FBTyxHQUE2QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUV2RSxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUM5QixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUN0QixPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSw2QkFBVyxHQUFsQixVQUFvQixPQUFlO1FBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFDO0lBQ2xDLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQWpDSyxlQUFPLFVBaUNaLENBQUE7Ozs7QUNyQ0Q7SUFLSSxlQUFhLEVBQVUsRUFBRSxFQUFVO1FBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELHFCQUFLLEdBQUw7UUFDSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFDdkMsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTtBQVpLLGFBQUssUUFZVixDQUFBOzs7O0FDYkQsc0JBQXNCLFNBQVMsQ0FBQyxDQUFBO0FBRWhDO0lBT0ksY0FBYSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO1FBQ3ZELElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxvQkFBSyxHQUFMO1FBQ0ksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsc0JBQU8sR0FBUDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsdUJBQVEsR0FBUjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQscUJBQU0sR0FBTjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsd0JBQVMsR0FBVDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQseUJBQVUsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLGFBQUssQ0FBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVMLFdBQUM7QUFBRCxDQXRDQSxBQXNDQyxJQUFBO0FBckNLLFlBQUksT0FxQ1QsQ0FBQTs7OztBQ3hDRCxzQkFBc0IsU0FBUyxDQUFDO0FBQXZCLDhCQUF1QjtBQUNoQyxxQkFBcUIsUUFBUSxDQUFDO0FBQXJCLDJCQUFxQjs7OztBQ0M5QjtJQUlJLGlCQUFhLFFBQWtDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFFTSwrQkFBYSxHQUFwQixVQUFzQixLQUFXO1FBQzdCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDM0IsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUwsY0FBQztBQUFELENBaEJBLEFBZ0JDLElBQUE7QUFmSyxlQUFPLFVBZVosQ0FBQTs7OztBQ2xCRCxJQUFZLFFBQVEsV0FBTSx3QkFBd0IsQ0FBQyxDQUFBO0FBQzFDLGdCQUFRO0FBRWpCLHdCQUF3QixXQUFXLENBQUM7QUFBM0Isb0NBQTJCO0FBQ3BDLDBCQUEwQiw0QkFBNEIsQ0FBQztBQUE5QywwQ0FBOEM7Ozs7QUNGdkQ7SUFBQTtJQUtBLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFKYyxjQUFNLFNBSXBCLENBQUE7Ozs7Ozs7OztBQ1BELHVCQUF1QixhQUFhLENBQUMsQ0FBQTtBQUlyQztJQUN3Qiw2QkFBTTtJQUcxQixtQkFBYSxLQUFXO1FBQ3BCLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQseUJBQUssR0FBTCxVQUFPLFFBQWlCO1FBQ3BCLFFBQVEsQ0FBQyxhQUFhLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBQ3hDLENBQUM7SUFFTCxnQkFBQztBQUFELENBYkEsQUFhQyxDQVp1QixlQUFNLEdBWTdCO0FBWkssaUJBQVMsWUFZZCxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIHZpZXcgZnJvbSAnLi92aWV3L3ZpZXcubnMnO1xuZXhwb3J0IHt2aWV3fTtcbiIsImltcG9ydCB7IFZpZXdlZSB9IGZyb20gJy4vdmlld2Vlcy9WaWV3ZWUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuY2xhc3MgQ29udHJvbCB7XG4gICAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgY2FudmFzOiAgICBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwcml2YXRlIGNvbnRleHQ6ICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgcGFpbnRlcjogICBQYWludGVyO1xuXG4gICAgY29uc3RydWN0b3IoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGFDb250YWluZXI7XG4gICAgICAgIHRoaXMuY2FudmFzICAgID0gdGhpcy5jcmVhdGVDYW52YXMoIGFDb250YWluZXIgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ICAgPSB0aGlzLmdldENvbnRleHQoIHRoaXMuY2FudmFzICk7XG4gICAgICAgIHRoaXMucGFpbnRlciAgID0gbmV3IFBhaW50ZXIoIHRoaXMuY29udGV4dCApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIDogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICB2YXIgaUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ0NBTlZBUycgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICd3aWR0aCcsICBhQ29udGFpbmVyLm9mZnNldFdpZHRoLnRvU3RyaW5nKCkgICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnaGVpZ2h0JywgYUNvbnRhaW5lci5vZmZzZXRIZWlnaHQudG9TdHJpbmcoKSApO1xuICAgICAgICBhQ29udGFpbmVyLmFwcGVuZENoaWxkKCBpQ2FudmFzICk7XG4gICAgICAgIHJldHVybiBpQ2FudmFzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29udGV4dCggYUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcbiAgICAgICAgdmFyIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUoIDAuNSwgMC41ICk7IC8vIFByZXZlbnRzIGFudGlhbGlhc2luZyBlZmZlY3QuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMxQUJDOUMnO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29udGVudHMoIGFWaWV3ZWU6IFZpZXdlZSApIHtcbiAgICAgICAgYVZpZXdlZS5wYWludCggdGhpcy5wYWludGVyICk7XG4gICAgfVxufVxuIiwiZXhwb3J0XG5jbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy54LCB0aGlzLnkgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFJlY3Qge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgdzogbnVtYmVyO1xuICAgIGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyLCBhVzogbnVtYmVyLCBhSDogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgICAgIHRoaXMudyA9IGFXO1xuICAgICAgICB0aGlzLmggPSBhSDtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCggdGhpcy54LCB0aGlzLnksIHRoaXMudywgdGhpcy5oICk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54IDogdGhpcy54ICsgdGhpcy53O1xuICAgIH1cblxuICAgIGdldFJpZ2h0KCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggKyB0aGlzLncgOiB0aGlzLng7XG4gICAgfVxuXG4gICAgZ2V0VG9wKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgOiB0aGlzLnkgKyB0aGlzLmg7XG4gICAgfVxuXG4gICAgZ2V0Qm90dG9tKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgKyB0aGlzLmggOiB0aGlzLnk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdFRvcCgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLmdldExlZnQoKSwgdGhpcy5nZXRUb3AoKSApO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IFJlY3QgfSBmcm9tICcuL1JlY3QnO1xuIiwiaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4vLi4vZ2VvbWV0cnkvUmVjdCc7XG5cbmV4cG9ydFxuY2xhc3MgUGFpbnRlciB7XG4gICAgcHJpdmF0ZSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gYUNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdSZWN0YW5nbGUoIGFSZWN0OiBSZWN0ICkge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5yZWN0KCBhUmVjdC54LCBhUmVjdC55LCBhUmVjdC53LCBhUmVjdC5oICk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0ICogYXMgZ2VvbWV0cnkgZnJvbSAnLi9nZW9tZXRyeS9nZW9tZXRyeS5ucyc7XG5leHBvcnQgeyBnZW9tZXRyeSB9O1xuXG5leHBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9Db250cm9sJztcbmV4cG9ydCB7IFJlY3RhbmdsZSB9IGZyb20gJy4vdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlJztcbiIsImltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFZpZXdlZSB7XG5cbiAgICBhYnN0cmFjdCBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTtcblxufVxuIiwiaW1wb3J0IHsgVmlld2VlIH0gZnJvbSAnLi8uLi9WaWV3ZWUnO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4vLi4vLi4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBWaWV3ZWUge1xuICAgIHJlY3Q6IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVjdCA9IGFSZWN0O1xuICAgIH1cblxuICAgIHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApIHtcbiAgICAgICAgYVBhaW50ZXIuZHJhd1JlY3RhbmdsZSggdGhpcy5yZWN0ICk7XG4gICAgfVxuXG59XG4iXX0=
