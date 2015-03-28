// Call this script after jQuery
// Callme - inline Google Voice calling without Flash
// by Matthew Reidsma, May 2012
//
// http://matthewreidsma.com/projects/callme

// Set the Google Voice ID from the embed dialer code
var gv_id = "68910de29487313c7b0e56cddb9d8f1c4d6571a4";
var called = false;

// Make the "Call Me" span look like a link
$(".call-link").css("cursor", "pointer").css("color", "#219ab3");
$(".call-link").parent().append('<span class="call-form" style="display: inline-block; padding: .6em 1em; margin-left: 2em; border: 1px solid #bbb;background: #ddd;"><form><input type="hidden" id="button_id" value="' + gv_id + '" /><input type="hidden" id="cid_name" value="Email Caller" /><label for="cid_number" class="call">Your Number:</label> <input class="call" type="text" id="cid_number" /> <a class="button-grey" id="callme">Connect</a></form></span>');
$(".call-form").toggle();

// Set a click handler to run the following function when a user clicks "Call Me"
$(".call-link").click(function() {

    ga('send', 'event', 'link', 'click', 'call');

    $(".call-form").toggle();
    $("#callme").click(function() {


        $( "#callme").unbind( "click" );
        $(this).text("Connecting...").attr("class", "button-blue"); // Change the button to show something is working

        // Grab values from form
        var button_id = $('#button_id').val();
        var cid_number = $('#cid_number').val();
        var cid_name = $('#cid_name').val();

        ga('send', 'event', 'link', 'click', 'dial-'+cid_number);

        var params = [{
            'key': 'buttonId',
            'value': button_id
        }, {
            'key': 'callerNumber',
            'value': cid_number
        }, {
            'key': 'name',
            'value': cid_name
        }, {
            'key': 'showCallerNumber',
            'value': '1'
        }];

        crossDomainPost(params);

    });
});

function crossDomainPost(parameters) {
    // Add the iframe with a unique name
    var iframe = document.createElement("iframe");
    var uniqueString = "callme-frame";
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.contentWindow.name = uniqueString;

    // construct a form with hidden inputs, targeting the iframe
    var form = document.createElement("form");
    form.target = uniqueString;
    form.action = "https://clients4.google.com/voice/embed/webButtonConnect";
    form.method = "POST";

    for (var i = parameters.length - 1; i >= 0; i--) {
        var p = parameters[i];
        // repeat for each parameter
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = p.key;
        input.value = p.value;
        form.appendChild(input);
    };

    document.body.appendChild(form);
    form.submit();
}