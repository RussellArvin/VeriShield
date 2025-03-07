export interface ThreatProps {
    id: string,
    userId: string,
    description: string,
    sourceUrl: string,
    createdAt: Date,
    status: string
}

export class Threat {
    constructor(private readonly props: Readonly<ThreatProps>){}

    public getValue(): ThreatProps{
        return this.props;
    }
}