import { Stream     } from '../../../../core';
import { Viewee     } from '../../../viewees';
import { DualMatrix } from '../../../geometry/DualMatrix';
import { inject     } from '../../../../core/di';
import { LazyTree   } from '../../../../core/LazyTree';

import {
    Rect,
    Rects
} from '../../../geometry';

import {
    getBoundingRect,
    getChildrenMatrix
} from '../../../viewees/multimethods';

import {
    pipe,
    prop,
    lensProp,
    set,
} from '../../../../core/FP';


export
class RenderContext {
    matrix:   DualMatrix
    clipArea: Rect

    static from = ( clipArea? ) => ({ matrix: new DualMatrix(), clipArea })

    static getSub = ( viewee: Viewee, bounds: Rect, ctx: RenderContext ): RenderContext => ({
        matrix:   getChildrenMatrix( viewee, ctx.matrix ),
        clipArea: viewee.isClipping ? Rect.intersect( [ ctx.clipArea, bounds ] ) : ctx.clipArea
    })

    static getSubFor = ( ctx, viewee ) => {
        const subCtxFn = vieweeToRender( viewee, ctx )[ 1 ]
        return subCtxFn();
    }

    static getFor = ( viewee: Viewee ) =>
        viewee
        .getAncestors()
        .reduce( RenderContext.getSubFor, RenderContext.from() )
}

export
const getScaledBoundingRectOf = ( viewee: Viewee, matrix: DualMatrix ) =>
    getBoundingRect( viewee )
    .applyMatrix( matrix.scale )

export
const getRendereredBoundingRectOf = ( viewee: Viewee, matrix: DualMatrix, clipArea ) =>
    getBoundingRect( viewee )
    .applyMatrix( DualMatrix.getCombination( matrix ) )
    .intersect( clipArea )


const outsideClipArea = pipe( prop('bounds'), Rect.isNull )

// Antialiasing applied by the canvas results in pixels outside the rect boundery.
// So we expand the damaged rect to include these extra pixels.
const expandBoundsByAntialiasing = ( acc ) => {
    const { bounds } = acc
    const zoomMatrix = acc.ctx.matrix.zoom

    if ( Rect.isNull( bounds ) ) {
        return acc
    } else {
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

}

const vieweeToRender = ( viewee: Viewee, ctx: RenderContext ): [ any, Function ] => {
    const bounds = getRendereredBoundingRectOf( viewee, ctx.matrix, ctx.clipArea )

    // The reduce part (given to the children) - A function (so it is lazily evaluated) to get the context for this viewee children.
    const subCtxFn = () => RenderContext.getSub( viewee, bounds, ctx )

    const mapped = {
        viewee,
        bounds,
        ctx,
    }

    return [ mapped, subCtxFn ]
}

const getNonClippingCompositionBoundsOf = ( viewee: Viewee, context: RenderContext ) => Rect.union(
    LazyTree.of( viewee )
        .dropChildrenIf( Viewee.isClipping )
        .mapAccum( vieweeToRender, context )
        .dropSubTreeIf( outsideClipArea )
        .map( expandBoundsByAntialiasing )
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
        const context = RenderContext.getFor( viewee )
        const damagedRect = getNonClippingCompositionBoundsOf( viewee, context )
        this.damagedRect = Rect.union( [ damagedRect, this.damagedRect ])
    }

    flushDamagedRect(): Rect {
        let iDamagedRect: Rect = this.damagedRect;
        this.damagedRect = undefined;
        return iDamagedRect;
    }

}
