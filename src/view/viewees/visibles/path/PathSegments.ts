import { Point } from './../../../geometry';

export
class PathSegment {
    private end: Point;

    constructor( aEnd: Point ) {
        this.end = aEnd;
    }

    getEnd(): Point {
        return this.end;
    }
}

export
type PathSegments = PathSegment[];

export
class LineSegment extends PathSegment {
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

}
