import { Viewee        } from '../viewees';
import { Transformable } from './';
import { Rect,
         Rects         } from '../geometry';

import { inject } from '../../core/di';

export
abstract class Clipped extends Transformable {
    protected clipArea: Rect;
    private   antialiasingExtraMargins:  number;


    constructor() {
        super();
        this.antialiasingExtraMargins = inject( 'antialiasingExtraMargins' );
    }


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
        // Although the viewee bounds may not be within the clipArea, it's
        // stroke antialiasing may be. So expand the rect to include the
        // antialiasing margin.
        this.expandToIncludeAntialiasing( aBoundingRect );
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

    // Antialiasing applied by the canvas results in pixels outside the rect boundery.
    // So we expand the damaged rect to include these extra pixels.
    protected expandToIncludeAntialiasing( aRect: Rect ) : Rect {
        // When the zoom level is below 1, say 0.5, a stroke width of 1 will
        // be rendered onto 2 pixels, then antialiasing will be applied (which
        // is never more than a pixel wide). So we have to account for the zoom
        // factor.
        // First, we find the biggest of the zoom factors.
        // Then, we ensure it does not go below the antialiasingExtraMargins
        // or the expansion will not catch the antialiasing.
        let expensionFactor = Math.max( this.zoomMatrix.scaleX, this.zoomMatrix.scaleY, this.antialiasingExtraMargins );

        // We multiply the injected antialiasingExtraMargins by the
        // expensionFactor;
        let margins = this.antialiasingExtraMargins * expensionFactor;
        aRect.expand( margins );

        return aRect;
    }

}
