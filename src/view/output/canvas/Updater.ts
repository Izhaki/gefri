import { Transformable   } from '../';
import { Stream          } from '../../../core';
import { Viewee          } from '../../viewees';
import { Rects,
         TransformMatrix } from '../../geometry';

import { cumulateTransformationsOf } from '../../viewees/multimethods';

export
class Updater extends Transformable {
    private damagedRects:              Rects = [];
    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;

    constructor( aUpdateStream: Stream ) {
        super();
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
    }

    onUpdate( aViewee: Viewee ): void {
        this.pushState();

        this.updateTransformationsFor( aViewee );
        this.addVieweeBoundingRectToDamagedRect( aViewee );

        this.popState();
    }

    getDamagedRects(): Rects {
        return this.damagedRects;
    }

    private updateTransformationsFor( aViewee: Viewee ) {
        aViewee.forEachAncestor( ( aAncestor: Viewee )  => {
            this.cumulateTransformationsOf( aAncestor );
        });
    }

    private addVieweeBoundingRectToDamagedRect( aViewee ) {
        let iDamagedRect = this.getRendereredBoundingRectOf( aViewee );
        this.damagedRects.push( iDamagedRect );
    }

}
