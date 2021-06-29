import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";

export async function loadUserContent() {
    //Make the '+' button functional
    document.getElementById('newContentBtn').addEventListener("click", _e => {
        window.location.href = "/pages/content-manager/add-content.html?step=0";
    });

    //Load the user's media content
    let getContentReq = $.ajax({
        url: Config.GET_USER_CONTENT_ENDPOINT,
        method: 'GET',
        processData: false,
        contentType: false,
        headers: {
            'X-Session-Id': Util.getCookie("sessionid")
        }
    });

    getContentReq.done(e => {
        const CONTENT_SECTION = document.getElementById('contentList');
        let r = <Types.IContentResponse> JSON.parse(e);
        for(let i = 0; i < r.content.length; i++) {

            let contentEntry = r.content[i];
            let contentDomElement = document.createElement('div');
            contentDomElement.id = contentEntry.id;
            contentDomElement.classList.value = "contentElement";

            let thumbnailDomElement = document.createElement('img');
            //thumbnailDomElement.src = "data:image/png;base64, " + contentEntry.thumbnail;
            thumbnailDomElement.src = "/img/spinner.gif";
            thumbnailDomElement.alt = contentEntry.name + " Thumbnail Failed to load";
            thumbnailDomElement.classList.value = "contentElementThumbnail";

            let titleDomElement = document.createElement('p');
            titleDomElement.innerHTML = contentEntry.name;
            titleDomElement.classList.value = "contentElementName";

            contentDomElement.appendChild(thumbnailDomElement);
            contentDomElement.appendChild(titleDomElement);

            contentDomElement.addEventListener("click", _e => {
                window.sessionStorage.setItem("CONTENT_ITEM_THUMBNAIL", thumbnailDomElement.src);
                window.sessionStorage.setItem("CONTENT_ITEM_ID", contentEntry.id);
                window.location.href = "/pages/content-manager/view-content-item.html";
            });

            CONTENT_SECTION.appendChild(contentDomElement);

            let thumbnailRequest = $.ajax({
                url: Config.GET_CONTENT_THUMBNAIL_ENDPOINT + "/" + contentEntry.id,
                method: 'GET',
                headers: {
                    'X-Session-Id': Util.getCookie("sessionid")
                }
            });

            thumbnailRequest.done(e => {
                let r = <Types.IImageResponse> JSON.parse(e);
                if(r.status == 200) {
                    if(r.data != "") {
                        thumbnailDomElement.src = "data:image/png;base64, " + r.data;            
                    } else {
                        thumbnailDomElement.src = "/img/cross_icon.png";
                        thumbnailDomElement.title = "Failed to load image!";
                    }
                } else {
                    thumbnailDomElement.src = "/img/cross_icon.png";
                    thumbnailDomElement.title = "Failed to load image!";
                }
            })

            thumbnailRequest.fail(_e => {
                thumbnailDomElement.src = "/img/cross_icon.png";
                thumbnailDomElement.title = "Failed to load image!";
            });
        }
    });

    getContentReq.fail(e => {
        switch(e.status) {
            case 401: window.location.href = "";
            case 502: alert("Failed to load content: " + e.responseText);
        }
    })
}