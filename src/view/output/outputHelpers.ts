import { Viewee } from '../viewees'

import { DualMatrix } from '../geometry/DualMatrix'

import {
    Rect,
} from '../geometry'

import {
    getBoundingRect,
    getChildrenMatrix
} from '../viewees/multimethods'

import {
    pipe,
    prop
} from '../../core/FP'

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
const getRendereredBoundingRectOf = ( viewee: Viewee, matrix: DualMatrix, clipArea ) =>
    getBoundingRect( viewee )
    .applyMatrix( DualMatrix.getCombination( matrix ) )
    .intersect( clipArea )

export
const getScaledBoundingRectOf = ( viewee: Viewee, matrix: DualMatrix ) =>
    getBoundingRect( viewee )
    .applyMatrix( matrix.scale )

export
const outsideClipArea = pipe( prop('bounds'), Rect.isNull )

export
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
