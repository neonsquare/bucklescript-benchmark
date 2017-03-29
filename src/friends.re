type person = {name: string, age: int, friends: list string};

let makePerson name age friends => {name, age, friends};

let addFriend friend person => {
  ...person,
  friends: [friend.name, ...person.friends]
};

let printPerson person => {
  let friends = String.concat ", " person.friends;
  Js.log (Printf.sprintf "Person %s: %s" person.name friends)
};

let friends () => {
  let tom = makePerson "Tom" 23 [];
  let mary = makePerson "Mary" 25 [];
  let john = makePerson "John" 27 [];
  let sara = makePerson "Sara" 21 [];
  let smiths = ref [tom, mary];
  let millers = ref [john, sara];
  millers := !millers |> List.map (addFriend tom);
  smiths := !smiths |> List.map (addFriend john);
  millers := !millers |> List.map (addFriend mary);
  smiths := !smiths |> List.map (addFriend sara);
  Array.of_list (!millers @ !smiths)
};
