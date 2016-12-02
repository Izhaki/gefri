import { Point,
         Rect  } from './../../../geometry';

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

    getBoundingRect( aStart: Point ): Rect {
        return new Rect( 0,0,20,20); // TODO
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
