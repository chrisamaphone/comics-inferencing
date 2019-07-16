// Adapted from PyHop by Dana Nau: https://bitbucket.org/dananau/pyhop/src/default/

import * as SG from "./scenegraph"
import * as HTN from "./htn"

// Analog of the operator() method in PyHop
function applyTask(action: HTN.PrimitiveAction, args: string[], state: SG.SceneGraph) : SG.SceneGraph | null {

    // If preconditions hold, modify the state accordingly.


    // Otherwise, return null.
    return null;
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


