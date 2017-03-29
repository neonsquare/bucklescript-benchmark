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
const b1_label = "friends Reason: (BuckleScript Records)"
const b1 = bench(b1_label, N, FriendsRe.friends)

const b2_label = "friends JS: (Object.assign)"
const b2 = bench(b2_label, N, FriendsJS.friends)

const b3_label = "friends JS: (Object literal, manual key mapping)"
const b3 = bench(b3_label, N, FriendsJS_literal.friends)

const b4_label = "friends JS: (Object mutation)"
const b4 = bench(b4_label, N, FriendsFJS.friends)

console.log("\n\n"+b1_label+" computed results:")
b1.map(FriendsRe.printPerson)

console.log("\n\n"+b2_label+" computed results:")
b2.map(FriendsJS.printPerson)

console.log("\n\n"+b3_label+" computed results:")
b3.map(FriendsJS_literal.printPerson)

console.log("\n\n"+b4_label+" computed results:")
b4.map(FriendsFJS.printPerson)

