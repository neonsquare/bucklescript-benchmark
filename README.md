# BuckleScript Benchmark

This little benchmark demonstrates how static compilation using a
compiler like
[Bucklescript](https://github.com/bloomberg/bucklescript) can make
very similar looking [Reason](https://facebook.github.io/reason/) code run an order of magnitude faster than naively written JS.

# Descriptions of the Code-Variants:

## `src/friends.re`
A straight forward implementation in Reason.

## `src/friends.js`
Direct adaption from the Reason code. Is using JS objects instead of a
record. Immutable object update is done with `Object.assign` which is
similar to the Object spread syntax that is often used when
transpiling JS with Babel. The array gets updated immutable through
Array spread.

## `src/friends_literal.js`
Instead of `Object.assign` this variant uses a direct object literal
and any property gets manually set from the source object. This is
significantly faster then Object.assign, but one has to manually
maintain that any possible property in the source object gets set in
the clone.

## `src/ffriends.js`
This variant doesn't behave immutable. Instead the inital person
objects get modified directly and also the friends-Array is modified
using `Array.push()` instead of `Array.spread()`.

# Build and Run

To build the javascript code from the Reason-Code using Bucklescript just run `npm run build`.

To run the benchmark run `npm start`. The output should be similar to the following:

```
Timings:

friends Reason: (BuckleScript Records): 981.740ms
friends JS: (Object.assign): 11636.720ms
friends JS: (Object literal, manual key mapping): 4594.644ms
friends JS: (Object mutation): 2082.998ms


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


friends JS: (Object literal, manual key mapping) computed results:
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
(Measured using Node.js v7.7.1 on a MacBook Pro Retina 2,3 GHz Intel
Core i7, 16GB RAM)

Of course the timings depend on the used JS engine!

## How realistic is such code?

Functional programming patterns are more and more common in modern Javascript projects. Strictly controlling side effects is an important aspect when applying them. Directly modifying data structures makes it harder to follow the state flow of complex programs. So instead of this, a functional program makes use of immutable datastructures.

JavaScript objects are inherently optimized to get directly modified at runtime. Though, operations like `Object.assign` or Syntax extensions like Object spread or Array spread make it very easy to code in a style that implements immutable datastructures ad hoc from plain javascript objects and arrays. Typical use cases are state transformations implemented in Redux reducers. The example used in this benchmark uses this style to demonstrate how this can lead to bad performance compared to code that is compiled using a compiler that knows that its datastructures actually really are immutable a priori.

The second JavaScript  variant demonstrates, that even a direct destructive modification of the Array within the person records themselves may not necessarily give better performance. It also isn't generating exactly the same result, because the order of the friends array ends up reversed.

This leads to an interesting outcome: While languages like [TypeScript](http://www.typescriptlang.org)
can use their static type system to offer better tooling or less
runtime errors, they still are - by their whole definition -  bound to
the mutative nature of JavaScript. A language like [Reason](https://facebook.github.io/reason/) with a
compiler like BuckleScript has a much stricter definition. Those
constraints open up the door to more freedom in optimizing code and
choosing more efficient data structure representations.

## Hand optimization vs. Compilers

Some readers may note, that this example doesn't show that
"Bucklescript" generates faster code than JS because one could just
manually write code that does the same as what Bucklescript generates.
This is true, but it isn't practical. While this may work for very small
toy examples like this benchmark, it never would work for real
programs. It is nearly impossible to sustain this kind of hand
optimization across public API boundaries.

The main point here is, that a language like Reason defines simple
language semantics that _abstract away_ any concrete representation of
code and values so that they can later be changed, improved or
optimized. Automatically. Or short: An improved BuckleScript compiler
can generate even faster code out of the given Reason example. Without
changing the code itself.

## Where is the price?

[Bucklescript](https://github.com/bloomberg/bucklescript) doesn't just map records directly on JavaScript objects. It instead  uses a representation of Arrays and any property access is compiled to simple array index accesses. This representation is the reason how the result can deliver such a good runtime performance. Also lists are not mapped 1:1 on Arrays! Their representation uses 2-element arrays where the first element is the list head and the 2nd element is the tail of the list:

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

If you want to use idiomatic JS objects in [Bucklescript](https://github.com/bloomberg/bucklescript) (e.g. for
interoperability with JS libs) - you can use the FFI (Foreign Function
Interface) of BuckleScript. This FFI is what makes a big difference to
languages like TypeScript: When writing pure BuckleScript
(OCaml/Reason) code, the compiler is free to take any representation
it likes, as all interoperability is restricted _within_ the Reason/OCaml language
semantics. With the FFI one interfaces the pure written code with the
JavaScript runtime. This is where BuckleScript has to play by the 
rules of its host language and accept the dynamic behaviour there.

--
Jochen H. Schmidt
27. Mar. 2017
