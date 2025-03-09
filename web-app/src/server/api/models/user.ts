export interface UserProps {
    id: string;
    firstName: string,
    lastName: string
    email: string;
    keywords: string[];
    persona: string | null;
    createdAt: Date;
    updatedAt: Date;
    canScan: boolean;
}

export class User{
    constructor(private readonly props: Readonly<UserProps>){}

    public getValue(): UserProps{
        return this.props;
    }

    public updateDetails(
        firstName: string,
        lastName: string,
        keywords: string[],
        persona: string
    ){
        return new User({
            ...this.props,
            firstName,
            lastName,
            keywords,
            persona
        })
    }
}