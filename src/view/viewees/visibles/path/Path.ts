import { Visible         } from './../Visible';
import { PathSegment,
         PathSegments,
         LineSegment,
         QuadSegment,
         CubicSegment    } from './PathSegments'
import { Point,
         Rect,
         Rects,
         Matrix          } from './../../../geometry';
import { Transformations } from './../../../output';

export
class Path extends Visible {
    static applyMatrix( aPath: Path, aMatrix: Matrix ): Path {
        let iClone: Path = aPath.clone();
        iClone.applyMatrix( aMatrix );
        return iClone;
    }


    private start:    Point;
    private segments: PathSegments = [];

    constructor( aStart: Point ) {
        super();
        this.start = aStart;
    }

    clone(): Path {
        let iClone = new Path( this.getStart().clone() );
        this.segments.forEach( aSegment => {
            iClone.addSegment( aSegment.clone() );
        });
        return iClone;
    }

    applyMatrix( aMatrix: Matrix ) {
        this.start = this.start.applyMatrix( aMatrix );

        this.segments.forEach( aSegment => {
            aSegment.applyMatrix( aMatrix );
        });
    }

    addSegment( aSegment: PathSegment ) {
        this.segments.push( aSegment );
    }

    lineTo( aEnd: Point ): Path {
        let iSegment = new LineSegment( aEnd );
        this.addSegment( iSegment );
        return this;
    }

    quadTo( aControl: Point, aEnd: Point ): Path {
        let iSegment = new QuadSegment( aControl, aEnd );
        this.addSegment( iSegment );
        return this;
    }

    cubicTo( aControl1: Point, aControl2: Point, aEnd: Point ): Path {
        let iSegment = new CubicSegment( aControl1, aControl2, aEnd );
        this.addSegment( iSegment );
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

    setControl1( aSegmentIndex: number, aPoint: Point ): void {
        this.notifyUpdate();
        let iSegment: CubicSegment = this.segments[ aSegmentIndex ] as CubicSegment;
        iSegment.setControl1( aPoint );
        this.notifyUpdate();
    }

    setControl2( aSegmentIndex: number, aPoint: Point ): void {
        this.notifyUpdate();
        let iSegment: CubicSegment = this.segments[ aSegmentIndex ] as CubicSegment;
        iSegment.setControl2( aPoint );
        this.notifyUpdate();
    }


    getStart(): Point {
        return this.start;
    }

    getPointDistance( aPoint: Point ): number {
        let iSegmentDistances: number[] = [];
        this.forEachSegment( ( aSegment, aStart ) => {
            let iDistance = aSegment.getPointDistance( aStart, aPoint );
            iSegmentDistances.push( iDistance );
        });

        return Math.min( ...iSegmentDistances );
    }

    forEachSegment( aCallback ): void {
        this.segments.forEach( ( aSegment: PathSegment, aIndex: number ) => {
            let isFirstSegment = aIndex == 0;
            let aSegmentStart: Point = isFirstSegment ? this.start : this.segments[ aIndex - 1 ].getEnd();
            aCallback( aSegment, aSegmentStart );
        });
    }

}
