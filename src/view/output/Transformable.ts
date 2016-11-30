import { Stateful         } from './';
import { Translation,
         Scale,
         TransformMatrix,
         Rect,
         Point            } from '../geometry';
import { Viewee           } from '../viewees/Viewee';


export
interface Transformations {
    translate: Translation;
    scale:     Scale;
    zoom:      Scale;
}

export
class Transformable extends Stateful {
    protected preMatrix:  TransformMatrix; // Pre-appearance matrix
    protected postMatrix: TransformMatrix; // Post-appearance matrix

    constructor() {
        super();
        this.preMatrix  = new TransformMatrix();
        this.postMatrix = new TransformMatrix();
    }

    protected transform( aTransformations: Transformations ): void {
        this.translate( aTransformations.translate );
        this.zoom( aTransformations.zoom );
        this.scale( aTransformations.scale );
    }

    protected translate( aTranslation: Translation ): void {
        // Translation goes in the preMatrix to make calculation easier - had
        // it been assigned to the postMatrix, we'd need some extra maths to
        // componsate for scale in the preMatrix.
        this.preMatrix.translate( aTranslation.x, aTranslation.y );
    }

    protected scale( aScale: Scale ): void {
        // Scale goes in the preMatrix.
        this.preMatrix.scale( aScale.x, aScale.y );
    }

    protected zoom( aZoom: Scale ): void {
        // Zoom goes in the post matrix.
        this.postMatrix.scale( aZoom.x, aZoom.y );
    }

    protected preTransformPoint( aPoint: Point ): Point {
        return this.preMatrix.transformPoint( aPoint );
    }

    protected preTransformRect( aRect: Rect ): Rect {
        return this.preMatrix.transformRect( aRect );
    }

    protected postTransformRect( aRect: Rect ): Rect {
        return this.postMatrix.transformRect( aRect );
    }

    protected toAbsoluteRect( aRect: Rect ): Rect {
        let preRect  = this.preTransformRect( aRect );
        let postRect = this.postTransformRect( preRect );
        return postRect;
    }

    protected applyTransformations( aViewee: Viewee ): void {
        let iTransformations: Transformations;

        iTransformations = aViewee.getTransformations();
        this.transform( iTransformations );
    }

    protected getState() : any {
        var iState        = super.getState();
        iState.preMatrix  = this.preMatrix.clone();
        iState.postMatrix = this.postMatrix.clone();
        return iState;
    }

    protected restoreState( aState: any ) {
        this.preMatrix  = aState.preMatrix;
        this.postMatrix = aState.postMatrix;
    }

}
