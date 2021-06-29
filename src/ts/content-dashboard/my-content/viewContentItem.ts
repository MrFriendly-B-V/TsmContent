import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";
import { Configuration } from "../../../../node_modules/webpack/types";

export async function loadContentItem() {
    let id = window.sessionStorage.getItem("CONTENT_ITEM_ID");
    if(id == null) {
        window.location.href = "/pages/content-manager/home.html";
        return;
    }

    let getContentDetailsReq = $.ajax({
        url: Config.GET_USER_CONTENT_ENDPOINT + "/" + id,
        method: 'GET',
        processData: false,
        contentType: false,
        headers: {
            'X-Session-Id': Util.getCookie("sessionid")
        }
    });

    getContentDetailsReq.done(e => {
        let r = <Types.IContentResponse> JSON.parse(e);
        if(r.content.length == 0) {
            window.location.href = "/pages/content-manager/home.html";
            return;
        }

        const THUMBNAIL = <HTMLImageElement> document.getElementById('thumbnail');
        THUMBNAIL.src = window.sessionStorage.getItem("CONTENT_ITEM_THUMBNAIL");

        let content = r.content[0];
        const TITLE = <HTMLElement> document.getElementById('title');
        TITLE.innerHTML = content.name;

        const DESCRIPTION = <HTMLElement> document.getElementById('description');
        DESCRIPTION.innerHTML = content.description;
        
        const LOCATIONS = <HTMLElement> document.getElementById("locations");
        content.locations.forEach(location => {
            //TODO get location names and show t hem
        });

        const TIME_BLOCKS = <HTMLElement> document.getElementById('time-blocks');
        let getDayBlockConfigReq = $.ajax({
            url: "/config/day_block_config.json",
            type: 'GET',
            dataType: 'json'
        });

        getDayBlockConfigReq.then(e => {
            let configs = <Types.IDayBlockConfig[]> e;

            configs.forEach(config => {
                let timeBlockElement = document.createElement("div");
                timeBlockElement.title = config.start + " - " + config.end;
                timeBlockElement.innerHTML = config.name;

                content.day_blocks.forEach(timeBlock => {
                    if(timeBlock == config.name) {
                        timeBlockElement.classList.value = "item-selected";
                        timeBlockElement.setAttribute("data-day-block-selected", "true");
                    }
                });

                timeBlockElement.addEventListener("click", _e => {
                    let isSelected = (timeBlockElement.getAttribute("data-day-block-selected") == "true") ? true : false;
                    if(isSelected) {
                        timeBlockElement.setAttribute("data-day-block-selected", "false");
                        timeBlockElement.classList.remove("item-selected");
                    } else {
                        timeBlockElement.setAttribute("data-day-block-selected", "true");
                        timeBlockElement.classList.add("item-selected");
                    }
                });

                TIME_BLOCKS.appendChild(timeBlockElement);
            });
        });
    })
}