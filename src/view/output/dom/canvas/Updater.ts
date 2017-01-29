import { Clipped } from '../../';
import { Stream  } from '../../../../core';
import { Viewee  } from '../../../viewees';
import { Rect,
         Rects   } from '../../../geometry';

import { cumulateTransformationsOf } from '../../../viewees/multimethods';

export
class Updater extends Clipped {
    private damagedRect: Rect  = undefined;

    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;

    constructor( aUpdateStream: Stream ) {
        super();
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
    }

    onUpdate( aViewee: Viewee ): void {
        this.pushState();

        this.updateMatrixFor( aViewee );
        this.addToDamagedRect( aViewee );

        this.popState();
    }

    addToDamagedRect( aViewee ): void {
        this.addVieweeBoundingRectToDamagedRect( aViewee );
        if ( !aViewee.isClipping ) {
            this.pushState();

            this.cumulateTransformationsOf( aViewee );

            aViewee.forEachChild( ( aChild ) => {
                this.addToDamagedRect( aChild );
            });

            this.popState();
        }
    }

    flushDamagedRect(): Rect {
        let iDamagedRect: Rect = this.damagedRect;
        this.damagedRect = undefined;
        return iDamagedRect;
    }

    private updateMatrixFor( aViewee: Viewee ): void {
        aViewee.forEachAncestor( ( aAncestor: Viewee )  => {
            this.cumulateTransformationsOf( aAncestor );
        });
    }

    private addVieweeBoundingRectToDamagedRect( aViewee: Viewee ): void {
        let iDamagedRect = this.getRendereredBoundingRectOf( aViewee );
        iDamagedRect = this.expandToIncludeAntialiasing( iDamagedRect );

        if ( this.damagedRect ) {
            this.damagedRect.union( iDamagedRect );
        } else {
            this.damagedRect = iDamagedRect.clone();
        }
    }

}
