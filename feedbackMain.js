/* 
Copyright 2016 Adobe Systems Incorporated.  All rights reserved. 
*/

/*jslint vars: true, plusplus: true*/
/*global window, UserVoice, FEEDBACK_TYPE, unescape, jQuery, $, FEEDBACK_CONSTANTS, UI_CONTANTS */

var feedbackDirPath;
var feedbackLocale;
var userId;

function getQueryVariables() {
    "use strict";
    var result = {}, i;
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair.length === 2) {
            result[pair[0]] = pair[1];
        }
    }
    return result;
}


function getUvLocaleFromDwLocale(dwLocale) {
    "use strict";
   
    var localeMap = {
        "cs_CZ": "cs",
        "de_DE": "de",
        "en_US": "",
        "es_ES": "es",
        "fr_FR": "fr",
        "it_IT": "it",
        "ja_JP": "ja",
        "ko_KR": "ko",
        "nl_NL": "nl",
        "pl_PL": "pl",
        "pt_BR": "pt-BR",
        "ru_RU": "ru",
        "sv_SE": "sv-SE",
        "tr_TR": "tr",
        "zh_CN": "cn",
        "zh_TW": "zh-TW"
    };
    
    if (localeMap[dwLocale]) {
        return localeMap[dwLocale];
    } else {
        return '';
    }
}

function setFeedbackQueryParams() {
    "use strict";
    var queryVars = getQueryVariables();
    userId = queryVars.userId || "";
    userId = unescape(userId);
    
    feedbackLocale = queryVars.feedbackLocale || "";
    feedbackLocale = getUvLocaleFromDwLocale(feedbackLocale);
}

function setFeedbackDirPath() {
    "use strict";
    var filePath = document.location.pathname;
    feedbackDirPath = filePath.substring(0, filePath.lastIndexOf('/'));
}

/*
 * Set up strings for localization.
*/
function setUpLocalization() {
    "use strict";
    var stringPath = feedbackDirPath + FEEDBACK_CONSTANTS.StringsPath;
    if (jQuery !== 'undefined' && $ !== 'undefined') {
        $.i18n.properties({
            name: 'feedback',
            language: ' ',
            path: stringPath,
            mode: 'map',
            callback: function () {
            }
        });
    }
}

/*
* This function returns localized string for a given string Id.
*/
function getLocalizedString(stringId) {
    "use strict";
    var result = "";
    if ($ !== 'undefined') {
        result = $.i18n.prop(stringId);
    }
    return result;
}

function initFeedackView() {
    "use strict";
    
    setFeedbackDirPath();
    setFeedbackQueryParams();
    setUpLocalization();
    
    var feedbackElem = document.getElementById(UI_CONTANTS.ContainerDivID);
    var feedbackType = feedbackElem.getAttribute(UI_CONTANTS.DataFeedbackType);
    
    UserVoice = window.UserVoice || [];
    
    (function () {
        var uv = document.createElement('script');
        uv.type = 'text/javascript';
        uv.async = true;
        uv.src = feedbackDirPath + 'dwFeedbackSdk.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(uv, s);
    })();
    
    //set color
    UserVoice.push(['set', {
        accent_color: '#1473E6',
        height: '230px', // Widget height
        width: '250px',
        permalinks_enabled: 'false',
        locale: feedbackLocale,
		screenshot_enabled: 'false'
    }]);

    //set identity of user
    UserVoice.push(['identify', {
        email: userId, // User’s email address
        name: '' // User’s real name
    }]);

    if (feedbackType === FEEDBACK_TYPE.PreProcessor) {
        UserVoice.push(['set', {
            strings: {
                contact_title: getLocalizedString("contact_title"),
                contact_message_placeholder: getLocalizedString("contact_message_placeholder")
            }
        }]);
        UserVoice.push(['embed', '#mainContainer', {
            mode: 'contact'
        }]);
    } else if (feedbackType === FEEDBACK_TYPE.AppUITheme) {
        UserVoice.push(['set', {
            strings: {
                contact_title: getLocalizedString("app_ui_theme_feedback_title"),
                contact_message_placeholder: getLocalizedString("contact_message_placeholder")
            }
        }]);
        UserVoice.push(['embed', '#mainContainer', {
            mode: 'contact'
        }]);
    } else if (feedbackType === FEEDBACK_TYPE.FilesPanel) {
        UserVoice.push(['set', {
            strings: {
                contact_title: getLocalizedString("files_panel_feedback_title"),
                contact_message_placeholder: getLocalizedString("contact_message_placeholder")
            }
        }]);
        UserVoice.push(['embed', '#mainContainer', {
            mode: 'contact'
        }]);
    } else {
        UserVoice.push(['set', {
            strings: {
                post_suggestion_title: getLocalizedString("post_suggestion_title"),
                post_suggestion_body: getLocalizedString("post_suggestion_body"),
                post_suggestion_message_placeholder: getLocalizedString("post_suggestion_message_placeholder"),
                post_suggestion_success_body: getLocalizedString("post_suggestion_success_body")
            }
        }]);
        
        UserVoice.push(['embed', '#mainContainer', {
            mode: 'feedback'
        }]);
    }
    
    var loadingElem = document.getElementById(UI_CONTANTS.LoadingDivID);
    var feedbackIframe = feedbackElem.getElementsByTagName("iframe")[0];
    
    if (feedbackIframe) {
        feedbackIframe.onload = function () {
            loadingElem.classList.add("setDisplayNone");
            feedbackElem.classList.remove("hide");
            feedbackIframe.style.visibility = "visible";
        };
    } else {
        setTimeout(function () {
            loadingElem.classList.add("setDisplayNone");
            feedbackElem.classList.remove("hide");
        }, 800);
    }
}

initFeedackView();
