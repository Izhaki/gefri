import { Stateful         } from './';
import { TransformMatrix, 
         Rect, 
         Point            } from '../geometry';

export
abstract class Transformable extends Stateful {
    protected matrix: TransformMatrix;

    constructor() {
        super();
        this.matrix = new TransformMatrix();
    }

    translate( x, y ): void {
        this.matrix.translate( new Point( x, y ) )
    }

    scale( x, y ): void {
        this.matrix.scale( new Point( x, y ) )
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