const APP_ROUTES = {
    LANDING: '/',
    CLERK_WEBHOOK:"/api/clerk",
    DOCS:"/docs",
    APP:{
        HOME:'/app',
        RESPONSE_CENTRE: {
            HOME: '/app/response-centre',
            ITEM: (id: string) => { return `/app/response-centre/${id}`}
        }
    }
}

export default APP_ROUTES;