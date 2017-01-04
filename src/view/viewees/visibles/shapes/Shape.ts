import { Visible     } from './../Visible';
import { Translation } from './../../../geometry';

export
abstract class Shape extends Visible {

    abstract translate( aDelta: Translation ): void;

}
