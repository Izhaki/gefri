import { currify          } from '../../../core/Utils';
import { methodDispatcher } from '../methodDispatcher'
import { getBoundingRect  } from './getBoundingRect';

import { HitTester        } from '../../output';

import { Rect,
         TransformMatrix  } from './../../geometry';

import { Rectangle,
         Path          } from '../';

export
let hitTest = currify(
    ( getVieweeAbsoluteBoundingRect ) => methodDispatcher({

        Rectangle: ( aRectangle: Rectangle, x: number, y:number, aClipArea: Rect, aAbsoluteMatrix: TransformMatrix ): boolean => {
            let aVieweeRect: Rect;

            aVieweeRect = getVieweeAbsoluteBoundingRect( aRectangle );
            aVieweeRect.intersect( aClipArea );
            return aVieweeRect.contains( x, y );
        },

        Path: ( aPath: Path, x: number, y:number, aClipArea: Rect, aAbsoluteMatrix: TransformMatrix ): boolean => {
            const HIT_PADDING = 3;
            let   aVieweeRect: Rect;
            let   isWithinRect: boolean;

            aVieweeRect = getVieweeAbsoluteBoundingRect( aPath );

            aVieweeRect.intersect( aClipArea );
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
