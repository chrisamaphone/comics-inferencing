import * as HTN from "./htn"
import * as SG from "./scenegraph"

// Our narrative ontology:
import {Relation} from "./relations"
import {Attribute} from "./attributes"

// ---- Operator Definitions

// blast operator and task
const op_blast : HTN.OperatorDefinition =
    function(args:string[]) {
            return { 
                preconds: [explosion_at_epsilon, hulk_at_epsilon],
                effects : [hulk_blasted] 
            }
    }

const task_blast : HTN.Task = {
        operator_name : "blast",
        args: []
    }

// fall operator and task
const op_fall : HTN.OperatorDefinition =
    function(args:string[]) {
            return { 
                preconds : [hulk_blasted],
                effects : [hulk_falling]
            }
    }

const task_fall : HTN.Task = {
        operator_name : "fall",
        args: []
    }

// fall prime operator and task
const op_fall_prime : HTN.OperatorDefinition =
    function(args:string[]) {
            return {
                preconds : [hulk_falling],
                effects : [hulk_falling]
            }
    }

const task_fall_prime : HTN.Task = {
        operator_name : "fall'",
        args: []
    }

// land operator and task
const op_land : HTN.OperatorDefinition =
    function(args:string[]) {
            return {
                preconds : [hulk_falling],
                effects : [hulk_landed]
            }
    }

const task_land : HTN.Task = {
        operator_name : "land",
        args: []
    }

// ---- Decomposition Definitions    

// fall repeat decomposition and task
const fall_repeat : HTN.DecompDefn = 
    function(args:string[]) {
            return [task_fall, task_fall_prime, task_fall_prime]
    }

const task_falling : HTN.Task = {
    operator_name: "falling",
    args: []
}

// propel decomposition and task
const propel : HTN.DecompDefn =
    function(args:string[]) {
        return [task_blast, task_falling, task_land]
    }

const task_propel : HTN.Task = {
    operator_name: "propel",
    args: []
}

// operators maps node names to operator definitions
export function operators(name : string) : HTN.OperatorDefinition | null {
    if (name == "fall")
        return op_fall;
    if (name == "fall'")
        return op_fall_prime;
    if (name == "blast")
        return op_blast;
    if (name == "land")
        return op_land;
    return null;
}

// decomps maps composite node names to instances of the Decomp type.
// The values matching an existing composite node must always be nonempty lists.
export function methods(name : string) : HTN.DecompDefn[] | null {
    if (name == "falling")
        return [fall_repeat];
    if (name == "propel")
        return [propel];
    return null;
}

// The Hulk Domain! HULK SMASH
export const hulkDomain : HTN.Domain = {operators: operators, methods: methods};

// ---- Ground Literal Definitions

// There is an explosion at the environment.
export const explosion_at_epsilon : SG.RelationEdge = {
    source : "explosion",
    relation : Relation.At,
    sink: "epsilon", 
    type: "RelationEdge"
}

// Hulk is at the environment.
export const hulk_at_epsilon : SG.RelationEdge = {
    source : "hulk",
    relation : Relation.At,
    sink : "epsilon",
    type : "RelationEdge"
}

// Hulk is blasted.
export const hulk_blasted : SG.AttributeEdge = {
    source : "hulk",
    attribute : Attribute.Blasted,
    type : "AttributeEdge"
}

// Hulk is falling.
export const hulk_falling : SG.AttributeEdge = {
    source : "hulk",
    attribute : Attribute.Falling,
    type : "AttributeEdge"
}

// Hulk has landed.
export const hulk_landed : SG.AttributeEdge = {
    source : "hulk",
    attribute : Attribute.Landed,
    type : "AttributeEdge"
}

// ---- Initial state
export const init : SG.SceneGraph = [
    hulk_at_epsilon,
    explosion_at_epsilon   
]
