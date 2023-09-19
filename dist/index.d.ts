import { Socket, Server, ServerOptions } from 'socket.io';
export declare class Plugboard {
    io: Server;
    commands: string[];
    private eventsCollected;
    constructor(opts?: Partial<ServerOptions> | undefined);
    start(port: number, cb: CallableFunction): void;
}
export declare class ASocket<Args extends any[]> {
    socket?: Socket;
    io?: Server;
    args?: Args;
    init(s: Socket, io: Server, args: Args): void;
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map