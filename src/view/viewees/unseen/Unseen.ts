import { Viewee }  from '../Viewee';
import { Painter } from '../../painters/Painter';

export
class Unseen extends Viewee {

    paint( aPainter: Painter ): void {
        this.paintChildren( aPainter );
    }

}
