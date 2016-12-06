import { Point,
         Rect  } from './../../../geometry';

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

    getBoundingRect( aStart: Point ): Rect {
        return new Rect( aStart, this.getEnd() );
    };

}

export
class QuadSegment extends PathSegment {

    private control: Point;

    constructor( aControl: Point, aEnd: Point ) {
        super( aEnd );
        this.control = aControl;
    }

    getControl(): Point {
        return this.control;
    }

    setControl( aControl ) {
        this.control = aControl;
    }

    getBoundingRect( aStart: Point ): Rect {
        let iStart = aStart,
            iCtrl  = this.getControl(),
            iEnd   = this.getEnd();

        let iBezier = new Bezier(
            iStart.x, iStart.y,
            iCtrl.x,  iCtrl.y,
            iEnd.x,   iEnd.y
        );

        return this.getBezierBoundingRect( iBezier ) ;
    };

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

    getControl1(): Point {
        return this.control1;
    }

    getControl2(): Point {
        return this.control2;
    }

    getBoundingRect( aStart: Point ): Rect {
        return new Rect( 0,0,20,20); // TODO
    };

}
