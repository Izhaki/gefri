import { Composite     } from './../../core';
import { Rect,
         Transformations } from '../geometry';

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

    abstract getTransformations(): Transformations;

}
