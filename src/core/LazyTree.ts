// Don't be deceived by the use of classes and inheritance here.
// This is a functional library. If you look at Lazy.js you'll see
// that its functional code can be 'lifted' into classes to save some noise.

import {
    identity,
    pipe,
    complement,
    allPass,
    Predicate
} from './FP'

const hasChildren = node => node.children && node.children.length > 0;

enum FilterType {
    keep,
    drop
}

export
abstract class LazyTree {

    static of( aNodes: any ) {
        let iNodes = Array.isArray( aNodes ) ? aNodes : [aNodes];
        return new OriginTree( iNodes );
    }

    abstract traverse( aCallback: Function );
    abstract traverseChildren( aNode, aCallback: Function );

    // Will carry on traversing the node and its children
    keepSubTreeIf( aPredicate: Predicate ) {
        return new SubTreeFilter( this, FilterType.keep, aPredicate );
    }

    // Will stop traversing the node and its children
    dropSubTreeIf( aPredicate: Predicate ) {
        return new SubTreeFilter( this, FilterType.drop, aPredicate );
    }

    // Will carry on traversing the node's children
    keepChildrenIf( aPredicate: Predicate ) {
        return new ChildrenFilter( this, FilterType.keep, aPredicate );
    }

    dropNodeIf( aPredicate: Predicate ) {
        return new NodeFilter( this, FilterType.drop, aPredicate );
    }

    // Will stop traversing the node's children
    dropChildrenIf( aPredicate: Predicate ) {
       return new ChildrenFilter( this, FilterType.drop, aPredicate );
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
    private predicates: Predicate[]
    private keepFunction: Function

    constructor( chainee: LazyTree, type: FilterType, predicate: Predicate ) {
        super( chainee )

        const isKeep = type === FilterType.keep

        this.predicates = [ predicate ]
        this.keepFunction = pipe( allPass, isKeep ? identity : complement )
    }

    public and( keep: Predicate ) {
        this.predicates.push( keep )
        return this
    }

    protected keep( node ) {
        return this.keepFunction( this.predicates )( node )
    }

}

class SubTreeFilter extends Filter {
    private callback: Function

    constructor( chainee: LazyTree, type: FilterType, predicate: Predicate ) {
        super( chainee, type, predicate );
        this.callback = ( node, callback ) => this.keep( node ) ? callback( node ) : false;
    }

    traverse( callback: Function ) {
        this.chainee.traverse( node => this.callback( node, callback ) )
    }

    traverseChildren( node, callback: Function ) {
        this.chainee.traverseChildren( node, child => this.callback( child, callback ) )
    }
}

class NodeFilter extends Filter {

    traverse( aCallback: Function ) {
        this.chainee.traverse( node => {
            if ( this.keep( node ) ) {
                const goOn = aCallback( node )
                return goOn && this.keep( node )
            } else {
                return true
            }
        })
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
