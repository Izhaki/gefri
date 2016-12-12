import { Transformable } from './';
import { Rect,
         Point         } from '../geometry';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;

    protected intersectClipAreaWith( aAbsoluteRect: Rect ): void {
        if ( this.clipArea ) {
            this.clipArea.intersect( aAbsoluteRect );
        } else {
            this.clipArea = aAbsoluteRect;
        }
    }

    isRectWithinClipArea( aAbsoluteRect: Rect ): boolean {
        return this.clipArea.isOverlappingWith( aAbsoluteRect );
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
