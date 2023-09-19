import { readdirSync } from 'fs';
import { Socket, Server, ServerOptions } from 'socket.io';

const INCOMING = './socket_in';

export class Plugboard {
    io: Server;
    commands = readdirSync(INCOMING).map(i => i.replace('js', ''));
    private eventsCollected: {
        [index: string]: ASocket<[]>
    }

    constructor(opts?: Partial<ServerOptions> | undefined) {

        const collectingCmds: { [index: string]: ASocket<[]> } = {};
        for (let cmd of this.commands) {
            const cmdPath = `file://${process.cwd()}/${INCOMING}/${cmd}.js`;
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