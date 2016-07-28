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
    Painter.prototype.translate = function (x, y) {
        this.context.translate(x, y);
    };
    Painter.prototype.pushState = function () {
        this.context.save();
    };
    Painter.prototype.popState = function () {
        this.context.restore();
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
        aPainter.pushState();
        this.applyTransformations(aPainter);
        this.forEachChild(function (aChild) {
            aChild.paint(aPainter);
        });
        aPainter.popState();
    };
    Viewee.prototype.applyTransformations = function (aPainter) {
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
    };
    Rectangle.prototype.getRectBounds = function () {
        return this.rect;
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
    Shape.prototype.applyTransformations = function (aPainter) {
        var iBounds = this.getRectBounds();
        aPainter.translate(iBounds.getLeft(), iBounds.getTop());
    };
    return Shape;
}(Viewee_1.Viewee));
exports.Shape = Shape;

},{"./../Viewee":9}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9QYWludGVyLnRzIiwic3JjL3ZpZXcvdmlldy5ucy50cyIsInNyYy92aWV3L3ZpZXdlZXMvVmlld2VlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7SUFLSTtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUssSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFNRCw0QkFBUSxHQUFSLFVBQVUsTUFBTTtRQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCwrQkFBVyxHQUFYO1FBQWEsY0FBWTthQUFaLFdBQVksQ0FBWixzQkFBWSxDQUFaLElBQVk7WUFBWiw2QkFBWTs7UUFDckIsR0FBRyxDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtCQUFXLEdBQVgsVUFBYSxNQUFNO1FBQ2YsSUFBSSxX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QUN3Qiw2QkFBSztJQUd6QixtQkFBYSxLQUFXO1FBQ3BCLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsNkJBQVMsR0FBVCxVQUFXLFFBQWlCO1FBQ3hCLFFBQVEsQ0FBQyxhQUFhLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxpQ0FBYSxHQUFiO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVMLGdCQUFDO0FBQUQsQ0FqQkEsQUFpQkMsQ0FoQnVCLGFBQUssR0FnQjVCO0FBaEJLLGlCQUFTLFlBZ0JkLENBQUE7Ozs7Ozs7OztBQ3JCRCx1QkFBd0IsYUFBYSxDQUFDLENBQUE7QUFJdEM7SUFDNkIseUJBQU07SUFEbkM7UUFDNkIsOEJBQU07SUFnQm5DLENBQUM7SUFkRyxxQkFBSyxHQUFMLFVBQU8sUUFBaUI7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxRQUFRLENBQUUsQ0FBQTtRQUMxQixJQUFJLENBQUMsYUFBYSxDQUFFLFFBQVEsQ0FBRSxDQUFDO0lBQ25DLENBQUM7SUFNRCxvQ0FBb0IsR0FBcEIsVUFBc0IsUUFBaUI7UUFDbkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25DLFFBQVEsQ0FBQyxTQUFTLENBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBRSxDQUFDO0lBQzlELENBQUM7SUFFTCxZQUFDO0FBQUQsQ0FqQkEsQUFpQkMsQ0FoQjRCLGVBQU0sR0FnQmxDO0FBaEJjLGFBQUssUUFnQm5CLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0XG5jbGFzcyBDb21wb3NpdGU8IFQgPiB7XG4gICAgY2hpbGRyZW46IFRbXTtcbiAgICBwYXJlbnQgOiAgVDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ICAgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogQWRkaW5nIGFuZCByZW1vdmluZ1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBhZGRDaGlsZCggYUNoaWxkICk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGFDaGlsZCApO1xuICAgICAgICBhQ2hpbGQucGFyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICBhZGRDaGlsZHJlbiggLi4uYXJnczogVFtdICk6IHZvaWQge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoIGFyZ3VtZW50c1tpXSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGQoIGFDaGlsZCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGlDaGlsZEluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKCBhQ2hpbGQgKTtcblxuICAgICAgICBpZiAoIGlDaGlsZEluZGV4ID09PSAtMSApIHtcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgcmVxdWVzdGVkIGNoaWxkXCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFDaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoIGlDaGlsZEluZGV4LCAxICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFV0aWxpdHlcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZm9yRWFjaENoaWxkKCBhQ2FsbGJhY2sgKTogdm9pZCB7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBhQ2FsbGJhY2soIHRoaXMuY2hpbGRyZW5baV0sIGkgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQ2hpbGRsZXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgaGFzUGFyZW50KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgIT0gbnVsbDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgKiBhcyB2aWV3IGZyb20gJy4vdmlldy92aWV3Lm5zJztcbmV4cG9ydCB7dmlld307XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSBmcm9tICcuL3ZpZXdlZXMvVmlld2VlJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuL3BhaW50ZXJzL1BhaW50ZXInO1xuXG5leHBvcnRcbmNsYXNzIENvbnRyb2wge1xuICAgIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIGNhbnZhczogICAgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjb250ZXh0OiAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHBhaW50ZXI6ICAgUGFpbnRlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBhQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmNhbnZhcyAgICA9IHRoaXMuY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyICk7XG4gICAgICAgIHRoaXMuY29udGV4dCAgID0gdGhpcy5nZXRDb250ZXh0KCB0aGlzLmNhbnZhcyApO1xuICAgICAgICB0aGlzLnBhaW50ZXIgICA9IG5ldyBQYWludGVyKCB0aGlzLmNvbnRleHQgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAgICAgdmFyIGlDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdDQU5WQVMnICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCAgYUNvbnRhaW5lci5vZmZzZXRXaWR0aC50b1N0cmluZygpICApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ2hlaWdodCcsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0LnRvU3RyaW5nKCkgKTtcbiAgICAgICAgYUNvbnRhaW5lci5hcHBlbmRDaGlsZCggaUNhbnZhcyApO1xuICAgICAgICByZXR1cm4gaUNhbnZhcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbnRleHQoIGFDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ICk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XG4gICAgICAgIHZhciBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XG4gICAgICAgIC8vIGNvbnRleHQudHJhbnNsYXRlKCAwLjUsIDAuNSApOyAvLyBQcmV2ZW50cyBhbnRpYWxpYXNpbmcgZWZmZWN0LlxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMUFCQzlDJztcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbnRlbnRzKCBhVmlld2VlOiBWaWV3ZWUgKSB7XG4gICAgICAgIGFWaWV3ZWUucGFpbnQoIHRoaXMucGFpbnRlciApO1xuICAgIH1cbn1cbiIsImV4cG9ydFxuY2xhc3MgUG9pbnQge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIHRoaXMueCwgdGhpcy55ICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBSZWN0IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIHc6IG51bWJlcjtcbiAgICBoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciwgYVc6IG51bWJlciwgYUg6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgICAgICB0aGlzLncgPSBhVztcbiAgICAgICAgdGhpcy5oID0gYUg7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFJlY3Qge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3QoIHRoaXMueCwgdGhpcy55LCB0aGlzLncsIHRoaXMuaCApO1xuICAgIH1cblxuICAgIGdldExlZnQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLncgPj0gMCA/IHRoaXMueCA6IHRoaXMueCArIHRoaXMudztcbiAgICB9XG5cbiAgICBnZXRSaWdodCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54ICsgdGhpcy53IDogdGhpcy54O1xuICAgIH1cblxuICAgIGdldFRvcCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55IDogdGhpcy55ICsgdGhpcy5oO1xuICAgIH1cblxuICAgIGdldEJvdHRvbSgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55ICsgdGhpcy5oIDogdGhpcy55O1xuICAgIH1cblxuICAgIGdldExlZnRUb3AoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy5nZXRMZWZ0KCksIHRoaXMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5leHBvcnQgeyBSZWN0IH0gZnJvbSAnLi9SZWN0JztcbiIsImltcG9ydCB7IFJlY3QgfSBmcm9tICcuLy4uL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmNsYXNzIFBhaW50ZXIge1xuICAgIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3RydWN0b3IoIGFDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgKSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGFDb250ZXh0O1xuICAgIH1cblxuICAgIGRyYXdSZWN0YW5nbGUoIGFSZWN0OiBSZWN0ICkge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5yZWN0KCBhUmVjdC54LCBhUmVjdC55LCBhUmVjdC53LCBhUmVjdC5oICk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIHRyYW5zbGF0ZSggeCwgeSApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggeCwgeSApO1xuICAgIH1cblxuICAgIHB1c2hTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKVxuICAgIH1cblxuICAgIHBvcFN0YXRlKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpXG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCAqIGFzIGdlb21ldHJ5IGZyb20gJy4vZ2VvbWV0cnkvZ2VvbWV0cnkubnMnO1xuZXhwb3J0IHsgZ2VvbWV0cnkgfTtcblxuZXhwb3J0IHsgQ29udHJvbCB9IGZyb20gJy4vQ29udHJvbCc7XG5leHBvcnQgeyBSZWN0YW5nbGUgfSBmcm9tICcuL3ZpZXdlZXMvc2hhcGVzL1JlY3RhbmdsZSc7XG4iLCJpbXBvcnQgeyBDb21wb3NpdGUgfSBmcm9tICcuLy4uLy4uL2NvcmUvQ29tcG9zaXRlJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFZpZXdlZSBleHRlbmRzIENvbXBvc2l0ZTwgVmlld2VlID4ge1xuXG4gICAgYWJzdHJhY3QgcGFpbnQoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQ7XG5cbiAgICBwYWludENoaWxkcmVuKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgaWYgKCB0aGlzLmlzQ2hpbGRsZXNzKCkgKSByZXR1cm47XG5cbiAgICAgICAgYVBhaW50ZXIucHVzaFN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5hcHBseVRyYW5zZm9ybWF0aW9ucyggYVBhaW50ZXIgKTtcblxuICAgICAgICB0aGlzLmZvckVhY2hDaGlsZCggZnVuY3Rpb24oIGFDaGlsZCApIHtcbiAgICAgICAgICAgIGFDaGlsZC5wYWludCggYVBhaW50ZXIgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYVBhaW50ZXIucG9wU3RhdGUoKTtcbiAgICB9XG5cbiAgICBhcHBseVRyYW5zZm9ybWF0aW9ucyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIC8vIERvZXMgbm90aGluZyBieSBkZWZhdWx0LiBDaGlsZHJlbiB3aWxsIG92ZXJyaWRlLlxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgU2hhcGUgfSAgIGZyb20gJy4vU2hhcGUnO1xuaW1wb3J0IHsgUmVjdCB9ICAgIGZyb20gJy4vLi4vLi4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBTaGFwZSB7XG4gICAgcmVjdDogUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKCBhUmVjdDogUmVjdCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZWN0ID0gYVJlY3Q7XG4gICAgfVxuXG4gICAgcGFpbnRTZWxmKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgYVBhaW50ZXIuZHJhd1JlY3RhbmdsZSggdGhpcy5yZWN0ICk7XG4gICAgfVxuXG4gICAgZ2V0UmVjdEJvdW5kcygpOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZpZXdlZSB9ICBmcm9tICcuLy4uL1ZpZXdlZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi8uLi9wYWludGVycy9QYWludGVyJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuLy4uLy4uL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFNoYXBlIGV4dGVuZHMgVmlld2VlIHtcblxuICAgIHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYWludFNlbGYoIGFQYWludGVyIClcbiAgICAgICAgdGhpcy5wYWludENoaWxkcmVuKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIGFic3RyYWN0IGdldFJlY3RCb3VuZHMoKTogUmVjdDtcblxuICAgIGFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgdmFyIGlCb3VuZHMgPSB0aGlzLmdldFJlY3RCb3VuZHMoKTtcbiAgICAgICAgYVBhaW50ZXIudHJhbnNsYXRlKCBpQm91bmRzLmdldExlZnQoKSwgaUJvdW5kcy5nZXRUb3AoKSApO1xuICAgIH1cblxufVxuIl19
