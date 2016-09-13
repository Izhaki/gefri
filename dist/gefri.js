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

},{"./view/view.ns":12}],3:[function(require,module,exports){
"use strict";
var ContextPainter_1 = require('./output/ContextPainter');
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

},{"./geometry/Rect":5,"./output/ContextPainter":8,"./viewees/unseen/Root":16}],4:[function(require,module,exports){
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
    ContextPainter.prototype.restoreState = function (aState) {
        _super.prototype.restoreState.call(this, aState);
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
var Transformable_1 = require('./Transformable');
var Painter = (function (_super) {
    __extends(Painter, _super);
    function Painter() {
        _super.apply(this, arguments);
    }
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
    Painter.prototype.getState = function () {
        var iState = _super.prototype.getState.call(this);
        iState.clipArea = this.clipArea ? this.clipArea.clone() : undefined;
        return iState;
    };
    Painter.prototype.restoreState = function (aState) {
        _super.prototype.restoreState.call(this, aState);
        this.clipArea = aState.clipArea;
    };
    return Painter;
}(Transformable_1.Transformable));
exports.Painter = Painter;

},{"./Transformable":11}],10:[function(require,module,exports){
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Stateful_1 = require('./Stateful');
var TransformMatrix_1 = require('../geometry/TransformMatrix');
var Point_1 = require('../geometry/Point');
var Transformable = (function (_super) {
    __extends(Transformable, _super);
    function Transformable() {
        _super.call(this);
        this.matrix = new TransformMatrix_1.TransformMatrix();
    }
    Transformable.prototype.translate = function (x, y) {
        this.matrix.translate(new Point_1.Point(x, y));
    };
    Transformable.prototype.scale = function (x, y) {
        this.matrix.scale(new Point_1.Point(x, y));
    };
    Transformable.prototype.toAbsoluteRect = function (aRect) {
        return this.matrix.transformRect(aRect);
    };
    Transformable.prototype.getState = function () {
        var iState = _super.prototype.getState.call(this);
        iState.matrix = this.matrix.clone();
        return iState;
    };
    Transformable.prototype.restoreState = function (aState) {
        this.matrix = aState.matrix;
    };
    return Transformable;
}(Stateful_1.Stateful));
exports.Transformable = Transformable;

},{"../geometry/Point":4,"../geometry/TransformMatrix":6,"./Stateful":10}],12:[function(require,module,exports){
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

},{"./Control":3,"./geometry/geometry.ns":7,"./viewees/shapes/Rectangle":14,"./viewees/unseen/Root":16,"./viewees/unseen/Transformer":17}],13:[function(require,module,exports){
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
    Viewee.prototype.applyTransformations = function (aTransformable) {
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
    Shape.prototype.applyTransformations = function (aTransformable) {
        _super.prototype.applyTransformations.call(this, aTransformable);
        var iBounds = this.getRectBounds();
        aTransformable.translate(iBounds.getLeft(), iBounds.getTop());
    };
    Shape.prototype.isWithinClipArea = function (aPainter) {
        return aPainter.isRectWithinClipArea(this.getRectBounds());
    };
    return Shape;
}(Viewee_1.Viewee));
exports.Shape = Shape;

},{"./../Viewee":13}],16:[function(require,module,exports){
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

},{"./Unseen":18}],17:[function(require,module,exports){
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
    Transformer.prototype.applyTransformations = function (aTransformable) {
        _super.prototype.applyTransformations.call(this, aTransformable);
        aTransformable.translate(this.translation.x, this.translation.y);
        aTransformable.scale(this.scale.x, this.scale.y);
    };
    return Transformer;
}(Unseen_1.Unseen));
exports.Transformer = Transformer;

},{"../../geometry/Point":4,"./Unseen":18}],18:[function(require,module,exports){
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

},{"../Viewee":13}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db21wb3NpdGUudHMiLCJzcmMvZ2VmcmkubnMudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvVHJhbnNmb3JtTWF0cml4LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkubnMudHMiLCJzcmMvdmlldy9vdXRwdXQvQ29udGV4dFBhaW50ZXIudHMiLCJzcmMvdmlldy9vdXRwdXQvUGFpbnRlci50cyIsInNyYy92aWV3L291dHB1dC9TdGF0ZWZ1bC50cyIsInNyYy92aWV3L291dHB1dC9UcmFuc2Zvcm1hYmxlLnRzIiwic3JjL3ZpZXcvdmlldy5ucy50cyIsInNyYy92aWV3L3ZpZXdlZXMvVmlld2VlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvUmVjdGFuZ2xlLnRzIiwic3JjL3ZpZXcvdmlld2Vlcy9zaGFwZXMvU2hhcGUudHMiLCJzcmMvdmlldy92aWV3ZWVzL3Vuc2Vlbi9Sb290LnRzIiwic3JjL3ZpZXcvdmlld2Vlcy91bnNlZW4vVHJhbnNmb3JtZXIudHMiLCJzcmMvdmlldy92aWV3ZWVzL3Vuc2Vlbi9VbnNlZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7SUFLSTtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUssSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFNRCw0QkFBUSxHQUFSLFVBQVUsTUFBTTtRQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCwrQkFBVyxHQUFYO1FBQWEsY0FBWTthQUFa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LGNBQTZCO1FBQ3pELGdCQUFLLENBQUMsb0JBQW9CLFlBQUUsY0FBYyxDQUFFLENBQUM7UUFDN0MsY0FBYyxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQ25FLGNBQWMsQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsQ0FBQztJQUN2RCxDQUFDO0lBRUwsa0JBQUM7QUFBRCxDQXBCQSxBQW9CQyxDQW5CeUIsZUFBTSxHQW1CL0I7QUFuQkssbUJBQVcsY0FtQmhCLENBQUE7Ozs7Ozs7OztBQ3pCRCx1QkFBd0IsV0FBVyxDQUFDLENBQUE7QUFHcEM7SUFDcUIsMEJBQU07SUFEM0I7UUFDcUIsOEJBQU07SUFNM0IsQ0FBQztJQUpHLHNCQUFLLEdBQUwsVUFBTyxRQUFpQjtRQUNwQixJQUFJLENBQUMsYUFBYSxDQUFFLFFBQVEsQ0FBRSxDQUFDO0lBQ25DLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0FQQSxBQU9DLENBTm9CLGVBQU0sR0FNMUI7QUFOSyxjQUFNLFNBTVgsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRcbmNsYXNzIENvbXBvc2l0ZTwgVCA+IHtcbiAgICBwcml2YXRlIGNoaWxkcmVuOiBUW107XG4gICAgcHJpdmF0ZSBwYXJlbnQgOiAgVDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ICAgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogQWRkaW5nIGFuZCByZW1vdmluZ1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBhZGRDaGlsZCggYUNoaWxkICk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGFDaGlsZCApO1xuICAgICAgICBhQ2hpbGQucGFyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICBhZGRDaGlsZHJlbiggLi4uYXJnczogVFtdICk6IHZvaWQge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoIGFyZ3VtZW50c1tpXSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGQoIGFDaGlsZCApOiB2b2lkIHtcbiAgICAgICAgdmFyIGlDaGlsZEluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKCBhQ2hpbGQgKTtcblxuICAgICAgICBpZiAoIGlDaGlsZEluZGV4ID09PSAtMSApIHtcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgcmVxdWVzdGVkIGNoaWxkXCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFDaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoIGlDaGlsZEluZGV4LCAxICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFV0aWxpdHlcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZm9yRWFjaENoaWxkKCBhQ2FsbGJhY2sgKTogdm9pZCB7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBhQ2FsbGJhY2soIHRoaXMuY2hpbGRyZW5baV0sIGkgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQ2hpbGRsZXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgaGFzUGFyZW50KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgIT0gbnVsbDtcbiAgICB9XG5cbn0iLCJpbXBvcnQgKiBhcyB2aWV3IGZyb20gJy4vdmlldy92aWV3Lm5zJztcbmV4cG9ydCB7dmlld307XG4iLCJpbXBvcnQgeyBWaWV3ZWUgfSAgICAgICAgIGZyb20gJy4vdmlld2Vlcy9WaWV3ZWUnO1xuaW1wb3J0IHsgQ29udGV4dFBhaW50ZXIgfSBmcm9tICcuL291dHB1dC9Db250ZXh0UGFpbnRlcic7XG5pbXBvcnQgeyBSZWN0IH0gICAgICAgICAgIGZyb20gJy4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBSb290IH0gICAgICAgICAgIGZyb20gJy4vdmlld2Vlcy91bnNlZW4vUm9vdCdcblxuZXhwb3J0XG5jbGFzcyBDb250cm9sIHtcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXM6ICAgIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY29udGV4dDogICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSBwYWludGVyOiAgIENvbnRleHRQYWludGVyO1xuICAgIHByaXZhdGUgYm91bmRzOiAgICBSZWN0O1xuICAgIHByaXZhdGUgY29udGVudHM6ICBWaWV3ZWUgPSBudWxsO1xuICAgIHByaXZhdGUgcm9vdDogICAgICBSb290O1xuXG4gICAgY29uc3RydWN0b3IoIGFDb250YWluZXI6IEhUTUxFbGVtZW50ICkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGFDb250YWluZXI7XG4gICAgICAgIHRoaXMuYm91bmRzICAgID0gbmV3IFJlY3QoIDAsIDAsIGFDb250YWluZXIub2Zmc2V0V2lkdGgsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0ICk7XG4gICAgICAgIHRoaXMuY2FudmFzICAgID0gdGhpcy5jcmVhdGVDYW52YXMoIGFDb250YWluZXIgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ICAgPSB0aGlzLmdldENvbnRleHQoIHRoaXMuY2FudmFzICk7XG4gICAgICAgIHRoaXMucGFpbnRlciAgID0gbmV3IENvbnRleHRQYWludGVyKCB0aGlzLmNvbnRleHQgKTtcblxuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgUm9vdCggdGhpcyApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIDogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICB2YXIgaUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ0NBTlZBUycgKTtcbiAgICAgICAgaUNhbnZhcy5zZXRBdHRyaWJ1dGUoICd3aWR0aCcsICBhQ29udGFpbmVyLm9mZnNldFdpZHRoLnRvU3RyaW5nKCkgICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnaGVpZ2h0JywgYUNvbnRhaW5lci5vZmZzZXRIZWlnaHQudG9TdHJpbmcoKSApO1xuICAgICAgICBhQ29udGFpbmVyLmFwcGVuZENoaWxkKCBpQ2FudmFzICk7XG4gICAgICAgIHJldHVybiBpQ2FudmFzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29udGV4dCggYUNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcbiAgICAgICAgdmFyIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcbiAgICAgICAgLy8gY29udGV4dC50cmFuc2xhdGUoIDAuNSwgMC41ICk7IC8vIFByZXZlbnRzIGFudGlhbGlhc2luZyBlZmZlY3QuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMxQUJDOUMnO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29udGVudHMoIGFWaWV3ZWU6IFZpZXdlZSApIHtcbiAgICAgICAgaWYgKCB0aGlzLmNvbnRlbnRzICE9PSBudWxsICkge1xuICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUNoaWxkKCB0aGlzLmNvbnRlbnRzICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRlbnRzID0gYVZpZXdlZTtcbiAgICAgICAgdGhpcy5yb290LmFkZENoaWxkKCBhVmlld2VlICk7XG5cbiAgICAgICAgdGhpcy5yb290LnBhaW50KCB0aGlzLnBhaW50ZXIgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Qm91bmRpbmdSZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZHM7XG4gICAgfVxufVxuIiwiZXhwb3J0XG5jbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCB4OiBudW1iZXIsIHk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCB0aGlzLngsIHRoaXMueSApO1xuICAgIH1cblxuICAgIHNldCggeDogbnVtYmVyLCB5OiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBSZWN0IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIHc6IG51bWJlcjtcbiAgICBoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciwgYVc6IG51bWJlciwgYUg6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgICAgICB0aGlzLncgPSBhVztcbiAgICAgICAgdGhpcy5oID0gYUg7XG4gICAgfVxuXG4gICAgY2xvbmUoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCggdGhpcy54LCB0aGlzLnksIHRoaXMudywgdGhpcy5oICk7XG4gICAgfVxuXG4gICAgZ2V0TGVmdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy53ID49IDAgPyB0aGlzLnggOiB0aGlzLnggKyB0aGlzLnc7XG4gICAgfVxuXG4gICAgZ2V0UmlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54ICsgdGhpcy53IDogdGhpcy54O1xuICAgIH1cblxuICAgIGdldFRvcCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oID49IDAgPyB0aGlzLnkgOiB0aGlzLnkgKyB0aGlzLmg7XG4gICAgfVxuXG4gICAgZ2V0Qm90dG9tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmggPj0gMCA/IHRoaXMueSArIHRoaXMuaCA6IHRoaXMueTtcbiAgICB9XG5cbiAgICBnZXRMZWZ0VG9wKCk6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy5nZXRMZWZ0KCksIHRoaXMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3QoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICB2YXIgaUxlZnQgICA9IE1hdGgubWF4KCB0aGlzLmdldExlZnQoKSwgICBhUmVjdC5nZXRMZWZ0KCkgICApLFxuICAgICAgICAgICAgaVRvcCAgICA9IE1hdGgubWF4KCB0aGlzLmdldFRvcCgpLCAgICBhUmVjdC5nZXRUb3AoKSAgICApLFxuICAgICAgICAgICAgaVJpZ2h0ICA9IE1hdGgubWluKCB0aGlzLmdldFJpZ2h0KCksICBhUmVjdC5nZXRSaWdodCgpICApLFxuICAgICAgICAgICAgaUJvdHRvbSA9IE1hdGgubWluKCB0aGlzLmdldEJvdHRvbSgpLCBhUmVjdC5nZXRCb3R0b20oKSApO1xuXG4gICAgICAgIHRoaXMueCA9IGlMZWZ0O1xuICAgICAgICB0aGlzLnkgPSBpVG9wO1xuICAgICAgICB0aGlzLncgPSBpUmlnaHQgLSBpTGVmdDtcbiAgICAgICAgdGhpcy5oID0gaUJvdHRvbSAtIGlUb3A7XG4gICAgfVxuXG4gICAgaXNPdmVybGFwcGluZ1dpdGgoIGFSZWN0OiBSZWN0ICk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5nZXRMZWZ0KCkgIDw9IGFSZWN0LmdldFJpZ2h0KCkgJiZcbiAgICAgICAgICAgIGFSZWN0LmdldExlZnQoKSA8PSB0aGlzLmdldFJpZ2h0KCkgJiZcbiAgICAgICAgICAgIHRoaXMuZ2V0VG9wKCkgICA8PSBhUmVjdC5nZXRCb3R0b20oKSAmJlxuICAgICAgICAgICAgYVJlY3QuZ2V0VG9wKCkgIDw9IHRoaXMuZ2V0Qm90dG9tKClcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGV4cGFuZCggYVBvaW50czogbnVtYmVyICk6IHZvaWQge1xuICAgICAgICB2YXIgaFNpZ24gPSB0aGlzLncgPj0gMCA/IC0xIDogMTtcbiAgICAgICAgdmFyIHZTaWduID0gdGhpcy5oID49IDAgPyAtMSA6IDE7XG5cbiAgICAgICAgdGhpcy54ICs9ICBoU2lnbiAqIGFQb2ludHM7XG4gICAgICAgIHRoaXMueSArPSAgdlNpZ24gKiBhUG9pbnRzO1xuICAgICAgICB0aGlzLncgKz0gLWhTaWduICogYVBvaW50cyAqIDI7XG4gICAgICAgIHRoaXMuaCArPSAtdlNpZ24gKiBhUG9pbnRzICogMjtcbiAgICB9XG5cbiAgICBjb250cmFjdCggYVBvaW50czogbnVtYmVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLmV4cGFuZCggLWFQb2ludHMgKTtcbiAgICB9XG5cbn1cbiIsIi8qKlxuICpcbiAqIEEgcGFydGlhbCAyRCB0cmFuc2Zvcm0gbWF0cml4LiBDdXJyZW50bHkgZG9lc24ndCBzdXBwb3J0IHJvdGF0aW9uIChhbmQgaGVuY2VcbiAqIHNrZXcpLlxuICovXG5cbmltcG9ydCB7IFJlY3QgfSAgZnJvbSAnLi9SZWN0JztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5cbmV4cG9ydFxuY2xhc3MgVHJhbnNmb3JtTWF0cml4IHtcbiAgICBzY2FsZVggICAgOiBudW1iZXI7IC8vIGFcbiAgICBzY2FsZVkgICAgOiBudW1iZXI7IC8vIGRcbiAgICB0cmFuc2xhdGVYOiBudW1iZXI7IC8vIGUgb3IgdHhcbiAgICB0cmFuc2xhdGVZOiBudW1iZXI7IC8vIGYgb3IgdHlcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggPSAwO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICB0aGlzLnNjYWxlWCAgICAgPSAxO1xuICAgICAgICB0aGlzLnNjYWxlWSAgICAgPSAxO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBUcmFuc2Zvcm1NYXRyaXgge1xuICAgICAgICB2YXIgaUNsb25lID0gbmV3IFRyYW5zZm9ybU1hdHJpeCgpO1xuICAgICAgICBpQ2xvbmUudHJhbnNsYXRlWCA9IHRoaXMudHJhbnNsYXRlWDtcbiAgICAgICAgaUNsb25lLnRyYW5zbGF0ZVkgPSB0aGlzLnRyYW5zbGF0ZVk7XG4gICAgICAgIGlDbG9uZS5zY2FsZVggPSB0aGlzLnNjYWxlWDtcbiAgICAgICAgaUNsb25lLnNjYWxlWSA9IHRoaXMuc2NhbGVZO1xuXG4gICAgICAgIHJldHVybiBpQ2xvbmU7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCBhVHJhbnNsYXRpb246IFBvaW50ICkge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggKz0gYVRyYW5zbGF0aW9uLnggKiB0aGlzLnNjYWxlWDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZICs9IGFUcmFuc2xhdGlvbi55ICogdGhpcy5zY2FsZVk7XG4gICAgfVxuXG4gICAgc2NhbGUoIGFTY2FsZTogUG9pbnQgKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlWCAqPSBhU2NhbGUueDtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZICo9IGFTY2FsZS55O1xuXG4gICAgICAgIHRoaXMuc2NhbGVYICAgICAqPSBhU2NhbGUueDtcbiAgICAgICAgdGhpcy5zY2FsZVkgICAgICo9IGFTY2FsZS55O1xuICAgIH1cblxuICAgIHRyYW5zZm9ybVBvaW50KCBhUG9pbnQ6IFBvaW50ICkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICAgICAgICBhUG9pbnQueCAqIHRoaXMuc2NhbGVYICsgdGhpcy50cmFuc2xhdGVYLFxuICAgICAgICAgICAgYVBvaW50LnkgKiB0aGlzLnNjYWxlWSArIHRoaXMudHJhbnNsYXRlWVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIEEgdGVtcG9yYWwgaGFjay4gUmVjdHMgc2hvdWxkIHJlYWxseSBiZSByZXByZXNlbnRlZCBhcyBhIHBvbHlnb24gdG9cbiAgICAvLyBzdXBwb3J0IHJvdGF0ZSwgYnV0IHRoaXMgd2lsbCBkbyBmb3Igbm93LlxuICAgIHRyYW5zZm9ybVJlY3QoIGFSZWN0OiBSZWN0ICkgOiBSZWN0IHtcbiAgICAgICAgdmFyIGlMZWZ0VG9wICAgICAgICAgICAgPSBhUmVjdC5nZXRMZWZ0VG9wKCksXG4gICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wID0gdGhpcy50cmFuc2Zvcm1Qb2ludCggaUxlZnRUb3AgKSxcblxuICAgICAgICAgICAgaVRyYW5zZm9ybWVkUmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICAgICAgICAgIGlUcmFuc2Zvcm1lZExlZnRUb3AueCxcbiAgICAgICAgICAgICAgICBpVHJhbnNmb3JtZWRMZWZ0VG9wLnksXG4gICAgICAgICAgICAgICAgYVJlY3QudyAqIHRoaXMuc2NhbGVYLFxuICAgICAgICAgICAgICAgIGFSZWN0LmggKiB0aGlzLnNjYWxlWVxuICAgICAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gaVRyYW5zZm9ybWVkUmVjdDtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5leHBvcnQgeyBSZWN0IH0gZnJvbSAnLi9SZWN0JztcbiIsImltcG9ydCB7IFBhaW50ZXIgfSBmcm9tICcuL1BhaW50ZXInO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4uL2dlb21ldHJ5L1JlY3QnO1xuXG5leHBvcnRcbmNsYXNzIENvbnRleHRQYWludGVyIGV4dGVuZHMgUGFpbnRlciB7XG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6ICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gYUNvbnRleHQ7XG4gICAgfVxuXG4gICAgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnJlY3QoIGFSZWN0LngsIGFSZWN0LnksIGFSZWN0LncsIGFSZWN0LmggKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICBzdXBlci50cmFuc2xhdGUoIHgsIHkgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggeCwgeSApO1xuICAgIH1cblxuICAgIHNjYWxlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICBzdXBlci5zY2FsZSggeCwgeSApO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2NhbGUoIHgsIHkgKTtcbiAgICB9XG5cbiAgICBpbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0OiBSZWN0ICk6IHZvaWQge1xuICAgICAgICBzdXBlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIGFSZWN0ICk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHNvbWUgZXh0cmEgbWFyZ2lucyB0byBhY2NvdW50IGZvciBhbnRpYWxpYXNpbmdcbiAgICAgICAgdmFyIGlSZWN0ID0gYVJlY3QuY2xvbmUoKTtcbiAgICAgICAgaVJlY3QuZXhwYW5kKCAxICk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZWN0KFxuICAgICAgICAgICAgaVJlY3QueCxcbiAgICAgICAgICAgIGlSZWN0LnksXG4gICAgICAgICAgICBpUmVjdC53LFxuICAgICAgICAgICAgaVJlY3QuaFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGlwKCk7XG4gICAgfVxuXG4gICAgcHVzaFN0YXRlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5wdXNoU3RhdGUoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVzdG9yZVN0YXRlKCBhU3RhdGU6IGFueSApIHtcbiAgICAgICAgc3VwZXIucmVzdG9yZVN0YXRlKCBhU3RhdGUgKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFRyYW5zZm9ybWFibGUgfSBmcm9tICcuL1RyYW5zZm9ybWFibGUnO1xuaW1wb3J0IHsgUmVjdCB9ICAgICAgICAgIGZyb20gJy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUG9pbnQgfSAgICAgICAgIGZyb20gJy4uL2dlb21ldHJ5L1BvaW50JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBQYWludGVyIGV4dGVuZHMgVHJhbnNmb3JtYWJsZSB7XG4gICAgcHJvdGVjdGVkIGNsaXBBcmVhOiBSZWN0O1xuXG4gICAgYWJzdHJhY3QgZHJhd1JlY3RhbmdsZSggYVJlY3Q6IFJlY3QgKTogdm9pZDtcblxuICAgIGludGVyc2VjdENsaXBBcmVhV2l0aCggYVJlY3Q6IFJlY3QgKTogdm9pZCB7XG4gICAgICAgIC8vIE91ciBjbGlwQXJlYSBpcyBpbiBhYnNvbHV0ZSBjb29yZGluYXRlcywgc28gd2UgY29udmVydCB0aGUgcmVjdFxuICAgICAgICAvLyB0byBhYnNvbHV0ZSBvbmVzLlxuICAgICAgICB2YXIgaUFic29sdXRlUmVjdCA9IHRoaXMudG9BYnNvbHV0ZVJlY3QoIGFSZWN0ICk7XG4gICAgICAgIGlmICggdGhpcy5jbGlwQXJlYSApIHtcbiAgICAgICAgICAgIHRoaXMuY2xpcEFyZWEuaW50ZXJzZWN0KCBpQWJzb2x1dGVSZWN0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsaXBBcmVhID0gaUFic29sdXRlUmVjdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzUmVjdFdpdGhpbkNsaXBBcmVhKCBhUmVjdDogUmVjdCApOiBib29sZWFuIHtcbiAgICAgICAgLy8gQ2xpcCBhcmVhIGlzIGluIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gICAgICAgIC8vIFNvIHdlIGNvbnZlcnQgdGhlIHJlY3QgdG8gYWJzb2x1dGUgb25lcy5cbiAgICAgICAgdmFyIGlBYnNvbHV0ZVJlY3QgPSB0aGlzLnRvQWJzb2x1dGVSZWN0KCBhUmVjdCApO1xuICAgICAgICBpZiAoIHRoaXMuY2xpcEFyZWEgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGlwQXJlYS5pc092ZXJsYXBwaW5nV2l0aCggaUFic29sdXRlUmVjdCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGUoKSA6IGFueSB7XG4gICAgICAgIHZhciBpU3RhdGUgPSBzdXBlci5nZXRTdGF0ZSgpO1xuICAgICAgICBpU3RhdGUuY2xpcEFyZWEgPSB0aGlzLmNsaXBBcmVhID8gdGhpcy5jbGlwQXJlYS5jbG9uZSgpIDogdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gaVN0YXRlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXN0b3JlU3RhdGUoIGFTdGF0ZTogYW55ICkge1xuICAgICAgICBzdXBlci5yZXN0b3JlU3RhdGUoIGFTdGF0ZSApO1xuICAgICAgICB0aGlzLmNsaXBBcmVhID0gYVN0YXRlLmNsaXBBcmVhO1xuICAgIH1cblxufVxuIiwiZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTdGF0ZWZ1bCB7XG4gICAgcHJvdGVjdGVkIHN0YXRlU3RhY2s6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGVTdGFjayA9IFtdO1xuICAgIH1cblxuICAgIHB1c2hTdGF0ZSgpIHtcbiAgICAgICAgdmFyIGlTdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoKTtcbiAgICAgICAgdGhpcy5zdGF0ZVN0YWNrLnB1c2goIGlTdGF0ZSApO1xuICAgIH1cblxuICAgIHBvcFN0YXRlKCkge1xuICAgICAgICB2YXIgaVN0YXRlID0gdGhpcy5zdGF0ZVN0YWNrLnBvcCgpO1xuICAgICAgICB0aGlzLnJlc3RvcmVTdGF0ZSggaVN0YXRlICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKCkgOiBhbnkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlc3RvcmVTdGF0ZSggYVN0YXRlOiBhbnkgKTtcblxufVxuIiwiaW1wb3J0IHsgU3RhdGVmdWwgfSAgICAgICAgZnJvbSAnLi9TdGF0ZWZ1bCc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1NYXRyaXggfSBmcm9tICcuLi9nZW9tZXRyeS9UcmFuc2Zvcm1NYXRyaXgnO1xuaW1wb3J0IHsgUmVjdCB9ICAgICAgICAgICAgZnJvbSAnLi4vZ2VvbWV0cnkvUmVjdCc7XG5pbXBvcnQgeyBQb2ludCB9ICAgICAgICAgICBmcm9tICcuLi9nZW9tZXRyeS9Qb2ludCc7XG5cbmV4cG9ydFxuYWJzdHJhY3QgY2xhc3MgVHJhbnNmb3JtYWJsZSBleHRlbmRzIFN0YXRlZnVsIHtcbiAgICBwcm90ZWN0ZWQgbWF0cml4OiBUcmFuc2Zvcm1NYXRyaXg7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKCB4LCB5ICk6IHZvaWQge1xuICAgICAgICB0aGlzLm1hdHJpeC50cmFuc2xhdGUoIG5ldyBQb2ludCggeCwgeSApIClcbiAgICB9XG5cbiAgICBzY2FsZSggeCwgeSApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tYXRyaXguc2NhbGUoIG5ldyBQb2ludCggeCwgeSApIClcbiAgICB9XG5cbiAgICB0b0Fic29sdXRlUmVjdCggYVJlY3Q6IFJlY3QgKTogUmVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeC50cmFuc2Zvcm1SZWN0KCBhUmVjdCApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTdGF0ZSgpIDogYW55IHtcbiAgICAgICAgdmFyIGlTdGF0ZSAgICA9IHN1cGVyLmdldFN0YXRlKCk7XG4gICAgICAgIGlTdGF0ZS5tYXRyaXggPSB0aGlzLm1hdHJpeC5jbG9uZSgpO1xuICAgICAgICByZXR1cm4gaVN0YXRlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXN0b3JlU3RhdGUoIGFTdGF0ZTogYW55ICkge1xuICAgICAgICB0aGlzLm1hdHJpeCA9IGFTdGF0ZS5tYXRyaXg7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgKiBhcyBnZW9tZXRyeSBmcm9tICcuL2dlb21ldHJ5L2dlb21ldHJ5Lm5zJztcbmV4cG9ydCB7IGdlb21ldHJ5IH07XG5cbmV4cG9ydCB7IENvbnRyb2wgfSAgICAgZnJvbSAnLi9Db250cm9sJztcbmV4cG9ydCB7IFJlY3RhbmdsZSB9ICAgZnJvbSAnLi92aWV3ZWVzL3NoYXBlcy9SZWN0YW5nbGUnO1xuZXhwb3J0IHsgVHJhbnNmb3JtZXIgfSBmcm9tICcuL3ZpZXdlZXMvdW5zZWVuL1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IFJvb3QgfSAgICAgICAgZnJvbSAnLi92aWV3ZWVzL3Vuc2Vlbi9Sb290JztcbiIsImltcG9ydCB7IENvbXBvc2l0ZSB9ICAgICBmcm9tICcuLy4uLy4uL2NvcmUvQ29tcG9zaXRlJztcbmltcG9ydCB7IFBhaW50ZXIgfSAgICAgICBmcm9tICcuLy4uL291dHB1dC9QYWludGVyJztcbmltcG9ydCB7IFRyYW5zZm9ybWFibGUgfSBmcm9tICcuLy4uL291dHB1dC9UcmFuc2Zvcm1hYmxlJztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBWaWV3ZWUgZXh0ZW5kcyBDb21wb3NpdGU8IFZpZXdlZSA+IHtcblxuICAgIGFic3RyYWN0IHBhaW50KCBhUGFpbnRlcjogUGFpbnRlciApOiB2b2lkO1xuXG4gICAgcHJvdGVjdGVkIHBhaW50Q2hpbGRyZW4oIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBpZiAoIHRoaXMuaXNDaGlsZGxlc3MoKSApIHJldHVybjtcblxuICAgICAgICBhUGFpbnRlci5wdXNoU3RhdGUoKTtcblxuICAgICAgICB0aGlzLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoQ2hpbGQoIGZ1bmN0aW9uKCBhQ2hpbGQgKSB7XG4gICAgICAgICAgICBhQ2hpbGQucGFpbnQoIGFQYWludGVyICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFQYWludGVyLnBvcFN0YXRlKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICB0aGlzLmFwcGx5VHJhbnNmb3JtYXRpb25zKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhcHBseVRyYW5zZm9ybWF0aW9ucyggYVRyYW5zZm9ybWFibGU6IFRyYW5zZm9ybWFibGUgKTogdm9pZCB7XG4gICAgICAgIC8vIERvZXMgbm90aGluZyBieSBkZWZhdWx0LiBDaGlsZHJlbiB3aWxsIG92ZXJyaWRlLlxuICAgIH1cblxuICAgIC8vIHB1YmxpYyBlcmFzZSggYVVwZGF0ZXI6IFVwZGF0ZXIgKSB7XG5cbiAgICAvLyB9XG5cbn1cbiIsImltcG9ydCB7IFNoYXBlIH0gICBmcm9tICcuL1NoYXBlJztcbmltcG9ydCB7IFJlY3QgfSAgICBmcm9tICcuLy4uLy4uL2dlb21ldHJ5L1JlY3QnO1xuaW1wb3J0IHsgUGFpbnRlciB9IGZyb20gJy4vLi4vLi4vb3V0cHV0L1BhaW50ZXInO1xuXG5leHBvcnRcbmNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIFNoYXBlIHtcbiAgICBwcml2YXRlIHJlY3Q6IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvciggYVJlY3Q6IFJlY3QgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVjdCA9IGFSZWN0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYWludFNlbGYoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBhUGFpbnRlci5kcmF3UmVjdGFuZ2xlKCB0aGlzLnJlY3QgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0UmVjdEJvdW5kcygpOiBSZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFZpZXdlZSB9ICAgICAgICBmcm9tICcuLy4uL1ZpZXdlZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gICAgICAgZnJvbSAnLi8uLi8uLi9vdXRwdXQvUGFpbnRlcic7XG5pbXBvcnQgeyBUcmFuc2Zvcm1hYmxlIH0gZnJvbSAnLi8uLi8uLi9vdXRwdXQvVHJhbnNmb3JtYWJsZSc7XG5pbXBvcnQgeyBSZWN0IH0gICAgICAgICAgZnJvbSAnLi8uLi8uLi9nZW9tZXRyeS9SZWN0JztcblxuZXhwb3J0XG5hYnN0cmFjdCBjbGFzcyBTaGFwZSBleHRlbmRzIFZpZXdlZSB7XG5cbiAgICBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIGlmICggdGhpcy5pc1dpdGhpbkNsaXBBcmVhKCBhUGFpbnRlciApICkge1xuICAgICAgICAgICAgdGhpcy5wYWludFNlbGYoIGFQYWludGVyIClcbiAgICAgICAgICAgIHRoaXMucGFpbnRDaGlsZHJlbiggYVBhaW50ZXIgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBwYWludFNlbGYoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0UmVjdEJvdW5kcygpOiBSZWN0O1xuXG4gICAgcHJvdGVjdGVkIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBhUGFpbnRlci5pbnRlcnNlY3RDbGlwQXJlYVdpdGgoIHRoaXMuZ2V0UmVjdEJvdW5kcygpICk7XG4gICAgICAgIHN1cGVyLmJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFwcGx5VHJhbnNmb3JtYXRpb25zKCBhVHJhbnNmb3JtYWJsZTogVHJhbnNmb3JtYWJsZSApOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuYXBwbHlUcmFuc2Zvcm1hdGlvbnMoIGFUcmFuc2Zvcm1hYmxlICk7XG4gICAgICAgIHZhciBpQm91bmRzID0gdGhpcy5nZXRSZWN0Qm91bmRzKCk7XG4gICAgICAgIGFUcmFuc2Zvcm1hYmxlLnRyYW5zbGF0ZSggaUJvdW5kcy5nZXRMZWZ0KCksIGlCb3VuZHMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNXaXRoaW5DbGlwQXJlYSggYVBhaW50ZXI6IFBhaW50ZXIgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBhUGFpbnRlci5pc1JlY3RXaXRoaW5DbGlwQXJlYSggdGhpcy5nZXRSZWN0Qm91bmRzKCkgKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFVuc2VlbiB9ICBmcm9tICcuL1Vuc2Vlbic7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi4vLi4vb3V0cHV0L1BhaW50ZXInO1xuaW1wb3J0IHsgQ29udHJvbCB9IGZyb20gJy4uLy4uL0NvbnRyb2wnO1xuXG4vLyBBbiBhZGFwdGVyIGJldHdlZW4gdGhlIHZpZXdlZSBjb21wb3NpdGlvbiBhbmQgdGhlIGNvbnRyb2wuXG4vLyBUaGVyZSBpcyBvbmx5IG9uZSByb290IHBlciBoaWVyYXJjaHksIGFuZCBpdCBpcyBjcmVhdGVkIGF1dG9tYXRpY2FsbHlcbi8vIGJ5IHRoZSBjb250cm9sLlxuZXhwb3J0XG5jbGFzcyBSb290IGV4dGVuZHMgVW5zZWVuIHtcbiAgICBwcml2YXRlIGNvbnRyb2w6IENvbnRyb2xcblxuICAgIGNvbnN0cnVjdG9yKCBhQ29udHJvbDogQ29udHJvbCApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb250cm9sID0gYUNvbnRyb2w7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJlZm9yZUNoaWxkcmVuUGFpbnRpbmcoIGFQYWludGVyOiBQYWludGVyICk6IHZvaWQge1xuICAgICAgICBzdXBlci5iZWZvcmVDaGlsZHJlblBhaW50aW5nKCBhUGFpbnRlciApO1xuICAgICAgICB0aGlzLnNldENsaXBBcmVhVG9Db250cm9sQm91bmRzKCBhUGFpbnRlciApO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q2xpcEFyZWFUb0NvbnRyb2xCb3VuZHMoIGFQYWludGVyICl7XG4gICAgICAgIGxldCBpQ29udHJvbEJvdW5kcyA9IHRoaXMuY29udHJvbC5nZXRCb3VuZGluZ1JlY3QoKTtcbiAgICAgICAgYVBhaW50ZXIuaW50ZXJzZWN0Q2xpcEFyZWFXaXRoKCBpQ29udHJvbEJvdW5kcyApO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVW5zZWVuIH0gICAgICAgIGZyb20gJy4vVW5zZWVuJztcbmltcG9ydCB7IFBhaW50ZXIgfSAgICAgICBmcm9tICcuLi8uLi9vdXRwdXQvUGFpbnRlcic7XG5pbXBvcnQgeyBUcmFuc2Zvcm1hYmxlIH0gZnJvbSAnLi8uLi8uLi9vdXRwdXQvVHJhbnNmb3JtYWJsZSc7XG5pbXBvcnQgeyBQb2ludCB9ICAgICAgICAgZnJvbSAnLi4vLi4vZ2VvbWV0cnkvUG9pbnQnO1xuXG5leHBvcnRcbmNsYXNzIFRyYW5zZm9ybWVyIGV4dGVuZHMgVW5zZWVuIHtcblxuICAgIHByaXZhdGUgdHJhbnNsYXRpb246IFBvaW50ID0gbmV3IFBvaW50KCAwLCAwICk7XG4gICAgcHJpdmF0ZSBzY2FsZTogICAgICAgUG9pbnQgPSBuZXcgUG9pbnQoIDEsIDEgKTtcblxuICAgIHNldFRyYW5zbGF0ZSggeDogbnVtYmVyLCB5OiBudW1iZXIgKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24uc2V0KCB4LCB5ICk7XG4gICAgfVxuXG4gICAgc2V0U2NhbGUoIHg6IG51bWJlciwgeTogbnVtYmVyICkge1xuICAgICAgICB0aGlzLnNjYWxlLnNldCggeCwgeSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhcHBseVRyYW5zZm9ybWF0aW9ucyggYVRyYW5zZm9ybWFibGU6IFRyYW5zZm9ybWFibGUgKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmFwcGx5VHJhbnNmb3JtYXRpb25zKCBhVHJhbnNmb3JtYWJsZSApO1xuICAgICAgICBhVHJhbnNmb3JtYWJsZS50cmFuc2xhdGUoIHRoaXMudHJhbnNsYXRpb24ueCwgdGhpcy50cmFuc2xhdGlvbi55ICk7XG4gICAgICAgIGFUcmFuc2Zvcm1hYmxlLnNjYWxlKCB0aGlzLnNjYWxlLngsIHRoaXMuc2NhbGUueSApO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgVmlld2VlIH0gIGZyb20gJy4uL1ZpZXdlZSc7XG5pbXBvcnQgeyBQYWludGVyIH0gZnJvbSAnLi4vLi4vb3V0cHV0L1BhaW50ZXInO1xuXG5leHBvcnRcbmNsYXNzIFVuc2VlbiBleHRlbmRzIFZpZXdlZSB7XG5cbiAgICBwYWludCggYVBhaW50ZXI6IFBhaW50ZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGFpbnRDaGlsZHJlbiggYVBhaW50ZXIgKTtcbiAgICB9XG5cbn1cbiJdfQ==
