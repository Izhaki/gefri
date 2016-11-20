import { Transformable } from './';
import { Rect,
         Point         } from '../geometry';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;

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

    protected getState() : any {
        var iState = super.getState();
        iState.clipArea = this.clipArea ? this.clipArea.clone() : undefined;
        return iState;
    }

    protected restoreState( aState: any ) {
        super.restoreState( aState );
        this.clipArea = aState.clipArea;
    }

}