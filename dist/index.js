var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readdirSync } from 'fs';
import { Server } from 'socket.io';
export class Plugboard {
    constructor(socketFolder, opts) {
        this.onConnection = null;
        this.socketFolder = socketFolder;
        this.commands = readdirSync(socketFolder).map(i => i.replace('.js', ''));
        const collectingCmds = {};
        for (let cmd of this.commands) {
            const cmdPath = `file://${process.cwd()}/${socketFolder}/${cmd}.js`;
            import(cmdPath).then(theCommand => {
                if (theCommand.default) {
                    const event = new theCommand.default();
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
                if (!this.eventsCollected[cmd])
                    continue;
                socket.on(cmd, (...args) => __awaiter(this, void 0, void 0, function* () {
                    const event = this.eventsCollected[cmd];
                    event.init(socket, this.io, args);
                    event.run();
                }));
            }
        });
    }
    start(port, cb) {
        this.io.listen(port);
        cb();
    }
}
export class ASocket {
    init(s, io, args) {
        this.socket = s;
        this.io = io;
        this.args = args;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
