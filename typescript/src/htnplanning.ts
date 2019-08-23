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


/*
    Version of solver with tree-structured output
*/
export function seekEventStructure(domain : HTN.Domain, state: SG.SceneGraph, problem : HTN.Task) : HTN.Solution | null {

    // Look up task.name in the HTN.operators global dict mapping operator names to PrimitiveActions.
    if(domain.operators(problem.operator_name)) {
        
        // Call applyTask() on the resulting action and args.
        const operator : HTN.OperatorDefinition = domain.operators(problem.operator_name) as HTN.OperatorDefinition;
        const newState : SG.SceneGraph | null = applyTask(operator, problem.args, state);

        // If the application of operator was successful, this task it itself the solution.
        if(newState) {
            return problem;
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
            

            for(let i=0; i < subtasks.length; i++) {
                const child_sol : HTN.Solution | null = seekEventStructure(domain, state, subtasks[i]);
                if(child_sol) {
                    child_sols.push(child_sol);
                } else { // No solution for a child
                    return null;
                }
            }

            const new_node : HTN.SolutionNode =
            {
                action_type: method.name,
                children: child_sols
            }

            return new_node;
        }        
    }

    return null;
}

/* linearize : Solution -> Task[] (sequence of primitive tasks at the leaves of the sol)
*/
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
}

/* Correctness condition:
    If
        seekPlan(domain, state, [problem], []:plan) = somePlan
    then
        linearize(seekEventStructure(domain, state, problem)) = somePlan
    and vice versa.

    XXX - still need to test this
*/

/*
Friday, 8/23/2019
TO DO for next time: modify seekEventStructure to also return an array of intermediate states.
    Then work on this function: it needs to match the comic to that list.
    Actually, "linearize" may not really be useful at all.

function seekMatchingEventStructure(domain : HTN.Domain, comic : SG.SceneGraph[]) : HTN.Solution | null {
    
    for(let i=0; i < domain.allKeys.length; i++) {
        const topLevelTaskName : string = domain.allKeys[i];
        // Also need to iterate through all possible args
        const trySol =
            seekEventStructure(domain, comic[0], {operator_name:topLevelTaskName, args:[]});
        if (trySol as HTN.Solution) {
            const linearSol = linearize(trySol as HTN.Solution);
            // XXX - what we actually need is the sequence of intermediate states.
            if (SG.matchPanelSequence(comic, linearSol)) {
                return (trySol as HTN.Solution);
            }
        }
    }
    
    return null;
}
*/


