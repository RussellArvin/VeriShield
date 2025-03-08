export interface UserProps {
    id: string;
    firstName: string,
    lastName: string
    email: string;
    keywords: string[];
    persona: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class User{
    constructor(private readonly props: Readonly<UserProps>){}

    public getValue(): UserProps{
        return this.props;
    }
}