/**
 *
 * A partial 2D transform matrix. Currently doesn't support rotation (and hence
 * skew).
 */

import { Rect,
         Point } from './';

export
type Translation = Point;

export
type Scale = Point;

export
interface Transformations {
    translate: Translation;
    scale:     Scale;
}

export
const cNoTranslate: Translation = new Point( 0, 0 );

export
const cNoScale: Scale = new Point( 1, 1 );


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

    transform( transformations: Transformations ) {
        this.translate( transformations.translate.x, transformations.translate.y );
        this.scale( transformations.scale.x, transformations.scale.y );
    }

    translate( x: number, y: number ) {
        this.translateX += x * this.scaleX;
        this.translateY += y * this.scaleY;
    }

    scale( x: number, y: number ) {
        this.translateX *= x;
        this.translateY *= y;

        this.scaleX     *= x;
        this.scaleY     *= y;
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
