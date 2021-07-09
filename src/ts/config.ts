//LoginServer
export const LOGIN_ENDPOINT = "https://login.api.twinsight.media/auth/login";
export const REGISTER_ENDPOINT = "https://login.api.twinsight.media/auth/register";
export const SESSION_ENDPOINT = "https://login.api.twinsight.media/auth/session";
export const LOGOUT_ENDPOINT = "https://login.api.twinsight.media/auth/logout";

//UserServer
export const GET_USER_DETAILS_ENDPOINT = "https://user.api.twinsight.media/user/get";
export const UPDATE_USER_DETAILS_ENDPOINT = "https://user.api.twinsight.media/user/update";
export const NEW_USER_ENDPOINT = "https://user.api.twinsight.media/user/new";

//SubscriptionServer
export const GET_SUBSCRIBTION_ENDPOINT = "https://subscription.api.twinsight.media/subscription/get";

//ContentServer
export const GET_USER_CONTENT_ENDPOINT = "https://content.api.twinsight.media/content/get";
export const UPLOAD_USER_CONTENT_ENDPOINT = "https://content.api.twinsight.media/content/upload";
export const SET_CONTENT_DETAILS_ENDPOINT = "https://content.api.twinsight.media/content/details";
export const GET_CONTENT_THUMBNAIL_ENDPOINT = "https://content.api.twinsight.media/content/image";
export const UPDATE_CONTENT_DETAILS_ENDPOINT = "https://content.api.twinsight.media/content/update";

//LocationServer
export const GET_USER_LOCATIONS_ENDPOINT = "https://location.api.twinsight.media/locations/get";
export const GET_LOCATION_DETAILS_ENDPOINT = "https://location.api.twinsight.media/locations";

//DevicesServer
export const GET_DEVICES_FOR_LOCATION_ENDPOINT = "http://localhost:8080/devices/location";