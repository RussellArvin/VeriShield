interface ThreatScanProps {
    id: string,
    threatId: string,
    scannedThreats: number,
    createdAt: Date
}

export class ThreatScan {
    constructor(private readonly props: Readonly<ThreatScanProps>){}

    public getValue(): ThreatScanProps{
        return this.props;
    }
}