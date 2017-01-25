// Don't be deceived by the use of classes and inheritance here.
// This is a functional library. If you look at Lazy.js you'll see
// that its functional code can be 'lifted' into classes to save some noise.

export
abstract class LazyTree {

    static of( aNodes: any ) {
        let iNodes = aNodes.length ? aNodes : [aNodes];
        return new OriginTree( iNodes );
    }

    abstract traverse( aCallback: Function );
    abstract traverseChildren( aNode, aCallback: Function );

    keepIf( aPredicate: Function ) {
        return new NodeFilter( this, aPredicate );
    }

    dropIf( aPredicate: Function ) {
        return new NodeFilter( this, aNode => !aPredicate( aNode ) );
    }

    keepChildrenIf( aPredicate: Function ) {
        return new ChildrenFilter( this, aPredicate );
    }

    dropChildrenIf( aPredicate: Function ) {
        return new ChildrenFilter( this, aNode => !aPredicate( aNode ) );
    }

    map( aMapper: Function ) {
        return new MappedTree( this, aMapper );
    }

    scan( aAggregator: Function, aAccumulator: any ) {
        return new ScanedTree( this, aAggregator, aAccumulator );
    }

    reduce( aAggregator: Function, aAccumulator: any ) {
        this.traverse(
            aNode => aAccumulator = aAggregator( aAccumulator, aNode )
        );

        return aAccumulator;
    }

    toArray() {
        let iNodes = []
        this.traverse( aNode => iNodes.push( aNode ) );
        return iNodes;
    }

}

class OriginTree extends LazyTree {
    constructor( private nodes: any[] ) {
        super();
    }

    traverse( aCallback: Function ) {
        this.nodes.forEach( aNode => {
            let goOn = aCallback( aNode ) !== false;
            if ( goOn ) {
                this.traverseChildren( aNode, aCallback );
            }
        });
    }

    traverseChildren( aNode, aCallback: Function ) {
        if ( aNode.children ) {
            let children = LazyTree.of( aNode.children );
            children.traverse( aCallback );
        }
    }
}

abstract class ChainedTree extends LazyTree {

    constructor( protected chainee: LazyTree ) {
        super();
    }

    traverseChildren( aNode, aCallback: Function ) {
        this.chainee.traverseChildren( aNode, aCallback );
    }

}

class ScanedTree extends ChainedTree {

    constructor( chainee: LazyTree,
                 protected aAggregator: Function,
                 protected aAccumulator: any ) {
        super( chainee );
    }

    traverse( aCallback: Function ) {

        let traverseAccumulate = ( aNode, aAccumulator ) => {
            let iAccumulator = this.aAggregator( aAccumulator, aNode )
            let goOn = aCallback( iAccumulator ) !== false;
            if ( goOn ) {
                this.traverseChildren( aNode, aChild => traverseAccumulate( aChild, iAccumulator ) );
            }
            return false;
        }

        return this.chainee.traverse(
            aNode => traverseAccumulate( aNode, this.aAccumulator )
        );
    }

}

class MappedTree extends ChainedTree {

    constructor( chainee: LazyTree, protected mapper: Function ) {
        super( chainee );
    }

    traverse( aCallback: Function ) {
        return this.chainee.traverse(
            aNode => aCallback( this.mapper( aNode ) )
        );
    }

}

abstract class Filter extends ChainedTree {

    constructor( chainee: LazyTree, protected keep: Function ) {
        super( chainee );
    }

}

class NodeFilter extends Filter {

    traverse( aCallback: Function ) {
        this.chainee.traverse( aNode => {
            if ( this.keep( aNode ) ) {
                return aCallback( aNode );
            }
            return false;
        })
    }

}

class ChildrenFilter extends Filter {

    traverse( aCallback: Function ) {
        this.chainee.traverse( aNode => {
            aCallback( aNode );
            return this.keep( aNode );
        })
    }

}
