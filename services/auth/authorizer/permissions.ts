
interface ApiController {
    path: string,
    method: 'GET' | 'PUT' | 'POST' | 'DELETE'
    Roles: Role[]
}

export enum Role {
   client = 'tds-client',
   clerk = 'tds-clerk',
   trancriber = 'tds-transcriber',
   admin = 'tds-admin'
}

export const API_ORDERS_GO_TO_STEP_2: ApiController = {
    path: '/orders/client/go-to-step2',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GO_TO_STEP_3: ApiController = {
    path: '/orders/client/go-to-step3',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GO_TO_STEP_4: ApiController = {
    path: '/orders/client/go-to-step4',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GO_TO_STEP_5: ApiController = {
    path: '/orders/client/go-to-step5',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_PLACE_ORDER: ApiController = {
    path: '/orders/client/place-order',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GET_ORDER: ApiController = {
    path: '/orders/getOrder',
    method: 'GET',
    Roles: [Role.client, Role.clerk, Role.trancriber, Role.admin]
};

export const API_ORDERS_GET_CLIENT_DASHBOARD: ApiController = {
    path: '/orders/getOrder',
    method: 'GET',
    Roles: [Role.client, Role.admin]
};

export const controllers: ApiController[] = [
    API_ORDERS_GO_TO_STEP_2,
    API_ORDERS_GO_TO_STEP_3,
    API_ORDERS_GO_TO_STEP_4,
    API_ORDERS_GO_TO_STEP_5,
    API_ORDERS_PLACE_ORDER,
    API_ORDERS_GET_ORDER,
    API_ORDERS_GET_CLIENT_DASHBOARD
]

export function getControllers(path: string, method: string): ApiController {
    return controllers.find(x => method.includes(x.method) && x.path === path);
}

export function enumFromStringValue<T> (enm: { [s: string]: T}, value: string): T | undefined {
    return (Object.values(enm) as unknown as string[]).includes(value)
      ? value as unknown as T
      : undefined;
  }


