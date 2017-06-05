import { Composite,
         Stream           } from './../../core';
import { Rect,
         Matrix           } from '../geometry';

export
type Viewees = Viewee[];

export
abstract class Viewee extends Composite< Viewee > {

    static isClipping = ( viewee ) => viewee.isClipping;
    static isRendered = ( viewee ) => viewee.rendered
    static isInteractive = ( viewee ) => viewee.isInteractive()

    static    updates$: Stream = new Stream(); // A global static (null) updates stream
    protected updates$: Stream = Viewee.updates$;

    protected clipping: boolean = true;

    // Determines wheather or not the viewee and its children should be rendered.
    protected _rendered: boolean = true;

    get rendered(): boolean {
        return this._rendered;
    }

    get isClipping(): boolean {
        return this.clipping;
    }

    set isClipping( clipping: boolean ) {
        this.clipping = clipping;
    }

    attach( aStream: Stream ) {
        this.updates$ = aStream;

        this.forEachChild( aChild => {
            aChild.attach( aStream );
        });
    }

    /**
     * @returns {boolean} true if the viewee should be hit-tested against
     */
    abstract isInteractive(): boolean;

    detach() {
        this.updates$ = Viewee.updates$;

        this.forEachChild( aChild => {
            aChild.detach();
        });
    }

    protected onAfterAdd() {
        let iUpdateStream = this.getParent().updates$;
        this.attach( iUpdateStream );
        super.onAfterAdd();
        this.notifyUpdate();
    }

    protected onBeforeRemove() {
        super.onBeforeRemove();
        this.notifyUpdate();
        this.detach();
    }

    protected notifyUpdate(): void {
        this.updates$.notify( this );
    }

}
