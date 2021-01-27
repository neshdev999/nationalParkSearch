/* Global Variables */

const userApiKey = 'xNbXel9KHm9MZpOzdV2riVYIxBBCMlXNguJBHa6u';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function generateDefaultOutputSection(responseJson) {
    // let outputResponseLength = parseInt(responseJson['limit']);
    let outputResponseLength = responseJson.data.length;
    let parkFullNameArray = [];
    let parkDescArray = [];
    let parkWebURLArray = [];
    let addressLineOneArray = [],
        addressLineTwoArray = [],
        addressLineThreeArray = [],
        addressCityArray = [],
        addressStateCodeArray = [],
        addressPostalCodeArray = [];

    for (let i = 0; i < outputResponseLength; i++) {
        parkFullNameArray.push(responseJson.data[i].fullName);
        parkDescArray.push(responseJson.data[i].description);
        parkWebURLArray.push(responseJson.data[i].url);
        addressLineOneArray.push(responseJson.data[i].addresses[0]['line1']);
        addressLineTwoArray.push(responseJson.data[i].addresses[0]['line2']);
        addressLineThreeArray.push(responseJson.data[i].addresses[0]['line3']);
        addressCityArray.push(responseJson.data[i].addresses[0]['city']);
        addressStateCodeArray.push(responseJson.data[i].addresses[0]['stateCode']);
        addressPostalCodeArray.push(responseJson.data[i].addresses[0]['postalCode']);
    }


    for (let j = 0; j < outputResponseLength; j++) {
        $('#outputParkList').append(`<div class="parkOutputStylesHolder"><div><div class="parkNameIndicatorStyles">Park [${j+1}]</div> <div class="parkName"> ${parkFullNameArray[j]}</div>
        <div class="parkDesc">${parkDescArray[j]}</div>
                                          <div class="parkURL"><a href="${parkWebURLArray[j]}">${parkWebURLArray[j]}</a></div>
                                          <div class="parkAddress">
                                          <div class="parkAddressContactHeader">CONTACT THE PARK</div>
                                      
                                          <div>${addressLineOneArray[j]}</div>
                                          <div>${addressLineTwoArray[j]}</div>
                                          <div>${addressLineThreeArray[j]}</div>
                                          <div>${addressCityArray[j]}</div>
                                          <div>${addressStateCodeArray[j]}</div>
                                          <div>${addressPostalCodeArray[j]}</div>
                                          </div>
                                    </div>`);


    }
}



function formatQueryParams(params) {
    // const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`);
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getParksData(countryCodes, maxResults) {
    const params = {
        api_key: userApiKey,
        limit: maxResults,
        stateCode: countryCodes
    }
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            generateDefaultOutputSection(responseJson);
            console.log(JSON.stringify(responseJson));
        })
        .catch(err => {
            $('#serverErrorReportContainer').text(`Something went wrong : ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();

        // Remove placeholder header
        if ($('#outputParkList').length) {
            $("#outputParkList").empty();
        }

        // make error report field blank
        $('#serverErrorReportContainer').css('display', 'none');
        $('#serverErrorReportContainer').text("");

        // Hide DefaultView Header
        $('.defaultViewHeader').css('display', 'none');

        // const searchTerm = $('#parkSearchTermInput').val();
        const countryStateCheckboxes = $(".statesList").find("input:checked");
        let selectedCountryCodes = [];
        for (let i = 0; i < countryStateCheckboxes.length; i++) {
            let stringCurrentVal = i.toString();
            selectedCountryCodes.push(countryStateCheckboxes[stringCurrentVal].value);
        }
        const selectedMaxResults = $('#parkSearchMaxResultsInput').val();

        let commaSeperatedCountryCodes = selectedCountryCodes.join(',');
        // console.log("SelectedMaxResults: " + selectedMaxResults);
        // console.log(countryStateCheckboxes['0'].value);
        // console.log(countryStateCheckboxes);
        // console.log(selectedCountryCodes);
        // console.log(searchTerm);
        // console.log(commaSeperatedCountryCodes);
        $('.defaultViewHeader').text(`${commaSeperatedCountryCodes} National Parks`);
        // show DefaultView Header
        $('.defaultViewHeader').css('display', 'block');

        getParksData(commaSeperatedCountryCodes, selectedMaxResults);


    });
}

/*Footer*/

function generateFooter() {
    const githubUserFooterBase = githubUserFooter();
    $('#footer').append(githubUserFooterBase);
}

function githubUserFooter() {
    return `<div class="footContain"><div class="footStyles"><span>&nbsp;The National Parks Search Panel&nbsp;&nbsp;<br></span><span>Nesh &copy; ${getCopyRightYear()}</span></div></div>`;
}

function getCopyRightYear() {
    return new Date().getFullYear();
}

$(window).bind("load", function() {
    var footerHeight = 0,
        footerTop = 0,
        $footer = $("#footer");
    positionFooter();

    function positionFooter() {
        footerHeight = $footer.height();
        footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";
        if (($(document.body).height() + footerHeight) < $(window).height()) {
            $footer.css({
                position: "absolute"
            }).animate({
                top: footerTop
            })
        } else {
            $footer.css({
                position: "static"
            })
        }
    }
    $(window)
        .scroll(positionFooter)
        .resize(positionFooter)
});

function clearContent() {
    // Uncheck all checkboxes on page load    
    $(':checkbox:checked').prop('checked', false);
    $('#parkSearchMaxResultsInput').val('10');
}

/* Initialize Application */
$(function() {

    console.log('App loaded! Waiting for submit!');
    clearContent();
    getParksData('NC', '5');
    watchForm();
    generateFooter();
});