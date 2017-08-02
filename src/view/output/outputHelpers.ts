import { Viewee } from '../viewees'

import { DualMatrix } from '../geometry/DualMatrix'

import {
    Rect,
} from '../geometry'

import {
    pipe,
    prop,
} from '../../core/FP'

import {
    OutputContext,
    getRenderedBoundingRectOf,
    getSubContext as getSubOutputContext,
} from './OutputContext'

export
interface OutputMap {
    viewee: Viewee,
    ctx: OutputContext,
    bounds: Rect,
}

const newOutputMap = ( ctx: OutputContext, viewee: Viewee ) => ({
    viewee,
    bounds: getRenderedBoundingRectOf( viewee, ctx ),
    ctx,
})

export
const outsideClipArea = pipe( prop('bounds'), Rect.isNull )

const getSubContext = ( outputMap: OutputMap ) => getSubOutputContext( outputMap.ctx, outputMap.viewee, outputMap.bounds )

export
const vieweeToRender = ( viewee: Viewee, ctx: OutputContext ): [ OutputMap, Function ] => {
    const outputMap = newOutputMap( ctx, viewee )

    // The reduce part (given to the children) - A thunk (so it is lazily evaluated) to get the context for this viewee children.
    const subCtxFn = () => getSubContext( outputMap )

    return [ outputMap, subCtxFn ]
}
