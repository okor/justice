  /////////////////////
  //      Utils      //
  /////////////////////

  // could be base64 or empty
  function urlIsRemote(urlString) {
    return (urlString && urlString.match(/^http|^\/\/|url\(http/)) ? true : false;
  }

  function elementIsTypeOf(element, typeString) {
    return element.getAttribute && element.getAttribute('type') && element.getAttribute('type').match(typeString);
  }

  function elementAttributeMatches(element, attr, matcher) {
    return element.getAttribute(attr) && element.getAttribute(attr).match(matcher);
  }