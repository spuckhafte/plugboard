import { readdirSync } from 'fs';
import { Socket, Server, ServerOptions } from 'socket.io';

export class Plugboard {
    socketFolder: string;
    io: Server;
    commands: string[];
    onConnection: ((socket: Socket, io: Server) => void) | null = null;
    private eventsCollected: {
        [index: string]: ASocket<[]>
    }

    constructor(socketFolder: string, opts?: Partial<ServerOptions> | undefined) {
        this.socketFolder = socketFolder;
        this.commands = readdirSync(socketFolder).map(i => i.replace('.js', ''));

        const collectingCmds: { [index: string]: ASocket<[]> } = {};
        for (let cmd of this.commands) {
            const cmdPath = `file://${process.cwd()}/${socketFolder}/${cmd}.js`;
            import(cmdPath).then(theCommand => {
                if (theCommand.default) {
                    const event: ASocket<[]> = new theCommand.default();
                    collectingCmds[cmd] = event;
                }
            }).catch(e => console.log(e));
        }
        this.eventsCollected = collectingCmds;

        this.io = new Server(opts);

        this.io.on('connection', socket => {
            if (this.onConnection) 
                this.onConnection(socket, this.io);
            
            for (let cmd of this.commands) {
                if (!this.eventsCollected[cmd]) continue;

                socket.on(cmd, async (...args) => {
                    const event = this.eventsCollected[cmd];
                    event.init(socket, this.io, args as []);
                    event.run();
                });
            }
        });
    }

    start(port: number, cb: CallableFunction) {
        this.io.listen(port);
        cb();
    }
}


export class ASocket<Args extends any[]> {
    socket?: Socket;
    io?: Server;
    args?: Args;

    init(s: Socket, io: Server, args: Args) {
        this.socket = s;
        this.io = io;
        this.args = args;
    }

    async run() {

    }
}