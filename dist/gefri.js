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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9Db250ZXh0UGFpbnRlci50cyIsInNyYy92aWV3L3BhaW50ZXJzL1BhaW50ZXIudHMiLCJzcmMvdmlldy9wYWludGVycy9TdGF0ZWZ1bC50cyIsInNyYy92aWV3L3ZpZXcubnMudHMiLCJzcmMvdmlldy92aWV3ZWVzL1ZpZXdlZS50cyIsInNyYy92aWV3L3ZpZXdlZXMvc2hhcGVzL1JlY3RhbmdsZS50cyIsInNyYy92aWV3L3ZpZXdlZXMvc2hhcGVzL1NoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0lBS0k7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFLLElBQUksQ0FBQztJQUN6QixDQUFDO0lBTUQsNEJBQVEsR0FBUixVQUFVLE1BQU07UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsK0JBQVcsR0FBWDtRQUFhLGNBQVk7YUFBWixXQUFZLENBQVosc0JBQVksQ0FBWixJQUFZO1lBQVosNkJBQVk7O1FBQ3JCLEdBQUcsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDbEMsQ0FBQztJQUNMLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQWEsTUFBTTtRQUNmLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBRSxDQUFDO1FBRWxELEVBQUUsQ0FBQyxDQUFFLFdBQVcsS0FBSyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxnQ0FBZ0MsQ0FBQTtRQUMxQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBRSxXQUFXLEVBQUUsQ0FBQyxDQUFFLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7SUFNRCxnQ0FBWSxHQUFaLFVBQWMsU0FBUztRQUNuQixHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFHLENBQUM7WUFDOUMsU0FBUyxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7SUFFRCwrQkFBVyxHQUFYO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsNkJBQVMsR0FBVDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQXREQSxBQXNEQyxJQUFBO0FBckRLLGlCQUFTLFlBcURkLENBQUE7Ozs7QUN0REQsSUFBWSxJQUFJLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMvQixZQUFJO0FBQUU7OztBQ0FkLCtCQUErQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzNELHFCQUF3QixpQkFBaUIsQ0FBQyxDQUFBO0FBRTFDO0lBUUksaUJBQWEsVUFBdUI7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBTSxJQUFJLFdBQUksQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBRSxDQUFDO1FBQ25GLElBQUksQ0FBQyxNQUFNLEdBQU0sSUFBSSxDQUFDLFlBQVksQ0FBRSxVQUFVLENBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFLLElBQUksQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUssSUFBSSwrQkFBYyxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQztJQUN4RCxDQUFDO0lBRU8sOEJBQVksR0FBcEIsVUFBc0IsVUFBdUI7UUFDekMsSUFBSSxPQUFPLEdBQXlDLFFBQVEsQ0FBQyxhQUFhLENBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkYsT0FBTyxDQUFDLFlBQVksQ0FBRSxPQUFPLEVBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBRyxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxZQUFZLENBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUUsQ0FBQztRQUNyRSxVQUFVLENBQUMsV0FBVyxDQUFFLE9BQU8sQ0FBRSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLDRCQUFVLEdBQWxCLFVBQW9CLE9BQTBCO1FBQzFDLElBQUksT0FBTyxHQUE2QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUV2RSxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUM5QixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUN0QixPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSw2QkFBVyxHQUFsQixVQUFvQixPQUFlO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUE7UUFDakQsT0FBTyxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUMsT0FBTyxDQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0wsY0FBQztBQUFELENBdkNBLEFBdUNDLElBQUE7QUF0Q0ssZUFBTyxVQXNDWixDQUFBOzs7O0FDM0NEO0lBS0ksZUFBYSxFQUFVLEVBQUUsRUFBVTtRQUMvQixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxxQkFBSyxHQUFMO1FBQ0ksTUFBTSxDQUFDLElBQUksS0FBSyxDQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDO0lBQ3ZDLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7QUFaSyxhQUFLLFFBWVYsQ0FBQTs7OztBQ2JELHNCQUFzQixTQUFTLENBQUMsQ0FBQTtBQUVoQztJQU9JLGNBQWEsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtRQUN2RCxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsb0JBQUssR0FBTDtRQUNJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELHNCQUFPLEdBQVA7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHVCQUFRLEdBQVI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHFCQUFNLEdBQU47UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHdCQUFTLEdBQVQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHlCQUFVLEdBQVY7UUFDSSxNQUFNLENBQUMsSUFBSSxhQUFLLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCx3QkFBUyxHQUFULFVBQVcsS0FBVztRQUNsQixJQUFJLEtBQUssR0FBSyxJQUFJLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUksRUFDekQsSUFBSSxHQUFNLElBQUksQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBSyxFQUN6RCxNQUFNLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFHLEVBQ3pELE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUUsQ0FBQztRQUU5RCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0lBRUQsZ0NBQWlCLEdBQWpCLFVBQW1CLEtBQVc7UUFDMUIsTUFBTSxDQUFDLENBQ0gsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFLLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFNLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDcEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FDdEMsQ0FBQTtJQUNMLENBQUM7SUFFRCxxQkFBTSxHQUFOLFVBQVEsT0FBZTtRQUNuQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxDQUFDLElBQUssS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxJQUFLLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsdUJBQVEsR0FBUixVQUFVLE9BQWU7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFDLE9BQU8sQ0FBRSxDQUFDO0lBQzVCLENBQUM7SUFFTCxXQUFDO0FBQUQsQ0F6RUEsQUF5RUMsSUFBQTtBQXhFSyxZQUFJLE9Bd0VULENBQUE7Ozs7QUNyRUQscUJBQXNCLFFBQVEsQ0FBQyxDQUFBO0FBQy9CLHNCQUFzQixTQUFTLENBQUMsQ0FBQTtBQUVoQztJQU9JO1FBQ0ksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBTyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBTyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELCtCQUFLLEdBQUw7UUFDSSxJQUFJLE1BQU0sR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDcEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUU1QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxtQ0FBUyxHQUFULFVBQVcsWUFBbUI7UUFDMUIsSUFBSSxDQUFDLFVBQVUsSUFBSSxZQUFZLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsSUFBSSxZQUFZLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEQsQ0FBQztJQUVELCtCQUFLLEdBQUwsVUFBTyxNQUFhO1FBQ2hCLElBQUksQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFNUIsSUFBSSxDQUFDLE1BQU0sSUFBUSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLElBQVEsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsd0NBQWMsR0FBZCxVQUFnQixNQUFhO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLGFBQUssQ0FDWixNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFDeEMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQzNDLENBQUM7SUFDTixDQUFDO0lBSUQsdUNBQWEsR0FBYixVQUFlLEtBQVc7UUFDdEIsSUFBSSxRQUFRLEdBQWMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUN4QyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFFLFFBQVEsQ0FBRSxFQUVyRCxnQkFBZ0IsR0FBRyxJQUFJLFdBQUksQ0FDdkIsbUJBQW1CLENBQUMsQ0FBQyxFQUNyQixtQkFBbUIsQ0FBQyxDQUFDLEVBQ3JCLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFDckIsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUN4QixDQUFDO1FBRU4sTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQzVCLENBQUM7SUFFTCxzQkFBQztBQUFELENBNURBLEFBNERDLElBQUE7QUEzREssdUJBQWUsa0JBMkRwQixDQUFBOzs7O0FDckVELHNCQUFzQixTQUFTLENBQUM7QUFBdkIsOEJBQXVCO0FBQ2hDLHFCQUFxQixRQUFRLENBQUM7QUFBckIsMkJBQXFCOzs7Ozs7Ozs7QUNEOUIsd0JBQXdCLFdBQVcsQ0FBQyxDQUFBO0FBR3BDO0lBQzZCLGtDQUFPO0lBR2hDLHdCQUFhLFFBQWtDO1FBQzNDLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQsc0NBQWEsR0FBYixVQUFlLEtBQVc7UUFDdEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMzQixPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsT0FBTyxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDbkQsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsa0NBQVMsR0FBVCxVQUFXLENBQUMsRUFBRSxDQUFDO1FBQ1gsZ0JBQUssQ0FBQyxTQUFTLFlBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsOENBQXFCLEdBQXJCLFVBQXVCLEtBQVc7UUFDOUIsZ0JBQUssQ0FBQyxxQkFBcUIsWUFBRSxLQUFLLENBQUUsQ0FBQztRQUdyQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXpCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUNiLEtBQUssQ0FBQyxDQUFDLEVBQ1AsS0FBSyxDQUFDLENBQUMsRUFDUCxLQUFLLENBQUMsQ0FBQyxFQUNQLEtBQUssQ0FBQyxDQUFDLENBQ1YsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGtDQUFTLEdBQVQ7UUFDSSxnQkFBSyxDQUFDLFNBQVMsV0FBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGlDQUFRLEdBQVI7UUFDSSxnQkFBSyxDQUFDLFFBQVEsV0FBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVMLHFCQUFDO0FBQUQsQ0FwREEsQUFvREMsQ0FuRDRCLGlCQUFPLEdBbURuQztBQW5ESyxzQkFBYyxpQkFtRG5CLENBQUE7Ozs7Ozs7OztBQ3ZERCx5QkFBZ0MsWUFBWSxDQUFDLENBQUE7QUFDN0MsZ0NBQWdDLDZCQUE2QixDQUFDLENBQUE7QUFFOUQsc0JBQWdDLG1CQUFtQixDQUFDLENBQUE7QUFFcEQ7SUFDK0IsMkJBQVE7SUFJbkM7UUFDSSxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBSUQsMkJBQVMsR0FBVCxVQUFXLENBQUMsRUFBRSxDQUFDO1FBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUUsSUFBSSxhQUFLLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFFLENBQUE7SUFDOUMsQ0FBQztJQUVELHVDQUFxQixHQUFyQixVQUF1QixLQUFXO1FBRzlCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUUsS0FBSyxDQUFFLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLFFBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUUsYUFBYSxDQUFFLENBQUM7UUFDN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUM7UUFDbEMsQ0FBQztJQUNMLENBQUM7SUFFRCxzQ0FBb0IsR0FBcEIsVUFBc0IsS0FBVztRQUc3QixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFFLEtBQUssQ0FBRSxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxRQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFFLGFBQWEsQ0FBRSxDQUFDO1FBQzVELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7SUFFRCxnQ0FBYyxHQUFkLFVBQWdCLEtBQVc7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFFLEtBQUssQ0FBRSxDQUFDO0lBQzlDLENBQUM7SUFFUywwQkFBUSxHQUFsQjtRQUNJLElBQUksTUFBTSxHQUFHLGdCQUFLLENBQUMsUUFBUSxXQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLE1BQU0sR0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUNwRSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFUyw4QkFBWSxHQUF0QixVQUF3QixNQUFXO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEMsQ0FBQztJQUVMLGNBQUM7QUFBRCxDQXREQSxBQXNEQyxDQXJEOEIsbUJBQVEsR0FxRHRDO0FBckRjLGVBQU8sVUFxRHJCLENBQUE7Ozs7QUMzREQ7SUFJSTtRQUNJLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCw0QkFBUyxHQUFUO1FBQ0ksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCwyQkFBUSxHQUFSO1FBQ0ksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2hDLENBQUM7SUFFUywyQkFBUSxHQUFsQjtRQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBSUwsZUFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUF2QmMsZ0JBQVEsV0F1QnRCLENBQUE7Ozs7QUN4QkQsSUFBWSxRQUFRLFdBQU0sd0JBQXdCLENBQUMsQ0FBQTtBQUMxQyxnQkFBUTtBQUVqQix3QkFBd0IsV0FBVyxDQUFDO0FBQTNCLG9DQUEyQjtBQUNwQywwQkFBMEIsNEJBQTRCLENBQUM7QUFBOUMsMENBQThDOzs7Ozs7Ozs7QUNKdkQsMEJBQTBCLHdCQUF3QixDQUFDLENBQUE7QUFHbkQ7SUFDOEIsMEJBQW1CO0lBRGpEO1FBQzhCLDhCQUFtQjtJQTBCakQsQ0FBQztJQXRCRyw4QkFBYSxHQUFiLFVBQWUsUUFBaUI7UUFDNUIsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRWpDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsc0JBQXNCLENBQUUsUUFBUSxDQUFFLENBQUM7UUFFeEMsSUFBSSxDQUFDLFlBQVksQ0FBRSxVQUFVLE1BQU07WUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBRSxRQUFRLENBQUUsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsdUNBQXNCLEdBQXRCLFVBQXdCLFFBQWlCO1FBQ3JDLElBQUksQ0FBQyxvQkFBb0IsQ0FBRSxRQUFRLENBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQscUNBQW9CLEdBQXBCLFVBQXNCLFFBQWlCO0lBRXZDLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0EzQkEsQUEyQkMsQ0ExQjZCLHFCQUFTLEdBMEJ0QztBQTFCYyxjQUFNLFNBMEJwQixDQUFBOzs7Ozs7Ozs7QUM5QkQsc0JBQXdCLFNBQVMsQ0FBQyxDQUFBO0FBSWxDO0lBQ3dCLDZCQUFLO0lBR3pCLG1CQUFhLEtBQVc7UUFDcEIsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCw2QkFBUyxHQUFULFVBQVcsUUFBaUI7UUFDeEIsUUFBUSxDQUFDLGFBQWEsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELGlDQUFhLEdBQWI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQWpCQSxBQWlCQyxDQWhCdUIsYUFBSyxHQWdCNUI7QUFoQkssaUJBQVMsWUFnQmQsQ0FBQTs7Ozs7Ozs7O0FDckJELHVCQUF3QixhQUFhLENBQUMsQ0FBQTtBQUl0QztJQUM2Qix5QkFBTTtJQURuQztRQUM2Qiw4QkFBTTtJQTJCbkMsQ0FBQztJQXpCRyxxQkFBSyxHQUFMLFVBQU8sUUFBaUI7UUFDcEIsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFFLFFBQVEsQ0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFFLFFBQVEsQ0FBRSxDQUFBO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUUsUUFBUSxDQUFFLENBQUM7UUFDbkMsQ0FBQztJQUNMLENBQUM7SUFNRCxzQ0FBc0IsR0FBdEIsVUFBd0IsUUFBaUI7UUFDckMsUUFBUSxDQUFDLHFCQUFxQixDQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBRSxDQUFDO1FBQ3ZELGdCQUFLLENBQUMsc0JBQXNCLFlBQUUsUUFBUSxDQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELG9DQUFvQixHQUFwQixVQUFzQixRQUFpQjtRQUNuQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDbkMsUUFBUSxDQUFDLFNBQVMsQ0FBRSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVELGdDQUFnQixHQUFoQixVQUFrQixRQUFpQjtRQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBRSxDQUFDO0lBQ2pFLENBQUM7SUFFTCxZQUFDO0FBQUQsQ0E1QkEsQUE0QkMsQ0EzQjRCLGVBQU0sR0EyQmxDO0FBM0JjLGFBQUssUUEyQm5CLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0XG5jbGFzcyBDb21wb3NpdGU8IFQgPiB7XG4gICAgY2hpbGRyZW46IFRbXTtcbiAgICBwYXJlbnQgOiAgVDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ICAgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogQWRkaW5nIGFuZCByZW1vdmluZ1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBhZGRDaGlsZCggYUNoaWxkICk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGFDaGlsZCApO1xuICAgICAgICBhQ2hpbGQucGFyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICBhZGRDaGlsZHJlbiggLi4uYXJnczogVFtdICk6IHZvaWQge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoIGFyZ3VtZW50c1tpXSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGQoIGFDaGlsZCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGlDaGlsZEluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKCBhQ2hpbGQgKTtcblxuICAgICAgICBpZiAoIGlDaGlsZEluZGV4ID09PSAtMSApIHtcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgcmVxdWVzdGVkIGNoaWxkXCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFDaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoIGlDaGlsZEluZGV4LCAxICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFV0aWxpdHlcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZm9yRWFjaENoaWxkKCBhQ2FsbGJhY2sgKTogdm9pZCB7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBhQ2FsbGJhY2soIHRoaXMuY2hpbGRyZW5baV0sIGkgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQ2hpbGRsZXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgaGFzUGFyZW50KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgIT0gbnVsbDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgKiBhcyB2aWV3IGZyb20gJy4vdmlldy92aWV3Lm5zJztcbmV4cG9ydCB7dmlld307XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgZnJvbSAnLi92aWV3ZWVzL1ZpZXdlZSc7XG5pbXBvcnQgeyBDb250ZXh0UGFpbnRlciB9IGZyb20gJy4vcGFpbnRlcnMvQ29udGV4dFBhaW50ZXInO1xuaW1wb3J0IHsgUmVjdCB9ICAgIGZyb20gJy4vZ2VvbWV0cnkvUmVjdCc7XG5cbmV4cG9ydFxuY2xhc3MgQ29udHJvbCB7XG4gICAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgY2FudmFzOiAgICBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwcml2YXRlIGNvbnRleHQ6ICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgcGFpbnRlcjogICBDb250ZXh0UGFpbnRlcjtcbiAgICBwcml2YXRlIGJvdW5kczogICAgUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBhQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmJvdW5kcyAgICA9IG5ldyBSZWN0KCAwLCAwLCBhQ29udGFpbmVyLm9mZnNldFdpZHRoLCBhQ29udGFpbmVyLm9mZnNldEhlaWdodCApO1xuICAgICAgICB0aGlzLmNhbnZhcyAgICA9IHRoaXMuY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyICk7XG4gICAgICAgIHRoaXMuY29udGV4dCAgID0gdGhpcy5nZXRDb250ZXh0KCB0aGlzLmNhbnZhcyApO1xuICAgICAgICB0aGlzLnBhaW50ZXIgICA9IG5ldyBDb250ZXh0UGFpbnRlciggdGhpcy5jb250ZXh0ICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDYW52YXMoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgICAgIHZhciBpQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnQ0FOVkFTJyApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ3dpZHRoJywgIGFDb250YWluZXIub2Zmc2V0V2lkdGgudG9TdHJpbmcoKSAgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICdoZWlnaHQnLCBhQ29udGFpbmVyLm9mZnNldEhlaWdodC50b1N0cmluZygpICk7XG4gICAgICAgIGFDb250YWluZXIuYXBwZW5kQ2hpbGQoIGlDYW52YXMgKTtcbiAgICAgICAgcmV0dXJuIGlDYW52YXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb250ZXh0KCBhQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCApOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgICAgICB2YXIgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSggMC41LCAwLjUgKTsgLy8gUHJldmVudHMgYW50aWFsaWFzaW5nIGVmZmVjdC5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzFBQkM5Qyc7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb250ZW50cyggYVZpZXdlZTogVmlld2VlICkge1xuICAgICAgICB0aGlzLnBhaW50ZXIucHVzaFN0YXRlKCk7XG4gICAgICAgIHRoaXMucGFpbnRlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIHRoaXMuYm91bmRzIClcbiAgICAgICAgYVZpZXdlZS5wYWludCggdGhpcy5wYWludGVyICk7XG4gICAgICAgIHRoaXMucGFpbnRlci5wb3BTdGF0ZSgpO1xuICAgIH1cbn1cbiIsImV4cG9ydFxuY2xhc3MgUG9pbnQge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIHRoaXMueCwgdGhpcy55ICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBSZWN0IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIHc6IG51bWJlcjtcbiAgICBoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciwgYVc6IG51bWJlciwgYUg6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgICAgICB0aGlzLncgPSBhVztcbiAgICAgICAgdGhpcy5oID0gYUg7XG4gICAgfVxuXG4gICAgY2xvbmUoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCggdGhpcy54LCB0aGlzLnksIHRoaXMudywgdGhpcy5oICk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggOiB0aGlzLnggKyB0aGlzLnc7XG4gICAgfVxuXG4gICAgZ2V0UmlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54ICsgdGhpcy53IDogdGhpcy54O1xuICAgIH1cblxuICAgIGdldFRvcCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgOiB0aGlzLnkgKyB0aGlzLmg7XG4gICAgfVxuXG4gICAgZ2V0Qm90dG9tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSArIHRoaXMuaCA6IHRoaXMueTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0VG9wKCk6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy5nZXRMZWZ0KCksIHRoaXMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3QoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICB2YXIgaUxlZnQgICA9IE1hdGgubWF4KCB0aGlzLmdldExlZnQoKSwgICBhUmVjdC5nZXRMZWZ0KCkgICApLFxuICAgICAgICAgICAgaVRvcCAgICA9IE1hdGgubWF4KCB0aGlzLmdldFRvcCgpLCAgICBhUmVjdC5nZXRUb3AoKSAgICApLFxuICAgICAgICAgICAgaVJpZ2h0ICA9IE1hdGgubWluKCB0aGlzLmdldFJpZ2h0KCksICBhUmVjdC5nZXRSaWdodCgpICApLFxuICAgICAgICAgICAgaUJvdHRvbSA9IE1hdGgubWluKCB0aGlzLmdldEJvdHRvbSgpLCBhUmVjdC5nZXRCb3R0b20oKSApO1xuXG4gICAgICAgIHRoaXMueCA9IGlMZWZ0O1xuICAgICAgICB0aGlzLnkgPSBpVG9wO1xuICAgICAgICB0aGlzLncgPSBpUmlnaHQgLSBpTGVmdDtcbiAgICAgICAgdGhpcy5oID0gaUJvdHRvbSAtIGlUb3A7XG4gICAgfVxuXG4gICAgaXNPdmVybGFwcGluZ1dpdGgoIGFSZWN0OiBSZWN0ICk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5nZXRMZWZ0KCkgIDw9IGFSZWN0LmdldFJpZ2h0KCkgJiZcbiAgICAgICAgICAgIGFSZWN0LmdldExlZnQoKSA8PSB0aGlzLmdldFJpZ2h0KCkgJiZcbiAgICAgICAgICAgIHRoaXMuZ2V0VG9wKCkgICA8PSBhUmVjdC5nZXRCb3R0b20oKSAmJlxuICAgICAgICAgICAgYVJlY3QuZ2V0VG9wKCkgIDw9IHRoaXMuZ2V0Qm90dG9tKClcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGV4cGFuZCggYVBvaW50czogbnVtYmVyICk6IHZvaWQge1xuICAgICAgICB2YXIgaFNpZ24gPSB0aGlzLncgPj0gMCA/IC0xIDogMTtcbiAgICAgICAgdmFyIHZTaWduID0gdGhpcy5oID49IDAgPyAtMSA6IDE7XG5cbiAgICAgICAgdGhpcy54ICs9ICBoU2lnbiAqIGFQb2ludHM7XG4gICAgICAgIHRoaXMueSArPSAgdlNpZ24gKiBhUG9pbnRzO1xuICAgICAgICB0aGlzLncgKz0gLWhTaWduICogYVBvaW50cyAqIDI7XG4gICAgICAgIHRoaXMuaCArPSAtdlNpZ24gKiBhUG9pbnRzICogMjtcbiAgICB9XG5cbiAgICBjb250cmFjdCggYVBvaW50czogbnVtYmVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLmV4cGFuZCggLWFQb2ludHMgKTtcbiAgICB9XG5cbn1cbiIsIi8qKlxuICpcbiAqIEEgcGFydGlhbCAyRCB0cmFuc2Zvcm0gbWF0cml4LiBDdXJyZW50bHkgZG9lc24ndCBzdXBwb3J0IHJvdGF0aW9uIChhbmQgaGVuY2VcbiAqIHNrZXcpLlxuICovXG5cbmltcG9ydCB7IFJlY3QgfSAgZnJvbSAnLi9SZWN0JztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgVHJhbnNmb3JtTWF0cml4IHtcbiAgICBzY2FsZVggICAgOiBudW1iZXI7IC8vIGFcbiAgICBzY2FsZVkgICAgOiBudW1iZXI7IC8vIGRcbiAgICB0cmFuc2xhdGVYOiBudW1iZXI7IC8vIGUgb3IgdHhcbiAgICB0cmFuc2xhdGVZOiBudW1iZXI7IC8vIGYgb3IgdHlcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggPSAwO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICB0aGlzLnNjYWxlWCAgICAgPSAxO1xuICAgICAgICB0aGlzLnNjYWxlWSAgICAgPSAxO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBUcmFuc2Zvcm1NYXRyaXgge1xuICAgICAgICB2YXIgaUNsb25lID0gbmV3IFRyYW5zZm9ybU1hdHJpeCgpO1xuICAgICAgICBpQ2xvbmUudHJhbnNsYXRlWCA9IHRoaXMudHJhbnNsYXRlWDtcbiAgICAgICAgaUNsb25lLnRyYW5zbGF0ZVkgPSB0aGlzLnRyYW5zbGF0ZVk7XG4gICAgICAgIGlDbG9uZS5zY2FsZVggPSB0aGlzLnNjYWxlWDtcbiAgICAgICAgaUNsb25lLnNjYWxlWSA9IHRoaXMuc2NhbGVZO1xuXG4gICAgICAgIHJldHVybiBpQ2xvbmU7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCBhVHJhbnNsYXRpb246IFBvaW50ICkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggKz0gYVRyYW5zbGF0aW9uLnggKiB0aGlzLnNjYWxlWDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZICs9IGFUcmFuc2xhdGlvbi55ICogdGhpcy5zY2FsZVk7XG4gICAgfVxuXG4gICAgc2NhbGUoIGFTY2FsZTogUG9pbnQgKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCAqPSBhU2NhbGUueDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZICo9IGFTY2FsZS55O1xuXG4gICAgICAgIHRoaXMuc2NhbGVYICAgICAqPSBhU2NhbGUueDtcbiAgICAgICAgdGhpcy5zY2FsZVkgICAgICo9IGFTY2FsZS55O1xuICAgIH1cblxuICAgIHRyYW5zZm9ybVBvaW50KCBhUG9pbnQ6IFBvaW50ICkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICAgICAgICBhUG9pbnQueCAqIHRoaXMuc2NhbGVYICsgdGhpcy50cmFuc2xhdGVYLFxuICAgICAgICAgICAgYVBvaW50LnkgKiB0aGlzLnNjYWxlWSArIHRoaXMudHJhbnNsYXRlWVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIEEgdGVtcG9yYWwgaGFjay4gUmVjdHMgc2hvdWxkIHJlYWxseSBiZSByZXByZXNlbnRlZCBhcyBhIHBvbHlnb24gdG9cbiAgICAvLyBzdXBwb3J0IHJvdGF0ZSwgYnV0IHRoaXMgd2lsbCBkbyBmb3Igbm93LlxuICAgIHRyYW5zZm9ybVJlY3QoIGFSZWN0OiBSZWN0ICkgOiBSZWN0IHtcbiAgICAgICAgdmFyIGlMZWZ0VG9wICAgICAgICAgICAgPSBhUmVjdC5nZXRMZWZ0VG9wKCksXG4gICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wID0gdGhpcy50cmFuc2Zvcm1Qb2ludCggaUxlZnRUb3AgKSxcblxuICAgICAgICAgICAgaVRyYW5zZm9ybWVkUmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AueCxcbiAgICAgICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wLnksXG4gICAgICAgICAgICAgICAgYVJlY3QudyAqIHRoaXMuc2NhbGVYLFxuICAgICAgICAgICAgICAgIGFSZWN0LmggKiB0aGlzLnNjYWxlWVxuICAgICAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gaVRyYW5zZm9ybWVkUmVjdDtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5leHBvcnQgeyBSZWN0IH0gZnJvbSAnLi9SZWN0JztcbiIsImltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuL1BhaW50ZXInO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4uL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmNsYXNzIENvbnRleHRQYWludGVyIGV4dGVuZHMgUGFpbnRlciB7XG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6ICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gYUNvbnRleHQ7XG4gICAgfVxuXG4gICAgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnJlY3QoIGFSZWN0LngsIGFSZWN0LnksIGFSZWN0LncsIGFSZWN0LmggKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICBzdXBlci50cmFuc2xhdGUoIHgsIHkgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggeCwgeSApO1xuICAgIH1cblxuICAgIGludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3QgKTtcblxuICAgICAgICAvLyBXZSBhZGQgc29tZSBleHRyYSBtYXJnaW5zIHRvIGFjY291bnQgZm9yIGFudGlhbGlhc2luZ1xuICAgICAgICB2YXIgaVJlY3QgPSBhUmVjdC5jbG9uZSgpO1xuICAgICAgICBpUmVjdC5leHBhbmQoIDEgKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlY3QoXG4gICAgICAgICAgICBpUmVjdC54LFxuICAgICAgICAgICAgaVJlY3QueSxcbiAgICAgICAgICAgIGlSZWN0LncsXG4gICAgICAgICAgICBpUmVjdC5oXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmNsaXAoKTtcbiAgICB9XG5cbiAgICBwdXNoU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnB1c2hTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5wb3BTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxufSIsImltcG9ydCB7IFN0YXRlZnVsIH0gICAgICAgIGZyb20gJy4vU3RhdGVmdWwnO1xuaW1wb3J0IHsgVHJhbnNmb3JtTWF0cml4IH0gZnJvbSAnLi4vZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4JztcbmltcG9ydCB7IFJlY3QgfSAgICAgICAgICAgIGZyb20gJy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUG9pbnQgfSAgICAgICAgICAgZnJvbSAnLi4vZ2VvbWV0cnkvUG9pbnQnO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFBhaW50ZXIgZXh0ZW5kcyBTdGF0ZWZ1bCB7XG4gICAgcHJvdGVjdGVkIGNsaXBBcmVhOiBSZWN0O1xuICAgIHByb3RlY3RlZCBtYXRyaXg6ICAgVHJhbnNmb3JtTWF0cml4O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IFRyYW5zZm9ybU1hdHJpeCgpO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGRyYXdSZWN0YW5nbGUoIGFSZWN0OiBSZWN0ICk6IHZvaWQ7XG5cbiAgICB0cmFuc2xhdGUoIHgsIHkgKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWF0cml4LnRyYW5zbGF0ZSggbmV3IFBvaW50KCB4LCB5ICkgKVxuICAgIH1cblxuICAgIGludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIC8vIE91ciBjbGlwQXJlYSBpcyBpbiBhYnNvbHV0ZSBjb29yZGluYXRlcywgc28gd2UgY29udmVydCB0aGUgcmVjdFxuICAgICAgICAvLyB0byBhYnNvbHV0ZSBvbmVzLlxuICAgICAgICB2YXIgaUFic29sdXRlUmVjdCA9IHRoaXMudG9BYnNvbHV0ZVJlY3QoIGFSZWN0ICk7XG4gICAgICAgIGlmICggdGhpcy5jbGlwQXJlYSApIHtcbiAgICAgICAgICAgIHRoaXMuY2xpcEFyZWEuaW50ZXJzZWN0KCBpQWJzb2x1dGVSZWN0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsaXBBcmVhID0gaUFic29sdXRlUmVjdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzUmVjdFdpdGhpbkNsaXBBcmVhKCBhUmVjdDogUmVjdCApOiBib29sZWFuIHtcbiAgICAgICAgLy8gQ2xpcCBhcmVhIGlzIGluIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gICAgICAgIC8vIFNvIHdlIGNvbnZlcnQgdGhlIHJlY3QgdG8gYWJzb2x1dGUgb25lcy5cbiAgICAgICAgdmFyIGlBYnNvbHV0ZVJlY3QgPSB0aGlzLnRvQWJzb2x1dGVSZWN0KCBhUmVjdCApO1xuICAgICAgICBpZiAoIHRoaXMuY2xpcEFyZWEgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGlwQXJlYS5pc092ZXJsYXBwaW5nV2l0aCggaUFic29sdXRlUmVjdCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b0Fic29sdXRlUmVjdCggYVJlY3Q6IFJlY3QgKTogUmVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeC50cmFuc2Zvcm1SZWN0KCBhUmVjdCApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpIDogYW55IHtcbiAgICAgICAgdmFyIGlTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XG4gICAgICAgIGlTdGF0ZS5tYXRyaXggICA9IHRoaXMubWF0cml4LmNsb25lKCk7XG4gICAgICAgIGlTdGF0ZS5jbGlwQXJlYSA9IHRoaXMuY2xpcEFyZWEgPyB0aGlzLmNsaXBBcmVhLmNsb25lKCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBpU3RhdGU7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlc3RvcmVTdGF0ZSggYVN0YXRlOiBhbnkgKSB7XG4gICAgICAgIHRoaXMubWF0cml4ICAgPSBhU3RhdGUubWF0cml4O1xuICAgICAgICB0aGlzLmNsaXBBcmVhID0gYVN0YXRlLmNsaXBBcmVhO1xuICAgIH1cblxufVxuIiwiZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTdGF0ZWZ1bCB7XG4gICAgcHJvdGVjdGVkIHN0YXRlU3RhY2s6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGVTdGFjayA9IFtdO1xuICAgIH1cblxuICAgIHB1c2hTdGF0ZSgpIHtcbiAgICAgICAgdmFyIGlTdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoKTtcbiAgICAgICAgdGhpcy5zdGF0ZVN0YWNrLnB1c2goIGlTdGF0ZSApO1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCkge1xuICAgICAgICB2YXIgaVN0YXRlID0gdGhpcy5zdGF0ZVN0YWNrLnBvcCgpO1xuICAgICAgICB0aGlzLnJlc3RvcmVTdGF0ZSggaVN0YXRlICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCkgOiBhbnkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlc3RvcmVTdGF0ZSggYVN0YXRlOiBhbnkgKTtcblxufVxuIiwiaW1wb3J0ICogYXMgZ2VvbWV0cnkgZnJvbSAnLi9nZW9tZXRyeS9nZW9tZXRyeS5ucyc7XG5leHBvcnQgeyBnZW9tZXRyeSB9O1xuXG5leHBvcnQgeyBDb250cm9sIH0gZnJvbSAnLi9Db250cm9sJztcbmV4cG9ydCB7IFJlY3RhbmdsZSB9IGZyb20gJy4vdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlJztcbiIsImltcG9ydCB7IENvbXBvc2l0ZSB9IGZyb20gJy4vLi4vLi4vY29yZS9Db21wb3NpdGUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgVmlld2VlIGV4dGVuZHMgQ29tcG9zaXRlPCBWaWV3ZWUgPiB7XG5cbiAgICBhYnN0cmFjdCBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIHBhaW50Q2hpbGRyZW4oIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBpZiAoIHRoaXMuaXNDaGlsZGxlc3MoKSApIHJldHVybjtcblxuICAgICAgICBhUGFpbnRlci5wdXNoU3RhdGUoKTtcblxuICAgICAgICB0aGlzLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoQ2hpbGQoIGZ1bmN0aW9uKCBhQ2hpbGQgKSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFpbnQoIGFQYWludGVyICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFQYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxuXG4gICAgYmVmb3JlQ2hpbGRyZW5QYWludGluZyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICAvLyBEb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC4gQ2hpbGRyZW4gd2lsbCBvdmVycmlkZS5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFNoYXBlIH0gICBmcm9tICcuL1NoYXBlJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuLy4uLy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgU2hhcGUge1xuICAgIHJlY3Q6IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVjdCA9IGFSZWN0O1xuICAgIH1cblxuICAgIHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGFQYWludGVyLmRyYXdSZWN0YW5nbGUoIHRoaXMucmVjdCApO1xuICAgIH1cblxuICAgIGdldFJlY3RCb3VuZHMoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgZnJvbSAnLi8uLi9WaWV3ZWUnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gICAgZnJvbSAnLi8uLi8uLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTaGFwZSBleHRlbmRzIFZpZXdlZSB7XG5cbiAgICBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGlmICggdGhpcy5pc1dpdGhpbkNsaXBBcmVhKCBhUGFpbnRlciApICkge1xuICAgICAgICAgICAgdGhpcy5wYWludFNlbGYoIGFQYWludGVyIClcbiAgICAgICAgICAgIHRoaXMucGFpbnRDaGlsZHJlbiggYVBhaW50ZXIgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFic3RyYWN0IHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIGFic3RyYWN0IGdldFJlY3RCb3VuZHMoKTogUmVjdDtcblxuICAgIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBhUGFpbnRlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIHRoaXMuZ2V0UmVjdEJvdW5kcygpICk7XG4gICAgICAgIHN1cGVyLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICB2YXIgaUJvdW5kcyA9IHRoaXMuZ2V0UmVjdEJvdW5kcygpO1xuICAgICAgICBhUGFpbnRlci50cmFuc2xhdGUoIGlCb3VuZHMuZ2V0TGVmdCgpLCBpQm91bmRzLmdldFRvcCgpICk7XG4gICAgfVxuXG4gICAgaXNXaXRoaW5DbGlwQXJlYSggYVBhaW50ZXI6IFBhaW50ZXIgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBhUGFpbnRlci5pc1JlY3RXaXRoaW5DbGlwQXJlYSggdGhpcy5nZXRSZWN0Qm91bmRzKCkgKTtcbiAgICB9XG5cbn1cbiJdfQ==
