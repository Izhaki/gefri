import { Contextual    } from './';
import { Point,
         Rect          } from '../../../geometry';
import { getClassName,
         emptyArray    } from '../../../../core/Utils';
import {
    Viewee,
    PathSegment,
    QuadSegment,
    CubicSegment,
} from '../../../viewees';

import { Visible       } from '../../../viewees/visibles/Visible';

import { cumulateTransformationsOf } from '../../../viewees/multimethods';

import {
    fill,
    stroke
} from './multimethods';

import {
    pipe,
    prop
} from '../../../../core/FP';

import { LazyTree   } from '../../../../core/LT2'
import { DualMatrix } from '../../../geometry/DualMatrix'
import {
    RenderContext,
    getNonClippingCompositionBoundsOf,
    getRendereredBoundingRectOf,
    getScaledBoundingRectOf,
} from './Updater'

export
class Renderer extends Contextual {
    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;
    private fill:                      ( aViewee: Viewee ) => void;
    stroke:                            ( what:    any    ) => void;

    constructor( aContext: CanvasRenderingContext2D ) {
        super( aContext );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
        this.fill                      = fill.curry( this );
        this.stroke                    = stroke.curry( this );
    }

    refresh( aViewee: Viewee, aDamagedRect: Rect ): void {
        // When the clip area involves non-integers antialiasing is applied
        // resulting in artifacts (see http://codepen.io/Izhaki/pen/YNyOQx).
        // So we quantise the damaged rect to ensure whole-pixel clipping.
        let iDamagedRect = aDamagedRect.quantise();

        this.erase( iDamagedRect );
        this.pushState();
        this.setclipArea( iDamagedRect );

        this.renderFP( aViewee, iDamagedRect );
        //this.render( aViewee );

        this.popState();
    }

    renderFP( aViewee: Viewee, clipArea: Rect ): void {
        const hidden = ( viewee: Viewee ): boolean => !viewee.rendered

        const outsideClipArea = pipe( prop('bounds'), Rect.isNull )
        const isClipping = pipe( prop('viewee'), Viewee.isClipping )

        const vieweeToRender = ( viewee: Viewee, ctx: RenderContext ): [ any, Function ] => {

            const bounds = getRendereredBoundingRectOf( viewee, ctx.matrix, ctx.clipArea )
            const scaledBounds = getScaledBoundingRectOf( viewee, ctx.matrix )
            const subCtxFn = () => RenderContext.getSub( viewee, bounds, ctx )

            const map = {
                viewee,
                ctx,
                bounds,
                scaledBounds
            }

            return [ map, subCtxFn ]
        }

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

        const intersectClipAreaWith = ( bounds: Rect ): void => {
            this.context.beginPath()
            this.context.rect( bounds.x, bounds.y, bounds.w, bounds.h )
            this.context.clip()
        }

        const output = ( node ) => ({
            preNode: () => fill( node ),
            preChildren: () => {
                this.context.save()
                if ( getClassName( node.viewee ) === 'Transformer' ) {
                    const zoom = node.viewee.getZoom()
                    this.context.scale( zoom.x, zoom.y )
                }
                if ( node.viewee.isClipping ) {
                    intersectClipAreaWith( node.scaledBounds );
                }
            },
            postChildren: () => this.context.restore(),
            postNode: () => stroke( node ),
        })

        LazyTree.of( aViewee )
            .dropSubTreeIf( hidden )
            .mapAccum( vieweeToRender, context )
            .dropNodeIf( outsideClipArea )
            .dropChildrenIf( outsideClipArea ).and( isClipping )
            .traverse( output )
    }

    render( aViewee: Viewee ): void {
        if ( this.needsRendering( aViewee ) ) {
            this.fill( aViewee );
            this.renderChildren( aViewee );
            this.stroke( aViewee );
        }

        // Note the algorithm is wrong: Instead of getting the non clipping composition we can just:
        // Not render the current one if it is oneside the clip area, but keep iterating to children
        // if it isn't clipping. So:
        // needsRendering only looks at current bounds, not all composition.
        // add to the above:
        // } else {
        //     if ( !isClipping ) renderChildren
        //}

    }

    private needsRendering( aViewee: Viewee ): boolean {
        if ( aViewee.rendered ) {
            if ( aViewee instanceof Visible ) {
                return this.isWithinClipArea( aViewee );
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    private renderChildren( aViewee: Viewee ): void {
        if ( aViewee.isChildless() ) return;

        this.pushState();

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( aViewee );
        }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });

        this.popState();
    }

}
