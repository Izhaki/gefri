// Don't be deceived by the use of classes and inheritance here.
// This is a functional library. If you look at Lazy.js you'll see
// that its functional code can be 'lifted' into classes to save some noise.

const hasChildren = node => node.children && node.children.length > 0;

export
abstract class LazyTree {

    static of( aNodes: any ) {
        let iNodes = Array.isArray( aNodes ) ? aNodes : [aNodes];
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

    mapReduce( aggregators: any, accumulator: any ) {
        return new MapReduceTree( this, aggregators, accumulator );
    }

    reduce( aAggregator: Function, aAccumulator: any ) {
        this.traverse(
            aNode => aAccumulator = aAggregator( aAccumulator, aNode )
        );

        return aAccumulator;
    }

    toArray() {
        let iNodes = []
        this.traverse( aNode => {
            return iNodes.push( aNode )
        } );
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
        if ( hasChildren( aNode ) ) {
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

class MapReduceTree extends ChainedTree {
    private aggregator;
    private accumulator: any;

    constructor( chainee: LazyTree, aggregator: any, accumulator: any ) {
        super( chainee );

        this.aggregator = aggregator;
        this.accumulator = accumulator;
    }

    traverse( aCallback: Function ) {

        const traverseAccumulate = ( accumulator, node ) => {
            const [ newAccumulatorFn, mappedValue ] = this.aggregator( accumulator, node )
            const goOn = aCallback( mappedValue ) !== false
            if ( goOn && hasChildren( node ) ) {
                const newAccumulator = newAccumulatorFn()
                this.traverseChildren( node, child => traverseAccumulate( newAccumulator, child ) );
            }
            return false
        }

        return this.chainee.traverse(
            aNode => traverseAccumulate( this.accumulator, aNode )
        )
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
    private callback: Function

    constructor( chainee: LazyTree, protected keep: Function ) {
        super( chainee, keep );
        this.callback = ( node, callback ) => this.keep( node ) ? callback( node ) : false;
    }

    traverse( callback: Function ) {
        this.chainee.traverse( node => this.callback( node, callback ) )
    }

    traverseChildren( node, callback: Function ) {
        this.chainee.traverseChildren( node, child => this.callback( child, callback ) )
    }


}

class ChildrenFilter extends Filter {

    traverse( aCallback: Function ) {
        this.chainee.traverse( aNode => {
            const goOn = aCallback( aNode );
            return goOn && this.keep( aNode );
        })
    }

    traverseChildren( aNode, aCallback: Function ) {
        if ( this.keep( aNode ) ) {
            this.chainee.traverseChildren( aNode, aCallback )
        }
    }

}
