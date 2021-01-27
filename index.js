/* Global Variables */

const userApiKey = 'xNbXel9KHm9MZpOzdV2riVYIxBBCMlXNguJBHa6u';
// const userApiKey = 'xNb';
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
    $('#outputParkList').removeClass('hidden');
}



function formatQueryParams(params) {
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
            $('#serverErrorReportContainer').text(`Server has responded with error 😪  : ${err.message} 😫`);
            $('#serverErrorReportContainer').css('display', 'block');
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();

        // Remove placeholder header
        if ($('#outputParkList').length) {
            $("#outputParkList").empty();
        }

        // Hide DefaultView Header
        $('.defaultViewHeader').css('display', 'none');

        // make error report field blank
        $('#serverErrorReportContainer').css('display', 'none');
        $('#serverErrorReportContainer').empty();

        const countryStateCheckboxes = $(".statesList").find("input:checked");
        let selectedCountryCodes = [];
        for (let i = 0; i < countryStateCheckboxes.length; i++) {
            let stringCurrentVal = i.toString();
            selectedCountryCodes.push(countryStateCheckboxes[stringCurrentVal].value);
        }
        const selectedMaxResults = $('#parkSearchMaxResultsInput').val();
        let commaSeperatedCountryCodes = selectedCountryCodes.join(',');
        $('.defaultViewHeader').text(`${commaSeperatedCountryCodes} National Parks`);
        // show DefaultView Header
        $('.defaultViewHeader').css('display', 'block');
        getParksData(commaSeperatedCountryCodes, selectedMaxResults);
    });
}

/*Footer*/

function generateFooter() {
    const parkUserFooterBase = parkUserFooter();
    $('#footer').append(parkUserFooterBase);
}

function parkUserFooter() {
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
    // make error report field blank
    $('#serverErrorReportContainer').css('display', 'none');
    $('#serverErrorReportContainer').empty();

}



/* Initialize Application */
$(function() {
    console.log('App loaded! Waiting for submit!');
    clearContent();
    getParksData('NC,DC,NY', '10');
    watchForm();
    generateFooter();
});