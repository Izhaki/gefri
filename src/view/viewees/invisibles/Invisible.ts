import { Viewee }  from '../Viewee';
import { Painter } from '../../output/Painter';
import { Updater } from '../../output/Updater';

export
abstract class Invisible extends Viewee {

    paint( aPainter: Painter ): void {
        this.paintChildren( aPainter );
    }

}
