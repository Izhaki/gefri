import { Clipped } from '../../';
import { Stream  } from '../../../../core';
import { Viewee  } from '../../../viewees';
import { Rect,
         Rects   } from '../../../geometry';

import { cumulateTransformationsOf } from '../../../viewees/multimethods';
import { inject } from '../../../../core/di';

export
class Updater extends Clipped {
    private damagedRects:              Rects = [];
    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;
    private   antialiasingExtraMargins: number;

    constructor( aUpdateStream: Stream ) {
        super();
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );

        this.antialiasingExtraMargins = inject( 'antialiasingExtraMargins' );
    }

    onUpdate( aViewee: Viewee ): void {
        this.pushState();

        this.updateMatrixFor( aViewee );
        this.addVieweeBoundingRectToDamagedRect( aViewee );

        this.popState();
    }

    getDamagedRects(): Rects {
        return this.damagedRects;
    }

    private updateMatrixFor( aViewee: Viewee ): void {
        aViewee.forEachAncestor( ( aAncestor: Viewee )  => {
            this.cumulateTransformationsOf( aAncestor );
        });
    }

    private addVieweeBoundingRectToDamagedRect( aViewee: Viewee ): void {
        let iDamagedRect = this.getRendereredBoundingRectOf( aViewee );
        iDamagedRect = this.expandToIncludeAntialiasing( iDamagedRect );

        this.damagedRects.push( iDamagedRect );
    }

    // Antialiasing applied by the canvas results in pixels outside the rect boundery.
    // So we expand the damaged rect to include these extra pixels.
    private expandToIncludeAntialiasing( aRect: Rect ) : Rect {
        // When the zoom level is below 1, say 0.5, a stroke width of 1 will
        // be rendered onto 2 pixels, then antialiasing will be applied (which
        // is never more than a pixel wide). So we have to account for the zoom
        // factor.
        // First, we find the biggest of the zoom factors.
        // Then, we ensure it does not go below 1 or the expansion will not
        // catch the antialiasing.
        let expensionFactor = Math.max( this.zoomMatrix.scaleX, this.zoomMatrix.scaleY, 1 );

        // We multiply the injected antialiasingExtraMargins by the
        // expensionFactor;
        let margins = this.antialiasingExtraMargins * expensionFactor;
        aRect.expand( margins );

        return aRect;
    }

}
