import { Composite }     from './../../core/Composite';
import { Painter }       from './../output/Painter';
import { Transformable } from './../output/Transformable';

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

    protected applyTransformations( aTransformable: Transformable ): void {
        // Does nothing by default. Children will override.
    }

    // public erase( aUpdater: Updater ) {

    // }

}
