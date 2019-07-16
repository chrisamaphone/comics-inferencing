import * as SG from "./scenegraph"

export interface Task {
    operator_name : string,
    args : string[]
}

// Operators are defined as functions from arguments to an
// object {preconditions, effects}.
export interface OperatorDefinition {
    (args: string[]): {preconds: SG.SceneGraph, effects: SG.SceneGraph}
}

// Composite actions are defined as lists of decomp definitions,
// which are functions from arguments to arrays of tasks
export interface DecompDefn {
    (args:string[]) : Task[]
}

// A plan (linearized) is an array of concrete tasks, i.e. task names
// and operators.
type plan = Task[]

/* A Solution tree is either
    - Node:
        - name
        - list of children (Solutions)
 - Leaf
    - Task (mapping to a primitive action + its args)
*/
interface SolutionNode {
    action_type : string,
    children : Solution[]
}

type Solution = SolutionNode | Task

// Test domain: propel by explosion

const op_blast : OperatorDefinition =
    function(args:string[]) {
            return { 
                preconds: [SG.explosion_at_epsilon, SG.hulk_at_epsilon],
                effects : [SG.hulk_blasted] 
            }
    }

const task_blast : Task =
    {
        operator_name : "blast",
        args: []
    }

const op_fall : OperatorDefinition =
    function(args:string[]) {
            return { 
                preconds : [SG.hulk_blasted],
                effects : [SG.hulk_falling]
            }
    }

const task_fall : Task =
    {
        operator_name : "fall",
        args: []
    }

const op_fall_prime : OperatorDefinition =
    function(args:string[]) {
            return {
                preconds : [SG.hulk_falling],
                effects : [SG.hulk_falling]
            }
    }

const task_fall_prime : Task =
    {
        operator_name : "fall'",
        args: []
    }

const op_land : OperatorDefinition =
    function(args:string[]) {
            return {
                preconds : [SG.hulk_falling],
                effects : [SG.hulk_landed]
            }
    }

const task_land : Task =
    {
        operator_name : "land",
        args: []
    }

const fall_repeat : DecompDefn = 
    function(args:string[]) {
            return [task_fall, task_fall_prime, task_fall_prime]
    }

const task_fall_repeat : Task =
    {
        operator_name: "fall_repeat",
        args: []
    }

const task_falling : Task = {
    operator_name: "falling",
    args: []
}

const decomp_propel : DecompDefn =
    function(args:string[]) {
        return [task_blast, task_falling, task_land]
    }

// operators maps node names to operator definitions
export function operators(name : string) : OperatorDefinition | null {
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
export function methods(name : string) : DecompDefn[] | null {
    if (name == "falling")
        return [fall_repeat];
    if (name == "propel_by_explosion")
        return [decomp_propel];
    return null;
}

/*
Helper functions for expandHTN()
*/
function randomInterval(min : number, max : number) : number {
    return Math.floor(Math.random()*(max+1)) + min;
}

// a.length must be > 0
export function randomMember(a:any[]) : any {
    const idx = randomInterval(0,a.length-1);
    return a[idx];
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
/* TODO: fix to account for operator arguments
export function expandHTN(action : action) : Solution {
    // If the action, is primitive, return it (leaf of the solution tree)
    if((action as PrimitiveAction).preconditions) {
        return (action as PrimitiveAction);
    }

    // Otherwise, if it is composite, recursively expand by looking in the
    // dictionary (decomps) for a decomposition of the composite.
    const comp = action as CompositeAction;
    const candidate_subplans : Decomp[] = decomps(comp.action_type);
    
    if(candidate_subplans) {
        const subplan : action[] = (randomMember(candidate_subplans) as Decomp).subplan;
        let children : Solution[] = [];
        for(let i=0; i<subplan.length; i++) {
            const childSol : Solution = expandHTN(subplan[i]);
            children.push(childSol);
        }
        return {action_type: comp.action_type, children: children};
    }
    throw new Error("No decomposition found for action "+action.action_type);
}
*/


/*
function linearize(s: Solution) : PrimitiveAction[] {

}
*/
 



