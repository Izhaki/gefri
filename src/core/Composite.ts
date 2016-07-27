export
class Composite< T > {
    children: T[];
    parent :  T;

    constructor() {
        this.children = [];
        this.parent   = null;
    }

    /****************************************************************************
     * Adding and removing
     ***************************************************************************/

    addChild( aChild ): void {
        this.children.push( aChild );
        aChild.parent = this;
    }

    addChildren( ...args: T[] ): void {
        for ( var i = 0; i < arguments.length; i++) {
            this.addChild( arguments[i] );
        }
    }

    removeChild( aChild ): void {
        var iChildIndex = this.children.indexOf( aChild );

        if ( iChildIndex === -1 ) {
            throw "Could not find requested child"
        } else {
            aChild.parent = null;
            this.children.splice( iChildIndex, 1 );
        }
    }

    /****************************************************************************
     * Utility
     ***************************************************************************/

    forEachChild( aCallback ): void {
        for ( var i = 0; i < this.children.length; i++ ) {
            aCallback( this.children[i], i );
        }
    }

    isChildless(): boolean {
        return this.children.length === 0;
    }

    hasParent(): boolean {
        return this.parent != null;
    }

}