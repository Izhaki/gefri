import { Stateful         } from './';
import { Transformations,
         Translation,
         Scale,
         TransformMatrix,
         Rect,
         Point            } from '../geometry';

export
class Transformable extends Stateful {
    protected matrix: TransformMatrix;

    constructor() {
        super();
        this.matrix = new TransformMatrix();
    }

    transform( aTransformations: Transformations ): void {
        this.translate( aTransformations.translate );
        this.scale( aTransformations.scale )
    }

    translate( aTranslation: Translation ): void {
        this.matrix.translate( aTranslation.x, aTranslation.y )
    }

    scale( aScale: Scale ): void {
        this.matrix.scale( aScale.x, aScale.y )
    }

    toAbsoluteRect( aRect: Rect ): Rect {
        return this.matrix.transformRect( aRect );
    }

    protected getState() : any {
        var iState    = super.getState();
        iState.matrix = this.matrix.clone();
        return iState;
    }

    protected restoreState( aState: any ) {
        this.matrix = aState.matrix;
    }

}
