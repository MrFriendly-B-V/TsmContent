
export async function step4() {
    let uploadSuccessStatus = window.sessionStorage.getItem("uploadSuccessStatus");
    if(uploadSuccessStatus == null) {
        window.location.href = "/pages/content-manager/home.html";
        return;
    }

    const STEP_4_HOLDER = document.getElementById('step4');
    STEP_4_HOLDER.classList.remove("defaultNoShow");
    STEP_4_HOLDER.setAttribute("aria-hidden", "false");

    const STATUS_FIELD = document.getElementById('step4StatusField');
    const BUTTON = document.getElementById('step4ContinueBtn');

    let continueUrl: string;
    switch (Number.parseInt(uploadSuccessStatus)) {
        case 0:
            STATUS_FIELD.innerHTML = "Your video has been uploaded!";
            continueUrl = "/pages/content-manager/home.html";
            BUTTON.innerHTML = "Done";

            window.sessionStorage.removeItem('userDetailsCompleted')
            window.sessionStorage.removeItem('selectedLocations')
            window.sessionStorage.removeItem('selectedDayBlocks')
            break;
        case 1:
        default:
            STATUS_FIELD.innerHTML = "Something went wrong, please try again later";
            continueUrl = "/pages/content-manager/add-content.html?step=3";
            BUTTON.innerHTML = "Try again";
            break;
    }

    BUTTON.addEventListener("click", (_e) => {
        window.location.href = continueUrl;
    })
}