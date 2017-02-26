import { Matrix } from './Matrix';

import { curry } from '../../core/FP';

export
class DualMatrix {
    zoom:  Matrix;
    scale: Matrix;

    constructor() {
        this.zoom  = new Matrix()
        this.scale = new Matrix()
    }

    static translate = curry( ( aTranslation, aMatrix: DualMatrix ): DualMatrix => ({
        zoom:  aMatrix.zoom,
        scale: Matrix.translate( aTranslation, aMatrix.scale )
    }));

    static scale = curry( ( aScale, aMatrix: DualMatrix ): DualMatrix => ({
        zoom:  aMatrix.zoom,
        scale: Matrix.scale( aScale, aMatrix.scale )
    }));

    static zoom = curry( ( aZoom, aMatrix: DualMatrix ): DualMatrix => ({
        zoom:  Matrix.scale( aZoom, aMatrix.zoom ),
        scale: aMatrix.scale,
    }));

    static getCombination = ( aMatrix: DualMatrix ): Matrix => Matrix.combine( aMatrix.scale, aMatrix.zoom );

};
