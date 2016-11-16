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
        if ( this.isChildAnAncestor( aChild ) ) {
            throw new Error( "Added child is an ancestor. Circular composition is prohibited." )
        }
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

    // Returns ancestors in top-down order
    getAncestors(): Composite<T>[] {
        let iAncestors,
            iCurrentParent,
            iCurrent;

        iAncestors = []
        iCurrent = this;
        while ( iCurrent.hasParent() ) {
            iCurrentParent = iCurrent.getParent();
            iAncestors.unshift( iCurrentParent );
            iCurrent = iCurrentParent;
        }

        return iAncestors;
    }

    /****************************************************************************
     * Utility
     ***************************************************************************/

    forEachChild( aCallback ): void {
        for ( var i = 0; i < this.children.length; i++ ) {
            aCallback( this.children[i], i );
        }
    }

    forEachAncestor( aCallback ): void {
        let iAncestors: Composite<T>[];

        iAncestors = this.getAncestors();
        iAncestors.forEach( aAncestor => {
            aCallback( aAncestor )
        })
    }

    isChildless(): boolean {
        return this.children.length === 0;
    }

    private isChildAnAncestor( aChild ): boolean {
        let iAncestors = this.getAncestors();
        return iAncestors.indexOf( aChild ) != -1;
    }

}
