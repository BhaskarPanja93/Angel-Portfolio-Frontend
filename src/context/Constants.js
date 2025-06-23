export const BACKEND_URL = "https://angelriya.ddns.net"
export const BACKEND_ROUTE = "/portfolio/back"
export const DYNAMIC_ROUTE = "/portfolio/dynamic"

export const RESPONSIVE_CHECK_ROUTE = "/portfolio/back/status/server-responsive";

export const ROUTES = {
    ORIGIN: BACKEND_URL,

    AUTHORITY_CHECK: BACKEND_URL + BACKEND_ROUTE + "/authority/auth-check",
    REFRESH: BACKEND_URL + BACKEND_ROUTE + "/authority/refresh-token",
    SIGN_OUT: BACKEND_URL + BACKEND_ROUTE + "/authority/sign-out",
    SIGN_IN: BACKEND_URL + BACKEND_ROUTE + "/authority/sign-in",

    ALL_CATEGORY_DATA: BACKEND_URL + BACKEND_ROUTE + "/data/fetch/all-category",
    PFP_DATA: BACKEND_URL + BACKEND_ROUTE + "/data/fetch/pfp",
    BANNER_DATA: BACKEND_URL + BACKEND_ROUTE + "/data/fetch/banner",
    SINGLE_CATEGORY_DATA: BACKEND_URL + BACKEND_ROUTE + "/data/fetch/category",
    SINGLE_ILLUSTRATION_DATA: BACKEND_URL + BACKEND_ROUTE + "/data/fetch/illustration",


    CREATE_CATEGORY: BACKEND_URL + BACKEND_ROUTE + "/data/update/category/create",
    CREATE_ILLUSTRATION: BACKEND_URL + BACKEND_ROUTE + "/data/update/illustration/create",
    MODIFY_CATEGORY: BACKEND_URL + BACKEND_ROUTE + "/data/update/category/update",
    MODIFY_ILLUSTRATION: BACKEND_URL + BACKEND_ROUTE + "/data/update/illustration/update",
    MODIFY_PFP: BACKEND_URL + BACKEND_ROUTE + "/data/update/pfp",
    MODIFY_BANNER: BACKEND_URL + BACKEND_ROUTE + "/data/update/banner",
};

