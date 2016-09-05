import { Composite } from './../../core/Composite';
import { Painter } from './../painters/Painter';

export
abstract class Viewee extends Composite< Viewee > {

    abstract paint( aPainter: Painter ): void;

    protected paintChildren( aPainter: Painter ): void {
        if ( this.isChildless() ) return;

        aPainter.pushState();

        this.beforeChildrenPainting( aPainter );

        this.forEachChild( function( aChild ) {
            aChild.paint( aPainter );
        });

        aPainter.popState();
    }

    protected beforeChildrenPainting( aPainter: Painter ): void {
        this.applyTransformations( aPainter );
    }

    protected applyTransformations( aPainter: Painter ): void {
        // Does nothing by default. Children will override.
    }

}
