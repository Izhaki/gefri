import { cumulateTransformationsOf,
         hitTest                    } from '../viewees/multimethods';

import { Rect,
         Matrix  } from '../geometry';
import { Clipped } from './Clipped';
import { Viewee,
         Viewees } from '../viewees';
import { Visible } from '../viewees/visibles/Visible';

export
class HitTester extends Clipped {
    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;
    private hitTest:                   ( aViewee: Viewee, x: number, y: number, aAbsoluteMatrix: Matrix ) => boolean;

    constructor() {
        super();
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
        this.hitTest = hitTest.curry(
            // We define a new function so to maintain this.
            aViewee => this.getRendereredBoundingRectOf( aViewee )
        );
    }

    test( aViewee: Viewee, x: number, y:number, hits: Viewees ) {
        if ( aViewee.rendered ) {
            if ( aViewee.isInteractive() ) {
                let isHit = this.hitTest( aViewee, x, y, this.getAbsoluteMatrix() );
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

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( aViewee );
        }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.test( aChild, x, y, hits );
        });

        this.popState();
    }

}

