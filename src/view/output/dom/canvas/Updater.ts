import { Stream     } from '../../../../core';
import { Viewee     } from '../../../viewees';
import { DualMatrix } from '../../../geometry/DualMatrix';
import { inject     } from '../../../../core/di';
import { LazyTree   } from '../../../../core/LazyTree';

import {
    Rect,
} from '../../../geometry';

import {
    getBoundingRect,
} from '../../../viewees/multimethods';

import {
    pipe,
    prop,
    lensProp,
    set,
} from '../../../../core/FP';

import {
    RenderContext,
    vieweeToRender,
    outsideClipArea
} from '../../outputHelpers'

// Antialiasing applied by the canvas results in pixels outside the rect boundery.
// So we expand the damaged rect to include these extra pixels.
const antialiasBounds = ( acc ) => {
    const { bounds } = acc
    const zoomMatrix = acc.ctx.matrix.zoom

    const antialiasingExtraMargins = inject( 'antialiasingExtraMargins' )
    // When the zoom level is below 1, say 0.5, a stroke width of 1 will
    // be rendered onto 2 pixels, then antialiasing will be applied (which
    // is never more than a pixel wide). So we have to account for the zoom
    // factor.
    // First, we find the biggest of the zoom factors.
    // Then, we ensure it does not go below the antialiasingExtraMargins
    // or the expansion will not catch the antialiasing.
    const expensionFactor = Math.max( zoomMatrix.scaleX, zoomMatrix.scaleY, antialiasingExtraMargins );

    // We multiply the injected antialiasingExtraMargins by the
    // expensionFactor;
    const margins = antialiasingExtraMargins * expensionFactor;

    return set( lensProp( 'bounds' ), Rect.expand( margins, bounds ), acc )

}

// TODO: Can be changed to use a reducer and merged with onUpdate
const getNonClippingCompositionBoundsOf = ( viewee: Viewee ) => Rect.union(
    LazyTree.of( viewee )
        .dropChildrenIf( Viewee.isClipping )
        .mapAccum( vieweeToRender, RenderContext.getFor( viewee ) )
        .dropSubTreeIf( outsideClipArea )
        .map( antialiasBounds )
        .map( prop('bounds') )
        .toArray()
)

export
class Updater {
    private damagedRect: Rect  = undefined;

    constructor( aUpdateStream: Stream ) {
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) );
    }

    onUpdate( viewee: Viewee ): void {
        const damagedRect = getNonClippingCompositionBoundsOf( viewee )
        this.damagedRect = Rect.union( [ damagedRect, this.damagedRect ])
    }

    flushDamagedRect(): Rect {
        let iDamagedRect: Rect = this.damagedRect;
        this.damagedRect = undefined;
        return iDamagedRect;
    }

}
