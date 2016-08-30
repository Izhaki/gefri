import { TransformMatrix } from '../geometry/TransformMatrix';
import { Rect }            from '../geometry/Rect';
import { Point }           from '../geometry/Point';

export
abstract class Painter {
    protected clipArea: Rect;
    protected matrix:   TransformMatrix;

    constructor() {
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

    pushState(): void {
    }

    popState(): void {
    }

}
