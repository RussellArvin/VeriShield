export interface ThreatProps {
    id: string,
    userId: string,
    description: string,
    sourceUrl: string,
    source: string,
    createdAt: Date,
    status: string
    factCheckerUrl: string,
    factCheckerDescription: string
    responseId: string | null
}

export class Threat {
    constructor(private readonly props: Readonly<ThreatProps>){}

    public getValue(): ThreatProps{
        return this.props;
    }

    public setResponseId(responseId: string){
        return new Threat({
            ...this.props,
            responseId
        })
    }
}