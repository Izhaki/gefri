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

},{"./Control":3,"./geometry/geometry.ns":7,"./viewees/shapes/Rectangle":13}],12:[function(require,module,exports){
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

},{"./../../core/Composite":1}],13:[function(require,module,exports){
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

},{"./Shape":14}],14:[function(require,module,exports){
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

},{"./../Viewee":12}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9Db250ZXh0UGFpbnRlci50cyIsInNyYy92aWV3L3BhaW50ZXJzL1BhaW50ZXIudHMiLCJzcmMvdmlldy9wYWludGVycy9TdGF0ZWZ1bC50cyIsInNyYy92aWV3L3ZpZXcubnMudHMiLCJzcmMvdmlldy92aWV3ZWVzL1ZpZXdlZS50cyIsInNyYy92aWV3L3ZpZXdlZXMvc2hhcGVzL1JlY3RhbmdsZS50cyIsInNyYy92aWV3L3ZpZXdlZXMvc2hhcGVzL1NoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0lBS0k7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFLLElBQUksQ0FBQztJQUN6QixDQUFDO0lBTUQsNEJBQVEsR0FBUixVQUFVLE1BQU07UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsK0JBQVcsR0FBWDtRQUFhLGNBQVk7YUFBWixXQUFZLENBQVosc0JBQVksQ0FBWixJQUFZO1lBQVosNkJBQVk7O1FBQ3JCLEdBQUcsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pD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QyxVQUFrQyxRQUFpQjtRQUMvQyxRQUFRLENBQUMscUJBQXFCLENBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFFLENBQUM7UUFDdkQsZ0JBQUssQ0FBQyxzQkFBc0IsWUFBRSxRQUFRLENBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRVMsb0NBQW9CLEdBQTlCLFVBQWdDLFFBQWlCO1FBQzdDLGdCQUFLLENBQUMsb0JBQW9CLFlBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25DLFFBQVEsQ0FBQyxTQUFTLENBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBRSxDQUFDO0lBQzlELENBQUM7SUFFUyxnQ0FBZ0IsR0FBMUIsVUFBNEIsUUFBaUI7UUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUwsWUFBQztBQUFELENBN0JBLEFBNkJDLENBNUI0QixlQUFNLEdBNEJsQztBQTVCYyxhQUFLLFFBNEJuQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydFxuY2xhc3MgQ29tcG9zaXRlPCBUID4ge1xuICAgIHByaXZhdGUgY2hpbGRyZW46IFRbXTtcbiAgICBwcml2YXRlIHBhcmVudCA6ICBUO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgICA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBBZGRpbmcgYW5kIHJlbW92aW5nXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGFkZENoaWxkKCBhQ2hpbGQgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggYUNoaWxkICk7XG4gICAgICAgIGFDaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgIH1cblxuICAgIGFkZENoaWxkcmVuKCAuLi5hcmdzOiBUW10gKTogdm9pZCB7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCggYXJndW1lbnRzW2ldICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDaGlsZCggYUNoaWxkICk6IHZvaWQge1xuICAgICAgICB2YXIgaUNoaWxkSW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoIGFDaGlsZCApO1xuXG4gICAgICAgIGlmICggaUNoaWxkSW5kZXggPT09IC0xICkge1xuICAgICAgICAgICAgdGhyb3cgXCJDb3VsZCBub3QgZmluZCByZXF1ZXN0ZWQgY2hpbGRcIlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYUNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSggaUNoaWxkSW5kZXgsIDEgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogVXRpbGl0eVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmb3JFYWNoQ2hpbGQoIGFDYWxsYmFjayApOiB2b2lkIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGFDYWxsYmFjayggdGhpcy5jaGlsZHJlbltpXSwgaSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNDaGlsZGxlc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICBoYXNQYXJlbnQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudCAhPSBudWxsO1xuICAgIH1cblxufSIsImltcG9ydCAqIGFzIHZpZXcgZnJvbSAnLi92aWV3L3ZpZXcubnMnO1xuZXhwb3J0IHt2aWV3fTtcbiIsImltcG9ydCB7IFZpZXdlZSB9ICBmcm9tICcuL3ZpZXdlZXMvVmlld2VlJztcbmltcG9ydCB7IENvbnRleHRQYWludGVyIH0gZnJvbSAnLi9wYWludGVycy9Db250ZXh0UGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gICAgZnJvbSAnLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5jbGFzcyBDb250cm9sIHtcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXM6ICAgIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY29udGV4dDogICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSBwYWludGVyOiAgIENvbnRleHRQYWludGVyO1xuICAgIHByaXZhdGUgYm91bmRzOiAgICBSZWN0O1xuXG4gICAgY29uc3RydWN0b3IoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGFDb250YWluZXI7XG4gICAgICAgIHRoaXMuYm91bmRzICAgID0gbmV3IFJlY3QoIDAsIDAsIGFDb250YWluZXIub2Zmc2V0V2lkdGgsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0ICk7XG4gICAgICAgIHRoaXMuY2FudmFzICAgID0gdGhpcy5jcmVhdGVDYW52YXMoIGFDb250YWluZXIgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ICAgPSB0aGlzLmdldENvbnRleHQoIHRoaXMuY2FudmFzICk7XG4gICAgICAgIHRoaXMucGFpbnRlciAgID0gbmV3IENvbnRleHRQYWludGVyKCB0aGlzLmNvbnRleHQgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSA6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAgICAgdmFyIGlDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdDQU5WQVMnICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCAgYUNvbnRhaW5lci5vZmZzZXRXaWR0aC50b1N0cmluZygpICApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ2hlaWdodCcsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0LnRvU3RyaW5nKCkgKTtcbiAgICAgICAgYUNvbnRhaW5lci5hcHBlbmRDaGlsZCggaUNhbnZhcyApO1xuICAgICAgICByZXR1cm4gaUNhbnZhcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbnRleHQoIGFDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ICk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XG4gICAgICAgIHZhciBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XG4gICAgICAgIC8vIGNvbnRleHQudHJhbnNsYXRlKCAwLjUsIDAuNSApOyAvLyBQcmV2ZW50cyBhbnRpYWxpYXNpbmcgZWZmZWN0LlxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMUFCQzlDJztcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbnRlbnRzKCBhVmlld2VlOiBWaWV3ZWUgKSB7XG4gICAgICAgIHRoaXMucGFpbnRlci5wdXNoU3RhdGUoKTtcbiAgICAgICAgdGhpcy5wYWludGVyLmludGVyc2VjdENsaXBBcmVhV2l0aCggdGhpcy5ib3VuZHMgKVxuICAgICAgICBhVmlld2VlLnBhaW50KCB0aGlzLnBhaW50ZXIgKTtcbiAgICAgICAgdGhpcy5wYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0XG5jbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy54LCB0aGlzLnkgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFJlY3Qge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgdzogbnVtYmVyO1xuICAgIGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyLCBhVzogbnVtYmVyLCBhSDogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgICAgIHRoaXMudyA9IGFXO1xuICAgICAgICB0aGlzLmggPSBhSDtcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0KCB0aGlzLngsIHRoaXMueSwgdGhpcy53LCB0aGlzLmggKTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLncgPj0gMCA/IHRoaXMueCA6IHRoaXMueCArIHRoaXMudztcbiAgICB9XG5cbiAgICBnZXRSaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggKyB0aGlzLncgOiB0aGlzLng7XG4gICAgfVxuXG4gICAgZ2V0VG9wKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSA6IHRoaXMueSArIHRoaXMuaDtcbiAgICB9XG5cbiAgICBnZXRCb3R0b20oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55ICsgdGhpcy5oIDogdGhpcy55O1xuICAgIH1cblxuICAgIGdldExlZnRUb3AoKTogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLmdldExlZnQoKSwgdGhpcy5nZXRUb3AoKSApO1xuICAgIH1cblxuICAgIGludGVyc2VjdCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHZhciBpTGVmdCAgID0gTWF0aC5tYXgoIHRoaXMuZ2V0TGVmdCgpLCAgIGFSZWN0LmdldExlZnQoKSAgICksXG4gICAgICAgICAgICBpVG9wICAgID0gTWF0aC5tYXgoIHRoaXMuZ2V0VG9wKCksICAgIGFSZWN0LmdldFRvcCgpICAgICksXG4gICAgICAgICAgICBpUmlnaHQgID0gTWF0aC5taW4oIHRoaXMuZ2V0UmlnaHQoKSwgIGFSZWN0LmdldFJpZ2h0KCkgICksXG4gICAgICAgICAgICBpQm90dG9tID0gTWF0aC5taW4oIHRoaXMuZ2V0Qm90dG9tKCksIGFSZWN0LmdldEJvdHRvbSgpICk7XG5cbiAgICAgICAgdGhpcy54ID0gaUxlZnQ7XG4gICAgICAgIHRoaXMueSA9IGlUb3A7XG4gICAgICAgIHRoaXMudyA9IGlSaWdodCAtIGlMZWZ0O1xuICAgICAgICB0aGlzLmggPSBpQm90dG9tIC0gaVRvcDtcbiAgICB9XG5cbiAgICBpc092ZXJsYXBwaW5nV2l0aCggYVJlY3Q6IFJlY3QgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmdldExlZnQoKSAgPD0gYVJlY3QuZ2V0UmlnaHQoKSAmJlxuICAgICAgICAgICAgYVJlY3QuZ2V0TGVmdCgpIDw9IHRoaXMuZ2V0UmlnaHQoKSAmJlxuICAgICAgICAgICAgdGhpcy5nZXRUb3AoKSAgIDw9IGFSZWN0LmdldEJvdHRvbSgpICYmXG4gICAgICAgICAgICBhUmVjdC5nZXRUb3AoKSAgPD0gdGhpcy5nZXRCb3R0b20oKVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZXhwYW5kKCBhUG9pbnRzOiBudW1iZXIgKTogdm9pZCB7XG4gICAgICAgIHZhciBoU2lnbiA9IHRoaXMudyA+PSAwID8gLTEgOiAxO1xuICAgICAgICB2YXIgdlNpZ24gPSB0aGlzLmggPj0gMCA/IC0xIDogMTtcblxuICAgICAgICB0aGlzLnggKz0gIGhTaWduICogYVBvaW50cztcbiAgICAgICAgdGhpcy55ICs9ICB2U2lnbiAqIGFQb2ludHM7XG4gICAgICAgIHRoaXMudyArPSAtaFNpZ24gKiBhUG9pbnRzICogMjtcbiAgICAgICAgdGhpcy5oICs9IC12U2lnbiAqIGFQb2ludHMgKiAyO1xuICAgIH1cblxuICAgIGNvbnRyYWN0KCBhUG9pbnRzOiBudW1iZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXhwYW5kKCAtYVBvaW50cyApO1xuICAgIH1cblxufVxuIiwiLyoqXG4gKlxuICogQSBwYXJ0aWFsIDJEIHRyYW5zZm9ybSBtYXRyaXguIEN1cnJlbnRseSBkb2Vzbid0IHN1cHBvcnQgcm90YXRpb24gKGFuZCBoZW5jZVxuICogc2tldykuXG4gKi9cblxuaW1wb3J0IHsgUmVjdCB9ICBmcm9tICcuL1JlY3QnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBUcmFuc2Zvcm1NYXRyaXgge1xuICAgIHNjYWxlWCAgICA6IG51bWJlcjsgLy8gYVxuICAgIHNjYWxlWSAgICA6IG51bWJlcjsgLy8gZFxuICAgIHRyYW5zbGF0ZVg6IG51bWJlcjsgLy8gZSBvciB0eFxuICAgIHRyYW5zbGF0ZVk6IG51bWJlcjsgLy8gZiBvciB0eVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWSA9IDA7XG4gICAgICAgIHRoaXMuc2NhbGVYICAgICA9IDE7XG4gICAgICAgIHRoaXMuc2NhbGVZICAgICA9IDE7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFRyYW5zZm9ybU1hdHJpeCB7XG4gICAgICAgIHZhciBpQ2xvbmUgPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XG4gICAgICAgIGlDbG9uZS50cmFuc2xhdGVYID0gdGhpcy50cmFuc2xhdGVYO1xuICAgICAgICBpQ2xvbmUudHJhbnNsYXRlWSA9IHRoaXMudHJhbnNsYXRlWTtcbiAgICAgICAgaUNsb25lLnNjYWxlWCA9IHRoaXMuc2NhbGVYO1xuICAgICAgICBpQ2xvbmUuc2NhbGVZID0gdGhpcy5zY2FsZVk7XG5cbiAgICAgICAgcmV0dXJuIGlDbG9uZTtcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUoIGFUcmFuc2xhdGlvbjogUG9pbnQgKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCArPSBhVHJhbnNsYXRpb24ueCAqIHRoaXMuc2NhbGVYO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgKz0gYVRyYW5zbGF0aW9uLnkgKiB0aGlzLnNjYWxlWTtcbiAgICB9XG5cbiAgICBzY2FsZSggYVNjYWxlOiBQb2ludCApIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVYICo9IGFTY2FsZS54O1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgKj0gYVNjYWxlLnk7XG5cbiAgICAgICAgdGhpcy5zY2FsZVggICAgICo9IGFTY2FsZS54O1xuICAgICAgICB0aGlzLnNjYWxlWSAgICAgKj0gYVNjYWxlLnk7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtUG9pbnQoIGFQb2ludDogUG9pbnQgKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgICAgICAgIGFQb2ludC54ICogdGhpcy5zY2FsZVggKyB0aGlzLnRyYW5zbGF0ZVgsXG4gICAgICAgICAgICBhUG9pbnQueSAqIHRoaXMuc2NhbGVZICsgdGhpcy50cmFuc2xhdGVZXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQSB0ZW1wb3JhbCBoYWNrLiBSZWN0cyBzaG91bGQgcmVhbGx5IGJlIHJlcHJlc2VudGVkIGFzIGEgcG9seWdvbiB0b1xuICAgIC8vIHN1cHBvcnQgcm90YXRlLCBidXQgdGhpcyB3aWxsIGRvIGZvciBub3cuXG4gICAgdHJhbnNmb3JtUmVjdCggYVJlY3Q6IFJlY3QgKSA6IFJlY3Qge1xuICAgICAgICB2YXIgaUxlZnRUb3AgICAgICAgICAgICA9IGFSZWN0LmdldExlZnRUb3AoKSxcbiAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AgPSB0aGlzLnRyYW5zZm9ybVBvaW50KCBpTGVmdFRvcCApLFxuXG4gICAgICAgICAgICBpVHJhbnNmb3JtZWRSZWN0ID0gbmV3IFJlY3QoXG4gICAgICAgICAgICAgICAgaVRyYW5zZm9ybWVkTGVmdFRvcC54LFxuICAgICAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AueSxcbiAgICAgICAgICAgICAgICBhUmVjdC53ICogdGhpcy5zY2FsZVgsXG4gICAgICAgICAgICAgICAgYVJlY3QuaCAqIHRoaXMuc2NhbGVZXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBpVHJhbnNmb3JtZWRSZWN0O1xuICAgIH1cblxufVxuIiwiZXhwb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IFJlY3QgfSBmcm9tICcuL1JlY3QnO1xuIiwiaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vUGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi4vZ2VvbWV0cnkvUmVjdCc7XG5cbmV4cG9ydFxuY2xhc3MgQ29udGV4dFBhaW50ZXIgZXh0ZW5kcyBQYWludGVyIHtcbiAgICBwcm90ZWN0ZWQgY29udGV4dDogIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEICkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBhQ29udGV4dDtcbiAgICB9XG5cbiAgICBkcmF3UmVjdGFuZ2xlKCBhUmVjdDogUmVjdCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQucmVjdCggYVJlY3QueCwgYVJlY3QueSwgYVJlY3QudywgYVJlY3QuaCApO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUoIHgsIHkgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnRyYW5zbGF0ZSggeCwgeSApO1xuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKCB4LCB5ICk7XG4gICAgfVxuXG4gICAgaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCBhUmVjdDogUmVjdCApOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCBhUmVjdCApO1xuXG4gICAgICAgIC8vIFdlIGFkZCBzb21lIGV4dHJhIG1hcmdpbnMgdG8gYWNjb3VudCBmb3IgYW50aWFsaWFzaW5nXG4gICAgICAgIHZhciBpUmVjdCA9IGFSZWN0LmNsb25lKCk7XG4gICAgICAgIGlSZWN0LmV4cGFuZCggMSApO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVjdChcbiAgICAgICAgICAgIGlSZWN0LngsXG4gICAgICAgICAgICBpUmVjdC55LFxuICAgICAgICAgICAgaVJlY3QudyxcbiAgICAgICAgICAgIGlSZWN0LmhcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuY2xpcCgpO1xuICAgIH1cblxuICAgIHB1c2hTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIucHVzaFN0YXRlKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgfVxuXG4gICAgcG9wU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnBvcFN0YXRlKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgU3RhdGVmdWwgfSAgICAgICAgZnJvbSAnLi9TdGF0ZWZ1bCc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1NYXRyaXggfSBmcm9tICcuLi9nZW9tZXRyeS9UcmFuc2Zvcm1NYXRyaXgnO1xuaW1wb3J0IHsgUmVjdCB9ICAgICAgICAgICAgZnJvbSAnLi4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBQb2ludCB9ICAgICAgICAgICBmcm9tICcuLi9nZW9tZXRyeS9Qb2ludCc7XG5cbmV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgUGFpbnRlciBleHRlbmRzIFN0YXRlZnVsIHtcbiAgICBwcm90ZWN0ZWQgY2xpcEFyZWE6IFJlY3Q7XG4gICAgcHJvdGVjdGVkIG1hdHJpeDogICBUcmFuc2Zvcm1NYXRyaXg7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKTogdm9pZDtcblxuICAgIHRyYW5zbGF0ZSggeCwgeSApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tYXRyaXgudHJhbnNsYXRlKCBuZXcgUG9pbnQoIHgsIHkgKSApXG4gICAgfVxuXG4gICAgaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCBhUmVjdDogUmVjdCApOiB2b2lkIHtcbiAgICAgICAgLy8gT3VyIGNsaXBBcmVhIGlzIGluIGFic29sdXRlIGNvb3JkaW5hdGVzLCBzbyB3ZSBjb252ZXJ0IHRoZSByZWN0XG4gICAgICAgIC8vIHRvIGFic29sdXRlIG9uZXMuXG4gICAgICAgIHZhciBpQWJzb2x1dGVSZWN0ID0gdGhpcy50b0Fic29sdXRlUmVjdCggYVJlY3QgKTtcbiAgICAgICAgaWYgKCB0aGlzLmNsaXBBcmVhICkge1xuICAgICAgICAgICAgdGhpcy5jbGlwQXJlYS5pbnRlcnNlY3QoIGlBYnNvbHV0ZVJlY3QgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xpcEFyZWEgPSBpQWJzb2x1dGVSZWN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNSZWN0V2l0aGluQ2xpcEFyZWEoIGFSZWN0OiBSZWN0ICk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBDbGlwIGFyZWEgaXMgaW4gYWJzb2x1dGUgY29vcmRpbmF0ZXNcbiAgICAgICAgLy8gU28gd2UgY29udmVydCB0aGUgcmVjdCB0byBhYnNvbHV0ZSBvbmVzLlxuICAgICAgICB2YXIgaUFic29sdXRlUmVjdCA9IHRoaXMudG9BYnNvbHV0ZVJlY3QoIGFSZWN0ICk7XG4gICAgICAgIGlmICggdGhpcy5jbGlwQXJlYSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaXBBcmVhLmlzT3ZlcmxhcHBpbmdXaXRoKCBpQWJzb2x1dGVSZWN0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvQWJzb2x1dGVSZWN0KCBhUmVjdDogUmVjdCApOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0cml4LnRyYW5zZm9ybVJlY3QoIGFSZWN0ICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCkgOiBhbnkge1xuICAgICAgICB2YXIgaVN0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcbiAgICAgICAgaVN0YXRlLm1hdHJpeCAgID0gdGhpcy5tYXRyaXguY2xvbmUoKTtcbiAgICAgICAgaVN0YXRlLmNsaXBBcmVhID0gdGhpcy5jbGlwQXJlYSA/IHRoaXMuY2xpcEFyZWEuY2xvbmUoKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIGlTdGF0ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVzdG9yZVN0YXRlKCBhU3RhdGU6IGFueSApIHtcbiAgICAgICAgdGhpcy5tYXRyaXggICA9IGFTdGF0ZS5tYXRyaXg7XG4gICAgICAgIHRoaXMuY2xpcEFyZWEgPSBhU3RhdGUuY2xpcEFyZWE7XG4gICAgfVxuXG59XG4iLCJleHBvcnRcbmFic3RyYWN0IGNsYXNzIFN0YXRlZnVsIHtcbiAgICBwcm90ZWN0ZWQgc3RhdGVTdGFjazogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVN0YWNrID0gW107XG4gICAgfVxuXG4gICAgcHVzaFN0YXRlKCkge1xuICAgICAgICB2YXIgaVN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXRlU3RhY2sucHVzaCggaVN0YXRlICk7XG4gICAgfVxuXG4gICAgcG9wU3RhdGUoKSB7XG4gICAgICAgIHZhciBpU3RhdGUgPSB0aGlzLnN0YXRlU3RhY2sucG9wKCk7XG4gICAgICAgIHRoaXMucmVzdG9yZVN0YXRlKCBpU3RhdGUgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKSA6IGFueSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVzdG9yZVN0YXRlKCBhU3RhdGU6IGFueSApO1xuXG59XG4iLCJpbXBvcnQgKiBhcyBnZW9tZXRyeSBmcm9tICcuL2dlb21ldHJ5L2dlb21ldHJ5Lm5zJztcbmV4cG9ydCB7IGdlb21ldHJ5IH07XG5cbmV4cG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL0NvbnRyb2wnO1xuZXhwb3J0IHsgUmVjdGFuZ2xlIH0gZnJvbSAnLi92aWV3ZWVzL3NoYXBlcy9SZWN0YW5nbGUnO1xuIiwiaW1wb3J0IHsgQ29tcG9zaXRlIH0gZnJvbSAnLi8uLi8uLi9jb3JlL0NvbXBvc2l0ZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBWaWV3ZWUgZXh0ZW5kcyBDb21wb3NpdGU8IFZpZXdlZSA+IHtcblxuICAgIGFic3RyYWN0IHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkO1xuXG4gICAgcHJvdGVjdGVkIHBhaW50Q2hpbGRyZW4oIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBpZiAoIHRoaXMuaXNDaGlsZGxlc3MoKSApIHJldHVybjtcblxuICAgICAgICBhUGFpbnRlci5wdXNoU3RhdGUoKTtcblxuICAgICAgICB0aGlzLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoQ2hpbGQoIGZ1bmN0aW9uKCBhQ2hpbGQgKSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFpbnQoIGFQYWludGVyICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFQYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLmFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhcHBseVRyYW5zZm9ybWF0aW9ucyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIC8vIERvZXMgbm90aGluZyBieSBkZWZhdWx0LiBDaGlsZHJlbiB3aWxsIG92ZXJyaWRlLlxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgU2hhcGUgfSAgIGZyb20gJy4vU2hhcGUnO1xuaW1wb3J0IHsgUmVjdCB9ICAgIGZyb20gJy4vLi4vLi4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi8uLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBTaGFwZSB7XG4gICAgcHJpdmF0ZSByZWN0OiBSZWN0O1xuXG4gICAgY29uc3RydWN0b3IoIGFSZWN0OiBSZWN0ICkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnJlY3QgPSBhUmVjdDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFpbnRTZWxmKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgYVBhaW50ZXIuZHJhd1JlY3RhbmdsZSggdGhpcy5yZWN0ICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFJlY3RCb3VuZHMoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgZnJvbSAnLi8uLi9WaWV3ZWUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gICAgZnJvbSAnLi8uLi8uLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTaGFwZSBleHRlbmRzIFZpZXdlZSB7XG5cbiAgICBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGlmICggdGhpcy5pc1dpdGhpbkNsaXBBcmVhKCBhUGFpbnRlciApICkge1xuICAgICAgICAgICAgdGhpcy5wYWludFNlbGYoIGFQYWludGVyIClcbiAgICAgICAgICAgIHRoaXMucGFpbnRDaGlsZHJlbiggYVBhaW50ZXIgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBwYWludFNlbGYoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0UmVjdEJvdW5kcygpOiBSZWN0O1xuXG4gICAgcHJvdGVjdGVkIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBhUGFpbnRlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIHRoaXMuZ2V0UmVjdEJvdW5kcygpICk7XG4gICAgICAgIHN1cGVyLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG4gICAgICAgIHZhciBpQm91bmRzID0gdGhpcy5nZXRSZWN0Qm91bmRzKCk7XG4gICAgICAgIGFQYWludGVyLnRyYW5zbGF0ZSggaUJvdW5kcy5nZXRMZWZ0KCksIGlCb3VuZHMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNXaXRoaW5DbGlwQXJlYSggYVBhaW50ZXI6IFBhaW50ZXIgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBhUGFpbnRlci5pc1JlY3RXaXRoaW5DbGlwQXJlYSggdGhpcy5nZXRSZWN0Qm91bmRzKCkgKTtcbiAgICB9XG5cbn1cbiJdfQ==
