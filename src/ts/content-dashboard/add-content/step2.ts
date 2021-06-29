import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";

export function step2() {
    if(window.sessionStorage.getItem('userDetailsCompleted') == null) {
        window.location.href = "/pages/content-manager/add-content.html?step=0";
    }

    if(window.sessionStorage.getItem('selectedLocations') == null) {
        window.location.href = "/pages/content-manager/add-content.html?step=1";
    }

    //Fetch the user's subscriptions so we know what we should show
    let loadUserSubscription = $.ajax({
        url: Config.GET_SUBSCRIBTION_ENDPOINT,
        method: 'POST',
        data: {
            session_id: Util.getCookie("sessionid")
        }
    });

    loadUserSubscription.done(async (e) => {
        let subscriptionResponse = <Types.ISubscriptionResponse> e;

        //The user isn't subscribed, redirect them to the place where they can do so
        if(subscriptionResponse.subscription_type != Types.SubscriptionType.Active) {
            //TODO redirect to subscribe page
            alert("SubscriptionType != ACTIVE")
            return;
        }
        
        //TODO Mocking the API here, since the two subscription features dont yet exist on the server
        subscriptionResponse.subscription_features = [ Types.SubscriptionFeature.TimeBasic, Types.SubscriptionFeature.TimeHourBlocks ];
        loadSubscriptionEnabledFeatures(subscriptionResponse.subscription_features);

        document.getElementById('step2ResetBtn').addEventListener("click", (_e) => {
            removeTimeSelectFeature(null);
            loadSubscriptionEnabledFeatures(subscriptionResponse.subscription_features);
        });

        document.getElementById('step2PreviousBtn').addEventListener("click", (_e) => window.location.href = "/pages/content-manager/add-content.html?step=1");
        document.getElementById('step2ContinueBtn').addEventListener("click", (_e) => {
            let anyTimeSelected = false;

            dayblocks: {
                window.sessionStorage.removeItem("selectedDayBlocks");

                let selectedDayBlocks = document.querySelectorAll("[data-day-block-selected=true]");
                if(selectedDayBlocks == null) {
                    break dayblocks;
                }

                let selectedDayBlockNames: string[] = new Array();
                selectedDayBlocks.forEach((e) => {
                    anyTimeSelected = true;
                    selectedDayBlockNames.push(e.innerHTML);
                });

                window.sessionStorage.setItem("selectedDayBlocks", selectedDayBlockNames.join(","));
            }

            timeslots: {
                window.sessionStorage.removeItem("selectedTimeSlots");

                let timeslotsSelectElement = <HTMLSelectElement> document.getElementById("select-time-slots");
                if(timeslotsSelectElement == null) {
                    break timeslots;
                }

                let selectedOptions = timeslotsSelectElement.selectedOptions;
                let selectedOptionIds: string[] = new Array();
                for(let i = 0; i < selectedOptions.length; i++) {
                    anyTimeSelected = true;
    
                    let option = selectedOptions[i];
                    selectedOptionIds.push(option.value);
                }

                window.sessionStorage.setItem("selectedTimeSlots", selectedOptionIds.join(","));
            }

            //The user must select at least one option somewhere, inform they if they haven't
            if(!anyTimeSelected) {
                let statusField = document.getElementById("step2StatusField");
                statusField.innerHTML = "You must select at least one option.";
                statusField.classList.value = "statusField warningRed";
                statusField.style.visibility = 'visible';

                return;
            }

            window.location.href = "/pages/content-manager/add-content.html?step=3";
        });
        
        const STEP_2_HOLDER = document.getElementById('step2');

        //Make the Step2 holder visible
        STEP_2_HOLDER.classList.remove("defaultNoShow");
        STEP_2_HOLDER.setAttribute("aria-hidden", "false");
    });
}

/**
 * Add the elements for the TimeHourBlocks subsription feature flag
 */
function loadFeatureTimeHourBlocks() {
    const STEP_2_HOLDER = document.getElementById("step2TimeslotHolder");

    //Create the header, informing the user what this is
    let timeBlocksHeader = document.createElement("h3");
    timeBlocksHeader.innerHTML = "Timeslots";
    timeBlocksHeader.setAttribute("data-feature-name", "TIME_HOUR_BLOCKS");
    STEP_2_HOLDER.appendChild(timeBlocksHeader);

    //Create a <select> element where the user can choose the timeslots
    let selectTimeSlotsElement = document.createElement("select");
    selectTimeSlotsElement.multiple = true;
    selectTimeSlotsElement.id = "select-time-slots";
    selectTimeSlotsElement.setAttribute("data-feature-name", "TIME_HOUR_BLOCKS");

    //When the user selects an option (i.e, the 'change' event),
    //we then want to remove all other Feature elements, to avoid overlaps etc
    selectTimeSlotsElement.addEventListener("change", (_e) => {
        if(selectTimeSlotsElement.selectedOptions.length > 0) {
            removeTimeSelectFeature(Types.SubscriptionFeature.TimeHourBlocks);
        } else {
            loadFeatureTimeBasic();
        }
    });

    //Populate the above created select element with 24 (For every hour an option) option elements.
    for(let i = 0; i < 24; i++) {
        let beginDateHour = i.toString();
        let endDateHour = (i+1).toString();

        //If the endDateHour would be '24', we want it to be '0'
        if(i+1 == 24) {
            endDateHour = "0";
        }

        //Make sure that the beginDateHour always is double digit, so '1' becomes '01'
        if(i < 10) {
            beginDateHour = "0" + beginDateHour;
        }

        //Make sure that the endDateHour is always double digit.
        //We cant merge this into the if-block above, because that'd give '010' as the endDateHour,
        //because the beginDateHour would be under 10, but the endDateHour isn't.
        if(i+1 < 10) {
            endDateHour = "0" + endDateHour;
        }

        let optionElem = document.createElement("option");
        optionElem.value = i.toString();
        optionElem.innerHTML = beginDateHour + ":00 - " + endDateHour + ":00"; 
        optionElem.setAttribute("data-feature-name", "TIME_HOUR_BLOCKS");

        selectTimeSlotsElement.appendChild(optionElem);
    }

    STEP_2_HOLDER.appendChild(selectTimeSlotsElement);
}

/**
 * Add the elements for the TimeBasic subscription feature flag
 */
async function loadFeatureTimeBasic() {
    const STEP_2_HOLDER = document.getElementById("step2DayBlockholder");
    
    //Fetch the configuration for the Day Blocks
    let getDayBlockConfigReq = $.ajax({
        url: "/config/day_block_config.json",
        type: 'GET',
        dataType: 'json'
    });

    //Add a header informing the user what this is
    let dayBlockHeader = document.createElement("h3");
    dayBlockHeader.innerHTML = "Day blocks:";
    dayBlockHeader.setAttribute("data-feature-name", "TIME_BASIC");
    STEP_2_HOLDER.appendChild(dayBlockHeader);

    //Create a holder for the different Day Blocks to fall under
    let datBlockHolder = document.createElement('div');
    datBlockHolder.setAttribute("data-feature-name", "TIME_BASIC");
    datBlockHolder.classList.value = "blockSelection";

    let result = <Types.IDayBlockConfig[]> await getDayBlockConfigReq;

    for(let i = 0; i < result.length; i++) {
        let dayBlockConfigEntry = result[i];
        
        //Create a dayblock item for the user to click
        let dayBlockItem = document.createElement("div");

        //Tooltip for the user, visible when they hover
        dayBlockItem.title = dayBlockConfigEntry.start + " - " + dayBlockConfigEntry.end;
        
        dayBlockItem.classList.value = "item";
        dayBlockItem.setAttribute("data-feature-name", "TIME_BASIC");
        dayBlockItem.innerHTML = dayBlockConfigEntry.name;

        //When the user clicks the item, we want to toggle between selected and unselected
        dayBlockItem.addEventListener("click", (_e) => {
            let isSelected = (dayBlockItem.getAttribute("data-day-block-selected") == "true") ? true : false;
            if(isSelected) {
                dayBlockItem.setAttribute("data-day-block-selected", "false");
                dayBlockItem.classList.remove("item-selected");
                
                if(document.querySelectorAll("[data-day-block-selected=true]").length == 0) {
                    loadFeatureTimeHourBlocks();
                }
            } else {
                dayBlockItem.setAttribute("data-day-block-selected", "true");
                dayBlockItem.classList.add("item-selected");

                //Besides changing the value, we also want to remove the other time selection elemenets
                //to prevent overlapping/contradicting time values
                removeTimeSelectFeature(Types.SubscriptionFeature.TimeBasic);
            }
        });

        datBlockHolder.appendChild(dayBlockItem);
    }

    STEP_2_HOLDER.appendChild(datBlockHolder);
}

/**
 * Remove all elements that do not belong to the feature that should be kept
 * @param keep The Feature elements to keep
 */
function removeTimeSelectFeature(keep: Types.SubscriptionFeature) {
    let items = document.querySelectorAll("*[data-feature-name]");

    items.forEach((item) => {
        if(keep != null && item.getAttribute("data-feature-name") != keep) {
            item.remove();
        } else if(keep == null) {
            item.remove();
        }
    });
}

async function loadSubscriptionEnabledFeatures(features: Types.SubscriptionFeature[]) {
    for(let i = 0; i < features.length; i++) {
        let feature = features[i];
        switch(feature) {

            //This feature flag allows a user to only select basic day blocks
            //E.g 'Morning', 'Afternoon', etc
            case Types.SubscriptionFeature.TimeBasic:
                await loadFeatureTimeBasic();
                break;

            //This feature flag allows a user to select time slots,
            //E.g 1PM-2PM, 1PM-4PM etc. Users can select multiple too.
            case Types.SubscriptionFeature.TimeHourBlocks:
                loadFeatureTimeHourBlocks();
                break;
        }
    }
}