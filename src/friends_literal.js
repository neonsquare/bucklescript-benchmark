'use strict';

const {makePerson} = require('./friends')

let addFriend = (friend, {name, age, friends}) =>
    ({name, age, friends: [friend.name, ...friends]})

function friends () {
  let tom = makePerson("Tom", 23, []);
  let mary = makePerson("Mary", 25, []);
  let john = makePerson("John", 27, []);
  let sara = makePerson("Sara", 21, []);
  let smiths = [tom, mary];
  let millers = [john, sara];
  millers = millers.map(p=>addFriend(tom, p))
  smiths = smiths.map(p=>addFriend(john, p))
  millers = millers.map(p=>addFriend(mary, p))
  smiths = smiths.map(p=>addFriend(sara, p))
}

module.exports = {
  friends
}
