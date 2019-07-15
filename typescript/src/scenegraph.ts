enum Relation {
    At,
}

enum Attribute {
    Blasted,
    Falling,
    Landed

}

interface RelationEdge {
    source: string,
    relation: Relation,
    sink: string,
    type: "RelationEdge"
}

interface AttributeEdge {
    source: string,
    attribute: Attribute,
    type: "AttributeEdge"
}

// A SceneGraph is an array of RelationEdges or AttributeEdges
export type SceneGraphEdge = RelationEdge | AttributeEdge
export type SceneGraph = SceneGraphEdge[]

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

// There is an explosion at the environment.
export const explosion_at_epsilon : RelationEdge = {
    source : "explosion",
    relation : Relation.At,
    sink: "epsilon", 
    type: "RelationEdge"
}

// Hulk is at the environment.
export const hulk_at_epsilon : RelationEdge = {
    source : "hulk",
    relation : Relation.At,
    sink : "epsilon",
    type : "RelationEdge"
}

// Hulk is blasted.
export const hulk_blasted : AttributeEdge = {
    source : "hulk",
    attribute : Attribute.Blasted,
    type : "AttributeEdge"
}

// Hulk is falling.
export const hulk_falling : AttributeEdge = {
    source : "hulk",
    attribute : Attribute.Falling,
    type : "AttributeEdge"
}

// Hulk has landed.
export const hulk_landed : AttributeEdge = {
    source : "hulk",
    attribute : Attribute.Landed,
    type : "AttributeEdge"
}




