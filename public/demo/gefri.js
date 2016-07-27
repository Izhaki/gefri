(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gefri = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Composite = (function () {
    function Composite() {
        this.children = [];
        this.parent = null;
    }
    Composite.prototype.addChild = function (aChild) {
        this.children.push(aChild);
        aChild.parent = this;
    };
    Composite.prototype.addChildren = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < arguments.length; i++) {
            this.addChild(arguments[i]);
        }
    };
    Composite.prototype.removeChild = function (aChild) {
        var iChildIndex = this.children.indexOf(aChild);
        if (iChildIndex === -1) {
            throw "Could not find requested child";
        }
        else {
            aChild.parent = null;
            this.children.splice(iChildIndex, 1);
        }
    };
    Composite.prototype.forEachChild = function (aCallback) {
        for (var i = 0; i < this.children.length; i++) {
            aCallback(this.children[i], i);
        }
    };
    Composite.prototype.isChildless = function () {
        return this.children.length === 0;
    };
    Composite.prototype.hasParent = function () {
        return this.parent != null;
    };
    return Composite;
}());
exports.Composite = Composite;

},{}],2:[function(require,module,exports){
"use strict";
var view = require('./view/view.ns');
exports.view = view;

},{"./view/view.ns":8}],3:[function(require,module,exports){
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

},{"./painters/Painter":7}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./Point":4}],6:[function(require,module,exports){
"use strict";
var Point_1 = require('./Point');
exports.Point = Point_1.Point;
var Rect_1 = require('./Rect');
exports.Rect = Rect_1.Rect;

},{"./Point":4,"./Rect":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";
var geometry = require('./geometry/geometry.ns');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;
var Rectangle_1 = require('./viewees/shapes/Rectangle');
exports.Rectangle = Rectangle_1.Rectangle;

},{"./Control":3,"./geometry/geometry.ns":6,"./viewees/shapes/Rectangle":10}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Composite_1 = require('./../../core/Composite');
var Viewee = (function (_super) {
    __extends(Viewee, _super);
    function Viewee() {
        _super.apply(this, arguments);
    }
    Viewee.prototype.paintChildren = function (aPainter) {
        if (this.isChildless())
            return;
        this.forEachChild(function (aChild) {
            aChild.paint(aPainter);
        });
    };
    return Viewee;
}(Composite_1.Composite));
exports.Viewee = Viewee;

},{"./../../core/Composite":1}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shape_1 = require('./Shape');
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(aRect) {
        _super.call(this);
        this.rect = aRect;
    }
    Rectangle.prototype.paintSelf = function (aPainter) {
        aPainter.drawRectangle(this.rect);
        this.paintChildren(aPainter);
    };
    return Rectangle;
}(Shape_1.Shape));
exports.Rectangle = Rectangle;

},{"./Shape":11}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Viewee_1 = require('./../Viewee');
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape() {
        _super.apply(this, arguments);
    }
    Shape.prototype.paint = function (aPainter) {
        this.paintSelf(aPainter);
        this.paintChildren(aPainter);
    };
    return Shape;
}(Viewee_1.Viewee));
exports.Shape = Shape;

},{"./../Viewee":9}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9QYWludGVyLnRzIiwic3JjL3ZpZXcvdmlldy5ucy50cyIsInNyYy92aWV3L3ZpZXdlZXMvVmlld2VlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7SUFLSTtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUssSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFNRCw0QkFBUSxHQUFSLFVBQVUsTUFBTTtRQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCwrQkFBVyxHQUFYO1FBQWEsY0FBWTthQUFaLFdBQVksQ0FBWixzQkFBWSxDQUFaLElBQVk7WUFBWiw2QkFBWTs7UUFDckIsR0FBRyxDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtCQUFXLEdBQVgsVUFBYSxNQUFNO1FBQ2YsSUFBSSxX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LFFBQWlCO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUUsUUFBUSxDQUFFLENBQUE7UUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBRSxRQUFRLENBQUUsQ0FBQztJQUNuQyxDQUFDO0lBR0wsWUFBQztBQUFELENBVEEsQUFTQyxDQVI0QixlQUFNLEdBUWxDO0FBUmMsYUFBSyxRQVFuQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydFxuY2xhc3MgQ29tcG9zaXRlPCBUID4ge1xuICAgIGNoaWxkcmVuOiBUW107XG4gICAgcGFyZW50IDogIFQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudCAgID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIEFkZGluZyBhbmQgcmVtb3ZpbmdcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgYWRkQ2hpbGQoIGFDaGlsZCApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKCBhQ2hpbGQgKTtcbiAgICAgICAgYUNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGRyZW4oIC4uLmFyZ3M6IFRbXSApOiB2b2lkIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKCBhcmd1bWVudHNbaV0gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNoaWxkKCBhQ2hpbGQgKTogdm9pZCB7XG4gICAgICAgIHZhciBpQ2hpbGRJbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZiggYUNoaWxkICk7XG5cbiAgICAgICAgaWYgKCBpQ2hpbGRJbmRleCA9PT0gLTEgKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNvdWxkIG5vdCBmaW5kIHJlcXVlc3RlZCBjaGlsZFwiXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKCBpQ2hpbGRJbmRleCwgMSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBVdGlsaXR5XG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZvckVhY2hDaGlsZCggYUNhbGxiYWNrICk6IHZvaWQge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgYUNhbGxiYWNrKCB0aGlzLmNoaWxkcmVuW2ldLCBpICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0NoaWxkbGVzcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIGhhc1BhcmVudCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50ICE9IG51bGw7XG4gICAgfVxuXG59IiwiaW1wb3J0ICogYXMgdmlldyBmcm9tICcuL3ZpZXcvdmlldy5ucyc7XG5leHBvcnQge3ZpZXd9O1xuIiwiaW1wb3J0IHsgVmlld2VlIH0gZnJvbSAnLi92aWV3ZWVzL1ZpZXdlZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5jbGFzcyBDb250cm9sIHtcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXM6ICAgIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY29udGV4dDogICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSBwYWludGVyOiAgIFBhaW50ZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gYUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jYW52YXMgICAgPSB0aGlzLmNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lciApO1xuICAgICAgICB0aGlzLmNvbnRleHQgICA9IHRoaXMuZ2V0Q29udGV4dCggdGhpcy5jYW52YXMgKTtcbiAgICAgICAgdGhpcy5wYWludGVyICAgPSBuZXcgUGFpbnRlciggdGhpcy5jb250ZXh0ICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDYW52YXMoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgICAgIHZhciBpQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnQ0FOVkFTJyApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ3dpZHRoJywgIGFDb250YWluZXIub2Zmc2V0V2lkdGgudG9TdHJpbmcoKSAgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICdoZWlnaHQnLCBhQ29udGFpbmVyLm9mZnNldEhlaWdodC50b1N0cmluZygpICk7XG4gICAgICAgIGFDb250YWluZXIuYXBwZW5kQ2hpbGQoIGlDYW52YXMgKTtcbiAgICAgICAgcmV0dXJuIGlDYW52YXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb250ZXh0KCBhQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCApOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgICAgICB2YXIgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSggMC41LCAwLjUgKTsgLy8gUHJldmVudHMgYW50aWFsaWFzaW5nIGVmZmVjdC5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzFBQkM5Qyc7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb250ZW50cyggYVZpZXdlZTogVmlld2VlICkge1xuICAgICAgICBhVmlld2VlLnBhaW50KCB0aGlzLnBhaW50ZXIgKTtcbiAgICB9XG59XG4iLCJleHBvcnRcbmNsYXNzIFBvaW50IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoIGFYOiBudW1iZXIsIGFZOiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMueCA9IGFYO1xuICAgICAgICB0aGlzLnkgPSBhWTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLngsIHRoaXMueSApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgUmVjdCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICB3OiBudW1iZXI7XG4gICAgaDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoIGFYOiBudW1iZXIsIGFZOiBudW1iZXIsIGFXOiBudW1iZXIsIGFIOiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMueCA9IGFYO1xuICAgICAgICB0aGlzLnkgPSBhWTtcbiAgICAgICAgdGhpcy53ID0gYVc7XG4gICAgICAgIHRoaXMuaCA9IGFIO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0KCB0aGlzLngsIHRoaXMueSwgdGhpcy53LCB0aGlzLmggKTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0KCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggOiB0aGlzLnggKyB0aGlzLnc7XG4gICAgfVxuXG4gICAgZ2V0UmlnaHQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLncgPj0gMCA/IHRoaXMueCArIHRoaXMudyA6IHRoaXMueDtcbiAgICB9XG5cbiAgICBnZXRUb3AoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSA6IHRoaXMueSArIHRoaXMuaDtcbiAgICB9XG5cbiAgICBnZXRCb3R0b20oKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSArIHRoaXMuaCA6IHRoaXMueTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0VG9wKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIHRoaXMuZ2V0TGVmdCgpLCB0aGlzLmdldFRvcCgpICk7XG4gICAgfVxuXG59XG4iLCJleHBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuZXhwb3J0IHsgUmVjdCB9IGZyb20gJy4vUmVjdCc7XG4iLCJpbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi8uLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5jbGFzcyBQYWludGVyIHtcbiAgICBwcml2YXRlIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEICkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBhQ29udGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnJlY3QoIGFSZWN0LngsIGFSZWN0LnksIGFSZWN0LncsIGFSZWN0LmggKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgKiBhcyBnZW9tZXRyeSBmcm9tICcuL2dlb21ldHJ5L2dlb21ldHJ5Lm5zJztcbmV4cG9ydCB7IGdlb21ldHJ5IH07XG5cbmV4cG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL0NvbnRyb2wnO1xuZXhwb3J0IHsgUmVjdGFuZ2xlIH0gZnJvbSAnLi92aWV3ZWVzL3NoYXBlcy9SZWN0YW5nbGUnO1xuIiwiaW1wb3J0IHsgQ29tcG9zaXRlIH0gZnJvbSAnLi8uLi8uLi9jb3JlL0NvbXBvc2l0ZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBWaWV3ZWUgZXh0ZW5kcyBDb21wb3NpdGU8IFZpZXdlZSA+IHtcblxuICAgIGFic3RyYWN0IHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkO1xuXG4gICAgcGFpbnRDaGlsZHJlbiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGlmICggdGhpcy5pc0NoaWxkbGVzcygpICkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGFQYWludGVyLnB1c2hTdGF0ZSgpO1xuXG4gICAgICAgIC8vIHRoaXMuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoQ2hpbGQoIGZ1bmN0aW9uKCBhQ2hpbGQgKSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFpbnQoIGFQYWludGVyICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFQYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBTaGFwZSB9IGZyb20gJy4vU2hhcGUnO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4vLi4vLi4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBTaGFwZSB7XG4gICAgcmVjdDogUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKCBhUmVjdDogUmVjdCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZWN0ID0gYVJlY3Q7XG4gICAgfVxuXG4gICAgcGFpbnRTZWxmKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgYVBhaW50ZXIuZHJhd1JlY3RhbmdsZSggdGhpcy5yZWN0ICk7XG4gICAgICAgIHRoaXMucGFpbnRDaGlsZHJlbiggYVBhaW50ZXIgKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZpZXdlZSB9IGZyb20gJy4vLi4vVmlld2VlJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLy4uLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFNoYXBlIGV4dGVuZHMgVmlld2VlIHtcblxuICAgIHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYWludFNlbGYoIGFQYWludGVyIClcbiAgICAgICAgdGhpcy5wYWludENoaWxkcmVuKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcbn1cbiJdfQ==
