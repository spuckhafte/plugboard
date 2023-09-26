import { Socket, Server, ServerOptions } from 'socket.io';
export declare class Plugboard {
    socketFolder: string;
    io: Server;
    commands: string[];
    onConnection: ((socket: Socket, io: Server) => void) | null;
    private eventsCollected;
    constructor(socketFolder: string, opts?: Partial<ServerOptions> | undefined);
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