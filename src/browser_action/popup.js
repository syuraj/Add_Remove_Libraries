/// <reference path="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.0.min.js"/>

var sendRequestToInjectLibrary = function (elementType, inputBoxId, containerId, requestType) {
    var input = $("#" + inputBoxId);
    var url = input.val();

    if (url != '') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { requestType: requestType, url: url }, function (response) {
                if (response != undefined && response.success == "true") {
                    $(input).attr('placeholder', 'Insert successful.').val('').focus();

                    var item_row = createItemRow(elementType, url, 1);
                    $("#" + containerId).prepend(item_row);
                }
                else {
                    $(input).attr('placeholder', 'Could not insert the library.');
                }
            });
        });
    }
    else {
        $(input).attr('placeholder', 'Url cannot be empty.');
    }

    return false;
}

var createItemRow = function (elementType, url, rowNo) {
    var item_row = $("<div></div>").html("<div class='item-link'> <a href='" + url + "' class='item-link' target='_blank'>" + url + "</a> </div>");
    $(item_row).addClass(rowNo % 2 == 0 ? "item-row" : "item-row alternating-row");

    var right_item_buttons = $("<div></div>").addClass("right-item-buttons");
    var remove_button = $("<div>&nbsp;</div>").addClass("cross-button").click(function () {
        sendRequestToRemoveUrl(elementType, url);
    });

    right_item_buttons.append(remove_button);
    item_row.append(right_item_buttons);

    return item_row;
}

var sendRequestToRemoveUrl = function (elementType, url) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { requestType: "removeUrl", elementType: elementType, url: url }, function (response) {

            if (response != null && response.success == "true") {
                $("a[href='" + url + "']").parent().parent().remove();
            }
        });
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { requestType: "getUrls" }, function (response) {

        if (response != null && response.success == "true") {
            for (var i = 0; i < response.scriptUrls.length; i++) {
                var item_row = createItemRow("script", response.scriptUrls[i], i);
                $("#javascript-item-rows").append(item_row);
            }

            for (var i = 0; i < response.cssUrls.length; i++) {
                var item_row = createItemRow("css", response.cssUrls[i], i);
                $("#css-item-rows").append(item_row);
            }
        }

        $("#btnInjectJavaScript").click(function () { sendRequestToInjectLibrary("script", "javascript-url", "javascript-item-rows", "injectJavaScriptUrl"); });
        $("#btnInjectCss").click(function () { sendRequestToInjectLibrary("css", "css-url", "css-item-rows", "injectCssUrl"); });
    });
});


document.getElementById('javascript-url').onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        sendRequestToInjectLibrary("script", "javascript-url", "javascript-item-rows", "injectJavaScriptUrl");
        return false;
    }
}

document.getElementById('css-url').onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        sendRequestToInjectLibrary("css", "css-url", "css-item-rows", "injectCssUrl");
        return false;
    }
}

