import { Relation } from "./relations"
import { Attribute } from "./attributes"
import * as Util from "./util"

// binary relations of a scenegraph
export interface RelationEdge {
    source: string,
    relation: Relation,
    sink: string,
    type: "RelationEdge"
}

// unary relations of a scenegraph
export interface AttributeEdge {
    source: string,
    attribute: Attribute,
    type: "AttributeEdge"
}

// makes a RelationEdge
export function makeRelation(source: string, rel: Relation, sink: string) : RelationEdge {
    return {
        source: source,
        relation: rel,
        sink: sink,
        type: "RelationEdge"
    };
}

// makes a AttributeEdge
export function makeAttribute(source: string, attr: Attribute) : AttributeEdge {
    return {
        source: source,
        attribute: attr,
        type: "AttributeEdge"
    };
}



// A SceneGraph is an array of RelationEdges or AttributeEdges
export type SceneGraphEdge = RelationEdge | AttributeEdge
export type SceneGraph = SceneGraphEdge[]

export function equals(g1: SceneGraph, g2: SceneGraph) : boolean {

    if (g1.length != g2.length) {
        return false;
    }

    for(let i = 0; i < g1.length; i++) 
    {
        const g1Edge = g1[i];
        const g2Edge = g2[i];

        if(g1Edge.type != g2Edge.type) {
            return false;
        }

        else if(g1Edge.type == 'AttributeEdge') {
            if(!attributeEdgeEquals((g1Edge as AttributeEdge), (g2Edge as AttributeEdge))) {
                return false;
            }
        }

        else {
            if(!relationEdgeEquals((g1Edge as RelationEdge), (g2Edge as RelationEdge))) {
                return false;
            }
        }
    }

    return true;

}

function relationEdgeEquals(r1: RelationEdge, r2: RelationEdge) : boolean {
    if(r1.source != r2.source) {
        return false;
    }
    if(r1.relation != r2.relation) {
        return false;
    }
    if (r1.sink != r2.sink) {
        return false;
    }
    return true;
}

function attributeEdgeEquals(a1: AttributeEdge, a2: AttributeEdge) : boolean {
    if(a1.source != a2.source) {
        return false;
    }
    if(a1.attribute != a2.attribute) {
        return false;
    }
    return true;
}

function removeEdge(edge: SceneGraphEdge, graph: SceneGraph) : SceneGraph | null {
    let prefix : SceneGraph = [];
    for(let i = 0; i < graph.length; i++) {
        if(equals([graph[i]], [edge])) {
            return prefix.concat(graph.slice(i+1))
        }
        prefix.push(graph[i]);
    }
    return null;
}

// Checks whether condition is a subgraph of scenegraph.
// If so, returns (state - condition).
// Otherwise returns null.
export function holds(condition: SceneGraph, state: SceneGraph) : SceneGraph | null {
    let subgraph : SceneGraph = state;

    // Remove each condition, as long as it exists in the state.
    for(let i=0; i<condition.length; i++) {
        const check = removeEdge(condition[i], subgraph);
        if(!check) { // The condition is not in the scene graph
            return null;
        }
        subgraph = (check as SceneGraph);
    }
    return subgraph;
}

// Union two scene graphs together
export function join(graph1: SceneGraph, graph2: SceneGraph) : SceneGraph {
    return graph1.concat(graph2);
}

export function isSubgraph(smaller: SceneGraph, bigger: SceneGraph) : boolean {
    if(holds(smaller, bigger))
        return true;
    return false;
}

export function matchPanelSequence(shorter: SceneGraph[], longer: SceneGraph[]) : boolean {
    return Util.match_subseq(isSubgraph, shorter, longer);
}