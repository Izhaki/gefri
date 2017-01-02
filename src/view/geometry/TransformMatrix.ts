/**
 *
 * A partial 2D transform matrix. Currently doesn't support rotation (and hence
 * skew).
 */

export
type Matrices = TransformMatrix[];

export
class TransformMatrix {

    /**
     * Combines (ie, composes or multiplies) the provided matrices.
     *
     * Note that the matrices should be provided in order of application
     * (ie, first matrix first, second second, and so forth)
     */
    static combine( ...aMatrices: Matrices ) : TransformMatrix {
        let multiplyMatrices = ( a:TransformMatrix, b:TransformMatrix ) => {
            return new TransformMatrix(
                b.scaleX * a.scaleX,
                b.scaleY * a.scaleY,
                b.translateX * a.scaleX + a.translateX,
                b.translateY * a.scaleY + a.translateY
            );
        }

        // We reverse the matrices array as in Matrices when applying
        // first A then B is achived B(Ax) which is equivilent to (BA)x.
        // see https://en.wikipedia.org/wiki/Transformation_matrix#Composing_and_inverting_transformations
        return aMatrices.reverse().reduce( multiplyMatrices );
    }

    scaleX    : number; // a
    scaleY    : number; // d
    translateX: number; // e or tx
    translateY: number; // f or ty

    constructor( aScaleX = 1, aScaleY = 1, aTranslateX = 0, aTranslateY = 0 ) {
        this.scaleX     = aScaleX;
        this.scaleY     = aScaleY;
        this.translateX = aTranslateX;
        this.translateY = aTranslateY;
    }

    clone() : TransformMatrix {
        var iClone = new TransformMatrix();
        iClone.translateX = this.translateX;
        iClone.translateY = this.translateY;
        iClone.scaleX = this.scaleX;
        iClone.scaleY = this.scaleY;

        return iClone;
    }

    translate( x: number, y: number ) {
        this.translateX += x * this.scaleX;
        this.translateY += y * this.scaleY;
    }

    scale( x: number, y: number ) {
        this.translateX *= x;
        this.translateY *= y;

        this.scaleX     *= x;
        this.scaleY     *= y;
    }

}
