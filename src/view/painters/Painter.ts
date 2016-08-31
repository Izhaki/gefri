import { Stateful }        from './Stateful';
import { TransformMatrix } from '../geometry/TransformMatrix';
import { Rect }            from '../geometry/Rect';
import { Point }           from '../geometry/Point';

export
abstract class Painter extends Stateful {
    protected clipArea: Rect;
    protected matrix:   TransformMatrix;

    constructor() {
        super();
        this.matrix = new TransformMatrix();
    }

    abstract drawRectangle( aRect: Rect ): void;

    translate( x, y ): void {
        this.matrix.translate( new Point( x, y ) )
    }

    intersectClipAreaWith( aRect: Rect ): void {
        // Our clipArea is in absolute coordinates, so we convert the rect
        // to absolute ones.
        var iAbsoluteRect = this.toAbsoluteRect( aRect );
        if ( this.clipArea ) {
            this.clipArea.intersect( iAbsoluteRect );
        } else {
            this.clipArea = iAbsoluteRect;
        }
    }

    isRectWithinClipArea( aRect: Rect ): boolean {
        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        var iAbsoluteRect = this.toAbsoluteRect( aRect );
        if ( this.clipArea ) {
            return this.clipArea.isOverlappingWith( iAbsoluteRect );
        } else {
            return true;
        }
    }

    toAbsoluteRect( aRect: Rect ): Rect {
        return this.matrix.transformRect( aRect );
    }

    protected getState() : any {
        var iState = super.getState();
        iState.matrix   = this.matrix.clone();
        iState.clipArea = this.clipArea ? this.clipArea.clone() : undefined;
        return iState;
    }

    protected restoreState( aState: any ) {
        this.matrix   = aState.matrix;
        this.clipArea = aState.clipArea;
    }

}
