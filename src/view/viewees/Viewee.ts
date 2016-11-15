import { Composite,
         Stream           } from './../../core';
import { Transformable    } from './../output';
import { Rect,
         Transformations,
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

    getAppliedTransformMatrix(): TransformMatrix {
        let iMatrix:           TransformMatrix = new TransformMatrix(),
            iTransformations : Transformations;

        this.forEachParent( ( aParent: Viewee )  => {
            iTransformations = aParent.getTransformations();
            iMatrix.transform( iTransformations );
        });

        return iMatrix;
    }

    protected notifyUpdate(): void {
        this.updatesStream.notify( this );
    }

}
