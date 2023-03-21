
/*

--------------------------------------------------------------------------------------------------------------------------------------------------------
    ---------                 ------           \                                /     |       _/      |     |\_                 |   ---------------
    |        \               /      \           \                              /      |     _/        |     |  \_               |   |
    |         \             /        \           \                            /       |   _/          |     |    \_             |   |
    |          \           /          \           \                          /        | _/            |     |      \_           |   |
    |           |         /            \           \                        /         |/              |     |        \_         |   ---------------
    |          /         /--------------\           \                      /          |\_             |     |          \_       |                 |
    |         /         /                \           \         /\         /           |  \_           |     |            \_     |                 |
    |        /         /                  \           \       /  \       /            |    \_         |     |              \_   |                 |
    |       /         /                    \           \     /    \     /             |      \_       |     |                \_ |                 |
    --------         /                      \           -----      -----              |        \      |     |                  \|   ---------------
---------------------------------------------------------------------------------------------------------------------------------------------------------

*/

// This code is property and under the sole declaration of Jeremiah Booker

// Initiate Jquery

// Load the script
var script = document.createElement("SCRIPT");
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);
//

// Declaration of Variables

const domain = "dawkinspgh.com"; // Domain for filtering purposes
const tableName = "DawkinsClicked"; // Clicked DB
const table = "DawkinsMain"; // Normal DB
const tableSecond = "DawkinsTime"; // Time DB
const visit = 2;
var firstTime;
var locations = "Longitude: ";
var buttons = [];
var pageName;
var ipAdd;
var ycoord;
var xcoord;
var response;
var time;
var lat;
var long;

// Sleep Function

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
}


var current = new Date().getTime(); // Get Current Time


// Time on website Function

window.addEventListener('beforeunload', (event) => {

    var endTime = new Date().getTime();
    var timeDiff = endTime - current;
    timeDiff /= 1000; //in ms
    var path = window.location.pathname;
    var page = path.split("/").pop();
    page = "/" + page;


    fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then((responseJson => {
            var ips = responseJson.ip;

            $.post("https://sqlphpwebapptry.azurewebsites.net/time.php", {
                ips: ips, page: page, seconds: timeDiff, table: tableSecond
            });
        }));
    sleep(1800); // Wait for Time

});


// Function to get initial visitor info and send to DB
window.addEventListener("load", init, false);

function init() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    var pageName = "/" + page;

    var refer = document.referrer; // Get page Name

    var pgOne = "Page Name: ";

    pgOne = pgOne + pageName.toString() + "  "; // Parse Page Name

    var btns = document.querySelectorAll('button'); // Get all Buttons

    var okay = "Buttons: "; // Unesccary but needed due to current Infrastructure

    // Function to send Buttons Clicked

    btns.forEach(function (item, index) {
        item.addEventListener('click', function () {
            var gg = item.className;
            var button = "Id: " + item.id + "  Class: " + gg;

            fetch("https://ipapi.co/json/")
                .then(response => response.json())
                .then((responseJson => {
                    var ips = responseJson.ip;

                    $.get('https://worldtimeapi.org/api/timezone/America/New_York')
                        .done(function (data) {
                            time = (data.datetime);
                            time = time.toString();

                            fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + long + "&apiKey=76bd43651d0c43578805321eef306773", requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                    var company = result.features[0].properties.name;


                                    $.post("https://sqlphpwebapptry.azurewebsites.net/clicked.php", { company: company, button: button, tableName: tableName });
                                });
                        });

                }));
        });
    });

    pgOne = pgOne + okay; // Unesccary but needed due to current Infrastructure

    pgOne = pgOne + "Visit Time: "; // Unesccary but needed due to current Infrastructure


    // Function to send All of Data to main DB

    fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then((responseJson => {
            var response = responseJson.ip;
            var addy;
            var city;
            var state;
            var zip;
            var who;
            var busName;
            var locations = "Longitude: ";
            locations = locations + (responseJson.longitude).toString();
            var july = "   Latitude: ";
            long = responseJson.longitude;
            july = july + (responseJson.latitude).toString();
            lat = responseJson.latitude;
            locations = locations + july;
            if (refer.includes(domain)) {
                refer = null;
            }
            pgOne = pgOne + " referrer: " + refer;



            fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + long + "&apiKey=76bd43651d0c43578805321eef306773")
                .then(response => response.json())
                .then(result => {
                    who = result.features[0].properties.postcode;
                    addy = result.features[0].properties.address_line2;
                    city = result.features[0].properties.city;
                    state = result.features[0].properties.state_code;
                    zip = result.features[0].properties.postcode;
                    busName = result.features[0].properties.name;
                    who = city + ", " + state;

                    /* Soon To Come ?
                     
                    fetch("https://apis.estated.com/v4/property?token=lds0JpWnB29d1aPsaxhdiOzOuh8JFJ&street_address=" + addy + "&city=" + city + "&state=" + state + "&zip_code=" + zip, requestOptions)
                        .then(response => response.json())
                        .then(responseJson => {
                            console.log(responseJson.data.valuation.value);
                        });
 
                    */

                    $.post("https://sqlphpwebapptry.azurewebsites.net/dawkins.php", { ipAdd: response, locations: who, visit: visit, pgOne: pgOne, busName: busName, table: table });

                });
        }));

}