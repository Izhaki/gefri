/**
 *
 * A partial 2D transform matrix. Currently doesn't support rotation (and hence
 * skew).
 */

import { Rect,
         Point } from './';

export
class TransformMatrix {
    scaleX    : number; // a
    scaleY    : number; // d
    translateX: number; // e or tx
    translateY: number; // f or ty

    constructor() {
        this.translateX = 0;
        this.translateY = 0;
        this.scaleX     = 1;
        this.scaleY     = 1;
    }

    clone() : TransformMatrix {
        var iClone = new TransformMatrix();
        iClone.translateX = this.translateX;
        iClone.translateY = this.translateY;
        iClone.scaleX = this.scaleX;
        iClone.scaleY = this.scaleY;

        return iClone;
    }

    translate( aTranslation: Point ) {
        this.translateX += aTranslation.x * this.scaleX;
        this.translateY += aTranslation.y * this.scaleY;
    }

    scale( aScale: Point ) {
        this.translateX *= aScale.x;
        this.translateY *= aScale.y;

        this.scaleX     *= aScale.x;
        this.scaleY     *= aScale.y;
    }

    transformPoint( aPoint: Point ) : Point {
        return new Point(
            aPoint.x * this.scaleX + this.translateX,
            aPoint.y * this.scaleY + this.translateY
        );
    }

    // A temporal hack. Rects should really be represented as a polygon to
    // support rotate, but this will do for now.
    transformRect( aRect: Rect ) : Rect {
        var iLeftTop            = aRect.getLeftTop(),
            iTransformedLeftTop = this.transformPoint( iLeftTop ),

            iTransformedRect = new Rect(
                iTransformedLeftTop.x,
                iTransformedLeftTop.y,
                aRect.w * this.scaleX,
                aRect.h * this.scaleY
            );

        return iTransformedRect;
    }

}
