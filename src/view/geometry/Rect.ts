import { Point } from './Point';

export
type Rects = Rect[];

export
class Rect {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor( aX: number, aY: number, aW: number, aH: number ) {
        this.x = aX;
        this.y = aY;
        this.w = aW;
        this.h = aH;
    }

    clone(): Rect {
        return new Rect( this.x, this.y, this.w, this.h );
    }

    getLeft(): number {
        return this.w >= 0 ? this.x : this.x + this.w;
    }

    getRight(): number {
        return this.w >= 0 ? this.x + this.w : this.x;
    }

    getTop(): number {
        return this.h >= 0 ? this.y : this.y + this.h;
    }

    getBottom(): number {
        return this.h >= 0 ? this.y + this.h : this.y;
    }

    getLeftTop(): Point {
        return new Point( this.getLeft(), this.getTop() );
    }

    intersect( aRect: Rect ): void {
        var iLeft   = Math.max( this.getLeft(),   aRect.getLeft()   ),
            iTop    = Math.max( this.getTop(),    aRect.getTop()    ),
            iRight  = Math.min( this.getRight(),  aRect.getRight()  ),
            iBottom = Math.min( this.getBottom(), aRect.getBottom() );

        this.x = iLeft;
        this.y = iTop;
        this.w = iRight - iLeft;
        this.h = iBottom - iTop;
    }

    isOverlappingWith( aRect: Rect ): boolean {
        return (
            this.getLeft()  <= aRect.getRight() &&
            aRect.getLeft() <= this.getRight() &&
            this.getTop()   <= aRect.getBottom() &&
            aRect.getTop()  <= this.getBottom()
        )
    }

    translate( aOffest: Point ) {
        this.x += aOffest.x;
        this.y += aOffest.y;
    }

    expand( aPoints: number ): void {
        var hSign = this.w >= 0 ? -1 : 1;
        var vSign = this.h >= 0 ? -1 : 1;

        this.x +=  hSign * aPoints;
        this.y +=  vSign * aPoints;
        this.w += -hSign * aPoints * 2;
        this.h += -vSign * aPoints * 2;
    }

    contract( aPoints: number ): void {
        this.expand( -aPoints );
    }

}
