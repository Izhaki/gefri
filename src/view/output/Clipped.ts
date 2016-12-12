import { Transformable } from './';
import { Rect,
         Point         } from '../geometry';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;

    isRectWithinClipArea( aRect: Rect ): boolean {
        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = this.toAbsoluteRect( aRect );
        return this.clipArea.isOverlappingWith( iAbsoluteRect );
    }

    protected intersectClipAreaWith( aRect: Rect ): void {
        // preTransform was already applied by Transforming, so to get the
        // absolute rect we only need to apply the post transforms
        let iAbsoluteRect = this.postTransformRect( aRect );
        if ( this.clipArea ) {
            this.clipArea.intersect( iAbsoluteRect );
        } else {
            this.clipArea = iAbsoluteRect;
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
