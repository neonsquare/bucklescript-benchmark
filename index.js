'use strict';

const FriendsRe = require('./lib/js/src/friends.js')
const FriendsJS = require('./src/friends.js')
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

let b1 = bench("FriendsRe", 1000000, FriendsRe.friends)
let b2 = bench("FriendsJS", 1000000, FriendsJS.friends)
let b3 = bench("FriendsFJS", 1000000, FriendsFJS.friends)

console.log("\nFriendsRe computed results")
b1.map(FriendsRe.printPerson)

console.log("\nFriendsJS computed results")
b2.map(FriendsJS.printPerson)

console.log("\nFriendsFJS computed results")
b3.map(FriendsFJS.printPerson)

