import { Clipped } from '../../';
import { Stream  } from '../../../../core';
import { Viewee  } from '../../../viewees';
import { Rect,
         Rects   } from '../../../geometry';

import { cumulateTransformationsOf } from '../../../viewees/multimethods';
import { inject } from '../../../../core/di';

export
class Updater extends Clipped {
    private damagedRect: Rect  = undefined;

    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;
    private antialiasingExtraMargins:  number;

    constructor( aUpdateStream: Stream ) {
        super();
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );

        this.antialiasingExtraMargins = inject( 'antialiasingExtraMargins' );
    }

    onUpdate( aViewee: Viewee ): void {
        this.pushState();

        this.updateMatrixFor( aViewee );
        this.addToDamagedRect( aViewee );

        this.popState();
    }

    addToDamagedRect( aViewee ): void {
        this.addVieweeBoundingRectToDamagedRect( aViewee );
        if ( !aViewee.isClipping ) {
            this.pushState();

            this.cumulateTransformationsOf( aViewee );

            aViewee.forEachChild( ( aChild ) => {
                this.addToDamagedRect( aChild );
            });

            this.popState();
        }
    }

    flushDamagedRect(): Rect {
        let iDamagedRect: Rect = this.damagedRect;
        this.damagedRect = undefined;
        return iDamagedRect;
    }

    private updateMatrixFor( aViewee: Viewee ): void {
        aViewee.forEachAncestor( ( aAncestor: Viewee )  => {
            this.cumulateTransformationsOf( aAncestor );
        });
    }

    private addVieweeBoundingRectToDamagedRect( aViewee: Viewee ): void {
        let iDamagedRect = this.getRendereredBoundingRectOf( aViewee );
        iDamagedRect = this.expandToIncludeAntialiasing( iDamagedRect );

        if ( this.damagedRect ) {
            this.damagedRect.union( iDamagedRect );
        } else {
            this.damagedRect = iDamagedRect.clone();
        }
    }

    // Antialiasing applied by the canvas results in pixels outside the rect boundery.
    // So we expand the damaged rect to include these extra pixels.
    private expandToIncludeAntialiasing( aRect: Rect ) : Rect {
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
