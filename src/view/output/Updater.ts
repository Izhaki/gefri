import { Transformable } from './Transformable';
import { Rect, Rects }   from '../geometry/Rect';
import { Painter }       from './Painter';

export

class Updater extends Transformable {
    private toErase:      Rects;

    constructor() {
        super()
        this.toErase = [];
    }

    erase( aRect: Rect ): void {
        var iAbsoluteRect = this.toAbsoluteRect( aRect );
        this.toErase.push( iAbsoluteRect );
    }

    flushUpdates( aPainter: Painter ): void {
        this.toErase.forEach( function( aRect ) {
            aPainter.erase( aRect );
        });
    }

}
