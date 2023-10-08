# Plugboard.io
*a better way of writing websockets*

**Plugboard.io** is a framework for dynamically loading and managing [Socket.IO](https://socket.io/) event handlers from a specified folder, allowing developers to define and handle custom events in a modular way. It abstracts away the low-level Socket.IO server setup and event handling logic, making it easier to organize and extend event-driven functionality in a Socket.IO application.

### Features
 - File based and modular approach.
 - Organized incoming sockets into files.
 - Each incoming request is a class.

### Use it

```
npm i plugboard.io
```

```./index.ts```
```ts
import { Plugboard } from "plugboard.io";

const plugboard = new Plugboard('dist/sockets', {
    cors: { origin: "*" },
});

plugboard.onConnection = (socket) => {
    socket.emit('connected');
}

plugboard.start(3000);
```

Initialize a new instance of the class and pass the following:
 - name of the folder where incoming sockets are stored
 - `ServerOptions` for `Server` imported from **socket.io**

Each incoming socket connection is stored inside the specified folder as a file with the same name as of the associated socket request.

Lets say in client side code:
```ts
socket.emit("search", "jhon");
```

`./socket/search.ts`
```ts
import { ASocket } from "plugboard.io";

export default class extends ASocket<[query: string]> {
    async run() {
        if (!this.args) return;

        // query: string
        const [query] = this.args;

        const result = await searchFromTheDb(query);
        this.socket?.emit('search-result', result);
    }
}
```

Every request is a class extending `ASocket`. The type passed in the generic is that of the payload coming with the request.

### "this" of a request:
```ts
this {
    io?: Server
    socket?: Socket
    args?: T
}
```