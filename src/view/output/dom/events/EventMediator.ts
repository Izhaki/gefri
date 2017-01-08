import { Control } from '../Control';
import { Stream  } from '../../../../core';
import { Viewee,
         Viewees } from '../../../viewees/Viewee';

import { Point   } from '../../../geometry';

import { MouseMoveEvent } from './MouseMoveEvent';
import { HitTestResult } from '../../';

export
class EventMediator {
    private control:       Control;
    private HitTestResult: HitTestResult;

    private previousMouseEvent: MouseMoveEvent = new MouseMoveEvent();
    private currentlyDragged:   Viewee = undefined;

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
        let containerOffset: Point = new Point( container.offsetLeft, container.offsetTop );

        let iHitTestResult = new HitTestResult();

        let isMouseDown: boolean = false;

        let mapEvent = ( aDomEvent ): MouseMoveEvent => {
            let iEvent = new MouseMoveEvent();

            iEvent.client.coords = new Point( aDomEvent.clientX, aDomEvent.clientY ).substract( containerOffset );
            iEvent.client.delta = iEvent.client.coords.substract( this.previousMouseEvent.client.coords );

            this.control.hitTest( iEvent.client.coords, iHitTestResult );

            let iMatrix = iHitTestResult.getAbsoluteMatrix();
            iEvent.absolute.coords = iEvent.client.coords.applyInverseMatrix( iMatrix );
            iEvent.absolute.delta  = iEvent.absolute.coords.substract( this.previousMouseEvent.absolute.coords );

            iEvent.topHit  = iHitTestResult.getTopHit();
            iEvent.hits    = iHitTestResult.getHits();
            iEvent.dragged = this.currentlyDragged;

            this.previousMouseEvent = iEvent;
            return iEvent;
        }

        container.addEventListener( 'mousedown', ( aDomEvent ) => {
            isMouseDown = true;

            let iEvent = mapEvent( aDomEvent );

            this.currentlyDragged = iEvent.hits[0];
        });

        container.addEventListener( 'mousemove', ( aDomEvent ) => {
            let iEvent =  mapEvent( aDomEvent );
            this.mouseMove$.notify( iEvent );

            if ( isMouseDown ) {
                this.mouseDrag$.notify( iEvent );
            }
        });

        container.addEventListener( 'mouseup', ( aDomEvent ) => {
            this.currentlyDragged = undefined;
            isMouseDown = false;
        });

    }
}
