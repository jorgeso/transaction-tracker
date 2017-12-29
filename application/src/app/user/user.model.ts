interface IUser {
    uid: string;
    displayName: string;
    email: string;
    accounts?: any;
}

export class User {
    uid: string;
    displayName: string;
    email: string;
    accounts?: any;

    constructor(user?: IUser){
        if (user != null) {
            this.uid = user.uid;
            this.displayName = user.displayName;
            this.email = user.email;
            this.accounts = user.accounts || {};
        }
    }
}