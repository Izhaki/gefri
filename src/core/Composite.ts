export
class Composite< T > {
    private children: Composite<T>[];
    private parent;

    constructor() {
        this.children = [];
        this.parent   = null;
    }

    /****************************************************************************
     * Adding and removing
     ***************************************************************************/

    addChild( aChild: Composite<T> ): void {
        this.children.push( aChild );
        aChild.setParent( this );
    }

    addChildren( ...args: T[] ): void {
        for ( var i = 0; i < arguments.length; i++) {
            this.addChild( arguments[i] );
        }
    }

    removeChild( aChild: Composite<T> ): void {
        var iChildIndex = this.children.indexOf( aChild );

        if ( iChildIndex === -1 ) {
            throw "Could not find requested child"
        } else {
            aChild.parent = null;
            this.children.splice( iChildIndex, 1 );
        }
    }

    /****************************************************************************
     * Parent
     ***************************************************************************/

    hasParent(): boolean {
        return this.parent != null;
    }

    setParent( aParent: Composite<T> ): void {
        this.parent = aParent;
    }

    getParent() : T {
        return this.parent;
    }

    // Returns parents in top-down order
    getParents(): Composite<T>[] {
        let iParents,
            iCurrentParent,
            iCurrent;

        iParents = []
        iCurrent = this;
        while ( iCurrent.hasParent() ) {
            iCurrentParent = iCurrent.getParent();
            iParents.unshift( iCurrentParent );
            iCurrent = iCurrentParent;
        }

        return iParents;
    }

    /****************************************************************************
     * Utility
     ***************************************************************************/

    forEachChild( aCallback ): void {
        for ( var i = 0; i < this.children.length; i++ ) {
            aCallback( this.children[i], i );
        }
    }

    forEachParent( aCallback ): void {
        let iParents: Composite<T>[];

        iParents = this.getParents();
        iParents.forEach( aParent => {
            aCallback( aParent )
        })
    }

    isChildless(): boolean {
        return this.children.length === 0;
    }

}
