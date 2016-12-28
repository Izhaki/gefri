import { getBoundingRect,
         cumulateTransformationsOf } from '../viewees/multimethods';

import { Rect          } from '../geometry';
import { Clipped       } from './Clipped';
import { Viewee,
         Viewees       } from '../viewees';
import { Visible       } from '../viewees/visibles/Visible';

export
class HitTester extends Clipped {
    private cumulateTransformationsOf: ( Viewee ) => void;

    constructor() {
        super();
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
    }

    test( aViewee: Viewee, x: number, y:number, hits: Viewees ) {
        if ( aViewee.rendered ) {
            if ( aViewee.isInteractive() ) {
                let aVieweeRect = this.getVieweeAbsoluteBoundingRect( aViewee );
                aVieweeRect.intersect( this.clipArea );
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

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( getBoundingRect( aViewee ) );
        }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.test( aChild, x, y, hits );
        });

        this.popState();
    }

    private getVieweeAbsoluteBoundingRect( aViewee: Viewee ): Rect {
        return this.toAbsoluteRect( getBoundingRect( aViewee ) );
    }

    protected intersectClipAreaWith( aRelativeRect: Rect ): void {
        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = this.toAbsoluteRect( aRelativeRect );
        super.intersectClipAreaWith( iAbsoluteRect );
    }

}

