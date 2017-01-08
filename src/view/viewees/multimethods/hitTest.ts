import { currify          } from '../../../core/Utils';
import { methodDispatcher } from '../methodDispatcher'
import { getBoundingRect  } from './getBoundingRect';

import { HitTester        } from '../../output';

import { Point,
         Rect,
         Matrix  } from './../../geometry';

import { Rectangle,
         Path          } from '../';

export
let hitTest = currify(
    ( getRendereredBoundingRectOf ) => methodDispatcher({

        Rectangle: ( aRectangle: Rectangle, aMousePosition: Point, aAbsoluteMatrix: Matrix ): boolean => {
            let aVieweeRect: Rect;

            aVieweeRect = getRendereredBoundingRectOf( aRectangle );
            return aVieweeRect.contains( aMousePosition );
        },

        Path: ( aPath: Path, aMousePosition: Point, aAbsoluteMatrix: Matrix ): boolean => {
            const HIT_PADDING = 3;
            let   aVieweeRect: Rect;
            let   isWithinRect: boolean;

            aVieweeRect = getRendereredBoundingRectOf( aPath );

            aVieweeRect.expand( HIT_PADDING )
            isWithinRect = aVieweeRect.contains( aMousePosition );

            if ( isWithinRect ) {
                let aAbsolutePath = Path.applyMatrix( aPath, aAbsoluteMatrix );
                let iDistance = aAbsolutePath.getPointDistance( aMousePosition );
                return iDistance < HIT_PADDING;
            } else {
                return false;
            }

        }

    })
);
