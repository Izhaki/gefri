import { Composite     } from './../../core';
import { Painter,
         Updater,
         Transformable } from './../output';
import { Rect          } from '../geometry';

export
abstract class Viewee extends Composite< Viewee > {
    protected clipping: boolean = true;

    abstract paint( aPainter: Painter ): void;

    erase(): void {
        // summonUpdater applies transformations, so in order for it to have the
        // current transformations, we start with the parent.
        let aUpdater = this.getParent().summonUpdater();

        aUpdater.erase( this.getBoundingRect() );
    }

    abstract getBoundingRect(): Rect;

    get isClipping(): boolean {
        return this.clipping;
    }

    set isClipping( clipping: boolean ) {
        this.clipping = clipping;
    }

    applyTransformations( aTransformable: Transformable ): void {
        // Does nothing by default. Children will override.
    }

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

    abstract summonUpdater(): Updater;

}
