import { Control } from './Control';
import { Stream  } from '../../../core';
import { Viewee,
         Viewees } from '../../viewees/Viewee';

export
class EventMediator {
    private control:    Control;
    public  mouseMove$: Stream;

    constructor( aControl: Control ) {
        this.control = aControl;

        this.mouseMove$ = new Stream();
        this.watchMouseMove();
    }

    private watchMouseMove(): void {
        let container = this.control.getContrainer();
        let offsetLeft = container.offsetLeft;
        let offsetTop  = container.offsetTop;

        container.addEventListener( 'mousemove', ( aEvent ) => {
            let hits: Viewees = this.control.hitTest( aEvent.clientX - offsetLeft, aEvent.clientY - offsetTop );
            this.mouseMove$.notify( hits );
        });
    }
}
