import { cumulateTransformationsOf,
         hitTest                    } from '../viewees/multimethods';

import { Point,
         Rect,
         Matrix      } from '../geometry';
import { Clipped     } from './Clipped';
import { Viewee,
         Viewees,
         Transformer } from '../viewees';

export
class HitTestResult {
    private hits:   Viewees = [];
    private matrix: Matrix  = new Matrix();

    public addHit( aViewee: Viewee ): void {
        // The viewee is added to the front of the hits array,
        // so it's deepest first.
        this.hits.unshift( aViewee );
    }

    public getHits(): Viewees {
        return this.hits;
    }

    public getTopHit(): Viewee {
        return this.hits[ 0 ];
    }

    public getAbsoluteMatrix(): Matrix {
        return this.matrix;
    }

    public setMatrix( aMatrix: Matrix ) {
        this.matrix = aMatrix.clone();
    }
}

export
class HitTester extends Clipped {
    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;
    private hitTest:                   ( aViewee: Viewee, aMousePosition: Point, aAbsoluteMatrix: Matrix ) => boolean;

    constructor() {
        super();
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
        this.hitTest = hitTest.curry(
            // We define a new function so to maintain this.
            aViewee => this.getRendereredBoundingRectOf( aViewee )
        );
    }

    test( aViewee: Viewee, aMousePosition: Point, aResult: HitTestResult ) {
        if ( aViewee.rendered ) {

            if ( aViewee instanceof Transformer ) {
                this.updateAbsoluteMatrix( aViewee, aResult );
            }


            if ( aViewee.isInteractive() ) {
                let isHit = this.hitTest( aViewee, aMousePosition, this.getAbsoluteMatrix() );
                if ( isHit ) {
                    aResult.addHit( aViewee );
                }
            }

            this.testChildren( aViewee, aMousePosition, aResult );

        }
    }

    private testChildren( aViewee: Viewee, aMousePosition: Point, aResult: HitTestResult ): void {
        if ( aViewee.isChildless() ) return;

        this.pushState();

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( aViewee );
        }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.test( aChild, aMousePosition, aResult );
        });

        this.popState();
    }

    private updateAbsoluteMatrix( aTransformer: Transformer, aResult: HitTestResult ) {
        this.pushState();

        this.cumulateTransformationsOf( aTransformer );
        aResult.setMatrix( this.getAbsoluteMatrix() );

        this.popState();
    }

}

