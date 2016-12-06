import { Visible          } from './../Visible';
import { PathSegment,
         PathSegments,
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

    setStart( aPoint: Point ): void {
        this.notifyUpdate();
        this.start = aPoint;
        this.notifyUpdate();
    }

    setEnd( aSegmentIndex: number, aPoint: Point ): void {
        this.notifyUpdate();
        this.segments[ aSegmentIndex ].setEnd( aPoint );
        this.notifyUpdate();
    }

    setControl( aSegmentIndex: number, aPoint: Point ): void {
        this.notifyUpdate();
        let iSegment: QuadSegment = this.segments[ aSegmentIndex ] as QuadSegment;
        iSegment.setControl( aPoint );
        this.notifyUpdate();
    }

    getStart(): Point {
        return this.start;
    }

    forEachSegment( aCallback ): void {
        this.segments.forEach( ( aSegment: PathSegment, aIndex: number ) => {
            let isFirstSegment = aIndex == 0;
            let aSegmentStart: Point = isFirstSegment ? this.start : this.segments[ aIndex - 1 ].getEnd();
            aCallback( aSegment, aSegmentStart );
        });
    }

    // TODO
    getBoundingRect(): Rect {
        let iBoundingRect: Rect = new Rect( 0, 0, 0, 0 );

        this.forEachSegment( ( aSegment ) => {
            let iSegmentBoundingRect: Rect = aSegment.getBoundingRect( this.getStart() );
            iBoundingRect = iSegmentBoundingRect;
        });

        return iBoundingRect;
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
