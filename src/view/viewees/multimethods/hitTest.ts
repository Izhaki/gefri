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
            let aVieweeRect = getVieweeAbsoluteBoundingRect( aRectangle );
            aVieweeRect.intersect( aClipArea );
            return aVieweeRect.contains( x, y );
        },

        Path: ( aPath: Path, x: number, y:number, aClipArea: Rect ): boolean => {
            let aVieweeRect = getVieweeAbsoluteBoundingRect( aPath );
            aVieweeRect.intersect( aClipArea );
            return aVieweeRect.contains( x, y );
        }

    })
);
