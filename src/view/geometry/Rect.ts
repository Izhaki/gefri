import { Point,
         Translation } from './';

export
type Rects = Rect[];

export
class Rect {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor( x: number, y: number, w: number, h: number );
    constructor( aLeftTop: Point, aRightBottom: Point );
    constructor() {
        if ( isXYWH( arguments ) ){
            this.x = arguments[ 0 ];
            this.y = arguments[ 1 ];
            this.w = arguments[ 2 ];
            this.h = arguments[ 3 ];
        } else if ( isTwoPoints( arguments ) ) {
            let iLeftTop     = arguments[ 0 ],
                iRightBottom = arguments[ 1 ];
            [ this.x, this.y, this.w, this.h ] = [ iLeftTop.x, iLeftTop.y, iRightBottom.x - iLeftTop.x, iRightBottom.y - iLeftTop.y ]
        }

        function isXYWH( args ) {
            return ( args.length == 4          ) &&
                   (typeof args[0] === 'number');
        }

        function isTwoPoints( args ) {
            return ( args.length == 2        ) &&
                   ( args[0].x !== undefined ) &&
                   ( args[1].x !== undefined );
        }

    }

    clone(): Rect {
        return new Rect( this.x, this.y, this.w, this.h );
    }

    getOrigin(): Point {
        return new Point( this.x, this.y );
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

    translate( aTranslation: Translation ) {
        this.x += aTranslation.x;
        this.y += aTranslation.y;
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

    // Turns negative width or height into positive ones.
    normalise(): void {

        if ( this.w < 0 ) {
            this.x = this.x + this.w;
            this.w = -this.w;
        }

        if ( this.h < 0 ) {
            this.y = this.y + this.h;
            this.h = -this.h;
        }

    }

}
