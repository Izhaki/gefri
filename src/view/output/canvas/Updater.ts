import { Stream          } from '../../../core';
import { Viewee          } from '../../viewees/Viewee';
import { Rect,
         Rects,
         TransformMatrix } from '../../geometry';

export
class Updater {
    private damagedRects;

    constructor( aUpdateStream: Stream, aDamagedRects: Rects ) {
        aUpdateStream.subscribe( aViewee => this.onUpdate( aViewee ) )
        this.damagedRects = aDamagedRects;
    }

    onUpdate( aViewee: Viewee ): void {
        let iDamagedRect = this.getVieweeAbsoluteBoundingRect( aViewee );
        this.damagedRects.push( iDamagedRect );
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
