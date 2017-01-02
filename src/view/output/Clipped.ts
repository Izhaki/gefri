import { Viewee        } from '../viewees';
import { Transformable } from './';
import { Rect          } from '../geometry';

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

    protected getRendereredBoundingRectOf( aViewee: Viewee ) : Rect {
        let aBoundingRect: Rect

        aBoundingRect = super.getRendereredBoundingRectOf( aViewee );
        aBoundingRect.intersect( this.clipArea );

        return aBoundingRect;
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
