import { Stream          } from '../../../core';
import { Viewee          } from '../../viewees/Viewee';
import { Rect,
         Rects,
         TransformMatrix } from '../../geometry';

export
class Updater {
    private damagedRects: Rects = [];

    constructor( aUpdateStream: Stream ) {
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) )
    }

    onUpdate( aViewee: Viewee ): void {
        let iDamagedRect = this.getVieweeAbsoluteBoundingRect( aViewee );
        this.damagedRects.push( iDamagedRect );
    }

    getDamagedRects(): Rects {
        return this.damagedRects;
    }

    private getVieweeAbsoluteBoundingRect( aViewee: Viewee ): Rect {
        let iMatrix:               TransformMatrix,
            iBoundingRect:         Rect,
            iAbsoluteBoundingRect: Rect;

        iMatrix               = aViewee.getAppliedTransformMatrix();
        iBoundingRect         = aViewee.getBoundingRect();
        iAbsoluteBoundingRect = iMatrix.transformRect( iBoundingRect )

        return iAbsoluteBoundingRect;

    }
}
