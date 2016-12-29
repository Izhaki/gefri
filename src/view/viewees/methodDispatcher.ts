import { getClassName } from '../../core/Utils';

/**
 * Takes an object with methods and returns a function that takes a viewee
 * and dispatches the corresponding method for that viewee.
 */
export
function methodDispatcher( aMethods ) {
    return ( aViewee, ...args ) => {
        let iClassName = getClassName( aViewee );
        return aMethods[iClassName]( aViewee, ...args );
    }
}
