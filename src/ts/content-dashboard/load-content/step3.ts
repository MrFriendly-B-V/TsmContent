import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";

interface IVideoDetailsForm extends HTMLFormElement {
    videoName:          HTMLInputElement,
    videoDescription:   HTMLTextAreaElement
}

interface IVideoUploadForm extends HTMLFormElement {
    contentIdentifier:  HTMLInputElement,
    uploadContent:      HTMLInputElement
}

export function step3() {
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

    document.getElementById('upload-btn').addEventListener("click", (_e) => {
        document.getElementById('uploadContent').click();
    });

    document.getElementById('step3ContinueButton').addEventListener("click", (_e) => {
        //Verify the name is filled in
        let videoDetailsForm = <IVideoDetailsForm> document.getElementById('step3EnterVideoDetails');

        if(videoDetailsForm.videoName.value == null || videoDetailsForm.videoName.value == "") {
            let statusField = document.getElementById("step3StatusField");
            statusField.innerHTML = "You need to enter the name of your content.";
            statusField.classList.value = "statusField warningRed";
            statusField.style.visibility = 'visible';
            
            return;
        }

        let videoIdentifier = Util.randomString(32);

        let videoUploadForm = <IVideoUploadForm> document.getElementById('step3VideoUpload');
        videoUploadForm.contentIdentifier.value = videoIdentifier;

        if(videoUploadForm.uploadContent.files.length == 0) {
            let statusField = document.getElementById("step3StatusField");
            statusField.innerHTML = "Please select the content you want to upload.";
            statusField.classList.value = "statusField warningRed";
            statusField.style.visibility = 'visible';
            
            return;
        }

        $.ajax({
            method: 'POST',
            url: Config.SET_CONTENT_DETAILS_ENDPOINT,
            data: {
                identifier: videoIdentifier,
                video_name: videoDetailsForm.videoName.value,
                video_description: (videoDetailsForm.videoDescription.value != "") ? videoDetailsForm.videoDescription.value : null,
                locations: window.sessionStorage.getItem('selectedLocations'),
                day_blocks: window.sessionStorage.getItem('selectedDayBlocks'),
                time_slots: window.sessionStorage.getItem('selectedTimeSlots'),
            }
        });

        $.ajax({
            method: 'POST',
            url: Config.UPLOAD_USER_CONTENT_ENDPOINT,
            data: new FormData(videoUploadForm),
            processData: false,
            contentType: false,

        });

        window.sessionStorage.setItem('identifier', videoIdentifier)
    });
}
