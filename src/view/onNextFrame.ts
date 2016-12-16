import { inject     } from '../core/di';
import { emptyArray } from '../core/Utils'

let waitForFrame = inject( 'waitForFrame' );

let alreadyScheduled = false;
let iCallbacks       = [];

function addCallback( aCallback ): void {
    let isNewCallback = iCallbacks.indexOf( aCallback ) == -1;
    if ( isNewCallback ) {
        iCallbacks.push( aCallback );
    }
}

function callEachCallback(): void {
    iCallbacks.forEach( ( aCallback ) => {
        aCallback()
    });
}

function emptyCallbacks(): void {
    emptyArray( iCallbacks );
}

// onNextFrame will call the callback before the next render.
// Using requestAnimationFrame also means this will happen after
// current tasks in the even loop has been fully processed, which
// may be a user action that triggered many changes to the viewee
// composition.
// For more: https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/
export
function onNextFrame( aCallback ) {
    addCallback( aCallback );
    if ( !alreadyScheduled ) {
        alreadyScheduled = true;

        waitForFrame.schedule( () => {
            callEachCallback();
            emptyCallbacks();
            alreadyScheduled = false;
        });
    }
}

export
function triggerNextFrame() {
    waitForFrame.flush();
}
