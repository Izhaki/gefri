import { Viewee,
         Viewees } from '../../viewees/Viewee';

import { Point   } from '../../geometry';

export
class MouseMoveEvent {
    coords:  Point   = new Point( 0, 0 );
    delta:   Point   = new Point( 0, 0 );
    topHit:  Viewee  = undefined;
    hits:    Viewees = [];
    dragged: Viewee = undefined;
}
