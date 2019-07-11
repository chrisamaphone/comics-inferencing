
// Primitive action:
//  - Action type (operator name)
//  - Label (unique ID)
//  - Preconditions
//  - Effects
interface PrimitiveAction {
    action_type : string,
    preconditions : string[],
    effects : string[]
}

interface Decomp {
    name : string,
    subplan : action[]
}

// Composite action:
//  - Action type
//  - Label
//  - List of decomposition methods
interface CompositeAction {
    action_type : string,
    decompositions: Decomp[]
}

type action = PrimitiveAction | CompositeAction

type plan = PrimitiveAction[]

/* HTN is either
    - Node:
        - action_type
        - label
        - decomp
        - list of children (HTNs)
 - Leaf
    - primitive action
*/
interface HTN_Node {
    action_type : string,
    decomp : Decomp,
    children : HTN[]
}

type HTN = HTN_Node | PrimitiveAction

const primitive_blast : PrimitiveAction =
    {
        action_type : "blast",
        preconditions : ["explosion_at", "entity_at"],
        effects : ["blasted"]
    }

const primitive_fall : PrimitiveAction =
    {
        action_type : "fall",
        preconditions : [],
        effects : []
    }

const primitive_fall_prime : PrimitiveAction =
    {
        action_type : "fall'",
        preconditions : [],
        effects : []
    }

const primitive_land : PrimitiveAction =
    {
        action_type : "land",
        preconditions : [],
        effects : []
    }

const fall_repeat : Decomp = 
    {
        name: "fall_repeat",
        subplan: [primitive_fall, primitive_fall_prime, primitive_fall_prime]
    }

const composite_falling : CompositeAction = {
    action_type : "falling",
    decompositions : [fall_repeat]
}

const falling_node : HTN = {
    action_type : "falling",
    decomp : fall_repeat,
    children : [primitive_fall, primitive_fall_prime, primitive_fall_prime]
}


// Not right yet
const example_HTN : HTN =
    {
        action_type : "propel by explosion",
        decomp : fall_repeat,
        children : []
    }


