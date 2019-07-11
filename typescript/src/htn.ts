
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

// Composite action:
//  - Action type
//  - Label
//  - List of decomposition methods
interface CompositeAction {
    action_type : string
}

type action = PrimitiveAction | CompositeAction

interface Decomp {
    name : string,
    subplan : action[]
}

type plan = PrimitiveAction[]

/* Solution is either
    - Node:
        - action_type
        - label
        - list of children (Solutions)
 - Leaf
    - primitive action
*/
interface SolutionNode {
    action_type : string,
    children : Solution[]
}

type Solution = SolutionNode | PrimitiveAction

// Test domain: propel by explosion

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
    action_type : "falling"
}

const decomp_propel : Decomp =
{
    name: "blast_fall_land",
    subplan: [primitive_blast, composite_falling, primitive_land]
}

export const composite_propel_by_explosion : CompositeAction = {
    action_type : "propel_by_explosion"
}

// decomps maps composite node names to instances of the Decomp type.
// The values matching an existing composite node must always be nonempty lists.
function decomps(name : string) : Decomp[] {
    if (name == "falling")
        return [fall_repeat];
    if (name == "propel_by_explosion")
        return [decomp_propel];
    return [];
}

const falling_node : Solution = {
    action_type : "falling",
    children : []
}

/* expandHTN(htn) recursively decomposes composite nodes into 
    primitive actions, creating a Solution (tree whose leaves 
    are primitive actions) along the way.

  Requires htn to be an action list of length at least 1.

  Test1:
  expandHTN(composite_propel_by_explosion) =
        {
            action_type: "propel_by_explosion",
            children: [
                primitive_blast,
                {
                    action_type: "falling",
                    children: [
                        primitive_fall,
                        primitive_fall',
                        primitive_fall'
                    ]
                },
                primitive_land
            ]
        }
*/

function randomInterval(min : number, max : number) : number {
    return Math.floor(Math.random()*(max+1)) + min;
}

// a.length must be > 0
export function randomMember(a:any[]) : any {
    return a[randomInterval(0,a.length-1)];
}

export function expandHTN(action : action) : Solution {
    // If the action, is primitive, return it (leaf of the solution tree)
    if((action as PrimitiveAction).preconditions) {
        return (action as PrimitiveAction);
    }

    // Otherwise, if it is composite, recursively expand by looking in the
    // dictionary (decomps) for a decomposition of the composite.
    const comp = action as CompositeAction;
    const candidate_subplans = decomps(comp.action_type);
    if(candidate_subplans) {
        const subplan : action[] = randomMember(candidate_subplans);
        let children : Solution[] = [];
        for(let i=0; i<subplan.length; i++) {
            const childSol : Solution = expandHTN(subplan[i]);
            children.push(childSol);
        }
        return {action_type: comp.action_type, children: children};
    }
    throw new Error("No decomposition found for action "+action.action_type);
}


/*
function linearize(s: Solution) : PrimitiveAction[] {

}
*/
 



