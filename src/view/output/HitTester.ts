import { Point,
         Rect,
         Matrix      } from '../geometry'

import { DualMatrix } from '../geometry/DualMatrix'

import { Viewee,
         Viewees,
         Path,
         Transformer } from '../viewees'

import { LazyTree } from '../../core/LazyTree'

import { getClassName } from '../../core/Utils'

import { getContextOf } from './OutputContext'

import { vieweeToRender } from './outputHelpers'

import {
    pipe,
} from '../../core/FP';

export
class HitTestResult {
    private hits:   Viewees = [];
    private matrix: Matrix  = new Matrix();

    public addHit( aViewee: Viewee ): void {
        // The viewee is added to the front of the hits array,
        // so it's deepest first.
        this.hits.unshift( aViewee );
    }

    public getHits(): Viewees {
        return this.hits;
    }

    public getTopHit(): Viewee {
        return this.hits[ 0 ];
    }

    public getAbsoluteMatrix(): Matrix {
        return this.matrix;
    }

    public setMatrix( aMatrix: Matrix ) {
        this.matrix = aMatrix.clone();
    }
}

export
class HitTester {

    test( aViewee: Viewee, aMousePosition: Point, aResult: HitTestResult ) {
        const context = getContextOf( aViewee )

        const hitTest = ( node ) => {

            if ( getClassName( node.viewee ) === 'Transformer' ) {
                const transformer = node.viewee as Transformer
                const absoluteMtx = pipe(
                    DualMatrix.scale( transformer.getScale() ),
                    DualMatrix.translate( transformer.getTranslate() ),
                    DualMatrix.zoom( transformer.getZoom() ),
                    DualMatrix.getCombination
                )( node.ctx.matrix )

                aResult.setMatrix( absoluteMtx )
            }

            return {
                preNode: () => {

                    const absoluteMtx = DualMatrix.getCombination( node.ctx.matrix )
                    const { viewee, bounds } = node

                    let isHit = undefined

                    switch ( getClassName( viewee ) ) {
                        case 'Path':
                            const path = viewee as Path
                            const HIT_PADDING = 3
                            let   isWithinRect: boolean;

                            const expandedRect = Rect.expand( HIT_PADDING, bounds )

                            isWithinRect = expandedRect.contains( aMousePosition )

                            if ( isWithinRect ) {
                                let aAbsolutePath = Path.applyMatrix( path, absoluteMtx )
                                let iDistance = aAbsolutePath.getPointDistance( aMousePosition )
                                isHit = iDistance < HIT_PADDING;
                            } else {
                                isHit = false;
                            }
                            break
                        case 'Rectangle':
                            isHit = bounds.contains( aMousePosition )
                            break
                        default:
                            throw "Could not find matching class in when hit testing"
                    }

                    if ( isHit ) {
                        aResult.addHit( viewee )
                    }
                },
                // preChildren: () => {
                //     if ( getClassName( node.viewee ) === 'Transformer' ) {
                //         const absoluteMtx = DualMatrix.getCombination( node.ctx.matrix )
                //         aResult.setMatrix( absoluteMtx )
                //     }
                // },

            }
        }

        LazyTree.of( aViewee )
            .keepSubTreeIf( Viewee.isRendered )
            .dropNodeIf( ( viewee ) => !viewee.isInteractive() ) // TODO: keepNodeIf( Viewee.isInteractive )
            .mapAccum( vieweeToRender, context )
            .traverse( hitTest )

    }

}

