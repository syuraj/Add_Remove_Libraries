/// <reference path="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.0.min.js"/>

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

      if (request.requestType == "getUrls") {
          var scriptUrls = getAllScriptUrls();
          var cssUrls = getAllCssUrls();

          sendResponse({ scriptUrls: scriptUrls, cssUrls: cssUrls, success: "true" });
      }
      else if (request.requestType == "injectJavaScriptUrl") {
          loadScript(request.url);
          sendResponse({ success: "true" });
      }
      else if (request.requestType == "injectCssUrl") {
          loadCssLibrary(request.url);
          sendResponse({ success: "true" });
      }
      else if (request.requestType == "removeUrl") {
          removeUrl(request.elementType, request.url);

          sendResponse({ success: "true" });
      }
  });

var loadScript = function (url) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")['0'].appendChild(script);
}

var loadCssLibrary = function (url) {
    var library = document.createElement("link");
    library.setAttribute("rel", "stylesheet")
    library.setAttribute("type", "text/css")
    library.setAttribute("href", url)

    document.getElementsByTagName("head")[0].appendChild(library);
}

var getAllScriptUrls = function () {
    return $("script").map(function () { return $(this).attr("src"); }).get();
}

var getAllCssUrls = function () {
    return $("link[rel=stylesheet]").map(function () { return $(this).attr("href"); }).get();
}

var removeUrl = function (elementType, url) {
    if (elementType == "script") {
        $("script[src='" + url + "']").remove();
    }
    else if (elementType == "css") {
        $("link[href='" + url + "']").remove();
    }
}
