
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
    path: '/orders/goToStep2',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GO_TO_STEP_3: ApiController = {
    path: '/orders/goToStep3',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GO_TO_STEP_4: ApiController = {
    path: '/orders/goToStep4',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_GO_TO_STEP_5: ApiController = {
    path: '/orders/goToStep5',
    method: 'POST',
    Roles: [Role.client, Role.admin]
};

export const API_ORDERS_PLACE_ORDER: ApiController = {
    path: '/orders/placeOrder',
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


