type person = {name: string, age: int, friends: list string};

let makePerson name age friends => {name, age, friends};

let addFriend friend person => {...person, friends: [friend.name, ...person.friends]};

let printPerson person => {
  let friends = String.concat ", " person.friends;
  Js.log (Printf.sprintf "Person %s: %s" person.name friends)
};

let rec map f xs => 
  switch xs {
  | [] => []
  | [ x, ... xs] => [ f x [@bs], ...  map f xs ]
  }
;

/*let u = fun [@bs] x  => x + 1 ; */
let friends () => {
  let tom = makePerson "Tom" 23 [];
  let mary = makePerson "Mary" 25 [];
  let john = makePerson "John" 27 [];
  let sara = makePerson "Sara" 21 [];
  let smiths = ref [tom, mary];
  let millers = ref [john, sara];
  
  /* millers := !millers |> List.map (addFriend tom);
  smiths := !smiths |> List.map (addFriend john);  
  millers := !millers |> List.map (addFriend mary);  
  smiths := !smiths |> List.map (addFriend sara); */

  millers := !millers |> map ((fun x  => addFriend tom x )[@bs]);
  smiths := !smiths |> map ((fun x => addFriend john x)[@bs]);
  millers := !millers |> map ((fun x => addFriend mary x) [@bs]);
  smiths := !smiths |> map ((fun x => addFriend sara x )[@bs]);
  Array.of_list (!millers @ !smiths)
};
