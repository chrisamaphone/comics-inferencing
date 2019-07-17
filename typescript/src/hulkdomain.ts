import * as HTN from "./htn"
import * as SG from "./scenegraph"

// Our narrative ontology:
import {Relation} from "./relations"
import {Attribute} from "./attributes"

// ---- Operator Definitions


// blast:
// explosion_at(env) * at(agent, env) -o blasted(agent)
const op_blast : HTN.OperatorDefinition =
    function(args:string[]) {
        const env : string = args[0];
        const agent : string = args[1];
        
        // explosion_at(env)
        const explosion_at_env = SG.makeRelation("explosion", Relation.At, env);
        
        // at(agent, env)
        const agent_at_env = SG.makeRelation(agent, Relation.At, env);
        
        // blasted(agent)
        const blasted_agent = SG.makeAttribute(agent, Attribute.Blasted);
        
        return { 
           preconds: [explosion_at_env, agent_at_env],
           effects : [blasted_agent] 
        }
    }


// fall:
// blasted(agent) -o falling(agent)
const op_fall : HTN.OperatorDefinition =
    function(args:string[]) {
        const agent : string = args[0]

        // blasted(agent)
        const blasted_agent = SG.makeAttribute(agent, Attribute.Blasted);

        // falling(agent)
        const falling_agent = SG.makeAttribute(agent, Attribute.Falling);

        return { 
            preconds : [blasted_agent],
            effects : [falling_agent]
        }
    }


// falling(agent) -o falling(agent)
const op_fall_prime : HTN.OperatorDefinition =
    function(args:string[]) {

        const agent : string = args[0];

        // falling(agent)
        const falling_agent = SG.makeAttribute(agent, Attribute.Falling);

        return {
            preconds : [falling_agent],
            effects : [falling_agent]
        }
    }


// falling(agent) -o landed(agent)
const op_land : HTN.OperatorDefinition =
    function(args:string[]) {

        const agent : string = args[0];

        // falling(agent)
        const falling_agent = SG.makeAttribute(agent, Attribute.Falling);

        // landed(agent)
        const landed_agent = SG.makeAttribute(agent, Attribute.Landed);

        return {
            preconds : [falling_agent],
            effects : [landed_agent]
        }
    }


// ---- Decomposition Definitions    

// fall repeat decomposition and tasks
const fall_repeat : HTN.DecompDefn = 
    function(args:string[]) {
        const agent : string = args[0];
        const task_fall = {
            operator_name: "fall",
            args: [agent]
        }

        const task_fall_prime = {
            operator_name: "fall'",
            args: [agent]
        }

        return [task_fall, task_fall_prime, task_fall_prime]
    }


// propel decomposition and tasks
const propel : HTN.DecompDefn =
    function(args:string[]) {
        const env : string = args[0];
        const agent : string = args[1];

        const task_blast = {
            operator_name: "blast",
            args: [env, agent]
        }

        const task_falling = {
            operator_name: "falling",
            args: [agent]
        }
        
        const task_land = {
            operator_name: "land",
            args: [agent]
        }

        return [task_blast, task_falling, task_land]
    }

export const task_propel : HTN.Task = {
    operator_name: "propel",
    args: ["epsilon", "hulk"]
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
export const hulkDomain : HTN.Domain = {
    operators: operators, 
    methods: methods,
    allKeys: ["falling", "propel", "fall", "fall'", "blast", "land"]
};

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
