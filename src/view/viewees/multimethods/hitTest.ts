import { currify          } from '../../../core/Utils';
import { methodDispatcher } from '../methodDispatcher'
import { getBoundingRect  } from './getBoundingRect';

import { HitTester        } from '../../output';

import { Rect,
         Matrix  } from './../../geometry';

import { Rectangle,
         Path          } from '../';

export
let hitTest = currify(
    ( getRendereredBoundingRectOf ) => methodDispatcher({

        Rectangle: ( aRectangle: Rectangle, x: number, y:number, aAbsoluteMatrix: Matrix ): boolean => {
            let aVieweeRect: Rect;

            aVieweeRect = getRendereredBoundingRectOf( aRectangle );
            return aVieweeRect.contains( x, y );
        },

        Path: ( aPath: Path, x: number, y:number, aAbsoluteMatrix: Matrix ): boolean => {
            const HIT_PADDING = 3;
            let   aVieweeRect: Rect;
            let   isWithinRect: boolean;

            aVieweeRect = getRendereredBoundingRectOf( aPath );

            aVieweeRect.expand( HIT_PADDING )
            isWithinRect = aVieweeRect.contains( x, y );

            if ( isWithinRect ) {
                let aAbsolutePath = Path.applyMatrix( aPath, aAbsoluteMatrix );
                let iDistance = aAbsolutePath.getPointDistance( x, y );
                return iDistance < HIT_PADDING;
            } else {
                return false;
            }

        }

    })
);
