import { Server } from "http";

import { startAppServer } from "./app";

const servers: {server: Server} = startAppServer();
export const server = servers.server;
