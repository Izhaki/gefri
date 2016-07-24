(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gefri = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var view = require('./view/view');
exports.view = view;

},{"./view/view":6}],2:[function(require,module,exports){
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
    Control.prototype.paint = function () {
        var iContext = this.canvas.getContext('2d');
        iContext.fillStyle = '#1ABC9C';
        iContext.lineWidth = 1;
        iContext.strokeStyle = 'black';
        iContext.beginPath();
        iContext.rect(10, 10, 20, 20);
        iContext.fill();
        iContext.stroke();
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
var geometry = require('./geometry/geometry');
exports.geometry = geometry;
var Control_1 = require('./Control');
exports.Control = Control_1.Control;

},{"./Control":2,"./geometry/geometry":5}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2VmcmkudHMiLCJzcmMvdmlldy9Db250cm9sLnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvUG9pbnQudHMiLCJzcmMvdmlldy9nZW9tZXRyeS9SZWN0LnRzIiwic3JjL3ZpZXcvZ2VvbWV0cnkvZ2VvbWV0cnkudHMiLCJzcmMvdmlldy92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQVksSUFBSSxXQUFNLGFBQWEsQ0FBQyxDQUFBO0FBQzVCLFlBQUk7QUFBRTs7O0FDRGQ7SUFLSSxpQkFBYSxVQUF1QjtRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUUsVUFBVSxDQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVPLDhCQUFZLEdBQXBCLFVBQXNCLFVBQXVCO1FBQ3pDLElBQUksT0FBTyxHQUEwQyxRQUFRLENBQUMsYUFBYSxDQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ3hGLE9BQU8sQ0FBQyxZQUFZLENBQUUsT0FBTyxFQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUcsQ0FBQztRQUNyRSxPQUFPLENBQUMsWUFBWSxDQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFFLENBQUM7UUFDckUsVUFBVSxDQUFDLFdBQVcsQ0FBRSxPQUFPLENBQUUsQ0FBQztRQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSx1QkFBSyxHQUFaO1FBQ0ksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFFLENBQUM7UUFLOUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDL0IsUUFBUSxDQUFDLFNBQVMs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anMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyB2aWV3IGZyb20gJy4vdmlldy92aWV3JztcbmV4cG9ydCB7dmlld307XG4iLCJleHBvcnRcbmNsYXNzIENvbnRyb2wge1xuICAgIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgICBwdWJsaWMgIGNhbnZhczogICAgSFRNTENhbnZhc0VsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvciggYUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gYUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmNyZWF0ZUNhbnZhcyggYUNvbnRhaW5lciApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ2FudmFzKCBhQ29udGFpbmVyOiBIVE1MRWxlbWVudCApIDogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICB2YXIgaUNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdDQU5WQVMnICk7XG4gICAgICAgIGlDYW52YXMuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCAgYUNvbnRhaW5lci5vZmZzZXRXaWR0aC50b1N0cmluZygpICApO1xuICAgICAgICBpQ2FudmFzLnNldEF0dHJpYnV0ZSggJ2hlaWdodCcsIGFDb250YWluZXIub2Zmc2V0SGVpZ2h0LnRvU3RyaW5nKCkgKTtcbiAgICAgICAgYUNvbnRhaW5lci5hcHBlbmRDaGlsZCggaUNhbnZhcyApO1xuICAgICAgICByZXR1cm4gaUNhbnZhcztcbiAgICB9XG5cbiAgICBwdWJsaWMgcGFpbnQoKSB7XG4gICAgICAgIHZhciBpQ29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcblxuICAgICAgICAvLyBQcmV2ZW50cyBhbnRpYWxpYXNpbmcgZWZmZWN0LlxuICAgICAgICAvLyBpQ29udGV4dC50cmFuc2xhdGUoIDAuNSwgMC41ICk7XG5cbiAgICAgICAgaUNvbnRleHQuZmlsbFN0eWxlID0gJyMxQUJDOUMnO1xuICAgICAgICBpQ29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgICBpQ29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG5cbiAgICAgICAgaUNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGlDb250ZXh0LnJlY3QoIDEwLCAxMCwgMjAsIDIwICk7XG4gICAgICAgIGlDb250ZXh0LmZpbGwoKTtcbiAgICAgICAgaUNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxufSIsImV4cG9ydFxuY2xhc3MgUG9pbnQge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgIH1cblxuICAgIGNsb25lKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIHRoaXMueCwgdGhpcy55ICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcblxuZXhwb3J0XG5jbGFzcyBSZWN0IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIHc6IG51bWJlcjtcbiAgICBoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciggYVg6IG51bWJlciwgYVk6IG51bWJlciwgYVc6IG51bWJlciwgYUg6IG51bWJlciApIHtcbiAgICAgICAgdGhpcy54ID0gYVg7XG4gICAgICAgIHRoaXMueSA9IGFZO1xuICAgICAgICB0aGlzLncgPSBhVztcbiAgICAgICAgdGhpcy5oID0gYUg7XG4gICAgfVxuXG4gICAgY2xvbmUoKSA6IFJlY3Qge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3QoIHRoaXMueCwgdGhpcy55LCB0aGlzLncsIHRoaXMuaCApO1xuICAgIH1cblxuICAgIGdldExlZnQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLncgPj0gMCA/IHRoaXMueCA6IHRoaXMueCArIHRoaXMudztcbiAgICB9XG5cbiAgICBnZXRSaWdodCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudyA+PSAwID8gdGhpcy54ICsgdGhpcy53IDogdGhpcy54O1xuICAgIH1cblxuICAgIGdldFRvcCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55IDogdGhpcy55ICsgdGhpcy5oO1xuICAgIH1cblxuICAgIGdldEJvdHRvbSgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaCA+PSAwID8gdGhpcy55ICsgdGhpcy5oIDogdGhpcy55O1xuICAgIH1cblxuICAgIGdldExlZnRUb3AoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggdGhpcy5nZXRMZWZ0KCksIHRoaXMuZ2V0VG9wKCkgKTtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB7IFBvaW50IH0gZnJvbSAnLi9Qb2ludCc7XG5leHBvcnQgeyBSZWN0IH0gZnJvbSAnLi9SZWN0JztcbiIsImltcG9ydCAqIGFzIGdlb21ldHJ5IGZyb20gJy4vZ2VvbWV0cnkvZ2VvbWV0cnknO1xuZXhwb3J0IHtnZW9tZXRyeX07XG5cbmV4cG9ydCB7IENvbnRyb2wgfSBmcm9tICcuL0NvbnRyb2wnOyJdfQ==
