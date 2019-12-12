// Adapted from PyHop by Dana Nau: https://bitbucket.org/dananau/pyhop/src/default/
import * as SG from "./scenegraph"
import * as HTN from "./htn"

// Analog of the operator() method in PyHop
// TODO: incorporate args
export function applyTask(operator: HTN.OperatorDefinition, args: string[], state: SG.SceneGraph) : SG.SceneGraph | null {
    const {preconds, effects} = operator(args);
        
    // If preconditions hold, modify the state accordingly.
    const remainder = SG.holds(preconds, state);
    if(remainder) {
        const smaller = (remainder as SG.SceneGraph);
        return SG.join(smaller, effects);
    } // Otherwise, return null.
    else { 
        return null;
    }
}

// Analog of method() in PyHop
export function applyMethod(method: HTN.DecompDefn, args: string[]) : HTN.Task[] {
    return method(args);
}

// Port of seekPlan() in PyHop
/*
    seekPlan(domain, init, tasks, plan) = solution
    iff
    [solution] is a sequence of ground primitive tasks that can execute 
    the input task sequence [tasks] on the initial state [init] under the 
    rules in [domain].
*/
export function seekPlan(domain: HTN.Domain, state: SG.SceneGraph, tasks: HTN.Task[], plan: HTN.Plan) : HTN.Plan | null {

    if(tasks.length == 0) {
        return plan;
    }

    const task1 : HTN.Task = tasks[0];

    // Look up task.name in the HTN.operators global dict mapping operator names to PrimitiveActions.
    if(domain.operators(task1.operator_name)) {
        
        // Call applyTask() on the resulting action and args.
        const operator : HTN.OperatorDefinition = domain.operators(task1.operator_name) as HTN.OperatorDefinition;
        const newState : SG.SceneGraph | null = applyTask(operator, task1.args, state);

        // If the application was successful,
        if(newState) {
            plan.push(task1); // append the task to the plan, and keep searching.
            const solution : HTN.Task[] | null = seekPlan(domain, newState, tasks.slice(1), plan);

            if(solution) {
                return solution;
            }
        }
    }

    // If it's not there, look it up in HTN.decomps
    if(domain.methods(task1.operator_name)) {

        // Call applyMethod() on resulting method candidates 
        const relevant : HTN.DecompDefn[] = domain.methods(task1.operator_name) as HTN.DecompDefn[];

        // Go through all relevant methods.
        for(let i = 0; i < relevant.length; i++) {
            const method : HTN.DecompDefn = relevant[i];
            const subtasks : HTN.Task[] = applyMethod(method, task1.args);
            
            if(subtasks.length > 0) {
                const newSubtasks = subtasks.concat(tasks.slice(1));
                const solution : HTN.Task[] | null = seekPlan(domain, state, newSubtasks, plan);

                if(solution) {
                    return solution;
                }
            }
        }        
    }

    return null;
}


export interface Solution {
    sol: HTN.Solution,
    states: SG.SceneGraph[], // the intermediate states computed by applying the leaves of the sol
    last_state: SG.SceneGraph
}

/*
    Version of solver with tree-structured output
*/
// Must be tested
export function seekEventStructure(domain : HTN.Domain, state: SG.SceneGraph, problem : HTN.Task) : Solution | null {

    // Look up task.name in the HTN.operators global dict mapping operator names to PrimitiveActions.
    if(domain.operators(problem.operator_name)) {
        
        // Call applyTask() on the resulting action and args.
        const operator : HTN.OperatorDefinition = domain.operators(problem.operator_name) as HTN.OperatorDefinition;
        const newState : SG.SceneGraph | null = applyTask(operator, problem.args, state);

        // If the application of operator was successful, this task is itself the solution.
        if(newState) {
            return {sol: problem, states: [state], last_state: newState}
        }
    }

    // If it's not there, look it up in HTN.decomps
    else if(domain.methods(problem.operator_name)) {

        // Call applyMethod() on resulting method candidates 
        const relevant : HTN.DecompDefn[] = domain.methods(problem.operator_name) as HTN.DecompDefn[];

        // Go through all relevant methods.
        for(let i = 0; i < relevant.length; i++) {
            const method : HTN.DecompDefn = relevant[i];
            const subtasks : HTN.Task[] = applyMethod(method, problem.args);
            let child_sols = []
            let child_states : SG.SceneGraph[] = []
            let last_state = state;
            let methodWorks : Boolean = true;

            for(let i=0; i < subtasks.length; i++) { // All subtasks of a method must succeed.
                const child_sol_and_states : Solution | null = seekEventStructure(domain, last_state, subtasks[i]);
                if(child_sol_and_states) {
                    const child_sol = child_sol_and_states.sol;
                    const states = child_sol_and_states.states;
                    last_state = child_sol_and_states.last_state;
                    child_sols.push(child_sol);
                    child_states.concat(states);
                } else { // No solution for a child -- the method fails.
                    methodWorks = false;
                    break;
                }
            }

            if (methodWorks) { // Build the new node and return it
                const new_sol : HTN.SolutionNode =
                {
                    action_type: method.name,
                    children: child_sols
                }

                const new_node : Solution =
                {
                    sol: new_sol,
                    states: child_states,
                    last_state: last_state
                }

                return new_node;
            }
            // Otherwise, keep searching through possible methods.
        }        
    }

    return null;
}

/* linearize : Solution -> Task[] (sequence of primitive tasks at the leaves of the sol)
*/
/* XXX - maybe not actually useful
function linearize(s: HTN.Solution) : HTN.Plan {
    if (s as HTN.Task) {
        return [s as HTN.Task];
    } else {
        const n : HTN.SolutionNode = s as HTN.SolutionNode;
        let p : HTN.Plan = [];
        for(let i = 0; i < n.children.length; i++) { 
            const child_plan = linearize(n.children[i]);
            p = p.concat(child_plan);
        }
        return p;
    }
} */
/* Correctness condition:
    If
        seekPlan(domain, state, [problem], []:plan) = somePlan
    then
        linearize(seekEventStructure(domain, state, problem).sol) = somePlan
    and vice versa.

    XXX - still need to test this
*/


// produces an HTN -- return all such that satisfy
export function seekMatchingEventStructure(domain : HTN.Domain, comic : SG.SceneGraph[]) : HTN.Solution | null {
    
    // loop over all tasks in the domain
    for(let i=0; i < domain.groundTasks.length; i++) 
    {
        const topLevelTask : HTN.Task = domain.groundTasks[i]; 
        // loop through and check if it can make sense as root

        // talk about how to represent these arguments to cycle through them
        // Also need to iterate through all possible args -> not necessary, all domain ground tasks
        // will be specified as input
        const trySol = seekEventStructure(domain, comic[0], topLevelTask);
        
        if (trySol as Solution) {
            const sol = trySol as Solution;
            const events : HTN.Solution = sol.sol;
            const states : SG.SceneGraph[] = sol.states;
            states.push(sol.last_state);

            if (SG.matchPanelSequence(comic, states)) {
                return (events as HTN.Solution);
            }
        }
    }
    
    return null;
}

// This returns a two dimensional array of HTN tasks.
// The length of the array is given by the length of the scene graph array: we can have as many tasks as
// we have scene graphs.  In each array index i is an array of all possible tasks that can establish the
// state of SceneGraph array index i.
export function findPossibleSceneGraphComicTasks(domain: HTN.Domain, comic: SG.SceneGraph[]) : HTN.Task[][] | null {

    // For each SceneGraph:
    for(let sceneGraphIndex = 0; sceneGraphIndex < comic.length; sceneGraphIndex++)
    {
        const comicSceneGraph : SG.SceneGraph = comic[sceneGraphIndex];

        // Go through all possible ground tasks of the domain.
        for(let i = 0; i < domain.groundTasks.length; i++)
        {
            // Can this ground task's effects provide the conditions listed in the scene graph?
            const groundTask : HTN.Task = domain.groundTasks[i];
            const groundTaskOp : HTN.OperatorDefinition = domain.operators(groundTask.operator_name) as HTN.OperatorDefinition;
            const {preconds, effects} = groundTaskOp(groundTask.args);

            // Hmm...this is not that simple.  It's not just whether the action can establish
            // the effects, but rather, it's if the action after applied to current state
            // can establish the effects.  Bleeeeerg.
            if(SG.holds(comicSceneGraph, effects))
            {

            }
            

            

            
            






        }
    }




    return null;
}




// TODO
// This produces a collection of HTNs, each one which "satisfies" the input comic (given as an array of SceneGraphs)
// Open Q: What does it mean for an HTN to "satisfy" a SceneGraph array?
// Tentative A: What it means for this function is that the HTN's root node can decompose into a tree structure
//      where the leaves are *exactly* the input SceneGraph array.  This need not be the case; it could also be
//      (for example) that the leaves are a superset of the input array, but which contain the input scenegraphs
//      in the same partial order. Maybe this is worth discussing?
export function parseSceneGraphComicAsHTN(domain: HTN.Domain, comic: SG.SceneGraph[]) : HTN.Solution[] | null {
    return null;
}



