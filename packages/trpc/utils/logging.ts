import logger from "@testy/logging";
// import pino from "pino";
import type { Context } from "../server/createContext";

// const logger = pino({});

export const trpcTrace = (ctx: Context, msg: string): void => {
    logger.trace(
        `${ctx.role == 'admin' ? 'ADMIN' : 'USER'} (${ctx.userId}): ${msg}`
    );
}

export const trpcInfo = (ctx: Context, msg: string): void => {
    logger.info(
        `${ctx.role == 'admin' ? 'ADMIN' : 'USER'} (${ctx.userId}): ${msg}`
    );
}

export const trpcWarn = (ctx: Context, msg: string): void => {
    logger.warn(
        `${ctx.role == 'admin' ? 'ADMIN' : 'USER'} (${ctx.userId}): ${msg}`
    );
}

export const trpcError = (ctx: Context, msg: string): void => {
    logger.error(
        `${ctx.role == 'admin' ? 'ADMIN' : 'USER'} (${ctx.userId}): ${msg}`
    );
}