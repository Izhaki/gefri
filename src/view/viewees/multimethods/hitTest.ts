import { currify          } from '../../../core/Utils';
import { methodDispatcher } from '../methodDispatcher'
import { getBoundingRect  } from './getBoundingRect';

import { HitTester        } from '../../output';

import { Rect          } from './../../geometry';

import { Rectangle,
         Path          } from '../';

export
let hitTest = currify(
    ( getVieweeAbsoluteBoundingRect ) => methodDispatcher({

        Rectangle: ( aRectangle: Rectangle, x: number, y:number, aClipArea: Rect ): boolean => {
            let aVieweeRect: Rect;

            aVieweeRect = getVieweeAbsoluteBoundingRect( aRectangle );
            aVieweeRect.intersect( aClipArea );
            return aVieweeRect.contains( x, y );
        },

        Path: ( aPath: Path, x: number, y:number, aClipArea: Rect ): boolean => {
            const HIT_PADDING = 2;
            let   aVieweeRect: Rect;
            let   isWithinRect: boolean;

            aVieweeRect = getVieweeAbsoluteBoundingRect( aPath );

            aVieweeRect.intersect( aClipArea );
            aVieweeRect.expand( HIT_PADDING )
            isWithinRect = aVieweeRect.contains( x, y );

            if ( isWithinRect ) {
                let iDistance = aPath.getPointDistance( x, y );
                return iDistance < HIT_PADDING;
            } else {
                return false;
            }

        }

    })
);
