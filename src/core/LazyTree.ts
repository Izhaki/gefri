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

    protected currentNode: any

    static of( aNodes: any ) {
        let iNodes = Array.isArray( aNodes ) ? aNodes : [aNodes];
        return new OriginTree( iNodes );
    }

    abstract traverse( callback: Function );
    abstract traverseChildren( callback: Function );

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

    reduceXl( aggregators: Function[], accumulator: any ) {
        const [ nodeAggregator, preChildrenAggregator, postChildreddAggregator ] = aggregators

        const zzz = ( node ) => {
            accumulator = nodeAggregator( accumulator, node )

            this.traverseChildren( zzz );
            return false
        }

        this.traverse( zzz );

        return accumulator
    }

    toArray() {
        let nodes = []
        this.traverse( node => {
            nodes.push( node )
            return true
        } );
        return nodes;
    }

}

class OriginTree extends LazyTree {
    constructor( private nodes: any[] ) {
        super();
    }

    traverseNodes( nodes, callback: Function ) {
        nodes.forEach( node => {
            this.currentNode = node
            let goOn = callback( node ) !== false
            if ( goOn ) {
                this.traverseChildren( callback )
            }
        });
    }

    traverse( callback: Function ) {
        this.traverseNodes( this.nodes, callback )
    }

    traverseChildren( callback: Function ) {
        if ( hasChildren( this.currentNode ) ) {
            this.traverseNodes( this.currentNode.children, callback )
        }
    }
}

abstract class ChainedTree extends LazyTree {

    constructor( protected chainee: LazyTree ) {
        super();
    }

    traverseChildren( callback: Function ) {
        this.chainee.traverseChildren( callback );
    }

}

class MapReduceTree extends ChainedTree {
    private aggregator
    private accumulator: any
    private originalTraverseChildren: Function
    private subAccumulatorFn: Function

    constructor( chainee: LazyTree, aggregator: any, accumulator: any ) {
        super( chainee );

        this.aggregator = aggregator
        this.accumulator = accumulator
        this.originalTraverseChildren = this.traverseChildren
    }

    traverseAccumulate( accumulator, node, callback ) {
        let [ subAccumulatorFn, mappedValue ] = this.aggregator( accumulator, node )

        this.subAccumulatorFn = subAccumulatorFn

        const goOn = callback( mappedValue ) !== false

        if ( goOn && hasChildren( node ) ) {
            this.traverseChildren( callback );
        }

        return false
    }


    traverse( callback: Function ) {
        return this.chainee.traverse( node => {
//?            this.currentNode = node
            return this.traverseAccumulate( this.accumulator, node, callback )
        })
    }

    traverseChildren( callback: Function ) {
        const newAccumulator = this.subAccumulatorFn()
        this.chainee.traverseChildren( child => this.traverseAccumulate( newAccumulator, child, callback ) )
    }

}

class MappedTree extends ChainedTree {

    constructor( chainee: LazyTree, protected mapper: Function ) {
        super( chainee );
    }

    traverse( callback: Function ) {
        return this.chainee.traverse(
            node => callback( this.mapper( node ) )
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

    traverseChildren( callback: Function ) {
        this.chainee.traverseChildren( child => this.callback( child, callback ) )
    }
}

class NodeFilter extends Filter {

    traverse( callback: Function ) {
        this.chainee.traverse( node => {
            if ( this.keep( node ) ) {
                const goOn = callback( node )
                return goOn && this.keep( node )
            } else {
                return true
            }
        })
    }

}

class ChildrenFilter extends Filter {

    traverse( callback: Function ) {
        this.chainee.traverse( node => {
            this.currentNode = node
            const goOn = callback( node );
            return goOn && this.keep( node );
        })
    }

    traverseChildren( callback: Function ) {
        if ( this.keep( this.currentNode ) ) {
            //this.chainee.traverseChildren( callback )
            this.chainee.traverseChildren( node => {
                this.currentNode = node
                return callback( node )
            })
        }
    }

}
