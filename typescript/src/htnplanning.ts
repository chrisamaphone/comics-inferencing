// Adapted from PyHop by Dana Nau: https://bitbucket.org/dananau/pyhop/src/default/
import * as SG from "./scenegraph"
import * as HTN from "./htn"

function removeEdge(edge: SG.SceneGraphEdge, graph: SG.SceneGraph) : SG.SceneGraph | null {
    let prefix : SG.SceneGraph = [];
    for(let i = 0; i < graph.length; i++) {
        if(graph[i] == edge) {
            return prefix.concat(graph.slice(i+1))
        }
        prefix.push(graph[i]);
    }
    return null;
}

// Checks whether condition is a subgraph of scenegraph.
// If so, returns (state - condition).
// Otherwise returns null.
// TODO: incorporate args
function holds(condition: SG.SceneGraph, state: SG.SceneGraph) : SG.SceneGraph | null {
    let subgraph : SG.SceneGraph = state;

    // Remove each condition, as long as it exists in the state.
    for(let i=0; i<condition.length; i++) {
        const check = removeEdge(condition[i], subgraph);
        if(!check) { // The condition is not in the scene graph
            return null;
        }
        subgraph = (check as SG.SceneGraph);
    }
    return subgraph;
}

// Union two scene graphs together
function join(graph1: SG.SceneGraph, graph2: SG.SceneGraph) : SG.SceneGraph {
    return graph1.concat(graph2);
}

// Analog of the operator() method in PyHop
// TODO: incorporate args
export function applyTask(operator: HTN.OperatorDefinition, args: string[], state: SG.SceneGraph) : SG.SceneGraph | null {
    const {preconds, effects} = operator(args);
    
    // If preconditions hold, modify the state accordingly.
    const remainder = holds(preconds, state);
    if(remainder) {
        const smaller = (remainder as SG.SceneGraph);
        return join(smaller, effects);
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
export function seekPlan(domain: HTN.Domain, state: SG.SceneGraph, tasks: HTN.Task[], plan: HTN.Task[]) : HTN.Task[] | null {

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

/*
function linearize(s: Solution) : PrimitiveAction[] {

}
*/
