import { Control } from '../Control';
import { Viewee  } from '../viewees/Viewee';
import { Root    } from '../viewees/invisibles';
import { Stream  } from '../../core';
import { Rect    } from '../geometry';

export
abstract class ElementLayer {
    private   element:              HTMLElement;
    private   hasBeenAddedToTheDOM: boolean = false;
    protected control:              Control

    protected root:                 Root;
    protected updatesStream:        Stream;

    constructor() {
        this.updatesStream = new Stream();
        this.root          = new Root( this );
        this.element       = this.createElement();

        this.root.attach( this.updatesStream );
    }

    onAfterAdded( aControl: Control ): void {
        this.control              = aControl;
        this.hasBeenAddedToTheDOM = true;
    }

    getBoundingRect(): Rect {
        return this.control.getBoundingRect();
    }

    addViewees( ...aViewees: Viewee[] ): void {
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

    protected abstract createElement(): HTMLElement;

}
