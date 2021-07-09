import * as Config from "../../config";
import * as Util from "../../util";
import * as $ from "jquery";
import * as Types from "../../types";

export async function loadLocations() {
    let locationReq = $.ajax({
        url: Config.GET_USER_LOCATIONS_ENDPOINT,
        method: 'POST',
        data: {
            session_id: Util.getCookie('sessionid')
        }
    });

    document.getElementById('newLocationBtn').addEventListener("click", _e => window.location.href = "/pages/content-manager/add-location.html");

    locationReq.then(e => {
        let r = <Types.IGetUserLocationsResponse> e
        if(r.status == 200) {
            let locations = r.locations;
            const LOCATION_LIST = document.getElementById('locationList');
            locations.forEach(location => {
                let locationDiv = document.createElement('div');
                locationDiv.classList.value = "locationElement sectionElement";
                locationDiv.id = location.id;

                let thumbnailElement = document.createElement('img');
                thumbnailElement.src = "/img/spinner.gif";
                thumbnailElement.alt = "Thumbnail is still loading!";

                let titleElement = document.createElement('p');
                titleElement.innerHTML = location.name;

                locationDiv.appendChild(thumbnailElement);
                locationDiv.appendChild(titleElement);

                locationDiv.addEventListener("click", _e => {
                    window.location.href = "/pages/content-manager/view-location.html?id=" + location.id;
                });

                LOCATION_LIST.appendChild(locationDiv);
            });
        }
    });
}