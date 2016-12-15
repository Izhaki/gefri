import { Composite,
         Stream           } from './../../core';
import { Transformable,
         Transformations  } from './../output';
import { Rect,
         TransformMatrix  } from '../geometry';

export
abstract class Viewee extends Composite< Viewee > {
    static    updatesStream: Stream = new Stream(); // A global static (null) updates stream
    protected updatesStream: Stream = Viewee.updatesStream;

    protected clipping: boolean = true;

    abstract getBoundingRect(): Rect;

    get isClipping(): boolean {
        return this.clipping;
    }

    set isClipping( clipping: boolean ) {
        this.clipping = clipping;
    }

    abstract getTransformations(): Transformations;

    attach( aStream: Stream ) {
        this.updatesStream = aStream;

        this.forEachChild( aChild => {
            aChild.attach( aStream );
        });
    }

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
