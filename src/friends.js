'use strict';

class Person {
  constructor(name, age, friends) {
    this.name = name
    this.age = age
    this.friends = friends
  }
}

function addFriend (friend, person) {
  return Object.assign({}, person, {
    friends: [friend.name, ...person.friends]
  });
}

function printPerson (person) {
  let friends = person.friends.join(", ")
  console.log(`Person ${person.name}: ${friends}`)
}

function friends () {
  let tom = new Person("Tom", 23, []);
  let mary = new Person("Mary", 25, []);
  let john = new Person("John", 27, []);
  let sara = new Person("Sara", 21, []);
  let smiths = [tom, mary];
  let millers = [john, sara];

  millers = millers.map(p=>addFriend(tom, p))
  smiths = smiths.map(p=>addFriend(john, p))
  millers = millers.map(p=>addFriend(mary, p))
  smiths = smiths.map(p=>addFriend(sara, p))
  return millers.concat(smiths);
}

module.exports = {
  Person, friends, printPerson
}
