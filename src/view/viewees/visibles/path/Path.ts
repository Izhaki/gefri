import { Visible          } from './../Visible';
import { PathSegments,
         LineSegment,
         QuadSegment,
         CubicSegment     } from './PathSegments'
import { Point,
         Rect,
         cNoScale,        } from './../../../geometry';
import { Transformations  } from './../../../output';

export
class Path extends Visible {
    private start:    Point;
    private segments: PathSegments = [];

    constructor( aStart: Point ) {
        super();
        this.start = aStart;
    }

    lineTo( aEnd: Point ): Path {
        let iSegment = new LineSegment( aEnd );
        this.segments.push( iSegment );
        return this;
    }

    quadTo( aControl: Point, aEnd: Point ): Path {
        let iSegment = new QuadSegment( aControl, aEnd );
        this.segments.push( iSegment );
        return this;
    }

    cubicTo( aControl1: Point, aControl2: Point, aEnd: Point ): Path {
        let iSegment = new CubicSegment( aControl1, aControl2, aEnd );
        this.segments.push( iSegment );
        return this;
    }

    getStart(): Point {
        return this.start;
    }

    forEachSegment( aCallback ): void {
        this.segments.forEach( aCallback );
    }

    // TODO
    getBoundingRect(): Rect {
        return new Rect( 0, 0, 0, 0 );
    }

    getTransformations(): Transformations {
        let iBounds: Rect = this.getBoundingRect();

        return {
            translate: iBounds.getLeftTop(),
            zoom:      cNoScale,
            scale:     cNoScale
        }
    }

}
