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
var Root_1 = require('./viewees/unseen/Root');
var Control = (function () {
    function Control(aContainer) {
        this.contents = null;
        this.container = aContainer;
        this.bounds = new Rect_1.Rect(0, 0, aContainer.offsetWidth, aContainer.offsetHeight);
        this.canvas = this.createCanvas(aContainer);
        this.context = this.getContext(this.canvas);
        this.painter = new ContextPainter_1.ContextPainter(this.context);
        this.root = new Root_1.Root(this);
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
        if (this.contents !== null) {
            this.root.removeChild(this.contents);
        }
        this.contents = aViewee;
        this.root.addChild(aViewee);
        this.root.paint(this.painter);
    };
    Control.prototype.getBoundingRect = function () {
        return this.bounds;
    };
    return Control;
}());
exports.Control = Control;

},{"./geometry/Rect":5,"./painters/ContextPainter":8,"./viewees/unseen/Root":15}],4:[function(require,module,exports){
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
var Transformer_1 = require('./viewees/unseen/Transformer');
exports.Transformer = Transformer_1.Transformer;
var Root_1 = require('./viewees/unseen/Root');
exports.Root = Root_1.Root;

},{"./Control":3,"./geometry/geometry.ns":7,"./viewees/shapes/Rectangle":13,"./viewees/unseen/Root":15,"./viewees/unseen/Transformer":16}],12:[function(require,module,exports){
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

},{"./../Viewee":12}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unseen_1 = require('./Unseen');
var Root = (function (_super) {
    __extends(Root, _super);
    function Root(aControl) {
        _super.call(this);
        this.control = aControl;
    }
    Root.prototype.beforeChildrenPainting = function (aPainter) {
        _super.prototype.beforeChildrenPainting.call(this, aPainter);
        this.setClipAreaToControlBounds(aPainter);
    };
    Root.prototype.setClipAreaToControlBounds = function (aPainter) {
        var iControlBounds = this.control.getBoundingRect();
        aPainter.intersectClipAreaWith(iControlBounds);
    };
    return Root;
}(Unseen_1.Unseen));
exports.Root = Root;

},{"./Unseen":17}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unseen_1 = require('./Unseen');
var Point_1 = require('../../geometry/Point');
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer() {
        _super.apply(this, arguments);
        this.translation = new Point_1.Point(0, 0);
        this.scale = new Point_1.Point(1, 1);
    }
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
}(Unseen_1.Unseen));
exports.Transformer = Transformer;

},{"../../geometry/Point":4,"./Unseen":17}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Viewee_1 = require('../Viewee');
var Unseen = (function (_super) {
    __extends(Unseen, _super);
    function Unseen() {
        _super.apply(this, arguments);
    }
    Unseen.prototype.paint = function (aPainter) {
        this.paintChildren(aPainter);
    };
    return Unseen;
}(Viewee_1.Viewee));
exports.Unseen = Unseen;

},{"../Viewee":12}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9wYWludGVycy9Db250ZXh0UGFpbnRlci50cyIsInNyYy92aWV3L3BhaW50ZXJzL1BhaW50ZXIudHMiLCJzcmMvdmlldy9wYWludGVycy9TdGF0ZWZ1bC50cyIsInNyYy92aWV3L3ZpZXcubnMudHMiLCJzcmMvdmlldy92aWV3ZWVzL1ZpZXdlZS50cyIsInNyYy92aWV3L3ZpZXdlZXMvc2hhcGVzL1JlY3RhbmdsZS50cyIsInNyYy92aWV3L3ZpZXdlZXMvc2hhcGVzL1NoYXBlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy91bnNlZW4vUm9vdC50cyIsInNyYy92aWV3L3ZpZXdlZXMvdW5zZWVuL1RyYW5zZm9ybWVyLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy91bnNlZW4vVW5zZWVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0lBS0k7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFLLElBQUksQ0FBQztJQUN6QixDQUFDO0lBTUQsNEJBQVEsR0FBUixVQUFVLE1BQU07UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsK0JBQVcsR0FBWDtRQUFhLGNBQVk7YUFBWixXQUFZLENBQVosc0JBQVksQ0FBWixJQUFZO1lB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Q0FBQztJQUpHLHNCQUFLLEdBQUwsVUFBTyxRQUFpQjtRQUNwQixJQUFJLENBQUMsYUFBYSxDQUFFLFFBQVEsQ0FBRSxDQUFDO0lBQ25DLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0FQQSxBQU9DLENBTm9CLGVBQU0sR0FNMUI7QUFOSyxjQUFNLFNBTVgsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRcbmNsYXNzIENvbXBvc2l0ZTwgVCA+IHtcbiAgICBwcml2YXRlIGNoaWxkcmVuOiBUW107XG4gICAgcHJpdmF0ZSBwYXJlbnQgOiAgVDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ICAgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogQWRkaW5nIGFuZCByZW1vdmluZ1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBhZGRDaGlsZCggYUNoaWxkICk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGFDaGlsZCApO1xuICAgICAgICBhQ2hpbGQucGFyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICBhZGRDaGlsZHJlbiggLi4uYXJnczogVFtdICk6IHZvaWQge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoIGFyZ3VtZW50c1tpXSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGQoIGFDaGlsZCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGlDaGlsZEluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKCBhQ2hpbGQgKTtcblxuICAgICAgICBpZiAoIGlDaGlsZEluZGV4ID09PSAtMSApIHtcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgcmVxdWVzdGVkIGNoaWxkXCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFDaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoIGlDaGlsZEluZGV4LCAxICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFV0aWxpdHlcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZm9yRWFjaENoaWxkKCBhQ2FsbGJhY2sgKTogdm9pZCB7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBhQ2FsbGJhY2soIHRoaXMuY2hpbGRyZW5baV0sIGkgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQ2hpbGRsZXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgaGFzUGFyZW50KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgIT0gbnVsbDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgKiBhcyB2aWV3IGZyb20gJy4vdmlldy92aWV3Lm5zJztcbmV4cG9ydCB7dmlld307XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgICAgICAgIGZyb20gJy4vdmlld2Vlcy9WaWV3ZWUnO1xuaW1wb3J0IHsgQ29udGV4dFBhaW50ZXIgfSBmcm9tICcuL3BhaW50ZXJzL0NvbnRleHRQYWludGVyJztcbmltcG9ydCB7IFJlY3QgfSAgICAgICAgICAgZnJvbSAnLi9nZW9tZXRyeS9SZWN0JztcbmltcG9ydCB7IFJvb3QgfSAgICAgICAgICAgZnJvbSAnLi92aWV3ZWVzL3Vuc2Vlbi9Sb290J1xuXG5leHBvcnRcbmNsYXNzIENvbnRyb2wge1xuICAgIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIGNhbnZhczogICAgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjb250ZXh0OiAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIHBhaW50ZXI6ICAgQ29udGV4dFBhaW50ZXI7XG4gICAgcHJpdmF0ZSBib3VuZHM6ICAgIFJlY3Q7XG4gICAgcHJpdmF0ZSBjb250ZW50czogIFZpZXdlZSA9IG51bGw7XG4gICAgcHJpdmF0ZSByb290OiAgICAgIFJvb3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gYUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5ib3VuZHMgICAgPSBuZXcgUmVjdCggMCwgMCwgYUNvbnRhaW5lci5vZmZzZXRXaWR0aCwgYUNvbnRhaW5lci5vZmZzZXRIZWlnaHQgKTtcbiAgICAgICAgdGhpcy5jYW52YXMgICAgPSB0aGlzLmNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lciApO1xuICAgICAgICB0aGlzLmNvbnRleHQgICA9IHRoaXMuZ2V0Q29udGV4dCggdGhpcy5jYW52YXMgKTtcbiAgICAgICAgdGhpcy5wYWludGVyICAgPSBuZXcgQ29udGV4dFBhaW50ZXIoIHRoaXMuY29udGV4dCApO1xuXG4gICAgICAgIHRoaXMucm9vdCA9IG5ldyBSb290KCB0aGlzICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVDYW52YXMoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkgOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgICAgIHZhciBpQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnQ0FOVkFTJyApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ3dpZHRoJywgIGFDb250YWluZXIub2Zmc2V0V2lkdGgudG9TdHJpbmcoKSAgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICdoZWlnaHQnLCBhQ29udGFpbmVyLm9mZnNldEhlaWdodC50b1N0cmluZygpICk7XG4gICAgICAgIGFDb250YWluZXIuYXBwZW5kQ2hpbGQoIGlDYW52YXMgKTtcbiAgICAgICAgcmV0dXJuIGlDYW52YXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb250ZXh0KCBhQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCApOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgICAgICB2YXIgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xuICAgICAgICAvLyBjb250ZXh0LnRyYW5zbGF0ZSggMC41LCAwLjUgKTsgLy8gUHJldmVudHMgYW50aWFsaWFzaW5nIGVmZmVjdC5cbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzFBQkM5Qyc7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb250ZW50cyggYVZpZXdlZTogVmlld2VlICkge1xuICAgICAgICBpZiAoIHRoaXMuY29udGVudHMgIT09IG51bGwgKSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QucmVtb3ZlQ2hpbGQoIHRoaXMuY29udGVudHMgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGVudHMgPSBhVmlld2VlO1xuICAgICAgICB0aGlzLnJvb3QuYWRkQ2hpbGQoIGFWaWV3ZWUgKTtcblxuICAgICAgICB0aGlzLnJvb3QucGFpbnQoIHRoaXMucGFpbnRlciApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRCb3VuZGluZ1JlY3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJvdW5kcztcbiAgICB9XG59XG4iLCJleHBvcnRcbmNsYXNzIFBvaW50IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoIHg6IG51bWJlciwgeTogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIHRoaXMueCwgdGhpcy55ICk7XG4gICAgfVxuXG4gICAgc2V0KCB4OiBudW1iZXIsIHk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFJlY3Qge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgdzogbnVtYmVyO1xuICAgIGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCBhWDogbnVtYmVyLCBhWTogbnVtYmVyLCBhVzogbnVtYmVyLCBhSDogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnggPSBhWDtcbiAgICAgICAgdGhpcy55ID0gYVk7XG4gICAgICAgIHRoaXMudyA9IGFXO1xuICAgICAgICB0aGlzLmggPSBhSDtcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0KCB0aGlzLngsIHRoaXMueSwgdGhpcy53LCB0aGlzLmggKTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLncgPj0gMCA/IHRoaXMueCA6IHRoaXMueCArIHRoaXMudztcbiAgICB9XG5cbiAgICBnZXRSaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggKyB0aGlzLncgOiB0aGlzLng7XG4gICAgfVxuXG4gICAgZ2V0VG9wKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSA6IHRoaXMueSArIHRoaXMuaDtcbiAgICB9XG5cbiAgICBnZXRCb3R0b20oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55ICsgdGhpcy5oIDogdGhpcy55O1xuICAgIH1cblxuICAgIGdldExlZnRUb3AoKTogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLmdldExlZnQoKSwgdGhpcy5nZXRUb3AoKSApO1xuICAgIH1cblxuICAgIGludGVyc2VjdCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHZhciBpTGVmdCAgID0gTWF0aC5tYXgoIHRoaXMuZ2V0TGVmdCgpLCAgIGFSZWN0LmdldExlZnQoKSAgICksXG4gICAgICAgICAgICBpVG9wICAgID0gTWF0aC5tYXgoIHRoaXMuZ2V0VG9wKCksICAgIGFSZWN0LmdldFRvcCgpICAgICksXG4gICAgICAgICAgICBpUmlnaHQgID0gTWF0aC5taW4oIHRoaXMuZ2V0UmlnaHQoKSwgIGFSZWN0LmdldFJpZ2h0KCkgICksXG4gICAgICAgICAgICBpQm90dG9tID0gTWF0aC5taW4oIHRoaXMuZ2V0Qm90dG9tKCksIGFSZWN0LmdldEJvdHRvbSgpICk7XG5cbiAgICAgICAgdGhpcy54ID0gaUxlZnQ7XG4gICAgICAgIHRoaXMueSA9IGlUb3A7XG4gICAgICAgIHRoaXMudyA9IGlSaWdodCAtIGlMZWZ0O1xuICAgICAgICB0aGlzLmggPSBpQm90dG9tIC0gaVRvcDtcbiAgICB9XG5cbiAgICBpc092ZXJsYXBwaW5nV2l0aCggYVJlY3Q6IFJlY3QgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmdldExlZnQoKSAgPD0gYVJlY3QuZ2V0UmlnaHQoKSAmJlxuICAgICAgICAgICAgYVJlY3QuZ2V0TGVmdCgpIDw9IHRoaXMuZ2V0UmlnaHQoKSAmJlxuICAgICAgICAgICAgdGhpcy5nZXRUb3AoKSAgIDw9IGFSZWN0LmdldEJvdHRvbSgpICYmXG4gICAgICAgICAgICBhUmVjdC5nZXRUb3AoKSAgPD0gdGhpcy5nZXRCb3R0b20oKVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZXhwYW5kKCBhUG9pbnRzOiBudW1iZXIgKTogdm9pZCB7XG4gICAgICAgIHZhciBoU2lnbiA9IHRoaXMudyA+PSAwID8gLTEgOiAxO1xuICAgICAgICB2YXIgdlNpZ24gPSB0aGlzLmggPj0gMCA/IC0xIDogMTtcblxuICAgICAgICB0aGlzLnggKz0gIGhTaWduICogYVBvaW50cztcbiAgICAgICAgdGhpcy55ICs9ICB2U2lnbiAqIGFQb2ludHM7XG4gICAgICAgIHRoaXMudyArPSAtaFNpZ24gKiBhUG9pbnRzICogMjtcbiAgICAgICAgdGhpcy5oICs9IC12U2lnbiAqIGFQb2ludHMgKiAyO1xuICAgIH1cblxuICAgIGNvbnRyYWN0KCBhUG9pbnRzOiBudW1iZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXhwYW5kKCAtYVBvaW50cyApO1xuICAgIH1cblxufVxuIiwiLyoqXG4gKlxuICogQSBwYXJ0aWFsIDJEIHRyYW5zZm9ybSBtYXRyaXguIEN1cnJlbnRseSBkb2Vzbid0IHN1cHBvcnQgcm90YXRpb24gKGFuZCBoZW5jZVxuICogc2tldykuXG4gKi9cblxuaW1wb3J0IHsgUmVjdCB9ICBmcm9tICcuL1JlY3QnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBUcmFuc2Zvcm1NYXRyaXgge1xuICAgIHNjYWxlWCAgICA6IG51bWJlcjsgLy8gYVxuICAgIHNjYWxlWSAgICA6IG51bWJlcjsgLy8gZFxuICAgIHRyYW5zbGF0ZVg6IG51bWJlcjsgLy8gZSBvciB0eFxuICAgIHRyYW5zbGF0ZVk6IG51bWJlcjsgLy8gZiBvciB0eVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWSA9IDA7XG4gICAgICAgIHRoaXMuc2NhbGVYICAgICA9IDE7XG4gICAgICAgIHRoaXMuc2NhbGVZICAgICA9IDE7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFRyYW5zZm9ybU1hdHJpeCB7XG4gICAgICAgIHZhciBpQ2xvbmUgPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XG4gICAgICAgIGlDbG9uZS50cmFuc2xhdGVYID0gdGhpcy50cmFuc2xhdGVYO1xuICAgICAgICBpQ2xvbmUudHJhbnNsYXRlWSA9IHRoaXMudHJhbnNsYXRlWTtcbiAgICAgICAgaUNsb25lLnNjYWxlWCA9IHRoaXMuc2NhbGVYO1xuICAgICAgICBpQ2xvbmUuc2NhbGVZID0gdGhpcy5zY2FsZVk7XG5cbiAgICAgICAgcmV0dXJuIGlDbG9uZTtcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUoIGFUcmFuc2xhdGlvbjogUG9pbnQgKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCArPSBhVHJhbnNsYXRpb24ueCAqIHRoaXMuc2NhbGVYO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgKz0gYVRyYW5zbGF0aW9uLnkgKiB0aGlzLnNjYWxlWTtcbiAgICB9XG5cbiAgICBzY2FsZSggYVNjYWxlOiBQb2ludCApIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVYICo9IGFTY2FsZS54O1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgKj0gYVNjYWxlLnk7XG5cbiAgICAgICAgdGhpcy5zY2FsZVggICAgICo9IGFTY2FsZS54O1xuICAgICAgICB0aGlzLnNjYWxlWSAgICAgKj0gYVNjYWxlLnk7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtUG9pbnQoIGFQb2ludDogUG9pbnQgKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgICAgICAgIGFQb2ludC54ICogdGhpcy5zY2FsZVggKyB0aGlzLnRyYW5zbGF0ZVgsXG4gICAgICAgICAgICBhUG9pbnQueSAqIHRoaXMuc2NhbGVZICsgdGhpcy50cmFuc2xhdGVZXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQSB0ZW1wb3JhbCBoYWNrLiBSZWN0cyBzaG91bGQgcmVhbGx5IGJlIHJlcHJlc2VudGVkIGFzIGEgcG9seWdvbiB0b1xuICAgIC8vIHN1cHBvcnQgcm90YXRlLCBidXQgdGhpcyB3aWxsIGRvIGZvciBub3cuXG4gICAgdHJhbnNmb3JtUmVjdCggYVJlY3Q6IFJlY3QgKSA6IFJlY3Qge1xuICAgICAgICB2YXIgaUxlZnRUb3AgICAgICAgICAgICA9IGFSZWN0LmdldExlZnRUb3AoKSxcbiAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AgPSB0aGlzLnRyYW5zZm9ybVBvaW50KCBpTGVmdFRvcCApLFxuXG4gICAgICAgICAgICBpVHJhbnNmb3JtZWRSZWN0ID0gbmV3IFJlY3QoXG4gICAgICAgICAgICAgICAgaVRyYW5zZm9ybWVkTGVmdFRvcC54LFxuICAgICAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AueSxcbiAgICAgICAgICAgICAgICBhUmVjdC53ICogdGhpcy5zY2FsZVgsXG4gICAgICAgICAgICAgICAgYVJlY3QuaCAqIHRoaXMuc2NhbGVZXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBpVHJhbnNmb3JtZWRSZWN0O1xuICAgIH1cblxufVxuIiwiZXhwb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IFJlY3QgfSBmcm9tICcuL1JlY3QnO1xuIiwiaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vUGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi4vZ2VvbWV0cnkvUmVjdCc7XG5cbmV4cG9ydFxuY2xhc3MgQ29udGV4dFBhaW50ZXIgZXh0ZW5kcyBQYWludGVyIHtcbiAgICBwcm90ZWN0ZWQgY29udGV4dDogIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEICkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBhQ29udGV4dDtcbiAgICB9XG5cbiAgICBkcmF3UmVjdGFuZ2xlKCBhUmVjdDogUmVjdCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQucmVjdCggYVJlY3QueCwgYVJlY3QueSwgYVJlY3QudywgYVJlY3QuaCApO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUoIHgsIHkgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnRyYW5zbGF0ZSggeCwgeSApO1xuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKCB4LCB5ICk7XG4gICAgfVxuXG4gICAgc2NhbGUoIHgsIHkgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNjYWxlKCB4LCB5ICk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zY2FsZSggeCwgeSApO1xuICAgIH1cblxuICAgIGludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3QgKTtcblxuICAgICAgICAvLyBXZSBhZGQgc29tZSBleHRyYSBtYXJnaW5zIHRvIGFjY291bnQgZm9yIGFudGlhbGlhc2luZ1xuICAgICAgICB2YXIgaVJlY3QgPSBhUmVjdC5jbG9uZSgpO1xuICAgICAgICBpUmVjdC5leHBhbmQoIDEgKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlY3QoXG4gICAgICAgICAgICBpUmVjdC54LFxuICAgICAgICAgICAgaVJlY3QueSxcbiAgICAgICAgICAgIGlSZWN0LncsXG4gICAgICAgICAgICBpUmVjdC5oXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmNsaXAoKTtcbiAgICB9XG5cbiAgICBwdXNoU3RhdGUoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnB1c2hTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5wb3BTdGF0ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxufSIsImltcG9ydCB7IFN0YXRlZnVsIH0gICAgICAgIGZyb20gJy4vU3RhdGVmdWwnO1xuaW1wb3J0IHsgVHJhbnNmb3JtTWF0cml4IH0gZnJvbSAnLi4vZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4JztcbmltcG9ydCB7IFJlY3QgfSAgICAgICAgICAgIGZyb20gJy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUG9pbnQgfSAgICAgICAgICAgZnJvbSAnLi4vZ2VvbWV0cnkvUG9pbnQnO1xuXG5leHBvcnRcbmFic3RyYWN0IGNsYXNzIFBhaW50ZXIgZXh0ZW5kcyBTdGF0ZWZ1bCB7XG4gICAgcHJvdGVjdGVkIGNsaXBBcmVhOiBSZWN0O1xuICAgIHByb3RlY3RlZCBtYXRyaXg6ICAgVHJhbnNmb3JtTWF0cml4O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IFRyYW5zZm9ybU1hdHJpeCgpO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGRyYXdSZWN0YW5nbGUoIGFSZWN0OiBSZWN0ICk6IHZvaWQ7XG5cbiAgICB0cmFuc2xhdGUoIHgsIHkgKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWF0cml4LnRyYW5zbGF0ZSggbmV3IFBvaW50KCB4LCB5ICkgKVxuICAgIH1cblxuICAgIHNjYWxlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICB0aGlzLm1hdHJpeC5zY2FsZSggbmV3IFBvaW50KCB4LCB5ICkgKVxuICAgIH1cblxuICAgIGludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIC8vIE91ciBjbGlwQXJlYSBpcyBpbiBhYnNvbHV0ZSBjb29yZGluYXRlcywgc28gd2UgY29udmVydCB0aGUgcmVjdFxuICAgICAgICAvLyB0byBhYnNvbHV0ZSBvbmVzLlxuICAgICAgICB2YXIgaUFic29sdXRlUmVjdCA9IHRoaXMudG9BYnNvbHV0ZVJlY3QoIGFSZWN0ICk7XG4gICAgICAgIGlmICggdGhpcy5jbGlwQXJlYSApIHtcbiAgICAgICAgICAgIHRoaXMuY2xpcEFyZWEuaW50ZXJzZWN0KCBpQWJzb2x1dGVSZWN0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsaXBBcmVhID0gaUFic29sdXRlUmVjdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzUmVjdFdpdGhpbkNsaXBBcmVhKCBhUmVjdDogUmVjdCApOiBib29sZWFuIHtcbiAgICAgICAgLy8gQ2xpcCBhcmVhIGlzIGluIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gICAgICAgIC8vIFNvIHdlIGNvbnZlcnQgdGhlIHJlY3QgdG8gYWJzb2x1dGUgb25lcy5cbiAgICAgICAgdmFyIGlBYnNvbHV0ZVJlY3QgPSB0aGlzLnRvQWJzb2x1dGVSZWN0KCBhUmVjdCApO1xuICAgICAgICBpZiAoIHRoaXMuY2xpcEFyZWEgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGlwQXJlYS5pc092ZXJsYXBwaW5nV2l0aCggaUFic29sdXRlUmVjdCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b0Fic29sdXRlUmVjdCggYVJlY3Q6IFJlY3QgKTogUmVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeC50cmFuc2Zvcm1SZWN0KCBhUmVjdCApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpIDogYW55IHtcbiAgICAgICAgdmFyIGlTdGF0ZSA9IHN1cGVyLmdldFN0YXRlKCk7XG4gICAgICAgIGlTdGF0ZS5tYXRyaXggICA9IHRoaXMubWF0cml4LmNsb25lKCk7XG4gICAgICAgIGlTdGF0ZS5jbGlwQXJlYSA9IHRoaXMuY2xpcEFyZWEgPyB0aGlzLmNsaXBBcmVhLmNsb25lKCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBpU3RhdGU7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlc3RvcmVTdGF0ZSggYVN0YXRlOiBhbnkgKSB7XG4gICAgICAgIHRoaXMubWF0cml4ICAgPSBhU3RhdGUubWF0cml4O1xuICAgICAgICB0aGlzLmNsaXBBcmVhID0gYVN0YXRlLmNsaXBBcmVhO1xuICAgIH1cblxufVxuIiwiZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTdGF0ZWZ1bCB7XG4gICAgcHJvdGVjdGVkIHN0YXRlU3RhY2s6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGVTdGFjayA9IFtdO1xuICAgIH1cblxuICAgIHB1c2hTdGF0ZSgpIHtcbiAgICAgICAgdmFyIGlTdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoKTtcbiAgICAgICAgdGhpcy5zdGF0ZVN0YWNrLnB1c2goIGlTdGF0ZSApO1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCkge1xuICAgICAgICB2YXIgaVN0YXRlID0gdGhpcy5zdGF0ZVN0YWNrLnBvcCgpO1xuICAgICAgICB0aGlzLnJlc3RvcmVTdGF0ZSggaVN0YXRlICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCkgOiBhbnkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlc3RvcmVTdGF0ZSggYVN0YXRlOiBhbnkgKTtcblxufVxuIiwiaW1wb3J0ICogYXMgZ2VvbWV0cnkgZnJvbSAnLi9nZW9tZXRyeS9nZW9tZXRyeS5ucyc7XG5leHBvcnQgeyBnZW9tZXRyeSB9O1xuXG5leHBvcnQgeyBDb250cm9sIH0gICAgIGZyb20gJy4vQ29udHJvbCc7XG5leHBvcnQgeyBSZWN0YW5nbGUgfSAgIGZyb20gJy4vdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlJztcbmV4cG9ydCB7IFRyYW5zZm9ybWVyIH0gZnJvbSAnLi92aWV3ZWVzL3Vuc2Vlbi9UcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBSb290IH0gICAgICAgIGZyb20gJy4vdmlld2Vlcy91bnNlZW4vUm9vdCc7XG4iLCJpbXBvcnQgeyBDb21wb3NpdGUgfSBmcm9tICcuLy4uLy4uL2NvcmUvQ29tcG9zaXRlJztcbmltcG9ydCB7IFBhaW50ZXIgfSAgIGZyb20gJy4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgVmlld2VlIGV4dGVuZHMgQ29tcG9zaXRlPCBWaWV3ZWUgPiB7XG5cbiAgICBhYnN0cmFjdCBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZDtcblxuICAgIHByb3RlY3RlZCBwYWludENoaWxkcmVuKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgaWYgKCB0aGlzLmlzQ2hpbGRsZXNzKCkgKSByZXR1cm47XG5cbiAgICAgICAgYVBhaW50ZXIucHVzaFN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5iZWZvcmVDaGlsZHJlblBhaW50aW5nKCBhUGFpbnRlciApO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaENoaWxkKCBmdW5jdGlvbiggYUNoaWxkICkge1xuICAgICAgICAgICAgYUNoaWxkLnBhaW50KCBhUGFpbnRlciApO1xuICAgICAgICB9KTtcblxuICAgICAgICBhUGFpbnRlci5wb3BTdGF0ZSgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBiZWZvcmVDaGlsZHJlblBhaW50aW5nKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hcHBseVRyYW5zZm9ybWF0aW9ucyggYVBhaW50ZXIgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICAvLyBEb2VzIG5vdGhpbmcgYnkgZGVmYXVsdC4gQ2hpbGRyZW4gd2lsbCBvdmVycmlkZS5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFNoYXBlIH0gICBmcm9tICcuL1NoYXBlJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuLy4uLy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vcGFpbnRlcnMvUGFpbnRlcic7XG5cbmV4cG9ydFxuY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgU2hhcGUge1xuICAgIHByaXZhdGUgcmVjdDogUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKCBhUmVjdDogUmVjdCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZWN0ID0gYVJlY3Q7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhaW50U2VsZiggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGFQYWludGVyLmRyYXdSZWN0YW5nbGUoIHRoaXMucmVjdCApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRSZWN0Qm91bmRzKCk6IFJlY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWN0O1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVmlld2VlIH0gIGZyb20gJy4vLi4vVmlld2VlJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLy4uLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuaW1wb3J0IHsgUmVjdCB9ICAgIGZyb20gJy4vLi4vLi4vZ2VvbWV0cnkvUmVjdCc7XG5cbmV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgU2hhcGUgZXh0ZW5kcyBWaWV3ZWUge1xuXG4gICAgcGFpbnQoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBpZiAoIHRoaXMuaXNXaXRoaW5DbGlwQXJlYSggYVBhaW50ZXIgKSApIHtcbiAgICAgICAgICAgIHRoaXMucGFpbnRTZWxmKCBhUGFpbnRlciApXG4gICAgICAgICAgICB0aGlzLnBhaW50Q2hpbGRyZW4oIGFQYWludGVyICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcGFpbnRTZWxmKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkO1xuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGdldFJlY3RCb3VuZHMoKTogUmVjdDtcblxuICAgIHByb3RlY3RlZCBiZWZvcmVDaGlsZHJlblBhaW50aW5nKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgYVBhaW50ZXIuaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCB0aGlzLmdldFJlY3RCb3VuZHMoKSApO1xuICAgICAgICBzdXBlci5iZWZvcmVDaGlsZHJlblBhaW50aW5nKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhcHBseVRyYW5zZm9ybWF0aW9ucyggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlciApO1xuICAgICAgICB2YXIgaUJvdW5kcyA9IHRoaXMuZ2V0UmVjdEJvdW5kcygpO1xuICAgICAgICBhUGFpbnRlci50cmFuc2xhdGUoIGlCb3VuZHMuZ2V0TGVmdCgpLCBpQm91bmRzLmdldFRvcCgpICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzV2l0aGluQ2xpcEFyZWEoIGFQYWludGVyOiBQYWludGVyICk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gYVBhaW50ZXIuaXNSZWN0V2l0aGluQ2xpcEFyZWEoIHRoaXMuZ2V0UmVjdEJvdW5kcygpICk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBVbnNlZW4gfSAgZnJvbSAnLi9VbnNlZW4nO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4uLy4uL3BhaW50ZXJzL1BhaW50ZXInO1xuaW1wb3J0IHsgQ29udHJvbCB9IGZyb20gJy4uLy4uL0NvbnRyb2wnO1xuXG4vLyBBbiBhZGFwdGVyIGJldHdlZW4gdGhlIHZpZXdlZSBjb21wb3NpdGlvbiBhbmQgdGhlIGNvbnRyb2wuXG4vLyBUaGVyZSBpcyBvbmx5IG9uZSByb290IHBlciBoaWVyYXJjaHksIGFuZCBpdCBpcyBjcmVhdGVkIGF1dG9tYXRpY2FsbHlcbi8vIGJ5IHRoZSBjb250cm9sLlxuZXhwb3J0XG5jbGFzcyBSb290IGV4dGVuZHMgVW5zZWVuIHtcbiAgICBwcml2YXRlIGNvbnRyb2w6IENvbnRyb2xcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udHJvbDogQ29udHJvbCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb250cm9sID0gYUNvbnRyb2w7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBzdXBlci5iZWZvcmVDaGlsZHJlblBhaW50aW5nKCBhUGFpbnRlciApO1xuICAgICAgICB0aGlzLnNldENsaXBBcmVhVG9Db250cm9sQm91bmRzKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q2xpcEFyZWFUb0NvbnRyb2xCb3VuZHMoIGFQYWludGVyICl7XG4gICAgICAgIGxldCBpQ29udHJvbEJvdW5kcyA9IHRoaXMuY29udHJvbC5nZXRCb3VuZGluZ1JlY3QoKTtcbiAgICAgICAgYVBhaW50ZXIuaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCBpQ29udHJvbEJvdW5kcyApO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVW5zZWVuIH0gIGZyb20gJy4vVW5zZWVuJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLi8uLi9wYWludGVycy9QYWludGVyJztcbmltcG9ydCB7IFBvaW50IH0gICBmcm9tICcuLi8uLi9nZW9tZXRyeS9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgVHJhbnNmb3JtZXIgZXh0ZW5kcyBVbnNlZW4ge1xuXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvbjogUG9pbnQgPSBuZXcgUG9pbnQoIDAsIDAgKTtcbiAgICBwcml2YXRlIHNjYWxlOiAgICAgICBQb2ludCA9IG5ldyBQb2ludCggMSwgMSApO1xuXG4gICAgc2V0VHJhbnNsYXRlKCB4OiBudW1iZXIsIHk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbi5zZXQoIHgsIHkgKTtcbiAgICB9XG5cbiAgICBzZXRTY2FsZSggeDogbnVtYmVyLCB5OiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0KCB4LCB5ICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFQYWludGVyICk7XG4gICAgICAgIGFQYWludGVyLnRyYW5zbGF0ZSggdGhpcy50cmFuc2xhdGlvbi54LCB0aGlzLnRyYW5zbGF0aW9uLnkgKTtcbiAgICAgICAgYVBhaW50ZXIuc2NhbGUoIHRoaXMuc2NhbGUueCwgdGhpcy5zY2FsZS55ICk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgZnJvbSAnLi4vVmlld2VlJztcbmltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuLi8uLi9wYWludGVycy9QYWludGVyJztcblxuZXhwb3J0XG5jbGFzcyBVbnNlZW4gZXh0ZW5kcyBWaWV3ZWUge1xuXG4gICAgcGFpbnQoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhaW50Q2hpbGRyZW4oIGFQYWludGVyICk7XG4gICAgfVxuXG59XG4iXX0=
