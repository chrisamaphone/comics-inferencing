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

// Mapping operator names to definitions.
export interface OperatorLibrary {
    (name: string) : OperatorDefinition | null
}

// Mapping method names to candidate decompositions.
export interface MethodLibrary {
    (name: string) : DecompDefn[] | null
}

// HTN Domain definition
export interface Domain {
    operators : OperatorLibrary,
    methods : MethodLibrary
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





 



