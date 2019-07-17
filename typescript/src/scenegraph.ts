import { Relation } from "./relations"
import { Attribute } from "./attributes"

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


function addIfNotMember(a: string[], str: string) {
    for(let i = 0; i < a.length; i++) {
        if(a[i] == str) {
            return;
        } 
    }

    a.push(str);
}


function getObjects(g: SceneGraph) : string[] {

    let objects:string[] = [];

    for(let i = 0; i < g.length; i++) {
        const edge = g[i];

        addIfNotMember(objects, edge.source);
        
        if((edge as RelationEdge).sink) {
            addIfNotMember(objects, (edge as RelationEdge).sink);
        }
    }

    return objects;
}

// Hulk example:

