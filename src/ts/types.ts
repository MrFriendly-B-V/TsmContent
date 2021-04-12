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
    status:             number;
    user_id:            string;
    company_base64:     string;
    name_base64:        string;
    phone_number:       number;
    addr_street_base64: string;
    addr_postal_base64: string;
    addr_number:        string;
    addr_country:       string;
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