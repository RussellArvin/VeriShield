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
    analysis: string | null
}

export class Threat {
    factCheckerUrl: string | undefined;
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
    
    public setAnalysis(analysis: string){
        return new Threat({
            ...this.props,
            analysis
        })
    }
}