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

},{"./view/view.ns":11}],3:[function(require,module,exports){
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
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
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
    ContextPainter.prototype.scale = function (x, y) {
        _super.prototype.scale.call(this, x, y);
        this.context.scale(x, y);
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Stateful_1 = require('./Stateful');
var TransformMatrix_1 = require('../geometry/TransformMatrix');
var Point_1 = require('../geometry/Point');
var Painter = (function (_super) {
    __extends(Painter, _super);
    function Painter() {
        _super.call(this);
        this.matrix = new TransformMatrix_1.TransformMatrix();
    }
    Painter.prototype.translate = function (x, y) {
        this.matrix.translate(new Point_1.Point(x, y));
    };
    Painter.prototype.scale = function (x, y) {
        this.matrix.scale(new Point_1.Point(x, y));
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
    Painter.prototype.getState = function () {
        var iState = _super.prototype.getState.call(this);
        iState.matrix = this.matrix.clone();
        iState.clipArea = this.clipArea ? this.clipArea.clone() : undefined;
        return iState;
    };
    Painter.prototype.restoreState = function (aState) {
        this.matrix = aState.matrix;
        this.clipArea = aState.clipArea;
    };
    return Painter;
}(Stateful_1.Stateful));
exports.Painter = Painter;

},{"../geometry/Point":4,"../geometry/TransformMatrix":6,"./Stateful":10}],10:[function(require,module,exports){
"use strict";
var Stateful = (function () {
    function Stateful() {
        this.stateStack = [];
    }
    Stateful.prototype.pushState = function () {
        var iState = this.getState();
        this.stateStack.push(iState);
    };
    Stateful.prototype.popState = function () {
        var iState = this.stateStack.pop();
        this.restoreState(iState);
    };
    Stateful.prototype.getState = function () {
        return {};
    };
    return Stateful;
}());
exports.Stateful = Stateful;

},{}],11:[function(require,module,exports){
"use strict";
var geometry = require('./geometry/geometry.ns');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;
var Rectangle_1 = require('./viewees/shapes/Rectangle');
exports.Rectangle = Rectangle_1.Rectangle;
var Transformer_1 = require('./viewees/Transformer');
exports.Transformer = Transformer_1.Transformer;

},{"./Control":3,"./geometry/geometry.ns":7,"./viewees/Transformer":12,"./viewees/shapes/Rectangle":14}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Viewee_1 = require('./Viewee');
var Point_1 = require('./../geometry/Point');
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer() {
        _super.apply(this, arguments);
        this.translation = new Point_1.Point(0, 0);
        this.scale = new Point_1.Point(1, 1);
    }
    Transformer.prototype.paint = function (aPainter) {
        this.paintChildren(aPainter);
    };
    Transformer.prototype.setTranslate = function (x, y) {
        this.translation.set(x, y);
    };
    Transformer.prototype.setScale = function (x, y) {
        this.scale.set(x, y);
    };
    Transformer.prototype.applyTransformations = function (aPainter) {
        _super.prototype.applyTransformations.call(this, aPainter);
        aPainter.translate(this.translation.x, this.translation.y);
        aPainter.scale(this.scale.x, this.scale.y);
    };
    return Transformer;
}(Viewee_1.Viewee));
exports.Transformer = Transformer;

},{"./../geometry/Point":4,"./Viewee":13}],13:[function(require,module,exports){
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

},{"./../../core/Composite":1}],14:[function(require,module,exports){
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

},{"./Shape":15}],15:[function(require,module,exports){
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
        _super.prototype.applyTransformations.call(this, aPainter);
        var iBounds = this.getRectBounds();
        aPainter.translate(iBounds.getLeft(), iBounds.getTop());
    };
    Shape.prototype.isWithinClipArea = function (aPainter) {
        return aPainter.isRectWithinClipArea(this.getRectBounds());
    };
    return Shape;
}(Viewee_1.Viewee));
exports.Shape = Shape;

},{"./../Viewee":13}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9Db250ZXh0UGFpbnRlci50cyIsInNyYy92aWV3L3BhaW50ZXJzL1BhaW50ZXIudHMiLCJzcmMvdmlldy9wYWludGVycy9TdGF0ZWZ1bC50cyIsInNyYy92aWV3L3ZpZXcubnMudHMiLCJzcmMvdmlldy92aWV3ZWVzL1RyYW5zZm9ybWVyLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9WaWV3ZWUudHMiLCJzcmMvdmlldy92aWV3ZWVzL3NoYXBlcy9SZWN0YW5nbGUudHMiLCJzcmMvdmlldy92aWV3ZWVzL3NoYXBlcy9TaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtJQUtJO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBSyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQU1ELDRCQUFRLEdBQVIsVUFBVSxNQUFNO1FBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELCtCQUFXLEdBQVg7UUFBYSxjQUFZO2FBQVosV0FBWSxDQUFaLHNCQUFZLENBQVosSUFBWTtZQUFaLDZCQUFZOztRQUNyQixHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxN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QUFELENBN0JBLEFBNkJDLENBNUI0QixlQUFNLEdBNEJsQztBQTVCYyxhQUFLLFFBNEJuQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydFxuY2xhc3MgQ29tcG9zaXRlPCBUID4ge1xuICAgIHByaXZhdGUgY2hpbGRyZW46IFRbXTtcbiAgICBwcml2YXRlIHBhcmVudCA6ICBUO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgICA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBBZGRpbmcgYW5kIHJlbW92aW5nXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGFkZENoaWxkKCBhQ2hpbGQgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggYUNoaWxkICk7XG4gICAgICAgIGFDaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgIH1cblxuICAgIGFkZENoaWxkcmVuKCAuLi5hcmdzOiBUW10gKTogdm9pZCB7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCggYXJndW1lbnRzW2ldICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDaGlsZCggYUNoaWxkICk6IHZvaWQge1xuICAgICAgICB2YXIgaUNoaWxkSW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoIGFDaGlsZCApO1xuXG4gICAgICAgIGlmICggaUNoaWxkSW5kZXggPT09IC0xICkge1xuICAgICAgICAgICAgdGhyb3cgXCJDb3VsZCBub3QgZmluZCByZXF1ZXN0ZWQgY2hpbGRcIlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYUNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSggaUNoaWxkSW5kZXgsIDEgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogVXRpbGl0eVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmb3JFYWNoQ2hpbGQoIGFDYWxsYmFjayApOiB2b2lkIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGFDYWxsYmFjayggdGhpcy5jaGlsZHJlbltpXSwgaSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNDaGlsZGxlc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICBoYXNQYXJlbnQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudCAhPSBudWxsO1xuICAgIH1cblxufSIsImltcG9ydCAqIGFzIHZpZXcgZnJvbSAnLi92aWV3L3ZpZXcubnMnO1xuZXhwb3J0IHt2aWV3fTtcbiIsImltcG9ydCB7IFZpZXdlZSB9ICBmcm9tICcuL3ZpZXdlZXMvVmlld2VlJztcbmltcG9ydCB7IENvbnRleHRQYWludGVyIH0gZnJvbSAnLi9wYWludGVycy9Db250ZXh0UGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gICAgZnJvbSAnLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5jbGFzcyBDb250cm9sIHtcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXM6ICAgIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY29udGV4dDogICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSBwYWludGVyOiAgIENvbnRleHRQYWludGVyO1xuICAgIHByaXZhdGUgYm91bmRzOiAgICBSZWN0O1xuXG4gICAgY29uc3RydWN0b3IoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGFDb250YWluZXI7XG4gICAgICAgIHRoaXMuYm91bmRzICAgID0gbmV3IFJlY3QoIDAsIDAsIGFDb250YWluZXIub2Zmc2V0V2lkdGgsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0ICk7XG4gICAgICAgIHRoaXMuY2FudmFzICAgID0gdGhpcy5jcmVhdGVDYW52YXMoIGFDb250YWluZXIgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ICAgPSB0aGlzLmdldENvbnRleHQoIHRoaXMuY2FudmFzICk7XG4gICAgICAgIHRoaXMucGFpbnRlciAgID0gbmV3IENvbnRleHRQYWludGVyKCB0aGlzLmNvbnRleHQgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAgICAgdmFyIGlDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdDQU5WQVMnICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCAgYUNvbnRhaW5lci5vZmZzZXRXaWR0aC50b1N0cmluZygpICApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ2hlaWdodCcsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0LnRvU3RyaW5nKCkgKTtcbiAgICAgICAgYUNvbnRhaW5lci5hcHBlbmRDaGlsZCggaUNhbnZhcyApO1xuICAgICAgICByZXR1cm4gaUNhbnZhcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbnRleHQoIGFDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ICk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XG4gICAgICAgIHZhciBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XG4gICAgICAgIC8vIGNvbnRleHQudHJhbnNsYXRlKCAwLjUsIDAuNSApOyAvLyBQcmV2ZW50cyBhbnRpYWxpYXNpbmcgZWZmZWN0LlxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMUFCQzlDJztcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbnRlbnRzKCBhVmlld2VlOiBWaWV3ZWUgKSB7XG4gICAgICAgIHRoaXMucGFpbnRlci5wdXNoU3RhdGUoKTtcbiAgICAgICAgdGhpcy5wYWludGVyLmludGVyc2VjdENsaXBBcmVhV2l0aCggdGhpcy5ib3VuZHMgKVxuICAgICAgICBhVmlld2VlLnBhaW50KCB0aGlzLnBhaW50ZXIgKTtcbiAgICAgICAgdGhpcy5wYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0XG5jbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCB4OiBudW1iZXIsIHk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLngsIHRoaXMueSApO1xuICAgIH1cblxuICAgIHNldCggeDogbnVtYmVyLCB5OiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBSZWN0IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIHc6IG51bWJlcjtcbiAgICBoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciwgYVc6IG51bWJlciwgYUg6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgICAgICB0aGlzLncgPSBhVztcbiAgICAgICAgdGhpcy5oID0gYUg7XG4gICAgfVxuXG4gICAgY2xvbmUoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCggdGhpcy54LCB0aGlzLnksIHRoaXMudywgdGhpcy5oICk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggOiB0aGlzLnggKyB0aGlzLnc7XG4gICAgfVxuXG4gICAgZ2V0UmlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54ICsgdGhpcy53IDogdGhpcy54O1xuICAgIH1cblxuICAgIGdldFRvcCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgOiB0aGlzLnkgKyB0aGlzLmg7XG4gICAgfVxuXG4gICAgZ2V0Qm90dG9tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSArIHRoaXMuaCA6IHRoaXMueTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0VG9wKCk6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy5nZXRMZWZ0KCksIHRoaXMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3QoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICB2YXIgaUxlZnQgICA9IE1hdGgubWF4KCB0aGlzLmdldExlZnQoKSwgICBhUmVjdC5nZXRMZWZ0KCkgICApLFxuICAgICAgICAgICAgaVRvcCAgICA9IE1hdGgubWF4KCB0aGlzLmdldFRvcCgpLCAgICBhUmVjdC5nZXRUb3AoKSAgICApLFxuICAgICAgICAgICAgaVJpZ2h0ICA9IE1hdGgubWluKCB0aGlzLmdldFJpZ2h0KCksICBhUmVjdC5nZXRSaWdodCgpICApLFxuICAgICAgICAgICAgaUJvdHRvbSA9IE1hdGgubWluKCB0aGlzLmdldEJvdHRvbSgpLCBhUmVjdC5nZXRCb3R0b20oKSApO1xuXG4gICAgICAgIHRoaXMueCA9IGlMZWZ0O1xuICAgICAgICB0aGlzLnkgPSBpVG9wO1xuICAgICAgICB0aGlzLncgPSBpUmlnaHQgLSBpTGVmdDtcbiAgICAgICAgdGhpcy5oID0gaUJvdHRvbSAtIGlUb3A7XG4gICAgfVxuXG4gICAgaXNPdmVybGFwcGluZ1dpdGgoIGFSZWN0OiBSZWN0ICk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5nZXRMZWZ0KCkgIDw9IGFSZWN0LmdldFJpZ2h0KCkgJiZcbiAgICAgICAgICAgIGFSZWN0LmdldExlZnQoKSA8PSB0aGlzLmdldFJpZ2h0KCkgJiZcbiAgICAgICAgICAgIHRoaXMuZ2V0VG9wKCkgICA8PSBhUmVjdC5nZXRCb3R0b20oKSAmJlxuICAgICAgICAgICAgYVJlY3QuZ2V0VG9wKCkgIDw9IHRoaXMuZ2V0Qm90dG9tKClcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGV4cGFuZCggYVBvaW50czogbnVtYmVyICk6IHZvaWQge1xuICAgICAgICB2YXIgaFNpZ24gPSB0aGlzLncgPj0gMCA/IC0xIDogMTtcbiAgICAgICAgdmFyIHZTaWduID0gdGhpcy5oID49IDAgPyAtMSA6IDE7XG5cbiAgICAgICAgdGhpcy54ICs9ICBoU2lnbiAqIGFQb2ludHM7XG4gICAgICAgIHRoaXMueSArPSAgdlNpZ24gKiBhUG9pbnRzO1xuICAgICAgICB0aGlzLncgKz0gLWhTaWduICogYVBvaW50cyAqIDI7XG4gICAgICAgIHRoaXMuaCArPSAtdlNpZ24gKiBhUG9pbnRzICogMjtcbiAgICB9XG5cbiAgICBjb250cmFjdCggYVBvaW50czogbnVtYmVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLmV4cGFuZCggLWFQb2ludHMgKTtcbiAgICB9XG5cbn1cbiIsIi8qKlxuICpcbiAqIEEgcGFydGlhbCAyRCB0cmFuc2Zvcm0gbWF0cml4LiBDdXJyZW50bHkgZG9lc24ndCBzdXBwb3J0IHJvdGF0aW9uIChhbmQgaGVuY2VcbiAqIHNrZXcpLlxuICovXG5cbmltcG9ydCB7IFJlY3QgfSAgZnJvbSAnLi9SZWN0JztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgVHJhbnNmb3JtTWF0cml4IHtcbiAgICBzY2FsZVggICAgOiBudW1iZXI7IC8vIGFcbiAgICBzY2FsZVkgICAgOiBudW1iZXI7IC8vIGRcbiAgICB0cmFuc2xhdGVYOiBudW1iZXI7IC8vIGUgb3IgdHhcbiAgICB0cmFuc2xhdGVZOiBudW1iZXI7IC8vIGYgb3IgdHlcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggPSAwO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICB0aGlzLnNjYWxlWCAgICAgPSAxO1xuICAgICAgICB0aGlzLnNjYWxlWSAgICAgPSAxO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBUcmFuc2Zvcm1NYXRyaXgge1xuICAgICAgICB2YXIgaUNsb25lID0gbmV3IFRyYW5zZm9ybU1hdHJpeCgpO1xuICAgICAgICBpQ2xvbmUudHJhbnNsYXRlWCA9IHRoaXMudHJhbnNsYXRlWDtcbiAgICAgICAgaUNsb25lLnRyYW5zbGF0ZVkgPSB0aGlzLnRyYW5zbGF0ZVk7XG4gICAgICAgIGlDbG9uZS5zY2FsZVggPSB0aGlzLnNjYWxlWDtcbiAgICAgICAgaUNsb25lLnNjYWxlWSA9IHRoaXMuc2NhbGVZO1xuXG4gICAgICAgIHJldHVybiBpQ2xvbmU7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCBhVHJhbnNsYXRpb246IFBvaW50ICkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggKz0gYVRyYW5zbGF0aW9uLnggKiB0aGlzLnNjYWxlWDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZICs9IGFUcmFuc2xhdGlvbi55ICogdGhpcy5zY2FsZVk7XG4gICAgfVxuXG4gICAgc2NhbGUoIGFTY2FsZTogUG9pbnQgKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCAqPSBhU2NhbGUueDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZICo9IGFTY2FsZS55O1xuXG4gICAgICAgIHRoaXMuc2NhbGVYICAgICAqPSBhU2NhbGUueDtcbiAgICAgICAgdGhpcy5zY2FsZVkgICAgICo9IGFTY2FsZS55O1xuICAgIH1cblxuICAgIHRyYW5zZm9ybVBvaW50KCBhUG9pbnQ6IFBvaW50ICkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICAgICAgICBhUG9pbnQueCAqIHRoaXMuc2NhbGVYICsgdGhpcy50cmFuc2xhdGVYLFxuICAgICAgICAgICAgYVBvaW50LnkgKiB0aGlzLnNjYWxlWSArIHRoaXMudHJhbnNsYXRlWVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIEEgdGVtcG9yYWwgaGFjay4gUmVjdHMgc2hvdWxkIHJlYWxseSBiZSByZXByZXNlbnRlZCBhcyBhIHBvbHlnb24gdG9cbiAgICAvLyBzdXBwb3J0IHJvdGF0ZSwgYnV0IHRoaXMgd2lsbCBkbyBmb3Igbm93LlxuICAgIHRyYW5zZm9ybVJlY3QoIGFSZWN0OiBSZWN0ICkgOiBSZWN0IHtcbiAgICAgICAgdmFyIGlMZWZ0VG9wICAgICAgICAgICAgPSBhUmVjdC5nZXRMZWZ0VG9wKCksXG4gICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wID0gdGhpcy50cmFuc2Zvcm1Qb2ludCggaUxlZnRUb3AgKSxcblxuICAgICAgICAgICAgaVRyYW5zZm9ybWVkUmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AueCxcbiAgICAgICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wLnksXG4gICAgICAgICAgICAgICAgYVJlY3QudyAqIHRoaXMuc2NhbGVYLFxuICAgICAgICAgICAgICAgIGFSZWN0LmggKiB0aGlzLnNjYWxlWVxuICAgICAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gaVRyYW5zZm9ybWVkUmVjdDtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5leHBvcnQgeyBSZWN0IH0gZnJvbSAnLi9SZWN0JztcbiIsImltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuL1BhaW50ZXInO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4uL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmNsYXNzIENvbnRleHRQYWludGVyIGV4dGVuZHMgUGFpbnRlciB7XG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6ICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gYUNvbnRleHQ7XG4gICAgfVxuXG4gICAgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnJlY3QoIGFSZWN0LngsIGFSZWN0LnksIGFSZWN0LncsIGFSZWN0LmggKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICBzdXBlci50cmFuc2xhdGUoIHgsIHkgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggeCwgeSApO1xuICAgIH1cblxuICAgIHNjYWxlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICBzdXBlci5zY2FsZSggeCwgeSApO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2NhbGUoIHgsIHkgKTtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICBzdXBlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0ICk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHNvbWUgZXh0cmEgbWFyZ2lucyB0byBhY2NvdW50IGZvciBhbnRpYWxpYXNpbmdcbiAgICAgICAgdmFyIGlSZWN0ID0gYVJlY3QuY2xvbmUoKTtcbiAgICAgICAgaVJlY3QuZXhwYW5kKCAxICk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZWN0KFxuICAgICAgICAgICAgaVJlY3QueCxcbiAgICAgICAgICAgIGlSZWN0LnksXG4gICAgICAgICAgICBpUmVjdC53LFxuICAgICAgICAgICAgaVJlY3QuaFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGlwKCk7XG4gICAgfVxuXG4gICAgcHVzaFN0YXRlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5wdXNoU3RhdGUoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICB9XG5cbiAgICBwb3BTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIucG9wU3RhdGUoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBTdGF0ZWZ1bCB9ICAgICAgICBmcm9tICcuL1N0YXRlZnVsJztcbmltcG9ydCB7IFRyYW5zZm9ybU1hdHJpeCB9IGZyb20gJy4uL2dlb21ldHJ5L1RyYW5zZm9ybU1hdHJpeCc7XG5pbXBvcnQgeyBSZWN0IH0gICAgICAgICAgICBmcm9tICcuLi9nZW9tZXRyeS9SZWN0JztcbmltcG9ydCB7IFBvaW50IH0gICAgICAgICAgIGZyb20gJy4uL2dlb21ldHJ5L1BvaW50JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBQYWludGVyIGV4dGVuZHMgU3RhdGVmdWwge1xuICAgIHByb3RlY3RlZCBjbGlwQXJlYTogUmVjdDtcbiAgICBwcm90ZWN0ZWQgbWF0cml4OiAgIFRyYW5zZm9ybU1hdHJpeDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBUcmFuc2Zvcm1NYXRyaXgoKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBkcmF3UmVjdGFuZ2xlKCBhUmVjdDogUmVjdCApOiB2b2lkO1xuXG4gICAgdHJhbnNsYXRlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICB0aGlzLm1hdHJpeC50cmFuc2xhdGUoIG5ldyBQb2ludCggeCwgeSApIClcbiAgICB9XG5cbiAgICBzY2FsZSggeCwgeSApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tYXRyaXguc2NhbGUoIG5ldyBQb2ludCggeCwgeSApIClcbiAgICB9XG5cbiAgICBpbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICAvLyBPdXIgY2xpcEFyZWEgaXMgaW4gYWJzb2x1dGUgY29vcmRpbmF0ZXMsIHNvIHdlIGNvbnZlcnQgdGhlIHJlY3RcbiAgICAgICAgLy8gdG8gYWJzb2x1dGUgb25lcy5cbiAgICAgICAgdmFyIGlBYnNvbHV0ZVJlY3QgPSB0aGlzLnRvQWJzb2x1dGVSZWN0KCBhUmVjdCApO1xuICAgICAgICBpZiAoIHRoaXMuY2xpcEFyZWEgKSB7XG4gICAgICAgICAgICB0aGlzLmNsaXBBcmVhLmludGVyc2VjdCggaUFic29sdXRlUmVjdCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbGlwQXJlYSA9IGlBYnNvbHV0ZVJlY3Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1JlY3RXaXRoaW5DbGlwQXJlYSggYVJlY3Q6IFJlY3QgKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENsaXAgYXJlYSBpcyBpbiBhYnNvbHV0ZSBjb29yZGluYXRlc1xuICAgICAgICAvLyBTbyB3ZSBjb252ZXJ0IHRoZSByZWN0IHRvIGFic29sdXRlIG9uZXMuXG4gICAgICAgIHZhciBpQWJzb2x1dGVSZWN0ID0gdGhpcy50b0Fic29sdXRlUmVjdCggYVJlY3QgKTtcbiAgICAgICAgaWYgKCB0aGlzLmNsaXBBcmVhICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpcEFyZWEuaXNPdmVybGFwcGluZ1dpdGgoIGlBYnNvbHV0ZVJlY3QgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9BYnNvbHV0ZVJlY3QoIGFSZWN0OiBSZWN0ICk6IFJlY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRyaXgudHJhbnNmb3JtUmVjdCggYVJlY3QgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKSA6IGFueSB7XG4gICAgICAgIHZhciBpU3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xuICAgICAgICBpU3RhdGUubWF0cml4ICAgPSB0aGlzLm1hdHJpeC5jbG9uZSgpO1xuICAgICAgICBpU3RhdGUuY2xpcEFyZWEgPSB0aGlzLmNsaXBBcmVhID8gdGhpcy5jbGlwQXJlYS5jbG9uZSgpIDogdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gaVN0YXRlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXN0b3JlU3RhdGUoIGFTdGF0ZTogYW55ICkge1xuICAgICAgICB0aGlzLm1hdHJpeCAgID0gYVN0YXRlLm1hdHJpeDtcbiAgICAgICAgdGhpcy5jbGlwQXJlYSA9IGFTdGF0ZS5jbGlwQXJlYTtcbiAgICB9XG5cbn1cbiIsImV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgU3RhdGVmdWwge1xuICAgIHByb3RlY3RlZCBzdGF0ZVN0YWNrOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlU3RhY2sgPSBbXTtcbiAgICB9XG5cbiAgICBwdXNoU3RhdGUoKSB7XG4gICAgICAgIHZhciBpU3RhdGUgPSB0aGlzLmdldFN0YXRlKCk7XG4gICAgICAgIHRoaXMuc3RhdGVTdGFjay5wdXNoKCBpU3RhdGUgKTtcbiAgICB9XG5cbiAgICBwb3BTdGF0ZSgpIHtcbiAgICAgICAgdmFyIGlTdGF0ZSA9IHRoaXMuc3RhdGVTdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5yZXN0b3JlU3RhdGUoIGlTdGF0ZSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpIDogYW55IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZXN0b3JlU3RhdGUoIGFTdGF0ZTogYW55ICk7XG5cbn1cbiIsImltcG9ydCAqIGFzIGdlb21ldHJ5IGZyb20gJy4vZ2VvbWV0cnkvZ2VvbWV0cnkubnMnO1xuZXhwb3J0IHsgZ2VvbWV0cnkgfTtcblxuZXhwb3J0IHsgQ29udHJvbCB9IGZyb20gJy4vQ29udHJvbCc7XG5leHBvcnQgeyBSZWN0YW5nbGUgfSBmcm9tICcuL3ZpZXdlZXMvc2hhcGVzL1JlY3RhbmdsZSc7XG5leHBvcnQgeyBUcmFuc2Zvcm1lciB9IGZyb20gJy4vdmlld2Vlcy9UcmFuc2Zvcm1lcic7XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgZnJvbSAnLi9WaWV3ZWUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5pbXBvcnQgeyBQb2ludCB9ICAgZnJvbSAnLi8uLi9nZW9tZXRyeS9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgVHJhbnNmb3JtZXIgZXh0ZW5kcyBWaWV3ZWUge1xuXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvbjogUG9pbnQgPSBuZXcgUG9pbnQoIDAsIDAgKTtcbiAgICBwcml2YXRlIHNjYWxlOiBQb2ludCAgICAgICA9IG5ldyBQb2ludCggMSwgMSApO1xuXG4gICAgcGFpbnQoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhaW50Q2hpbGRyZW4oIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgc2V0VHJhbnNsYXRlKCB4OiBudW1iZXIsIHk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbi5zZXQoIHgsIHkgKTtcbiAgICB9XG5cbiAgICBzZXRTY2FsZSggeDogbnVtYmVyLCB5OiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0KCB4LCB5ICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG4gICAgICAgIGFQYWludGVyLnRyYW5zbGF0ZSggdGhpcy50cmFuc2xhdGlvbi54LCB0aGlzLnRyYW5zbGF0aW9uLnkgKTtcbiAgICAgICAgYVBhaW50ZXIuc2NhbGUoIHRoaXMuc2NhbGUueCwgdGhpcy5zY2FsZS55ICk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGUgfSBmcm9tICcuLy4uLy4uL2NvcmUvQ29tcG9zaXRlJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFZpZXdlZSBleHRlbmRzIENvbXBvc2l0ZTwgVmlld2VlID4ge1xuXG4gICAgYWJzdHJhY3QgcGFpbnQoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgcGFpbnRDaGlsZHJlbiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGlmICggdGhpcy5pc0NoaWxkbGVzcygpICkgcmV0dXJuO1xuXG4gICAgICAgIGFQYWludGVyLnB1c2hTdGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuYmVmb3JlQ2hpbGRyZW5QYWludGluZyggYVBhaW50ZXIgKTtcblxuICAgICAgICB0aGlzLmZvckVhY2hDaGlsZCggZnVuY3Rpb24oIGFDaGlsZCApIHtcbiAgICAgICAgICAgIGFDaGlsZC5wYWludCggYVBhaW50ZXIgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYVBhaW50ZXIucG9wU3RhdGUoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYmVmb3JlQ2hpbGRyZW5QYWludGluZyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgLy8gRG9lcyBub3RoaW5nIGJ5IGRlZmF1bHQuIENoaWxkcmVuIHdpbGwgb3ZlcnJpZGUuXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBTaGFwZSB9ICAgZnJvbSAnLi9TaGFwZSc7XG5pbXBvcnQgeyBSZWN0IH0gICAgZnJvbSAnLi8uLi8uLi9nZW9tZXRyeS9SZWN0JztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLy4uLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuXG5leHBvcnRcbmNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIFNoYXBlIHtcbiAgICBwcml2YXRlIHJlY3Q6IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVjdCA9IGFSZWN0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYWludFNlbGYoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBhUGFpbnRlci5kcmF3UmVjdGFuZ2xlKCB0aGlzLnJlY3QgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0UmVjdEJvdW5kcygpOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZpZXdlZSB9ICBmcm9tICcuLy4uL1ZpZXdlZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi8uLi9wYWludGVycy9QYWludGVyJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuLy4uLy4uL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFNoYXBlIGV4dGVuZHMgVmlld2VlIHtcblxuICAgIHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgaWYgKCB0aGlzLmlzV2l0aGluQ2xpcEFyZWEoIGFQYWludGVyICkgKSB7XG4gICAgICAgICAgICB0aGlzLnBhaW50U2VsZiggYVBhaW50ZXIgKVxuICAgICAgICAgICAgdGhpcy5wYWludENoaWxkcmVuKCBhUGFpbnRlciApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRSZWN0Qm91bmRzKCk6IFJlY3Q7XG5cbiAgICBwcm90ZWN0ZWQgYmVmb3JlQ2hpbGRyZW5QYWludGluZyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGFQYWludGVyLmludGVyc2VjdENsaXBBcmVhV2l0aCggdGhpcy5nZXRSZWN0Qm91bmRzKCkgKTtcbiAgICAgICAgc3VwZXIuYmVmb3JlQ2hpbGRyZW5QYWludGluZyggYVBhaW50ZXIgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBzdXBlci5hcHBseVRyYW5zZm9ybWF0aW9ucyggYVBhaW50ZXIgKTtcbiAgICAgICAgdmFyIGlCb3VuZHMgPSB0aGlzLmdldFJlY3RCb3VuZHMoKTtcbiAgICAgICAgYVBhaW50ZXIudHJhbnNsYXRlKCBpQm91bmRzLmdldExlZnQoKSwgaUJvdW5kcy5nZXRUb3AoKSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc1dpdGhpbkNsaXBBcmVhKCBhUGFpbnRlcjogUGFpbnRlciApOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGFQYWludGVyLmlzUmVjdFdpdGhpbkNsaXBBcmVhKCB0aGlzLmdldFJlY3RCb3VuZHMoKSApO1xuICAgIH1cblxufVxuIl19
