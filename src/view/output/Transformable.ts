import { Stateful         } from './';
import { Translation,
         Scale,
         TransformMatrix,
         Rect,
         Point            } from '../geometry';
import { Viewee           } from '../viewees';
import { getBoundingRect  } from '../viewees/multimethods';


export
interface Transformations {
    translate: Translation;
    scale:     Scale;
    zoom:      Scale;
}

export
class Transformable extends Stateful {
    protected scaleMatrix: TransformMatrix; // Pre-appearance matrix
    protected zoomMatrix:  TransformMatrix; // Post-appearance matrix

    constructor() {
        super();
        this.scaleMatrix = new TransformMatrix();
        this.zoomMatrix  = new TransformMatrix();
    }

    translate( aTranslation: Translation ): void {
        // Translation goes in the scaleMatrix to make calculations easier - had
        // it been assigned to the zoomMatrix, we'd need some extra maths to
        // componsate for the scale in the scaleMatrix.
        this.scaleMatrix.translate( aTranslation.x, aTranslation.y );
    }

    scale( aScale: Scale ): void {
        // Scale goes in the scaleMatrix.
        this.scaleMatrix.scale( aScale.x, aScale.y );
    }

    zoom( aZoom: Scale ): void {
        // Zoom goes in the post matrix.
        this.zoomMatrix.scale( aZoom.x, aZoom.y );
    }

    protected toAbsoluteRect( aRelativeRect: Rect ): Rect {
        return aRelativeRect.apply( this.scaleMatrix, this.zoomMatrix );
    }

    protected getVieweeAbsoluteBoundingRect( aViewee: Viewee ): Rect {
        return this.toAbsoluteRect( getBoundingRect( aViewee ) );
    }

    protected getRendereredBoundingRectOf( aViewee: Viewee ) : Rect {
        return this.toAbsoluteRect( getBoundingRect( aViewee ) );
    }

    protected getAbsoluteMatrix(): TransformMatrix {
        return TransformMatrix.combine( this.scaleMatrix, this.zoomMatrix );
    }


    protected getState() : any {
        var iState        = super.getState();
        iState.scaleMatrix  = this.scaleMatrix.clone();
        iState.zoomMatrix = this.zoomMatrix.clone();
        return iState;
    }

    protected restoreState( aState: any ) {
        this.scaleMatrix  = aState.scaleMatrix;
        this.zoomMatrix = aState.zoomMatrix;
    }

}
