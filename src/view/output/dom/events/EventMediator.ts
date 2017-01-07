import { Control } from '../Control';
import { Stream  } from '../../../../core';
import { Viewee,
         Viewees } from '../../../viewees/Viewee';

import { Point   } from '../../../geometry';

import { MouseMoveEvent } from './MouseMoveEvent';
import { HitTestResult } from '../../';

export
class EventMediator {
    private control:         Control;
    private mouseMoveEvent:  MouseMoveEvent;
    private HitTestResult:   HitTestResult;
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
        let iHitTestResult = new HitTestResult();

        let isMouseDown: boolean = false;

        let mapEvent = ( aDomEvent ) => {
            let iX = aDomEvent.clientX - offsetLeft,
                iY = aDomEvent.clientY - offsetTop;

            this.control.hitTest( iX, iY, iHitTestResult );

            let dX = iX - iEvent.coords.x,
                dY = iY - iEvent.coords.y;

            let iMatrix = iHitTestResult.getAbsoluteMatrix();

            let previousAbsoluteCoords = new Point( iEvent.absolute.coords.x, iEvent.absolute.coords.y );
            let newAbsoluteCoords = new Point( iX, iY ).applyInverseMatrix( iMatrix );

            iEvent.coords.set( iX, iY );
            iEvent.delta.set( dX, dY );
            iEvent.absolute.coords = iEvent.coords.applyInverseMatrix( iMatrix );
            iEvent.absolute.delta.set( newAbsoluteCoords.x - previousAbsoluteCoords.x, newAbsoluteCoords.y - previousAbsoluteCoords.y );
            iEvent.topHit = iHitTestResult.getTopHit();
            iEvent.hits   = iHitTestResult.getHits();
        }

        container.addEventListener( 'mousedown', ( aDomEvent ) => {
            isMouseDown = true;

            mapEvent( aDomEvent );

            iEvent.dragged = iEvent.hits[0];

        });

        container.addEventListener( 'mousemove', ( aDomEvent ) => {
            mapEvent( aDomEvent );
            this.mouseMove$.notify( iEvent );

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
