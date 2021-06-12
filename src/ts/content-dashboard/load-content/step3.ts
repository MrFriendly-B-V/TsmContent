import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";

interface IVideoDetailsForm extends HTMLFormElement {
    videoName:          HTMLInputElement,
    videoDescription:   HTMLTextAreaElement
}

interface IVideoUploadForm extends HTMLFormElement {
    uploadContent:      HTMLInputElement
}

export async function step3() {
    if(window.sessionStorage.getItem('userDetailsCompleted') == null) {
        window.location.href = "/pages/content-manager/add-content.html?step=0";
    }

    if(window.sessionStorage.getItem('selectedLocations') == null) {
        window.location.href = "/pages/content-manager/add-content.html?step=1";
    }

    if(window.sessionStorage.getItem("selectedDayBlocks") == null && window.sessionStorage.getItem('selectedTimeSlots') == null) {
        window.location.href = "/pages/content-manager/add-content.html?step=2";
    }

    const STEP_3_HOLDER = document.getElementById('step3');
    STEP_3_HOLDER.classList.remove("defaultNoShow");
    STEP_3_HOLDER.setAttribute("aria-hidden", "false");
    const VIDEO_DETAILS_FORM = <IVideoDetailsForm> document.getElementById('step3EnterVideoDetails');

    document.getElementById('upload-btn').addEventListener("click", (_e) => {
        document.getElementById('uploadContent').click();
    });

    const STEP_3_UPLOAD_FILE_NAME_ELEM = document.getElementById('step3UploadFileName'); 
    document.getElementById('uploadContent').addEventListener("change", (e) => {
        let elem = <HTMLInputElement> e.target;
        let fileStr = elem.value;
        if(fileStr == null || fileStr == "") {
            return;
        }

        let fileName = fileStr.replace("C:\\fakepath\\", "");
        if(VIDEO_DETAILS_FORM.videoName.value == "") {
            VIDEO_DETAILS_FORM.videoName.value = fileName;
        }

        STEP_3_UPLOAD_FILE_NAME_ELEM.innerHTML = fileName;
    });

    document.getElementById('step3PreviousBtn').addEventListener("click", (_e) => window.location.href = "/pages/content-manager/add-content.html?step=2");
    document.getElementById('step3ContinueBtn').addEventListener("click", async (_e) => {
        //Verify the name is filled in
        if(VIDEO_DETAILS_FORM.videoName.value == null || VIDEO_DETAILS_FORM.videoName.value == "") {
            let statusField = document.getElementById("step3StatusField");
            statusField.innerHTML = "You need to enter the name of your content.";
            statusField.classList.value = "statusField warningRed statusFieldNoBorder";
            statusField.style.visibility = 'visible';
            
            return;
        }

        let videoIdentifier = Util.randomString(32);

        let videoUploadForm = <IVideoUploadForm> document.getElementById('step3VideoUpload');

        if(videoUploadForm.uploadContent.files.length == 0) {
            let statusField = document.getElementById("step3StatusField");
            statusField.innerHTML = "Please select the content you want to upload.";
            statusField.classList.value = "statusField warningRed statusFieldNoBorder";
            statusField.style.visibility = 'visible';
            
            return;
        }

        let videoDetailsReq = $.ajax({
            method: 'POST',
            url: Config.SET_CONTENT_DETAILS_ENDPOINT,
            data: {
                session_id: Util.getCookie('sessionid'),
                identifier: videoIdentifier,
                video_name: VIDEO_DETAILS_FORM.videoName.value,
                video_description: (VIDEO_DETAILS_FORM.videoDescription.value != "") ? VIDEO_DETAILS_FORM.videoDescription.value : null,
                locations: window.sessionStorage.getItem('selectedLocations'),
                day_blocks: window.sessionStorage.getItem('selectedDayBlocks'),
                time_slots: window.sessionStorage.getItem('selectedTimeSlots'),
            }
        });

        let videoUploadReq = $.ajax({
            method: 'POST',
            url: Config.UPLOAD_USER_CONTENT_ENDPOINT + "/" + videoIdentifier,
            data: new FormData(videoUploadForm),
            processData: false,
            contentType: false,
            headers: {
                'X-Session-Id': Util.getCookie("sessionid")
            }
        });

        //TODO show a spinner

        await videoDetailsReq;
        await videoUploadReq;

        //TODO hide the spinner

        window.sessionStorage.setItem("uploadSuccessStatus", "0");
        window.location.href = "/pages/content-manager/add-content.html?step=4";
    });
}
