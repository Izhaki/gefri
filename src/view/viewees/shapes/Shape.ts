import { Viewee } from './../Viewee';
import { Painter } from './../../painters/Painter';

export
abstract class Shape extends Viewee {

    paint( aPainter: Painter ): void {
        this.paintSelf( aPainter )
        this.paintChildren( aPainter );
    }

    abstract paintSelf( aPainter: Painter ): void;
}
