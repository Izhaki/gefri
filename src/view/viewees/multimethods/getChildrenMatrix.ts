import { methodDispatcher } from '../methodDispatcher'

import {
    Root,
    Transformer,
    Rectangle,
    Path
} from '../';

import {
    pipe
} from '../../../core/FP';

import {
    DualMatrix
} from '../../geometry/DualMatrix';

import { getBoundingRect  } from './';

export
const getChildrenMatrix = methodDispatcher({
    Root: ( root: Root, matrix: DualMatrix ): DualMatrix => {
        return matrix;
    },

    Transformer: ( transformer: Transformer, matrix: DualMatrix ): DualMatrix => pipe(
        DualMatrix.translate( transformer.getTranslate() ),
        DualMatrix.scale( transformer.getScale() ),
        DualMatrix.zoom( transformer.getZoom() )
    )( matrix ),

    Rectangle: ( rectangle: Rectangle, matrix:DualMatrix ): DualMatrix =>
        DualMatrix.translate( getBoundingRect( rectangle ).getLeftTop(), matrix ),

    // Path: ( aPath: Path, matrix: DualMatrix ): DualMatrix => {
    //     // TODO
    //     return matrix;
    // }
})
