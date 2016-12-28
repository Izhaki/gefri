import { Contextual    } from './';
import { Point,
         Rects         } from '../../geometry';
import { getClassName,
         emptyArray    } from '../../../core/Utils';
import { Viewee        } from '../../viewees/Viewee';
import { Visible       } from '../../viewees/visibles/Visible';

import { getBoundingRect,
         cumulateTransformationsOf } from '../../viewees/multimethods';

import { fill,
         stroke } from './multimethods';

export
class Renderer extends Contextual {
    private cumulateTransformationsOf: ( Viewee ) => void;
    private fill:                      ( Viewee ) => void;
    stroke:                            ( Viewee ) => void;

    constructor( aContext: CanvasRenderingContext2D ) {
        super( aContext );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
        this.fill                      = fill.curry( this );
        this.stroke                    = stroke.curry( this );
    }

    refresh( aViewee: Viewee, damagedRects: Rects ): void {
        this.eraseDamagedRects( damagedRects );
        this.render( aViewee );
        this.emptyDamagedRects( damagedRects );
    }

    render( aViewee: Viewee ): void {
        if ( this.needsRendering( aViewee ) ) {
            this.fill( aViewee );
            this.renderChildren( aViewee );
            this.stroke( aViewee );
        }
    }

    private eraseDamagedRects( aRects: Rects ): void {
        aRects.forEach( aRect => {
            this.erase( aRect );
        });
    }

    private emptyDamagedRects( aRects: Rects ): void {
        emptyArray( aRects );
    }

    private isWithinClipArea( aViewee: Viewee ): boolean {
        let iBounds = getBoundingRect( aViewee );
        return this.isRectWithinClipArea( iBounds );
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
            this.intersectClipAreaWith( getBoundingRect( aViewee ) );
        }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });

        this.popState();
    }

}
