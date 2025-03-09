export interface ThreatMediaProps {
    id: string,
    threatId: string,
    mediaUrl: string,
    createdAt: Date
    isDeepFake: boolean
}

export class ThreatMedia {
    constructor(private readonly props: Readonly<ThreatMediaProps>){}

    public getValue(){
        return this.props;
    }
}