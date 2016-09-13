import { Unseen }  from './Unseen';
import { Painter } from '../../output/Painter';
import { Control } from '../../Control';

// An adapter between the viewee composition and the control.
// There is only one root per hierarchy, and it is created automatically
// by the control.
export
class Root extends Unseen {
    private control: Control

    constructor( aControl: Control ) {
        super();
        this.control = aControl;
    }

    protected beforeChildrenPainting( aPainter: Painter ): void {
        super.beforeChildrenPainting( aPainter );
        this.setClipAreaToControlBounds( aPainter );
    }

    private setClipAreaToControlBounds( aPainter ){
        let iControlBounds = this.control.getBoundingRect();
        aPainter.intersectClipAreaWith( iControlBounds );
    }

}
