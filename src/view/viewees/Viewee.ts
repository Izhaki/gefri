import { Composite,
         Stream           } from './../../core';
import { Transformable,
         Transformations  } from './../output';
import { Rect,
         TransformMatrix  } from '../geometry';

export
abstract class Viewee extends Composite< Viewee > {
    static    updatesStream: Stream = new Stream();
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

    protected onAfterAdd() {
        this.updatesStream = this.getParent().updatesStream;
        super.onAfterAdd();
        this.notifyUpdate();
    }

    protected onBeforeRemove() {
        super.onBeforeRemove();
        this.notifyUpdate();
    }

    protected notifyUpdate(): void {
        this.updatesStream.notify( this );
    }

}
