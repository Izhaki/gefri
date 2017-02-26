import {
    Point,
    Matrix,
    Translation
} from './';

import {
    isntNil,
    min,
    max
} from '../../core/Utils'

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

    static getLeft   = ( rect ) : number => rect.getLeft()
    static getRight  = ( rect ) : number => rect.getRight()
    static getTop    = ( rect ) : number => rect.getTop()
    static getBottom = ( rect ) : number => rect.getBottom()

    static union( aRects: Rects ) : Rect {
        const iRects = aRects.filter( isntNil );

        if ( iRects.length === 0 ) {
            return undefined;
        }

        const left   = iRects.map( Rect.getLeft   ).reduce( min ),
              right  = iRects.map( Rect.getRight  ).reduce( max ),
              top    = iRects.map( Rect.getTop    ).reduce( min ),
              bottom = iRects.map( Rect.getBottom ).reduce( max );

        return new Rect (
            left,
            top,
            right  - left,
            bottom - top
        );
    }

    static intersect = ( aRects: Rects ): Rect => {
        const iRects = aRects.filter( isntNil );

        if ( iRects.length === 0 ) {
            return undefined;
        }

        const left   = iRects.map( Rect.getLeft   ).reduce( max ),
              right  = iRects.map( Rect.getRight  ).reduce( min ),
              top    = iRects.map( Rect.getTop    ).reduce( max ),
              bottom = iRects.map( Rect.getBottom ).reduce( min ),
              width  = right - left,
              height = bottom - top;

        // Note: A width of 0 does have a purpose - rendering antialiased strokes
        // See Antialiasing.spec and http://codepen.io/Izhaki/pen/VPyvad
        return new Rect (
            left,
            top,
            width  >= 0 ? width  : undefined,
            height >= 0 ? height : undefined
        );
    }

    static expand = ( points: number, rect: Rect ): Rect => rect.clone().expand( points )

    static isNull = ( rect: Rect ): boolean => rect.isNull();

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

    intersect( aRect: Rect ): Rect {
        const intersection = Rect.intersect([ this, aRect ]);
        this.x = intersection.x;
        this.y = intersection.y;
        this.w = intersection.w;
        this.h = intersection.h;
        return this;
    }

    union( aRect: Rect ): void {
        let x = Math.min( this.getLeft(),   aRect.getLeft()   ),
            y = Math.min( this.getTop(),    aRect.getTop()    ),
            w = Math.max( this.getRight(),  aRect.getRight()  ) - x,
            h = Math.max( this.getBottom(), aRect.getBottom() ) - y;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
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

    expand( aPoints: number ): Rect {
        var hSign = this.w >= 0 ? -1 : 1;
        var vSign = this.h >= 0 ? -1 : 1;

        this.x +=  hSign * aPoints;
        this.y +=  vSign * aPoints;
        this.w += -hSign * aPoints * 2;
        this.h += -vSign * aPoints * 2;

        return this;
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

    // Converts the coordinates and size of the rect to whole numbers.
    // This is done to prevent antialiasing artifacts.
    quantise(): Rect {
        let iLeft   = Math.floor( this.getLeft()   ),
            iTop    = Math.floor( this.getTop()    ),
            iRight  = Math.ceil ( this.getRight()  ),
            iBottom = Math.ceil ( this.getBottom() );

        return new Rect( iLeft, iTop, iRight - iLeft, iBottom - iTop );
    }

    contains( aPoint: Point ): boolean {
        return !this.isNull()  &&
               this.getLeft() <= aPoint.x && this.getRight()  >= aPoint.x &&
               this.getTop()  <= aPoint.y && this.getBottom() >= aPoint.y;
    }

    isNull(): boolean {
        return this.w === undefined || this.h === undefined;
    }

}
