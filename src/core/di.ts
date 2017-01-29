import * as Rx                 from 'rxjs';

const cAnimationFrame = Rx.Scheduler.animationFrame;

let injected = {
    'waitForFrame': cAnimationFrame,
    'antialiasingExtraMargins': 1
}

let current = injected;

let shallowClone = ( aObject: Object ) => Object.assign({}, aObject );

export
function overrideInjected( aInjected: string, aValue: any ) {
    current = shallowClone( current );
    current[ aInjected ] = aValue;
}

export
function inject( aInjected: any ): any {
    return current[ aInjected ];
}
