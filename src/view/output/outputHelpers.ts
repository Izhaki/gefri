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
    prop,
    reduce,
} from '../../core/FP'

export
class RenderContext {
    matrix:   DualMatrix
    clipArea: Rect

    constructor( clipArea = undefined, matrix = new DualMatrix() ) {
        this.clipArea = clipArea
        this.matrix = matrix
    }

    static getFor = ( viewee: Viewee ) => reduce(
        ( ctx, viewee ) => ctx.getSubOf( viewee ),
        new RenderContext(),
        viewee.getAncestors()
    )

    getRenderedBoundingRectOf = ( viewee ) =>
        getBoundingRect( viewee )
        .applyMatrix( DualMatrix.getCombination( this.matrix ) )
        .intersect( this.clipArea )

    getSubOf = ( viewee ) => new RenderContext(
        viewee.isClipping ? Rect.intersect( [ this.clipArea, this.getRenderedBoundingRectOf( viewee ) ] ) : this.clipArea,
        getChildrenMatrix( viewee, this.matrix )
    )

}

export
const getScaledBoundingRectOf = ( viewee: Viewee, matrix: DualMatrix ) =>
    getBoundingRect( viewee )
    .applyMatrix( matrix.scale )

export
const outsideClipArea = pipe( prop('bounds'), Rect.isNull )

export
const vieweeToRender = ( viewee: Viewee, ctx: RenderContext ): [ any, Function ] => {
    const bounds = ctx.getRenderedBoundingRectOf( viewee )

    const mapped = {
        viewee,
        bounds,
        ctx,
    }

    // The reduce part (given to the children) - A nullary function (so it is lazily evaluated) to get the context for this viewee children.
    const subCtxFn = () => ctx.getSubOf( viewee ) // TODO: This will calc the rendered bounds, but so is `bounds` above

    return [ mapped, subCtxFn ]
}
