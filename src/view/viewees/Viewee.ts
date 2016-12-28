import { Composite,
         Stream           } from './../../core';
import { Transformable,
         Transformations  } from './../output';
import { Rect,
         TransformMatrix  } from '../geometry';

export
type Viewees = Viewee[];

export
abstract class Viewee extends Composite< Viewee > {
    static    updatesStream: Stream = new Stream(); // A global static (null) updates stream
    protected updatesStream: Stream = Viewee.updatesStream;

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
        this.updatesStream = aStream;

        this.forEachChild( aChild => {
            aChild.attach( aStream );
        });
    }

    /**
     * @returns {boolean} true if the viewee should be hit-tested against
     */
    abstract isInteractive(): boolean;

    detach() {
        this.updatesStream = Viewee.updatesStream;

        this.forEachChild( aChild => {
            aChild.detach();
        });
    }

    protected onAfterAdd() {
        let iUpdateStream = this.getParent().updatesStream;
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
        this.updatesStream.notify( this );
    }

}
