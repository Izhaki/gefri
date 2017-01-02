import { Point,
         Rect,
         TransformMatrix  } from './../../../geometry';

import Bezier = require('bezier-js');

export
abstract class PathSegment {
    private end: Point;

    constructor( aEnd: Point ) {
        this.end = aEnd;
    }

    setEnd( aEnd: Point ) {
        this.end = aEnd;
    }

    getEnd(): Point {
        return this.end;
    }

    abstract getBoundingRect( aStart: Point ): Rect;
    abstract getPointDistance( aStart: Point, x: number, y: number ): number;
    abstract clone(): PathSegment;

    applyMatrix( aMatrix: TransformMatrix ) {
        this.end = this.end.apply( aMatrix );
    }

    protected getBezierBoundingRect( aBezier: Bezier ): Rect {
        let iBox = aBezier.bbox();

        return new Rect (
            iBox.x.min,
            iBox.y.min,
            iBox.x.size,
            iBox.y.size
        );
    }
}

export
type PathSegments = PathSegment[];

export
class LineSegment extends PathSegment {

    clone(): PathSegment {
        return new LineSegment( this.getEnd().clone() );
    }

    getBoundingRect( aStart: Point ): Rect {
        return new Rect( aStart, this.getEnd() );
    }

    getPointDistance( aStart: Point, x: number, y: number ): number {
        let abs = Math.abs,
            sqrt = Math.sqrt,
            sqr  = ( x ) => Math.pow( x, 2 );

        let x1 = aStart.x,
            y1 = aStart.y,
            x2 = this.getEnd().x,
            y2 = this.getEnd().y;

        let iDistance =
            abs( ( y2 - y1 ) * x - ( x2 - x1 ) * y + x2 * y1 - y2 * x1 )
            /
            sqrt( sqr( y2 - y1 ) + sqr( x2 - x1 ) );

        return iDistance
    }

}

export
class QuadSegment extends PathSegment {

    private control: Point;

    constructor( aControl: Point, aEnd: Point ) {
        super( aEnd );
        this.control = aControl;
    }

    clone(): PathSegment {
        return new QuadSegment( this.getControl().clone(), this.getEnd().clone() );
    }

    applyMatrix( aMatrix: TransformMatrix ) {
        super.applyMatrix( aMatrix );
        this.control = this.control.apply( aMatrix );
    }

    getControl(): Point {
        return this.control;
    }

    setControl( aControl ) {
        this.control = aControl;
    }

    private getBezier( aStart ): Bezier {
        let iStart = aStart,
            iCtrl  = this.getControl(),
            iEnd   = this.getEnd();

        return new Bezier(
            iStart.x, iStart.y,
            iCtrl.x,  iCtrl.y,
            iEnd.x,   iEnd.y
        );
    }

    getBoundingRect( aStart: Point ): Rect {
        let iBezier = this.getBezier( aStart );
        return this.getBezierBoundingRect( iBezier ) ;
    };

    getPointDistance( aStart: Point, x: number, y: number ): number {
        let iBezier     = this.getBezier( aStart ),
            iProjection = iBezier.project({ x, y }),
            iDistance   = iProjection.d;

        return iDistance;
    }

}

export
class CubicSegment extends PathSegment {

    private control1: Point;
    private control2: Point;

    constructor( aControl1: Point, aControl2: Point, aEnd: Point ) {
        super( aEnd );
        this.control1 = aControl1;
        this.control2 = aControl2;
    }

    clone(): PathSegment {
        return new CubicSegment( this.getControl1().clone(), this.getControl2().clone(), this.getEnd().clone() );
    }

    applyMatrix( aMatrix: TransformMatrix ) {
        super.applyMatrix( aMatrix );
        this.control1 = this.control1.apply( aMatrix );
        this.control2 = this.control2.apply( aMatrix );
    };

    getControl1(): Point {
        return this.control1;
    }

    getControl2(): Point {
        return this.control2;
    }

    setControl1( aControl ) {
        this.control1 = aControl;
    }

    setControl2( aControl ) {
        this.control2 = aControl;
    }

    private getBezier( aStart ): Bezier {
        let iStart = aStart,
            iCtrl1 = this.getControl1(),
            iCtrl2 = this.getControl2(),
            iEnd   = this.getEnd();

        return new Bezier(
            iStart.x, iStart.y,
            iCtrl1.x, iCtrl1.y,
            iCtrl2.x, iCtrl2.y,
            iEnd.x,   iEnd.y
        );
    }

    getBoundingRect( aStart: Point ): Rect {
        let iBezier = this.getBezier( aStart );
        return this.getBezierBoundingRect( iBezier ) ;

    }

    getPointDistance( aStart: Point, x: number, y: number ): number {
        let iBezier     = this.getBezier( aStart ),
            iProjection = iBezier.project({ x, y }),
            iDistance   = iProjection.d;

        return iDistance;
    }

}
