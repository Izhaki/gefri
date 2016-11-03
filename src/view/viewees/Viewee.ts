import { Composite     } from './../../core';
import { Transformable } from './../output';
import { Rect          } from '../geometry';

export
abstract class Viewee extends Composite< Viewee > {
    protected clipping: boolean = true;

    abstract getBoundingRect(): Rect;

    get isClipping(): boolean {
        return this.clipping;
    }

    set isClipping( clipping: boolean ) {
        this.clipping = clipping;
    }

    applyTransformations( aTransformable: Transformable ): void {
        // Does nothing by default. Children will override.
    }

}
