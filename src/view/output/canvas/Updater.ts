import { Transformable   } from '../';
import { Stream          } from '../../../core';
import { Viewee          } from '../../viewees/Viewee';
import { Rect,
         Rects,
         TransformMatrix } from '../../geometry';

import { getBoundingRect,
         cumulateTransformationsOf } from '../../viewees/multimethods';


export
class Updater extends Transformable {
    private damagedRects:              Rects = [];
    private cumulateTransformationsOf: ( Viewee ) => void;

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
        let iDamagedRect = this.getVieweeAbsoluteBoundingRect( aViewee );
        this.damagedRects.push( iDamagedRect );
    }

    private getVieweeAbsoluteBoundingRect( aViewee: Viewee ): Rect {
        return this.toAbsoluteRect( getBoundingRect( aViewee ) );
    }

}
