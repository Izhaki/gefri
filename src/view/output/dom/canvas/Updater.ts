import { Stream     } from '../../../../core';
import { Viewee     } from '../../../viewees';
import { DualMatrix } from '../../../geometry/DualMatrix';
import { inject     } from '../../../../core/di';
import { prop       } from '../../../../core/FP';
import { LazyTree   } from '../../../../core/LazyTree';

import {
    Rect,
    Rects
} from '../../../geometry';

import {
    getBoundingRect,
    getChildrenMatrix
} from '../../../viewees/multimethods';

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
        const [ subCtxFn ] = vieweeToRender( ctx, viewee )
        return subCtxFn();
    }

    static getFor = ( viewee: Viewee ) =>
        viewee
        .getAncestors()
        .reduce( RenderContext.getSubFor, RenderContext.from() )
}

export
const getScaledBoundingRectOf = ( viewee, matrix ) =>
    getBoundingRect( viewee )
    .applyMatrix( matrix.scale )

export
const getRendereredBoundingRectOf = ( viewee, matrix, clipArea ) =>
    getBoundingRect( viewee )
    .applyMatrix( DualMatrix.getCombination( matrix ) )
    .intersect( clipArea )

// Antialiasing applied by the canvas results in pixels outside the rect boundery.
// So we expand the damaged rect to include these extra pixels.
const expandToIncludeAntialiasing = ( bounds, zoomMatrix ) => {
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

    return Rect.expand( margins, bounds )
};

const outsideClipArea = Rect.isNull

const vieweeToRender = ( ctx: RenderContext, viewee: Viewee ): [ Function, any ] => {
    const vieweeBounds = getRendereredBoundingRectOf( viewee, ctx.matrix, ctx.clipArea )
    const bounds = outsideClipArea( vieweeBounds ) ? vieweeBounds : expandToIncludeAntialiasing( vieweeBounds, ctx.matrix.zoom )

    // The reduce part (given to the children) - A function (so it is lazily evaluated) to get the context for this viewee children.
    // Note: We use vieweeBounds rather than bounds here as these bounds will affect the clipping area,
    //       and we don't want the antialiasing be part of that.
    const subCtxFn = () => RenderContext.getSub( viewee, vieweeBounds, ctx )

    return [ subCtxFn, bounds ]
}

export
const getNonClippingCompositionBoundsOf = ( viewee: Viewee, context: RenderContext ) => Rect.union(
    LazyTree.of( viewee )
        .dropChildrenIf( Viewee.isClipping )
        .mapReduce( vieweeToRender, context )
        .dropSubTreeIf( outsideClipArea )
        .toArray()
)

export
class Updater {
    private damagedRect: Rect  = undefined;

    constructor( aUpdateStream: Stream ) {
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) );
    }

    onUpdate( viewee: Viewee ): void {
        const context = RenderContext.getFor( viewee );
        const damagedRect = getNonClippingCompositionBoundsOf( viewee, context )
        this.damagedRect = Rect.union( [ damagedRect, this.damagedRect ]);
    }

    flushDamagedRect(): Rect {
        let iDamagedRect: Rect = this.damagedRect;
        this.damagedRect = undefined;
        return iDamagedRect;
    }

}
