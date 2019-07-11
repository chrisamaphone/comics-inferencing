import {square} from "./whateveryouwant"
import {expandHTN, composite_propel_by_explosion, randomMember} from "./htn"

console.log("A")
const foo = 5;
const myStuff = [1,2,3,4,5]
console.log("Random member of myStuff: "+randomMember(myStuff))

console.log("Expanding propel by explosion:")
console.log(expandHTN(composite_propel_by_explosion));

const mydiv = document.getElementById("main");
mydiv!.innerHTML = "Hello, world!";

enum Relation {
    At,
    NextTo,
    Has
}

enum Attribute {
    Smiling,
    FacingForward,
    Grumpy
}

interface RelationEdge {
    source: string,
    relation: Relation,
    sink: string
}

interface AttributeEdge {
    source: string,
    attribute: Attribute,
}

// A SceneGraph is an array of RelationEdges or AttributeEdges
type SceneGraph = (RelationEdge | AttributeEdge)[]

const myAttributeEdge = { source: "bob", attribute:Attribute.Grumpy};
const myRelationEdge = {source: "bob", relation:Relation.At, sink: "house"};
const mySceneGraph:SceneGraph = [myAttributeEdge, myRelationEdge];

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

console.log(getObjects(mySceneGraph))

console.log(square(5));




