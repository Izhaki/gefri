import { Contextual    } from './';
import { Point,
         Rect          } from '../../../geometry';
import { getClassName,
         emptyArray    } from '../../../../core/Utils';
import { Viewee        } from '../../../viewees';
import { Visible       } from '../../../viewees/visibles/Visible';

import { cumulateTransformationsOf } from '../../../viewees/multimethods';

import { fill,
         stroke } from './multimethods';

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
        this.erase( aDamagedRect );
        this.pushState();
        this.setclipArea( aDamagedRect );
        this.render( aViewee );
        this.popState();
    }

    render( aViewee: Viewee ): void {
        if ( this.needsRendering( aViewee ) ) {
            this.fill( aViewee );
            this.renderChildren( aViewee );
            this.stroke( aViewee );
        }
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
