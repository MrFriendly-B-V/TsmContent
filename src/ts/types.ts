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
    subscription_type:      SubscriptionType;
    subscription_features:  SubscriptionFeature[];
}

export enum SubscriptionType {
    Active =            "ACTIVE",
    RequiresPayment =   "REQUIRES_PAYMENT",
    Ended =             "ENDED"
}

export enum SubscriptionFeature {
    ContentBasic =      "CONTENT_BASIC",
    DeviceBasic =       "DEVICE_BASIC",
    TimeBasic =         "TIME_BASIC",
    TimeHourBlocks =    "TIME_HOUR_BLOCKS",
}


//ContenServer
export interface IContentResponse {
    status:         number,
    content:        IContentElement[]
}

export interface IContentElement {
    id:             string,
    name:           string,
    description:    string,
    locations:      string[],
    day_blocks:     string[],
    time_slots:     string[]
}

export interface IImageResponse {
    status:         number,
    data:           string
}

//LocationServer
export interface IGetUserLocationsResponse {
    status:         number;
    locations:      ILocation[];
}

export interface ILocation {
    id:             string;
    name:           string;
}

export interface IGetLocationDetailsResponse {
    name:           string
}

// Local config
export interface IDayBlockConfig {
    name:       string;
    start:      string;
    end:        string;
}

//Device Server
export interface IDevice {
    id:             string;
    name:           string;
    description:    string;
}

export interface IDeviceResponse {
    devices:        IDevice[]
}