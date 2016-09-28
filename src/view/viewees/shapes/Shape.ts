import { Viewee        } from './../Viewee';
import { Painter, 
         Updater, 
         Transformable } from './../../output';
import { Rect          } from './../../geometry';
import { summonUpdater } from '../tactics/children/summonUpdater'

export
abstract class Shape extends Viewee {

    paint( aPainter: Painter ): void {
        if ( this.isWithinClipArea( aPainter ) ) {
            this.paintSelf( aPainter )
            this.paintChildren( aPainter );
        }
    }

    protected abstract paintSelf( aPainter: Painter ): void;

    protected beforeChildrenPainting( aPainter: Painter ): void {
        aPainter.intersectClipAreaWith( this.getBoundingRect() );
        super.beforeChildrenPainting( aPainter );
    }

    protected applyTransformations( aTransformable: Transformable ): void {
        super.applyTransformations( aTransformable );
        var iBounds: Rect = this.getBoundingRect();
        aTransformable.translate( iBounds.getLeft(), iBounds.getTop() );
    }

    protected isWithinClipArea( aPainter: Painter ): boolean {
        return aPainter.isRectWithinClipArea( this.getBoundingRect() );
    }

    summonUpdater() : Updater {
        return summonUpdater( this );
    }

}
