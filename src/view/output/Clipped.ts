import { Transformable } from './';
import { Rect,
         Point         } from '../geometry';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;

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

    protected intersectClipAreaWith( aRect: Rect ): void {
        if ( this.clipArea ) {
            this.clipArea.intersect( aRect );
        } else {
            this.clipArea = aRect;
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
