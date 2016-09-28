import { Composite     } from './../../core';
import { Painter,
         Updater,
         Transformable } from './../output';
import { Rect          } from '../geometry';

export
abstract class Viewee extends Composite< Viewee > {

    abstract paint( aPainter: Painter ): void;

    erase(): void {
        // summonUpdater applies transformations, so in order for it to have the
        // current transformations, we start with the parent.
        let aUpdater = this.getParent().summonUpdater();

        aUpdater.erase( this.getBoundingRect() );
    }

    protected abstract getBoundingRect(): Rect;

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

    abstract summonUpdater(): Updater;

}
