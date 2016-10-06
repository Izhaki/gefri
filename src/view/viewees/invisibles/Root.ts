import { Invisible } from './';
import { Painter,
         Updater   } from '../../output';
import { Control   } from '../../Control';
import { Rect      } from '../../geometry';

// An adapter between the viewee composition and the control.
// There is only one root per viewee hierarchy, and it is created automatically
// by the control.
export
class Root extends Invisible {
    private control: Control;
    private updater: Updater;

    constructor( aControl: Control ) {
        super();
        this.control = aControl;
        this.updater = new Updater();
    }

    refresh( aPainter: Painter ): void {
        this.updater.flushUpdates( aPainter );

        // TODO: For now, we just repaint the whole composition rather than
        // damaged areas only.
        this.paint( aPainter );
    }

    summonUpdater() : Updater {
        this.control.queueRefresh();
        return this.updater;
    }

    getBoundingRect(): Rect {
        // TODO change to tactic
        return this.control.getBoundingRect();
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
