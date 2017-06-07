import { Point,
         Rect          } from '../../../geometry';
import { getClassName  } from '../../../../core/Utils';
import {
    Viewee,
    PathSegment,
    QuadSegment,
    CubicSegment,
} from '../../../viewees';

import {
    pipe,
    prop
} from '../../../../core/FP';

import { LazyTree   } from '../../../../core/LazyTree'
import { DualMatrix } from '../../../geometry/DualMatrix'

import {
    RenderContext,
    vieweeToRender,
    getRendereredBoundingRectOf,
    getScaledBoundingRectOf,
    outsideClipArea,
} from '../../outputHelpers'

export
class Renderer {
    protected context: CanvasRenderingContext2D;

    constructor( context: CanvasRenderingContext2D ) {
        this.context = context
    }

    refresh( aViewee: Viewee, aDamagedRect: Rect ): void {
        // When the clip area involves non-integers antialiasing is applied
        // resulting in artifacts (see http://codepen.io/Izhaki/pen/YNyOQx).
        // So we quantise the damaged rect to ensure whole-pixel clipping.
        let iDamagedRect = aDamagedRect.quantise();

        this.context.clearRect( iDamagedRect.x, iDamagedRect.y, iDamagedRect.w, iDamagedRect.h );

        this.context.save()
        this.intersectClipAreaWith( iDamagedRect );
        this.renderFP( aViewee, iDamagedRect );
        this.context.restore()
    }

    renderFP( aViewee: Viewee, clipArea: Rect ): void {
        const hidden = ( viewee: Viewee ): boolean => !viewee.rendered

        const isClipping = pipe( prop('viewee'), Viewee.isClipping )

        const context = RenderContext.from( clipArea )

        const fill = ( node ) => {
            switch ( getClassName( node.viewee ) ) {
                case 'Root':
                case 'Transformer':
                case 'Path':
                    break
                case 'Rectangle':
                    this.context.fillStyle = node.viewee.fillColour
                    const rect = node.scaledBounds
                    this.context.fillRect( rect.x, rect.y, rect.w, rect.h );
                    break
                default:
                    throw "Could not find matching class in fill"
            }
        }

        const stroke = ( node ) => {
            switch ( getClassName( node.viewee ) ) {
                case 'Root':
                case 'Transformer':
                    break
                case 'Rectangle':
                    const rect = node.scaledBounds
                    this.context.strokeRect( rect.x, rect.y, rect.w, rect.h )
                    break
                case 'Path':
                    const path = node.viewee
                    const start = path.getStart().applyMatrix( node.ctx.matrix.scale )
                    this.context.beginPath();
                    this.context.moveTo( start.x, start.y )

                    path.forEachSegment( ( segment: PathSegment ) => {
                        const end = segment.getEnd().applyMatrix( node.ctx.matrix.scale )
                        switch ( getClassName( segment ) ) {
                            case 'LineSegment':
                                this.context.lineTo( end.x, end.y )
                                break
                            case 'QuadSegment':
                                const c = (segment as QuadSegment).getControl().applyMatrix( node.ctx.matrix.scale )
                                this.context.quadraticCurveTo( c.x, c.y, end.x, end.y )
                                break
                            case 'CubicSegment':
                                const c1 = (segment as CubicSegment).getControl1().applyMatrix( node.ctx.matrix.scale )
                                const c2 = (segment as CubicSegment).getControl2().applyMatrix( node.ctx.matrix.scale )
                                this.context.bezierCurveTo( c1.x, c1.y, c2.x, c2.y, end.x, end.y )
                                break
                            default:
                                throw "Could not find matching class when stroking line segments"
                        }
                    })

                    this.context.stroke()
                    break
                default:
                    throw "Could not find matching class in stroke"
            }
        }

        const output = ( node ) => {
            node.scaledBounds = getScaledBoundingRectOf( node.viewee, node.ctx.matrix )
            return {
                preNode: () => fill( node ),
                preChildren: () => {
                    this.context.save()
                    if ( getClassName( node.viewee ) === 'Transformer' ) {
                        const zoom = node.viewee.getZoom()
                        this.context.scale( zoom.x, zoom.y )
                    }
                    if ( node.viewee.isClipping ) {
                        this.intersectClipAreaWith( node.scaledBounds )
                    }
                },
                postChildren: () => this.context.restore(),
                postNode: () => stroke( node ),
            }
        }

        LazyTree.of( aViewee )
            .dropSubTreeIf( hidden )
            .mapAccum( vieweeToRender, context )
            .dropNodeIf( outsideClipArea )
            .dropChildrenIf( outsideClipArea ).and( isClipping )
            .traverse( output )
    }

    private intersectClipAreaWith = ( bounds: Rect ): void => {
        this.context.beginPath()
        this.context.rect( bounds.x, bounds.y, bounds.w, bounds.h )
        this.context.clip()
    }

}
