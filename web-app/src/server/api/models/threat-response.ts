export interface ThreatResponseProps {
    id: string,
    threatId: string,
    type: string,
    response: string,
    createdAt: Date,
    updatedAt: Date
}

export class ThreatResponse{
    constructor(private readonly props: Readonly<ThreatResponseProps>){}

    public getValue(): ThreatResponseProps{
        return this.props;
    }
}