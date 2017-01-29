import { Viewee        } from '../viewees';
import { Transformable } from './';
import { Rect,
         Rects         } from '../geometry';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;

    protected setclipArea( aRect: Rect ) {
        this.clipArea = aRect;
    }

    protected intersectClipAreaWith( aViewee: Viewee ): void {
        let iAbsoluteRect: Rect;

        // We get the bounding rect from our super, which should return a rect
        // in absolute coordinates.
        iAbsoluteRect = super.getRendereredBoundingRectOf( aViewee );

        if ( this.clipArea ) {
            this.clipArea.intersect( iAbsoluteRect );
        } else {
            this.setclipArea( iAbsoluteRect );
        }
    }

    isWithinClipArea( aViewee: Viewee ): boolean {
        let aBoundingRect: Rect

        aBoundingRect = this.getNonClippingCompositionBoundsOf( aViewee );
        aBoundingRect.intersect( this.clipArea );

        return !aBoundingRect.isNullRect()
    }

    protected getRendereredBoundingRectOf( aViewee: Viewee ) : Rect {
        let aBoundingRect: Rect

        aBoundingRect = super.getRendereredBoundingRectOf( aViewee );

        if ( this.clipArea ) {
            aBoundingRect.intersect( this.clipArea );
        }

        return aBoundingRect;
    }

    protected getNonClippingCompositionBoundsOf( aViewee: Viewee ): Rect {

        let aBoundingRects: Rects = [];

        aBoundingRects.push(
            super.getRendereredBoundingRectOf( aViewee )
        );

        if ( !aViewee.isClipping ) {
            aViewee.forEachChild( aChild => {
                aBoundingRects.push(
                    this.getNonClippingCompositionBoundsOf( aChild )
                );
            });
        }

        return Rect.union( aBoundingRects );
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
