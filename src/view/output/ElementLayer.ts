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

    protected contents:             Viewee  = null;
    protected root:                 Root;
    protected updatesStream:        Stream;

    constructor() {
        this.updatesStream = new Stream();
        this.root          = new Root( this );
        this.element       = this.createElement();
    }

    onAfterAdded( aControl: Control ): void {
        this.control              = aControl;
        this.hasBeenAddedToTheDOM = true;
    }

    getBoundingRect(): Rect {
        return this.control.getBoundingRect();
    }

    setContents( aViewee: Viewee ): void {
        if ( !this.hasBeenAddedToTheDOM ) {
            throw new Error( 'Setting contents of cavnas layer before it has been added to the DOM' );
        }

        if ( this.contents !== null ) {
            this.removeCurrentContents();
        }
        this.contents = aViewee;
        this.root.addChild( aViewee );
        this.root.attach( this.updatesStream );
    }

    getRoot(): Root {
        return this.root;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    protected abstract createElement(): HTMLElement;

    protected removeCurrentContents() {
        this.root.detach()
        this.root.removeChild( this.contents );
    }

}
