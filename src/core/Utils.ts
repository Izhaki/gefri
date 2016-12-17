export
function getClassName( anInstance: any ){
    return anInstance.constructor['name'];
}

export
function emptyArray( aArray: any[] ) {
    while ( aArray.length > 0 ) {
        aArray.pop();
    }
}

/**
 * Takes a currying function and exposes it as a static .curry() of itself.
 *
 * This is done for syntax clarity, so instead of writing (the somewhat
 * confusing)
 *
 *     this.fill = fill( this );
 *
 * we write
 *
 *     this.fill = fill.curry( this );
 *
 */
export
function currify( curringFunction ) {
    return class {
        static curry = curringFunction;
    }
}
