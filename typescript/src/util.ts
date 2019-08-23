
/*
Helper functions
*/

// Get a random number between min and max.
function randomInterval(min : number, max : number) : number {
    return Math.floor(Math.random()*(max+1)) + min;
}

// Get a random element of a.
// a.length must be > 0
export function randomMember(a:any[]) : any {
    const idx = randomInterval(0,a.length-1);
    return a[idx];
}

// Matching subsequences

// match_subseq(w, s) => true if every element in w is contained somewhere, in order, in s.
// Ex:
// w = [3, 8, 8, 4]
// s = [1, 2, 3, 3, 2, 8, 0, 4, 12]
// subseq(w, s)) => true
export function match_subseq<T>(leq : (x:T, y:T) => boolean, window : T[], seq : T[]) {
    for(let i=0; i < window.length; i++) {
        let found = false;
        
        // Search for seq[i] in window
        for(let j=0; j < seq.length && !found; j++) {
            if (leq(seq[j], window[i])) {
                seq = seq.slice(j+1);
                found = true;
            }
        }
        if (!found) {
            return false;
        }
    }
    // All elements in window are matched by something in seq 
    return true;
}

// Testing match_subseq 

const w = [3, 8, 8, 4]
const s = [1, 2, 3, 8, 3, 2, 8, 0, 4, 12]
const w2 : number[] = []
const s2 = [2, 2, 2, 2, 8, 3, 3, 8, 8, 4, 3, 8]


function my_match(sub : number, bigger : number) {
    return sub == bigger;
}

// Tests
console.log("match_subseq(w, s) = true? " + match_subseq(my_match, w, s))
console.log("match_subseq(w2, s) = true? " + match_subseq(my_match, w2, s))
console.log("match_subseq(w, w2) = false? " + !match_subseq(my_match, w, w2))
console.log("match_subseq(w, s2) = true? " + match_subseq(my_match, w, s2))
console.log("match(w,w) = true? " + match_subseq(my_match, w,w));
