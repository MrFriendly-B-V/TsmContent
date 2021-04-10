//LoginServer
export interface ILoginResponse {
    status:     number;
    message:    string;
    session_id: string;
    expiry:     number;
}

export interface ISessionCheckResponse {
    status:         number;
    user_id:        string;
    email:          string;
}


//UserServer
export interface IGetUserDetailsResponse {
    status:         number;
    user_id:        string;
    email:          string;
    date_of_birth:  number;
    company:        string;
    name:           string;
}


//SubscriptionServer
export interface ISubscriptionResponse {
    status:                 number;
    is_subscribed:          boolean;
    subscription_type:      number;
    subscription_features:  SubscriptionFeature[];
}

export enum SubscriptionFeature {
    CONTENT_BASIC
}


//ContenServer


//LocationServer
export interface IGetUserLocationsResponse {
    status:         number;
    locations:      ILocation[];
}

export interface ILocation {
    id:             string;
    name:           string;
}