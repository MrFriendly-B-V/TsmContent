export interface LoginResponse {
    sessionid:          string;
    userid:             string;
    accountexists:      boolean;
    login:              boolean;
}

export interface UserResponse {
    success:            boolean;
    email:              string;
}