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
function applyTask(action: HTN.PrimitiveAction, args: string[], state: SG.SceneGraph) : SG.SceneGraph | null {

    // If preconditions hold, modify the state accordingly.
    const remainder = holds(action.preconditions, state);
    if(remainder) {
        const smaller = (remainder as SG.SceneGraph);
        return join(smaller, action.effects);
    } // Otherwise, return null.
    else { 
        return null;
    }
}

// Analog of method() in PyHop
function applyMethod(state: SG.SceneGraph, tasks: HTN.Task[]) : HTN.Task[] {
    return [];
}

// Port of seekPlan() in PyHop
function seekPlan(state: SG.SceneGraph, tasks: HTN.Task[], plan: HTN.Task[]) : HTN.Task[] | null {

// Look up task.name in the HTN.operators global dict mapping operator names to PrimitiveActions.
// Call applyTask() on the resulting action and args.

// If it's not there, look it up in HTN.methods
// call applyMethod() on resulting method candidates (or choose a single method?)

    return null;
}


