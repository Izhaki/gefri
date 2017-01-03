import { Viewee        } from '../viewees';
import { Transformable } from './';
import { Rect          } from '../geometry';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;

    protected intersectClipAreaWith( aRelativeRect: Rect ): void {
        let iAbsoluteRect = aRelativeRect.apply( this.getAbsoluteMatrix() );
        if ( this.clipArea ) {
            this.clipArea.intersect( iAbsoluteRect );
        } else {
            this.clipArea = iAbsoluteRect;
        }
    }

    isRectWithinClipArea( aRelativeRect: Rect ): boolean {
        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = this.toAbsoluteRect( aRelativeRect );
        return this.clipArea.isOverlappingWith( iAbsoluteRect );
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
