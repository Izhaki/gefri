import { getBoundingRect,
         cumulateTransformationsOf } from '../viewees/multimethods';

import { Rect          } from '../geometry';
import { Transformable } from './Transformable';
import { Viewee,
         Viewees       } from '../viewees';
import { Visible       } from '../viewees/visibles/Visible';

export
class HitTester extends Transformable {
    private cumulateTransformationsOf: ( Viewee ) => void;

    constructor() {
        super();
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
    }

    test( aViewee: Viewee, x: number, y:number, hits: Viewees ) {
        if ( aViewee.rendered ) {
            if ( aViewee.isInteractive() ) {
                let aVieweeRect = this.getVieweeAbsoluteBoundingRect( aViewee );
                let isHit = aVieweeRect.contains( x, y );
                if ( isHit ) {
                    hits.unshift( aViewee );
                }
            }
            this.testChildren( aViewee, x, y, hits );
        }
    }

    private testChildren( aViewee: Viewee, x: number, y:number, hits: Viewees ): void {
        if ( aViewee.isChildless() ) return;

        this.pushState();

        // if ( aViewee.isClipping ) {
        //     this.intersectClipAreaWith( getBoundingRect( aViewee ) );
        // }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.test( aChild, x, y, hits );
        });

        this.popState();
    }

    private getVieweeAbsoluteBoundingRect( aViewee: Viewee ): Rect {
        return this.toAbsoluteRect( getBoundingRect( aViewee ) );
    }

}

