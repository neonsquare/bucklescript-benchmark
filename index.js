'use strict';

const FriendsRe = require('./lib/js/src/friends.js')
const FriendsJS = require('./src/friends.js')
const FriendsJS_literal = require('./src/friends_literal.js')
const FriendsFJS = require('./src/ffriends.js')

function bench (name, n, fn) {
    console.time(name)
    let result
    for (let i=0; i<n; ++i) {
        result = fn()
    }
    console.timeEnd(name)
    return result
}

const N = 1000000
console.log("Timings:\n")
const b1_label = "Reason: using BuckleScript Records/Lists "
const b1 = bench(b1_label, N, FriendsRe.friends)

const b2_label = "JS:     using Object.assign              "
const b2 = bench(b2_label, N, FriendsJS.friends)

console.log("\nTimings of unfair/cheating variants")

const b3_label = "JS: using Object and manual key mapping (brittle code!)         "
const b3 = bench(b3_label, N, FriendsJS_literal.friends)

const b4_label = "JS: using Object mutation (no immutability!)                    "
const b4 = bench(b4_label, N, FriendsFJS.friends)
