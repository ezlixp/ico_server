import { createServer } from 'http';
import { Server } from 'socket.io';
import validateSocket from './sockets/security/socketValidator.js';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from './types/socketIOTypes.js';
import { createExpressServer, useContainer } from 'routing-controllers';
import { HealthController } from './modules/health/health.controller.js';
import { UserController } from './modules/users/user.controller.js';
import { TsyringeAdapter } from './container.js';
import { container } from 'tsyringe';

useContainer(new TsyringeAdapter(container));
const app = createExpressServer({
    controllers: [HealthController, UserController],
    middlewares: [],
});
const server = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server);

io.on('new_namespace', (namespace) => {
    namespace.use(validateSocket);
});

export { io, server };
export default app;
