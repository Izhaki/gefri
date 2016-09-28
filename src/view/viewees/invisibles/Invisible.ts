import { Viewee   }  from '../Viewee';
import { Painter, 
         Updater  } from '../../output';

export
abstract class Invisible extends Viewee {

    paint( aPainter: Painter ): void {
        this.paintChildren( aPainter );
    }

}
