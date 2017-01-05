import { Control } from '../Control';
import { Stream  } from '../../../../core';
import { Viewee,
         Viewees } from '../../../viewees/Viewee';

import { Point   } from '../../../geometry';

import { MouseMoveEvent } from './MouseMoveEvent';

export
class EventMediator {
    private control:         Control;
    private mouseMoveEvent:  MouseMoveEvent;
    public  mouseMove$:      Stream;
    public  mouseDrag$:      Stream;

    constructor( aControl: Control ) {
        this.control    = aControl;

        this.mouseMove$ = new Stream();
        this.mouseDrag$ = new Stream();
        this.watchMouseMove();
    }

    private watchMouseMove(): void {
        let container = this.control.getContrainer();
        let offsetLeft = container.offsetLeft;
        let offsetTop  = container.offsetTop;

        let iEvent = new MouseMoveEvent();

        let isMouseDown: boolean = false;

        let mapEvent = ( aDomEvent ) => {
            let iX = aDomEvent.clientX - offsetLeft,
                iY = aDomEvent.clientY - offsetTop;

            let dX = iX - iEvent.coords.x,
                dY = iY - iEvent.coords.y;

            let hits: Viewees = this.control.hitTest( iX, iY );

            iEvent.coords.set( iX, iY );
            iEvent.delta.set( dX, dY );
            iEvent.topHit   = hits[0];
            iEvent.hits     = hits;
        }

        container.addEventListener( 'mousedown', ( aDomEvent ) => {
            isMouseDown = true;

            mapEvent( aDomEvent );

            iEvent.dragged = iEvent.hits[0];

        });

        container.addEventListener( 'mousemove', ( aDomEvent ) => {
            mapEvent( aDomEvent );
            this.mouseMove$.notify( iEvent.hits );

            if ( isMouseDown ) {
                this.mouseDrag$.notify( iEvent );
            }
        });

        container.addEventListener( 'mouseup', ( aDomEvent ) => {
            iEvent.dragged = undefined;
            isMouseDown = false;
        });

    }
}
