import { Request } from "express";
import { GraphQLParams } from "graphql-helix";
import { log, LogSeverity } from "./core/logging";

/**
 * GraphQL execution context.
 * @see https://graphql.org/learn/execution/
 */
export class Context extends Map<symbol, unknown> {
    readonly #req: Request;
    readonly params: GraphQLParams;

    constructor(req: Request, params: GraphQLParams) {
        super();
        this.#req = req;
        this.params = params;
    }

    log(severity: LogSeverity, data: string | Record<string, unknown> | Error): void {
        log(this.#req, severity, data, this.params);
    }
}
