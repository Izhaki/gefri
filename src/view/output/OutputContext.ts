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
    reduce,
} from '../../core/FP'

export
interface OutputContext {
    matrix:   DualMatrix
    clipArea: Rect
}

export
const getRenderedBoundingRectOf = ( viewee: Viewee, context: OutputContext ) =>
    getBoundingRect( viewee )
    .applyMatrix( DualMatrix.getCombination( context.matrix ) )
    .intersect( context.clipArea )

export
const newOutputContext = ( clipArea: Rect = undefined, matrix: DualMatrix = new DualMatrix() ) => ({ clipArea, matrix })

export
const getSubContext = ( context: OutputContext, viewee: Viewee, bounds: Rect  = getRenderedBoundingRectOf( viewee, context ) ): OutputContext => newOutputContext(
    viewee.isClipping ? Rect.intersect( [ context.clipArea, bounds ] ) : context.clipArea,
    getChildrenMatrix( viewee, context.matrix )
)

export
const getContextOf = ( viewee: Viewee ): OutputContext => reduce( getSubContext, newOutputContext(), viewee.getAncestors() )

