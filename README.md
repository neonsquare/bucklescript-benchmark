# BuckleScript Benchmark

This little benchmark demonstrates how static compilation using a compiler like Bucklescript can make very similar looking code run an order of magnitude faster than naively written JS.

To build the javascript code from the Reason-Code using Bucklescript just run `npm run build`.

To run the benchmark run `npm start`. The output should be similar to the following:

```
FriendsRe: 991.739ms
FriendsJS: 12001.444ms
FriendsFJS: 2143.926ms

FriendsRe computed results
Person John: Mary, Tom
Person Sara: Mary, Tom
Person Tom: Sara, John
Person Mary: Sara, John

FriendsJS computed results
Person John: Mary, Tom
Person Sara: Mary, Tom
Person Tom: Sara, John
Person Mary: Sara, John

FriendsFJS computed results
Person John: Tom, Mary
Person Sara: Tom, Mary
Person Tom: John, Sara
Person Mary: John, Sara
```
(Measured using Node.js v7.7.1 on a MacBook Pro Retina 2,3 GHz Intel Core i7, 16GB RAM)

## How realistic is such code?

Functional programming patterns are more and more common in modern Javascript projects. Strictly controlling side effects is an important aspect in this. Operations like `Object.assign`, Object spread or Array spread are quite common as an ad hoc, quick way to implement immutable datastructures from plain javascript objects and arrays. This example shows that this can lead to bad performance compared to code that is compiled using a compiler that knows that its datastructures actually really are immutable.

The FriendsFJS variant demonstrates, that even a direct destructive modification of the Array within the person records themselves may not necessarily give better performance. It also isn't generating exactly the same result, because the order of the friends array ends up reversed.

## Where is the price?

The representation BuckleScript compiles out of the Records enable this good performance, but are more difficult to handle in arbitrary JS code or within the debugger. You lose the easy runtime introspectability of plain javascript objects, which e.g. means  you do not directly see the names of the fields anymore. If you want to access such record instances from JavaScript you need to write accessor functions in BuckleScript.

--
Jochen H. Schmidt
27. Mar. 2017
