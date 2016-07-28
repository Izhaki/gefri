import { Composite } from './../../core/Composite';
import { Painter } from './../painters/Painter';

export
abstract class Viewee extends Composite< Viewee > {

    abstract paint( aPainter: Painter ): void;

    paintChildren( aPainter: Painter ): void {
        if ( this.isChildless() ) return;

        aPainter.pushState();

        this.applyTransformations( aPainter );

        this.forEachChild( function( aChild ) {
            aChild.paint( aPainter );
        });

        aPainter.popState();
    }

    applyTransformations( aPainter: Painter ): void {
        // Does nothing by default. Children will override.
    }

}
