import { Control   } from './Control';
import { Stream    } from '../../../core';

import { HitTester,
         HitTestResult } from '../'

import { Point,
         Rect   } from '../../geometry';

import { Viewee,
         Viewees,
         Root    } from '../../viewees';

export
abstract class ElementLayer {
    private   element:              HTMLElement;
    private   hasBeenAddedToTheDOM: boolean = false;
    private   hitTester:            HitTester;

    protected control:              Control

    protected root:                 Root;
    protected updates$:             Stream;



    constructor() {
        this.updates$  = new Stream();
        this.root      = new Root( this );
        this.element   = this.createElement();
        this.hitTester = new HitTester();

        this.root.attach( this.updates$ );
    }

    onAfterAdded( aControl: Control ): void {
        this.control              = aControl;
        this.hasBeenAddedToTheDOM = true;
    }

    getBoundingRect(): Rect {
        return this.control.getBoundingRect();
    }

    addViewees( ...aViewees: Viewees ): void {
        if ( !this.hasBeenAddedToTheDOM ) {
            throw new Error( 'Adding viewees to a layer before it has been added to the DOM' );
        }

        aViewees.forEach( ( aViewee: Viewee ) => {
            this.root.addChild( aViewee );
        })
    }

    getElement(): HTMLElement {
        return this.element;
    }

    hitTest( aMousePosition: Point, aResult: HitTestResult ): void {
        let hits: Viewees = [];
        this.hitTester.test( this.root, aMousePosition, aResult );
    }

    protected abstract createElement(): HTMLElement;

}
