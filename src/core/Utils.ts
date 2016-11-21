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
