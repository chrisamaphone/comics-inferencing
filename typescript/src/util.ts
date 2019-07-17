
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