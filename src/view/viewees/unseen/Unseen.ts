import { Viewee }  from '../Viewee';
import { Painter } from '../../output/Painter';

export
class Unseen extends Viewee {

    paint( aPainter: Painter ): void {
        this.paintChildren( aPainter );
    }

}
