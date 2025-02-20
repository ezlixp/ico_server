import { Router } from 'express';

/* eslint-disable */
// This is bad code.

const ROUTE_METADATA_KEY = Symbol('routesMetadata');

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RouteMetadata {
    method: HttpMethod;
    path: string;

    handler: Function;
}

function registerRoute(method: HttpMethod, path: string) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        const metadata: RouteMetadata = {
            method,
            path,
            handler: descriptor.value,
        };

        if (!target[ROUTE_METADATA_KEY]) {
            target[ROUTE_METADATA_KEY] = [];
        }

        target[ROUTE_METADATA_KEY].push(metadata);
    };
}

export const HttpGet = (path: string = '/') => {
    return registerRoute('get', path);
};

export const HttpPost = (path: string = '/') => {
    return registerRoute('post', path);
};

export const HttpPut = (path: string = '/') => {
    return registerRoute('put', path);
};

export const HttpPatch = (path: string = '/') => {
    return registerRoute('patch', path);
};

export const HttpDelete = (path: string = '/') => {
    return registerRoute('delete', path);
};

export const createRouter = (controller: any): Router => {
    const router = Router();
    const routes = controller.prototype[Symbol.for('routesMetadata')] || [];

    routes.forEach((route: any) => {
        const { method, path, handler } = route;

        switch (method) {
            case 'get':
                router.get(path, handler);
                break;
            case 'post':
                router.post(path, handler);
                break;
            case 'put':
                router.put(path, handler);
                break;
            case 'patch':
                router.patch(path, handler);
                break;
            case 'delete':
                router.delete(path, handler);
                break;
        }
    });

    return router;
};
