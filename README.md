# BuckleScript Benchmark

This little benchmark demonstrates how static compilation using a compiler like Bucklescript can make very similar looking code run an order of magnitude faster than naively written JS.

To build the javascript code from the Reason-Code using Bucklescript just run `npm run build`.

To run the benchmark run `npm start`. The output should be similar to the following:

```
Timings:

friends Reason: (BuckleScript Records): 1027.289ms
friends JS: (Object.assign): 12000.872ms
friends JS: (Object mutation): 2444.924ms


friends Reason: (BuckleScript Records) computed results:
Person John: Mary, Tom
Person Sara: Mary, Tom
Person Tom: Sara, John
Person Mary: Sara, John


friends JS: (Object.assign) computed results:
Person John: Mary, Tom
Person Sara: Mary, Tom
Person Tom: Sara, John
Person Mary: Sara, John


friends JS: (Object mutation) computed results:
Person John: Tom, Mary
Person Sara: Tom, Mary
Person Tom: John, Sara
Person Mary: John, Sara
```
(Measured using Node.js v7.7.1 on a MacBook Pro Retina 2,3 GHz Intel Core i7, 16GB RAM)

## How realistic is such code?

Functional programming patterns are more and more common in modern Javascript projects. Strictly controlling side effects is an important aspect when applying them. Directly modifying data structures makes it harder to follow the state flow of complex programs. So instead of this, a functional program makes use of immutable datastructures.

JavaScript objects are inherently optimized to get directly modified at runtime. Though, operations like `Object.assign` or Syntax extensions like Object spread or Array spread make it very easy to code in a style that implements immutable datastructures ad hoc from plain javascript objects and arrays. Typical use cases are state transformations implemented in Redux reducers. The example used in this benchmark uses this style to demonstrate how this can lead to bad performance compared to code that is compiled using a compiler that knows that its datastructures actually really are immutable a priori.

The second JavaScript  variant demonstrates, that even a direct destructive modification of the Array within the person records themselves may not necessarily give better performance. It also isn't generating exactly the same result, because the order of the friends array ends up reversed.

This leads to an interesting outcome: While languages like TypeScript
can use their static type system to offer better tooling or less
runtime errors, they still are - by their whole definition -  bound to
the mutative nature of JavaScript. A language like Reason with a
compiler like BuckleScript has a much stricter definition. Those constraints open up the door to more freedom in optimizing code and choosing more efficient data structure representations.

## Where is the price?

BuckleScript doesn't just map records directly on JavaScript objects. It instead  uses a representation of Arrays and any property access is compiled to simple array index accesses. This representation is the reason how the result can deliver such a good runtime performance. Also lists are not mapped 1:1 on Arrays! Their representation uses 2-element arrays where the first element is the list head and the 2nd element is the tail of the list:

```
[1,2,3,4]
->
[1, [2, [3, [4, 0]]]]
```

This makes pushing a new element onto a list a constant timed operation (just allocate a new "CONS-Pair" with the new head item and the old list as tail).

On the other side: If records and lists are structured this way, they
are more difficult to handle in arbitrary JS code or within a
debugging session. You lose the easy runtime introspectability of
plain javascript objects. Blunt said: you do not directly see the
names of the fields anymore. If you want to access such record
instances from JavaScript you need to write accessor functions in
BuckleScript.

If you want to use idiomatic JS objects in BuckleScript (e.g. for
interoperability with JS libs) - you can use the FFI (Foreign Function
Interface) of BuckleScript. This FFI is what makes a big difference to
languages like TypeScript: When writing pure BuckleScript
(OCaml/Reason) code, the compiler is free to take any representation
it likes, as all interoperability is restricted _within_ the languages
semantics. With the FFI one interfaces the pure written code with the
JavaScript runtime. This is where BuckleScript has to play by the 
rules of its host language and accept the dynamic behaviour there.

--
Jochen H. Schmidt
27. Mar. 2017
