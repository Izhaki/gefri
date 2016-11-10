import { Transformable } from './';
import { Rect          } from '../geometry';

export
function TransformableSpecs( createTransformable: () => Transformable ) {

    beforeEach( () => {
        this.transformable = createTransformable();
    });

}
