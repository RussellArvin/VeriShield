type QuickResponseType = "press" | "social" | "email" | "disclaimer"

const APP_ROUTES = {
    LANDING: '/',
    CLERK_WEBHOOK:"/api/clerk",
    DOCS:"/docs",
    APP:{
        THREAT_MONITOR: {
            HOME:'/app/threat-monitor',
            ITEM: (id: string) => { return `/app/threat-monitor/${id}` }
        },
        HOME:'/app',
        RESPONSE_CENTRE: {
            HOME: '/app/response-centre',
            ITEM: (id: string) => { return `/app/response-centre/${id}`}
        },
        QUICK_RESPONSE: (id: string,type:QuickResponseType) => {return `/app/quick-response/${id}?format=${type}`}
    }
}

export default APP_ROUTES;