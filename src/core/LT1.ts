import {
    identity,
    pipe,
    complement,
    allPass,
    Predicate
} from './FP'

const hasChildren = node => node.children && node.children.length > 0;

const Stop = undefined // Stop children iteration

type Callback = ( any ) => undefined | Function[]

export
abstract class LazyTree {

    static of( aNodes: any ) {
        let iNodes = Array.isArray( aNodes ) ? aNodes : [aNodes]
        return new Origin( iNodes )
    }

    abstract traverse( callback: Callback )

    map( mapper ) {
        return new Map( this, mapper )
    }

    reduce( callbacks: Function[], accumulator: any ) {
        const [ nodeCB, preCB, postCB ] = callbacks

        this.traverse( ( node ) => {
            accumulator = nodeCB( node, accumulator )
            return [
                () => preCB  ? accumulator = preCB( node, accumulator ) : null,
                () => postCB ? accumulator = postCB( node, accumulator ) : null,
            ]
        })
        return accumulator
    }

    toArray() {
        const nodes = []
        this.traverse( ( node ) => {
            nodes.push( node )
            return []
        })
        return nodes
    }

    mapAccum( aggregator, accumulator: any ) {
        return new MapAccum( this, aggregator, accumulator )
    }

    // Will carry on traversing the node and its children
    keepSubTreeIf( predicate: Predicate ) {
        return new SubTreeFilter( this, FilterType.keep, predicate );
    }

    // Will stop traversing the node and its children
    dropSubTreeIf( predicate: Predicate ) {
        return new SubTreeFilter( this, FilterType.drop, predicate );
    }

    // Will drop the node but not its children
    dropNodeIf( predicate: Predicate ) {
        return new NodeFilter( this, FilterType.drop, predicate );
    }

    // Will carry on traversing the node's children
    keepChildrenIf( predicate: Predicate ) {
        return new ChildrenFilter( this, FilterType.keep, predicate );
    }

    // Will stop traversing the node's children
    dropChildrenIf( predicate: Predicate ) {
       return new ChildrenFilter( this, FilterType.drop, predicate );
    }


}

class Origin extends LazyTree {
    private nodes: any[]

    constructor( nodes: any[] ) {
        super()
        this.nodes = nodes
    }

    traverse( callback: Callback ) {
        this.traverseNodes( this.nodes, callback )
    }

    traverseNodes( nodes, callback: Callback ) {
        nodes.forEach( node => {
            const childrenCallbacks = callback( node )
            if ( childrenCallbacks ) {
                this.traverseChildren( node, childrenCallbacks, callback )
            }
        });
    }

    traverseChildren( node, childrenCallbacks, callback: Callback ) {
        if ( hasChildren( node ) ) {
            const [ preCB, postCB ] = childrenCallbacks
            if ( preCB ) preCB( node )
            this.traverseNodes( node.children, callback )
            if ( postCB ) postCB( node )
        }
    }

}

abstract class Processor extends LazyTree {
    protected chainee: LazyTree

    constructor( chainee: LazyTree ) {
        super()
        this.chainee = chainee
    }
}

class Map extends Processor {
    private mapper

    constructor( chainee: LazyTree, mapper ) {
        super( chainee )
        this.mapper = mapper
    }

    traverse( callback: Callback ) {
        this.chainee.traverse( ( node ) => callback( this.mapper( node ) ) )
    }
}

class MapAccum extends Processor {
    private aggregator
    private accumulator

    constructor( chainee: LazyTree, aggregator, accumulator ) {
        super( chainee )
        this.aggregator = aggregator
        this.accumulator = accumulator
    }

    traverse( callback: Callback ) {
        let accumulator = this.accumulator
        this.chainee.traverse( ( node ) => {
            const oldAcc = accumulator
            const [ mapped, newAccFn ] = this.aggregator( node, accumulator )
            const [ preCB, postCB ] = callback( mapped )
            return [
                () => {
                    accumulator = newAccFn()
                    preCB ? preCB() : null
                },
                () => {
                    accumulator = oldAcc
                    postCB ? postCB() : null
                },
            ]
        })
    }
}

enum FilterType {
    keep,
    drop
}

abstract class Filter extends Processor {
    private predicates: Predicate[]
    private keepFunction: Function

    constructor( chainee: LazyTree, type: FilterType, predicate: Predicate ) {
        super( chainee )

        this.predicates = [ predicate ]
        this.keepFunction = pipe( allPass, type === FilterType.keep ? identity : complement )
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
    traverse( callback: Function ) {
        this.chainee.traverse( ( node ) => this.keep( node ) ? callback( node ) : Stop )
    }
}

class NodeFilter extends Filter {
    traverse( callback: Function ) {
        this.chainee.traverse( ( node ) => this.keep( node ) ? callback( node ) : [] )
    }
}

class ChildrenFilter extends Filter {

    traverse( callback: Function ) {
        this.chainee.traverse( ( node ) => {
            const childCallbacks = callback( node )
            return this.keep( node ) ? childCallbacks : Stop
        })
    }

}
