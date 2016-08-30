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

},{"./view/view.ns":10}],3:[function(require,module,exports){
"use strict";
var ContextPainter_1 = require('./painters/ContextPainter');
var Rect_1 = require('./geometry/Rect');
var Control = (function () {
    function Control(aContainer) {
        this.container = aContainer;
        this.bounds = new Rect_1.Rect(0, 0, aContainer.offsetWidth, aContainer.offsetHeight);
        this.canvas = this.createCanvas(aContainer);
        this.context = this.getContext(this.canvas);
        this.painter = new ContextPainter_1.ContextPainter(this.context);
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
        this.painter.pushState();
        this.painter.intersectClipAreaWith(this.bounds);
        aViewee.paint(this.painter);
        this.painter.popState();
    };
    return Control;
}());
exports.Control = Control;

},{"./geometry/Rect":5,"./painters/ContextPainter":8}],4:[function(require,module,exports){
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
    Rect.prototype.intersect = function (aRect) {
        var iLeft = Math.max(this.getLeft(), aRect.getLeft()), iTop = Math.max(this.getTop(), aRect.getTop()), iRight = Math.min(this.getRight(), aRect.getRight()), iBottom = Math.min(this.getBottom(), aRect.getBottom());
        this.x = iLeft;
        this.y = iTop;
        this.w = iRight - iLeft;
        this.h = iBottom - iTop;
    };
    Rect.prototype.isOverlappingWith = function (aRect) {
        return (this.getLeft() <= aRect.getRight() &&
            aRect.getLeft() <= this.getRight() &&
            this.getTop() <= aRect.getBottom() &&
            aRect.getTop() <= this.getBottom());
    };
    Rect.prototype.expand = function (aPoints) {
        var hSign = this.w >= 0 ? -1 : 1;
        var vSign = this.h >= 0 ? -1 : 1;
        this.x += hSign * aPoints;
        this.y += vSign * aPoints;
        this.w += -hSign * aPoints * 2;
        this.h += -vSign * aPoints * 2;
    };
    Rect.prototype.contract = function (aPoints) {
        this.expand(-aPoints);
    };
    return Rect;
}());
exports.Rect = Rect;

},{"./Point":4}],6:[function(require,module,exports){
"use strict";
var Rect_1 = require('./Rect');
var Point_1 = require('./Point');
var TransformMatrix = (function () {
    function TransformMatrix() {
        this.translateX = 0;
        this.translateY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
    }
    TransformMatrix.prototype.clone = function () {
        var iClone = new TransformMatrix();
        iClone.translateX = this.translateX;
        iClone.translateY = this.translateY;
        iClone.scaleX = this.scaleX;
        iClone.scaleY = this.scaleY;
        return iClone;
    };
    TransformMatrix.prototype.translate = function (aTranslation) {
        this.translateX += aTranslation.x * this.scaleX;
        this.translateY += aTranslation.y * this.scaleY;
    };
    TransformMatrix.prototype.scale = function (aScale) {
        this.translateX *= aScale.x;
        this.translateY *= aScale.y;
        this.scaleX *= aScale.x;
        this.scaleY *= aScale.y;
    };
    TransformMatrix.prototype.transformPoint = function (aPoint) {
        return new Point_1.Point(aPoint.x * this.scaleX + this.translateX, aPoint.y * this.scaleY + this.translateY);
    };
    TransformMatrix.prototype.transformRect = function (aRect) {
        var iLeftTop = aRect.getLeftTop(), iTransformedLeftTop = this.transformPoint(iLeftTop), iTransformedRect = new Rect_1.Rect(iTransformedLeftTop.x, iTransformedLeftTop.y, aRect.w * this.scaleX, aRect.h * this.scaleY);
        return iTransformedRect;
    };
    return TransformMatrix;
}());
exports.TransformMatrix = TransformMatrix;

},{"./Point":4,"./Rect":5}],7:[function(require,module,exports){
"use strict";
var Point_1 = require('./Point');
exports.Point = Point_1.Point;
var Rect_1 = require('./Rect');
exports.Rect = Rect_1.Rect;

},{"./Point":4,"./Rect":5}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Painter_1 = require('./Painter');
var ContextPainter = (function (_super) {
    __extends(ContextPainter, _super);
    function ContextPainter(aContext) {
        _super.call(this);
        this.context = aContext;
    }
    ContextPainter.prototype.drawRectangle = function (aRect) {
        var context = this.context;
        context.beginPath();
        context.rect(aRect.x, aRect.y, aRect.w, aRect.h);
        context.fill();
        context.stroke();
        context.closePath();
    };
    ContextPainter.prototype.translate = function (x, y) {
        _super.prototype.translate.call(this, x, y);
        this.context.translate(x, y);
    };
    ContextPainter.prototype.intersectClipAreaWith = function (aRect) {
        _super.prototype.intersectClipAreaWith.call(this, aRect);
        var iRect = aRect.clone();
        iRect.expand(1);
        this.context.beginPath();
        this.context.rect(iRect.x, iRect.y, iRect.w, iRect.h);
        this.context.clip();
    };
    ContextPainter.prototype.pushState = function () {
        _super.prototype.pushState.call(this);
        this.context.save();
    };
    ContextPainter.prototype.popState = function () {
        _super.prototype.popState.call(this);
        this.context.restore();
    };
    return ContextPainter;
}(Painter_1.Painter));
exports.ContextPainter = ContextPainter;

},{"./Painter":9}],9:[function(require,module,exports){
"use strict";
var TransformMatrix_1 = require('../geometry/TransformMatrix');
var Point_1 = require('../geometry/Point');
var Painter = (function () {
    function Painter() {
        this.matrix = new TransformMatrix_1.TransformMatrix();
    }
    Painter.prototype.translate = function (x, y) {
        this.matrix.translate(new Point_1.Point(x, y));
    };
    Painter.prototype.intersectClipAreaWith = function (aRect) {
        var iAbsoluteRect = this.toAbsoluteRect(aRect);
        if (this.clipArea) {
            this.clipArea.intersect(iAbsoluteRect);
        }
        else {
            this.clipArea = iAbsoluteRect;
        }
    };
    Painter.prototype.isRectWithinClipArea = function (aRect) {
        var iAbsoluteRect = this.toAbsoluteRect(aRect);
        if (this.clipArea) {
            return this.clipArea.isOverlappingWith(iAbsoluteRect);
        }
        else {
            return true;
        }
    };
    Painter.prototype.toAbsoluteRect = function (aRect) {
        return this.matrix.transformRect(aRect);
    };
    Painter.prototype.pushState = function () {
    };
    Painter.prototype.popState = function () {
    };
    return Painter;
}());
exports.Painter = Painter;

},{"../geometry/Point":4,"../geometry/TransformMatrix":6}],10:[function(require,module,exports){
"use strict";
var geometry = require('./geometry/geometry.ns');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;
var Rectangle_1 = require('./viewees/shapes/Rectangle');
exports.Rectangle = Rectangle_1.Rectangle;

},{"./Control":3,"./geometry/geometry.ns":7,"./viewees/shapes/Rectangle":12}],11:[function(require,module,exports){
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
        this.beforeChildrenPainting(aPainter);
        this.forEachChild(function (aChild) {
            aChild.paint(aPainter);
        });
        aPainter.popState();
    };
    Viewee.prototype.beforeChildrenPainting = function (aPainter) {
        this.applyTransformations(aPainter);
    };
    Viewee.prototype.applyTransformations = function (aPainter) {
    };
    return Viewee;
}(Composite_1.Composite));
exports.Viewee = Viewee;

},{"./../../core/Composite":1}],12:[function(require,module,exports){
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

},{"./Shape":13}],13:[function(require,module,exports){
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
        if (this.isWithinClipArea(aPainter)) {
            this.paintSelf(aPainter);
            this.paintChildren(aPainter);
        }
    };
    Shape.prototype.beforeChildrenPainting = function (aPainter) {
        aPainter.intersectClipAreaWith(this.getRectBounds());
        _super.prototype.beforeChildrenPainting.call(this, aPainter);
    };
    Shape.prototype.applyTransformations = function (aPainter) {
        var iBounds = this.getRectBounds();
        aPainter.translate(iBounds.getLeft(), iBounds.getTop());
    };
    Shape.prototype.isWithinClipArea = function (aPainter) {
        return aPainter.isRectWithinClipArea(this.getRectBounds());
    };
    return Shape;
}(Viewee_1.Viewee));
exports.Shape = Shape;

},{"./../Viewee":11}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9Db250ZXh0UGFpbnRlci50cyIsInNyYy92aWV3L3BhaW50ZXJzL1BhaW50ZXIudHMiLCJzcmMvdmlldy92aWV3Lm5zLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9WaWV3ZWUudHMiLCJzcmMvdmlldy92aWV3ZWVzL3NoYXBlcy9SZWN0YW5nbGUudHMiLCJzcmMvdmlldy92aWV3ZWVzL3NoYXBlcy9TaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtJQUtJO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBSyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQU1ELDRCQUFRLEdBQVIsVUFBVSxNQUFNO1FBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELCtCQUFXLEdBQVg7UUFBYSxjQUFZO2FBQVosV0FBWSxDQUFaLHNCQUFZLENBQVosSUFBWTtZQUFaLDZCQUFZOztRQUNyQixHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFFLFNBQVMsQ0FBQyxD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QUFDO1FBQ25DLENBQUM7SUFDTCxDQUFDO0lBTUQsc0NBQXNCLEdBQXRCLFVBQXdCLFFBQWlCO1FBQ3JDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUUsQ0FBQztRQUN2RCxnQkFBSyxDQUFDLHNCQUFzQixZQUFFLFFBQVEsQ0FBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxvQ0FBb0IsR0FBcEIsVUFBc0IsUUFBaUI7UUFDbkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25DLFFBQVEsQ0FBQyxTQUFTLENBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBRSxDQUFDO0lBQzlELENBQUM7SUFFRCxnQ0FBZ0IsR0FBaEIsVUFBa0IsUUFBaUI7UUFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUwsWUFBQztBQUFELENBNUJBLEFBNEJDLENBM0I0QixlQUFNLEdBMkJsQztBQTNCYyxhQUFLLFFBMkJuQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydFxuY2xhc3MgQ29tcG9zaXRlPCBUID4ge1xuICAgIGNoaWxkcmVuOiBUW107XG4gICAgcGFyZW50IDogIFQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudCAgID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIEFkZGluZyBhbmQgcmVtb3ZpbmdcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgYWRkQ2hpbGQoIGFDaGlsZCApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKCBhQ2hpbGQgKTtcbiAgICAgICAgYUNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGRyZW4oIC4uLmFyZ3M6IFRbXSApOiB2b2lkIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKCBhcmd1bWVudHNbaV0gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNoaWxkKCBhQ2hpbGQgKTogdm9pZCB7XG4gICAgICAgIHZhciBpQ2hpbGRJbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZiggYUNoaWxkICk7XG5cbiAgICAgICAgaWYgKCBpQ2hpbGRJbmRleCA9PT0gLTEgKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNvdWxkIG5vdCBmaW5kIHJlcXVlc3RlZCBjaGlsZFwiXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKCBpQ2hpbGRJbmRleCwgMSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBVdGlsaXR5XG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZvckVhY2hDaGlsZCggYUNhbGxiYWNrICk6IHZvaWQge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgYUNhbGxiYWNrKCB0aGlzLmNoaWxkcmVuW2ldLCBpICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0NoaWxkbGVzcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIGhhc1BhcmVudCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50ICE9IG51bGw7XG4gICAgfVxuXG59IiwiaW1wb3J0ICogYXMgdmlldyBmcm9tICcuL3ZpZXcvdmlldy5ucyc7XG5leHBvcnQge3ZpZXd9O1xuIiwiaW1wb3J0IHsgVmlld2VlIH0gIGZyb20gJy4vdmlld2Vlcy9WaWV3ZWUnO1xuaW1wb3J0IHsgQ29udGV4dFBhaW50ZXIgfSBmcm9tICcuL3BhaW50ZXJzL0NvbnRleHRQYWludGVyJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmNsYXNzIENvbnRyb2wge1xuICAgIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIGNhbnZhczogICAgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjb250ZXh0OiAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHBhaW50ZXI6ICAgQ29udGV4dFBhaW50ZXI7XG4gICAgcHJpdmF0ZSBib3VuZHM6ICAgIFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gYUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5ib3VuZHMgICAgPSBuZXcgUmVjdCggMCwgMCwgYUNvbnRhaW5lci5vZmZzZXRXaWR0aCwgYUNvbnRhaW5lci5vZmZzZXRIZWlnaHQgKTtcbiAgICAgICAgdGhpcy5jYW52YXMgICAgPSB0aGlzLmNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lciApO1xuICAgICAgICB0aGlzLmNvbnRleHQgICA9IHRoaXMuZ2V0Q29udGV4dCggdGhpcy5jYW52YXMgKTtcbiAgICAgICAgdGhpcy5wYWludGVyICAgPSBuZXcgQ29udGV4dFBhaW50ZXIoIHRoaXMuY29udGV4dCApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIDogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICB2YXIgaUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ0NBTlZBUycgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICd3aWR0aCcsICBhQ29udGFpbmVyLm9mZnNldFdpZHRoLnRvU3RyaW5nKCkgICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnaGVpZ2h0JywgYUNvbnRhaW5lci5vZmZzZXRIZWlnaHQudG9TdHJpbmcoKSApO1xuICAgICAgICBhQ29udGFpbmVyLmFwcGVuZENoaWxkKCBpQ2FudmFzICk7XG4gICAgICAgIHJldHVybiBpQ2FudmFzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29udGV4dCggYUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcbiAgICAgICAgdmFyIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUoIDAuNSwgMC41ICk7IC8vIFByZXZlbnRzIGFudGlhbGlhc2luZyBlZmZlY3QuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMxQUJDOUMnO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29udGVudHMoIGFWaWV3ZWU6IFZpZXdlZSApIHtcbiAgICAgICAgdGhpcy5wYWludGVyLnB1c2hTdGF0ZSgpO1xuICAgICAgICB0aGlzLnBhaW50ZXIuaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCB0aGlzLmJvdW5kcyApXG4gICAgICAgIGFWaWV3ZWUucGFpbnQoIHRoaXMucGFpbnRlciApO1xuICAgICAgICB0aGlzLnBhaW50ZXIucG9wU3RhdGUoKTtcbiAgICB9XG59XG4iLCJleHBvcnRcbmNsYXNzIFBvaW50IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoIGFYOiBudW1iZXIsIGFZOiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMueCA9IGFYO1xuICAgICAgICB0aGlzLnkgPSBhWTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLngsIHRoaXMueSApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgUmVjdCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICB3OiBudW1iZXI7XG4gICAgaDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoIGFYOiBudW1iZXIsIGFZOiBudW1iZXIsIGFXOiBudW1iZXIsIGFIOiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMueCA9IGFYO1xuICAgICAgICB0aGlzLnkgPSBhWTtcbiAgICAgICAgdGhpcy53ID0gYVc7XG4gICAgICAgIHRoaXMuaCA9IGFIO1xuICAgIH1cblxuICAgIGNsb25lKCk6IFJlY3Qge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3QoIHRoaXMueCwgdGhpcy55LCB0aGlzLncsIHRoaXMuaCApO1xuICAgIH1cblxuICAgIGdldExlZnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54IDogdGhpcy54ICsgdGhpcy53O1xuICAgIH1cblxuICAgIGdldFJpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLncgPj0gMCA/IHRoaXMueCArIHRoaXMudyA6IHRoaXMueDtcbiAgICB9XG5cbiAgICBnZXRUb3AoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55IDogdGhpcy55ICsgdGhpcy5oO1xuICAgIH1cblxuICAgIGdldEJvdHRvbSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgKyB0aGlzLmggOiB0aGlzLnk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdFRvcCgpOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIHRoaXMuZ2V0TGVmdCgpLCB0aGlzLmdldFRvcCgpICk7XG4gICAgfVxuXG4gICAgaW50ZXJzZWN0KCBhUmVjdDogUmVjdCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGlMZWZ0ICAgPSBNYXRoLm1heCggdGhpcy5nZXRMZWZ0KCksICAgYVJlY3QuZ2V0TGVmdCgpICAgKSxcbiAgICAgICAgICAgIGlUb3AgICAgPSBNYXRoLm1heCggdGhpcy5nZXRUb3AoKSwgICAgYVJlY3QuZ2V0VG9wKCkgICAgKSxcbiAgICAgICAgICAgIGlSaWdodCAgPSBNYXRoLm1pbiggdGhpcy5nZXRSaWdodCgpLCAgYVJlY3QuZ2V0UmlnaHQoKSAgKSxcbiAgICAgICAgICAgIGlCb3R0b20gPSBNYXRoLm1pbiggdGhpcy5nZXRCb3R0b20oKSwgYVJlY3QuZ2V0Qm90dG9tKCkgKTtcblxuICAgICAgICB0aGlzLnggPSBpTGVmdDtcbiAgICAgICAgdGhpcy55ID0gaVRvcDtcbiAgICAgICAgdGhpcy53ID0gaVJpZ2h0IC0gaUxlZnQ7XG4gICAgICAgIHRoaXMuaCA9IGlCb3R0b20gLSBpVG9wO1xuICAgIH1cblxuICAgIGlzT3ZlcmxhcHBpbmdXaXRoKCBhUmVjdDogUmVjdCApOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuZ2V0TGVmdCgpICA8PSBhUmVjdC5nZXRSaWdodCgpICYmXG4gICAgICAgICAgICBhUmVjdC5nZXRMZWZ0KCkgPD0gdGhpcy5nZXRSaWdodCgpICYmXG4gICAgICAgICAgICB0aGlzLmdldFRvcCgpICAgPD0gYVJlY3QuZ2V0Qm90dG9tKCkgJiZcbiAgICAgICAgICAgIGFSZWN0LmdldFRvcCgpICA8PSB0aGlzLmdldEJvdHRvbSgpXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBleHBhbmQoIGFQb2ludHM6IG51bWJlciApOiB2b2lkIHtcbiAgICAgICAgdmFyIGhTaWduID0gdGhpcy53ID49IDAgPyAtMSA6IDE7XG4gICAgICAgIHZhciB2U2lnbiA9IHRoaXMuaCA+PSAwID8gLTEgOiAxO1xuXG4gICAgICAgIHRoaXMueCArPSAgaFNpZ24gKiBhUG9pbnRzO1xuICAgICAgICB0aGlzLnkgKz0gIHZTaWduICogYVBvaW50cztcbiAgICAgICAgdGhpcy53ICs9IC1oU2lnbiAqIGFQb2ludHMgKiAyO1xuICAgICAgICB0aGlzLmggKz0gLXZTaWduICogYVBvaW50cyAqIDI7XG4gICAgfVxuXG4gICAgY29udHJhY3QoIGFQb2ludHM6IG51bWJlciApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5leHBhbmQoIC1hUG9pbnRzICk7XG4gICAgfVxuXG59XG4iLCIvKipcbiAqXG4gKiBBIHBhcnRpYWwgMkQgdHJhbnNmb3JtIG1hdHJpeC4gQ3VycmVudGx5IGRvZXNuJ3Qgc3VwcG9ydCByb3RhdGlvbiAoYW5kIGhlbmNlXG4gKiBza2V3KS5cbiAqL1xuXG5pbXBvcnQgeyBSZWN0IH0gIGZyb20gJy4vUmVjdCc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFRyYW5zZm9ybU1hdHJpeCB7XG4gICAgc2NhbGVYICAgIDogbnVtYmVyOyAvLyBhXG4gICAgc2NhbGVZICAgIDogbnVtYmVyOyAvLyBkXG4gICAgdHJhbnNsYXRlWDogbnVtYmVyOyAvLyBlIG9yIHR4XG4gICAgdHJhbnNsYXRlWTogbnVtYmVyOyAvLyBmIG9yIHR5XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZID0gMDtcbiAgICAgICAgdGhpcy5zY2FsZVggICAgID0gMTtcbiAgICAgICAgdGhpcy5zY2FsZVkgICAgID0gMTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogVHJhbnNmb3JtTWF0cml4IHtcbiAgICAgICAgdmFyIGlDbG9uZSA9IG5ldyBUcmFuc2Zvcm1NYXRyaXgoKTtcbiAgICAgICAgaUNsb25lLnRyYW5zbGF0ZVggPSB0aGlzLnRyYW5zbGF0ZVg7XG4gICAgICAgIGlDbG9uZS50cmFuc2xhdGVZID0gdGhpcy50cmFuc2xhdGVZO1xuICAgICAgICBpQ2xvbmUuc2NhbGVYID0gdGhpcy5zY2FsZVg7XG4gICAgICAgIGlDbG9uZS5zY2FsZVkgPSB0aGlzLnNjYWxlWTtcblxuICAgICAgICByZXR1cm4gaUNsb25lO1xuICAgIH1cblxuICAgIHRyYW5zbGF0ZSggYVRyYW5zbGF0aW9uOiBQb2ludCApIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVYICs9IGFUcmFuc2xhdGlvbi54ICogdGhpcy5zY2FsZVg7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWSArPSBhVHJhbnNsYXRpb24ueSAqIHRoaXMuc2NhbGVZO1xuICAgIH1cblxuICAgIHNjYWxlKCBhU2NhbGU6IFBvaW50ICkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggKj0gYVNjYWxlLng7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWSAqPSBhU2NhbGUueTtcblxuICAgICAgICB0aGlzLnNjYWxlWCAgICAgKj0gYVNjYWxlLng7XG4gICAgICAgIHRoaXMuc2NhbGVZICAgICAqPSBhU2NhbGUueTtcbiAgICB9XG5cbiAgICB0cmFuc2Zvcm1Qb2ludCggYVBvaW50OiBQb2ludCApIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgICAgICAgYVBvaW50LnggKiB0aGlzLnNjYWxlWCArIHRoaXMudHJhbnNsYXRlWCxcbiAgICAgICAgICAgIGFQb2ludC55ICogdGhpcy5zY2FsZVkgKyB0aGlzLnRyYW5zbGF0ZVlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBBIHRlbXBvcmFsIGhhY2suIFJlY3RzIHNob3VsZCByZWFsbHkgYmUgcmVwcmVzZW50ZWQgYXMgYSBwb2x5Z29uIHRvXG4gICAgLy8gc3VwcG9ydCByb3RhdGUsIGJ1dCB0aGlzIHdpbGwgZG8gZm9yIG5vdy5cbiAgICB0cmFuc2Zvcm1SZWN0KCBhUmVjdDogUmVjdCApIDogUmVjdCB7XG4gICAgICAgIHZhciBpTGVmdFRvcCAgICAgICAgICAgID0gYVJlY3QuZ2V0TGVmdFRvcCgpLFxuICAgICAgICAgICAgaVRyYW5zZm9ybWVkTGVmdFRvcCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoIGlMZWZ0VG9wICksXG5cbiAgICAgICAgICAgIGlUcmFuc2Zvcm1lZFJlY3QgPSBuZXcgUmVjdChcbiAgICAgICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wLngsXG4gICAgICAgICAgICAgICAgaVRyYW5zZm9ybWVkTGVmdFRvcC55LFxuICAgICAgICAgICAgICAgIGFSZWN0LncgKiB0aGlzLnNjYWxlWCxcbiAgICAgICAgICAgICAgICBhUmVjdC5oICogdGhpcy5zY2FsZVlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGlUcmFuc2Zvcm1lZFJlY3Q7XG4gICAgfVxuXG59XG4iLCJleHBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuZXhwb3J0IHsgUmVjdCB9IGZyb20gJy4vUmVjdCc7XG4iLCJpbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi9QYWludGVyJztcbmltcG9ydCB7IFJlY3QgfSBmcm9tICcuLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5jbGFzcyBDb250ZXh0UGFpbnRlciBleHRlbmRzIFBhaW50ZXIge1xuICAgIHByb3RlY3RlZCBjb250ZXh0OiAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3RydWN0b3IoIGFDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGFDb250ZXh0O1xuICAgIH1cblxuICAgIGRyYXdSZWN0YW5nbGUoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5yZWN0KCBhUmVjdC54LCBhUmVjdC55LCBhUmVjdC53LCBhUmVjdC5oICk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH1cblxuICAgIHRyYW5zbGF0ZSggeCwgeSApOiB2b2lkIHtcbiAgICAgICAgc3VwZXIudHJhbnNsYXRlKCB4LCB5ICk7XG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoIHgsIHkgKTtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICBzdXBlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0ICk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHNvbWUgZXh0cmEgbWFyZ2lucyB0byBhY2NvdW50IGZvciBhbnRpYWxpYXNpbmdcbiAgICAgICAgdmFyIGlSZWN0ID0gYVJlY3QuY2xvbmUoKTtcbiAgICAgICAgaVJlY3QuZXhwYW5kKCAxICk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZWN0KFxuICAgICAgICAgICAgaVJlY3QueCxcbiAgICAgICAgICAgIGlSZWN0LnksXG4gICAgICAgICAgICBpUmVjdC53LFxuICAgICAgICAgICAgaVJlY3QuaFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGlwKCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyAtIG5lZWRzIHRvIHB1c2ggdG8gc3RhY2tcbiAgICBwdXNoU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnB1c2hTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5wb3BTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxufSIsImltcG9ydCB7IFRyYW5zZm9ybU1hdHJpeCB9IGZyb20gJy4uL2dlb21ldHJ5L1RyYW5zZm9ybU1hdHJpeCc7XG5pbXBvcnQgeyBSZWN0IH0gICAgICAgICAgICBmcm9tICcuLi9nZW9tZXRyeS9SZWN0JztcbmltcG9ydCB7IFBvaW50IH0gICAgICAgICAgIGZyb20gJy4uL2dlb21ldHJ5L1BvaW50JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBQYWludGVyIHtcbiAgICBwcm90ZWN0ZWQgY2xpcEFyZWE6IFJlY3Q7XG4gICAgcHJvdGVjdGVkIG1hdHJpeDogICBUcmFuc2Zvcm1NYXRyaXg7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKTogdm9pZDtcblxuICAgIHRyYW5zbGF0ZSggeCwgeSApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tYXRyaXgudHJhbnNsYXRlKCBuZXcgUG9pbnQoIHgsIHkgKSApXG4gICAgfVxuXG4gICAgaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCBhUmVjdDogUmVjdCApOiB2b2lkIHtcbiAgICAgICAgLy8gT3VyIGNsaXBBcmVhIGlzIGluIGFic29sdXRlIGNvb3JkaW5hdGVzLCBzbyB3ZSBjb252ZXJ0IHRoZSByZWN0XG4gICAgICAgIC8vIHRvIGFic29sdXRlIG9uZXMuXG4gICAgICAgIHZhciBpQWJzb2x1dGVSZWN0ID0gdGhpcy50b0Fic29sdXRlUmVjdCggYVJlY3QgKTtcbiAgICAgICAgaWYgKCB0aGlzLmNsaXBBcmVhICkge1xuICAgICAgICAgICAgdGhpcy5jbGlwQXJlYS5pbnRlcnNlY3QoIGlBYnNvbHV0ZVJlY3QgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xpcEFyZWEgPSBpQWJzb2x1dGVSZWN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNSZWN0V2l0aGluQ2xpcEFyZWEoIGFSZWN0OiBSZWN0ICk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBDbGlwIGFyZWEgaXMgaW4gYWJzb2x1dGUgY29vcmRpbmF0ZXNcbiAgICAgICAgLy8gU28gd2UgY29udmVydCB0aGUgcmVjdCB0byBhYnNvbHV0ZSBvbmVzLlxuICAgICAgICB2YXIgaUFic29sdXRlUmVjdCA9IHRoaXMudG9BYnNvbHV0ZVJlY3QoIGFSZWN0ICk7XG4gICAgICAgIGlmICggdGhpcy5jbGlwQXJlYSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaXBBcmVhLmlzT3ZlcmxhcHBpbmdXaXRoKCBpQWJzb2x1dGVSZWN0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvQWJzb2x1dGVSZWN0KCBhUmVjdDogUmVjdCApOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0cml4LnRyYW5zZm9ybVJlY3QoIGFSZWN0ICk7XG4gICAgfVxuXG4gICAgcHVzaFN0YXRlKCk6IHZvaWQge1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCk6IHZvaWQge1xuICAgIH1cblxufVxuIiwiaW1wb3J0ICogYXMgZ2VvbWV0cnkgZnJvbSAnLi9nZW9tZXRyeS9nZW9tZXRyeS5ucyc7XG5leHBvcnQgeyBnZW9tZXRyeSB9O1xuXG5leHBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9Db250cm9sJztcbmV4cG9ydCB7IFJlY3RhbmdsZSB9IGZyb20gJy4vdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlJztcbiIsImltcG9ydCB7IENvbXBvc2l0ZSB9IGZyb20gJy4vLi4vLi4vY29yZS9Db21wb3NpdGUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgVmlld2VlIGV4dGVuZHMgQ29tcG9zaXRlPCBWaWV3ZWUgPiB7XG5cbiAgICBhYnN0cmFjdCBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIHBhaW50Q2hpbGRyZW4oIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBpZiAoIHRoaXMuaXNDaGlsZGxlc3MoKSApIHJldHVybjtcblxuICAgICAgICBhUGFpbnRlci5wdXNoU3RhdGUoKTtcblxuICAgICAgICB0aGlzLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoQ2hpbGQoIGZ1bmN0aW9uKCBhQ2hpbGQgKSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFpbnQoIGFQYWludGVyICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFQYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxuXG4gICAgYmVmb3JlQ2hpbGRyZW5QYWludGluZyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICAvLyBEb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC4gQ2hpbGRyZW4gd2lsbCBvdmVycmlkZS5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFNoYXBlIH0gICBmcm9tICcuL1NoYXBlJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuLy4uLy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgU2hhcGUge1xuICAgIHJlY3Q6IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVjdCA9IGFSZWN0O1xuICAgIH1cblxuICAgIHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGFQYWludGVyLmRyYXdSZWN0YW5nbGUoIHRoaXMucmVjdCApO1xuICAgIH1cblxuICAgIGdldFJlY3RCb3VuZHMoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgZnJvbSAnLi8uLi9WaWV3ZWUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gICAgZnJvbSAnLi8uLi8uLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTaGFwZSBleHRlbmRzIFZpZXdlZSB7XG5cbiAgICBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGlmICggdGhpcy5pc1dpdGhpbkNsaXBBcmVhKCBhUGFpbnRlciApICkge1xuICAgICAgICAgICAgdGhpcy5wYWludFNlbGYoIGFQYWludGVyIClcbiAgICAgICAgICAgIHRoaXMucGFpbnRDaGlsZHJlbiggYVBhaW50ZXIgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFic3RyYWN0IHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIGFic3RyYWN0IGdldFJlY3RCb3VuZHMoKTogUmVjdDtcblxuICAgIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBhUGFpbnRlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIHRoaXMuZ2V0UmVjdEJvdW5kcygpICk7XG4gICAgICAgIHN1cGVyLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICB2YXIgaUJvdW5kcyA9IHRoaXMuZ2V0UmVjdEJvdW5kcygpO1xuICAgICAgICBhUGFpbnRlci50cmFuc2xhdGUoIGlCb3VuZHMuZ2V0TGVmdCgpLCBpQm91bmRzLmdldFRvcCgpICk7XG4gICAgfVxuXG4gICAgaXNXaXRoaW5DbGlwQXJlYSggYVBhaW50ZXI6IFBhaW50ZXIgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBhUGFpbnRlci5pc1JlY3RXaXRoaW5DbGlwQXJlYSggdGhpcy5nZXRSZWN0Qm91bmRzKCkgKTtcbiAgICB9XG5cbn1cbiJdfQ==
