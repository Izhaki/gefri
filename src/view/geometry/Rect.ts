import { Point,
         Matrix,
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
        } else {
            throw new Error( "Invalid arguments supplied to Rect constructor." )
        }

        function isXYWH( args ) {
            return ( args.length == 4            ) &&
                   ( typeof args[0] === 'number' );
        }

        function isTwoPoints( args ) {
            return ( args.length == 2        ) &&
                   ( args[0].x !== undefined ) &&
                   ( args[1].x !== undefined );
        }

    }

    static union( aRects: Rects ) : Rect {
        let iLefts   = aRects.map( aRect => aRect.getLeft()   ),
            iRights  = aRects.map( aRect => aRect.getRight()  ),
            iTops    = aRects.map( aRect => aRect.getTop()    ),
            iBottoms = aRects.map( aRect => aRect.getBottom() );

        let iLeft   = Math.min( ...iLefts   ),
            iRight  = Math.max( ...iRights  ),
            iTop    = Math.min( ...iTops    ),
            iBottom = Math.max( ...iBottoms );

        return new Rect (
            iLeft,
            iTop,
            iRight  - iLeft,
            iBottom - iTop
        );
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

    applyMatrix( aMatrix: Matrix ): Rect {
        let iRect = this.clone();

        let iOrigin            = iRect.getOrigin(),
            iTransformedOrigin = iOrigin.applyMatrix( aMatrix );

        iRect.x = iTransformedOrigin.x;
        iRect.y = iTransformedOrigin.y;
        iRect.w = iRect.w * aMatrix.scaleX;
        iRect.h = iRect.h * aMatrix.scaleY;

        return iRect;
    }

    intersect( aRect: Rect ): void {
        var iLeft   = Math.max( this.getLeft(),   aRect.getLeft()   ),
            iTop    = Math.max( this.getTop(),    aRect.getTop()    ),
            iRight  = Math.min( this.getRight(),  aRect.getRight()  ),
            iBottom = Math.min( this.getBottom(), aRect.getBottom() );

        this.x = iLeft;
        this.y = iTop;

        // If two rects do not intersect, the resultant size will be negative.
        // In such case, we set the size to 0 - which currently represents a null rect.
        this.w = Math.max( 0, iRight - iLeft );
        this.h = Math.max( 0, iBottom - iTop );
    }

    union( aRect: Rect ): void {
        this.x = Math.min( this.getLeft(),   aRect.getLeft()   );
        this.y = Math.min( this.getTop(),    aRect.getTop()    );
        this.w = Math.max( this.getRight(),  aRect.getRight()  ) - this.x;
        this.h = Math.max( this.getBottom(), aRect.getBottom() ) - this.y;
    }

    isOverlappingWith( aRect: Rect ): boolean {
        return (
            this.getLeft()  <= aRect.getRight() &&
            aRect.getLeft() <= this.getRight() &&
            this.getTop()   <= aRect.getBottom() &&
            aRect.getTop()  <= this.getBottom()
        )
    }

    translate( aDelta: Translation ) {
        this.x += aDelta.x;
        this.y += aDelta.y;
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

    contains( aPoint: Point ): boolean {
        return !this.isNullRect()  &&
               this.getLeft() <= aPoint.x && this.getRight()  >= aPoint.x &&
               this.getTop()  <= aPoint.y && this.getBottom() >= aPoint.y;
    }

    isNullRect(): boolean {
        return this.w == 0 || this.h == 0;
    }

}
