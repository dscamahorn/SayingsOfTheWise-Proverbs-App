/* =MODAL
---------------------------------------------------------------------------------------*/

var targetChapterVerse;

function showModal(modal, message, menu) {
    //Hide existing screen
    $(".modal").attr("id", modal);
    $(".modal .modalMessage").html(message);
    $(".modal .modalMenu").html(menu);

    if (modal == "confirmShare") {

        $(".modal .modalShare p").html("<span>#Proverbs</span> " + targetChapterVerse);

        $(".modal .modalMenu a.confirm").on("click", function() {
            openWindow(lookupShareURL(), "inapp", true, 640, 480);
            hideModal();
            return false;
        });

        $(".modal .modalMenu a.deny").on("click", function() {
            hideModal();
            return false;
        });

    } else {

        $(".modal .modalMenu a").on("click", function() {
            hideModal();
            return false;
        });

    }

    $(".modal").addClass("show");
}

function hideModal() {

    $(".modal").removeClass("show");

}

function userAccepted() {
    amplify.store.localStorage("sotwUserAgreement", 1);
    hideModal();
    runApp();
}

/* =DRAG, DROP, HIT
---------------------------------------------------------------------------------------*/

function initDragDrop() {
    //$("#passageBase").draggable("y","#app");
    $("#passageBase").draggable("", "#appInner");
}

//Hit Test
$.fn.hitTestObject = function(obj) {

    var bounds = this.offset();

    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    var compare = obj.offset();
    compare.right = compare.left + obj.outerWidth();
    compare.bottom = compare.top + obj.outerHeight();

    return (!(compare.right < bounds.left ||
        compare.left > bounds.right ||
        compare.bottom < bounds.top ||
        compare.top > bounds.bottom));

};

//Drag
$.fn.draggable = function(direction, boundingBox) {

    //Setup values
    var offset = null;
    var targetObject = this;
    var minBoundX = 0; //left
    var minBoundY = 0; //top
    var maxBoundX = 0; //right
    var maxBoundY = 0; //bottom

    //Start Drag
    var start = function(e) {

        var startHeight = $(targetObject).outerHeight();
        var startWidth = $(targetObject).outerWidth();

        //debugScript("Objects starting height = "+startHeight);
        //debugScript("Objects starting width = "+startWidth);

        $(targetObject).outerHeight(startHeight);
        $(targetObject).outerWidth(startWidth);

        if ($(targetObject).attr("id") != "passageBase") {
            $(targetObject).css("line-height", startHeight + "px");
        }

        //Setup Bounds
        if (boundingBox !== null) {
            //left offset relative to the document minus the targets left offset relative to the document plus the left position in relation to its parent
            minBoundX = $(boundingBox).offset().left - $(targetObject).offset().left + $(targetObject).position().left;
            minBoundY = $(boundingBox).offset().top - $(targetObject).offset().top + $(targetObject).position().top;
            maxBoundX = $(boundingBox).offset().left + $(boundingBox).outerWidth() - startWidth - $(targetObject).offset().left + $(targetObject).position().left;
            maxBoundY = $(boundingBox).offset().top + $(boundingBox).outerHeight() - startHeight - $(targetObject).offset().top + $(targetObject).position().top;
            //debugScript("minX "+minBoundX);
            //debugScript($(boundingBox).offset().top + " minY "+minBoundY);
            //debugScript("maxX "+maxBoundX);
            //debugScript($(targetObject).offset().top + " maxY " + maxBoundY);
        }

        var orig = e.originalEvent;

        var pos = $(targetObject).position();

        if (Modernizr.touch) {

            offset = {
                x: orig.changedTouches[0].pageX - pos.left,
                y: orig.changedTouches[0].pageY - pos.top
            };

        } else {

            offset = {
                x: orig.clientX - pos.left,
                y: orig.clientY - pos.top
            };

        }

        if (Modernizr.touch) {

        } else {
            $(document).on("mousemove", moveMe);
            $(document).on("mouseup", stopMe);
        }

        $(targetObject).css({
            left: pos.left,
            top: pos.top
        });

        $(targetObject).addClass("dragged");

        if ($(targetObject).attr("id") != "passageBase") {
            $(targetObject).after("<div class='placeholder' style='width:100%; display:block; height:" + startHeight + "px;'></div>");
            $(".delete").css("opacity", 1);
        }

    };

    //Moving
    var moveMe = function(e) {

        e.preventDefault();
        var orig = e.originalEvent;

        switch (direction) {
            case "x":
                if (Modernizr.touch) {
                    $(targetObject).css({
                        left: Math.max(minBoundX, Math.min(orig.changedTouches[0].pageX - offset.x, maxBoundX))
                    }).addClass("dragged");
                } else {
                    $(targetObject).css({
                        left: Math.max(minBoundX, Math.min(orig.clientX - offset.x, maxBoundX))
                    }).addClass("dragged");
                }
                break;
            case "y":
                if (Modernizr.touch) {
                    $(targetObject).css({
                        top: Math.max(minBoundY, Math.min(orig.changedTouches[0].pageY - offset.y, maxBoundY))
                    }).addClass("dragged");
                } else {
                    $(targetObject).css({
                        top: Math.max(minBoundY, Math.min(orig.clientY - offset.y, maxBoundY))
                    }).addClass("dragged");
                }
                break;
            default:
                if (Modernizr.touch) {
                    $(targetObject).css({
                        top: Math.max(minBoundY, Math.min(orig.changedTouches[0].pageY - offset.y, maxBoundY)),
                        left: Math.max(minBoundX, Math.min(orig.changedTouches[0].pageX - offset.x, maxBoundX))
                    }).addClass("dragged");
                } else {
                    $(targetObject).css({
                        top: Math.max(minBoundY, Math.min(orig.clientY - offset.y, maxBoundY)),
                        left: Math.max(minBoundX, Math.min(orig.clientX - offset.x, maxBoundX))
                    }).addClass("dragged");
                }
                break;
        }

        var hitStar = $(".dragged").hitTestObject($(".star"));

        if (hitStar === true && $(".star").is(":visible")) {
            $(".star").addClass("hit");
        } else {
            $(".star").removeClass("hit");
        }

        var hitTweet = $(".dragged").hitTestObject($(".socialControls"));

        if (hitTweet === true && $(".socialControls").is(":visible")) {
            $(".socialControls").addClass("hit");
        } else {
            $(".socialControls").removeClass("hit");
        }

        var hitHome = $(".dragged").hitTestObject($(".home"));

        if (hitHome === true && $(".home").is(":visible")) {
            $(".home").addClass("hit");
        } else {
            $(".home").removeClass("hit");
        }

        var hitDelete = $(".dragged").hitTestObject($(".delete"));

        if (hitDelete === true && $("ul#favorites").is(":visible")) {
            $(".delete").addClass("hit");
        } else {
            $(".delete").removeClass("hit");
        }


    };

    //Stop Drag
    var stopMe = function(e) {

        e.preventDefault();
        var orig = e.originalEvent;

        if ($(targetObject).attr("id") != "passageBase") {
            $(targetObject).css("line-height", "normal");
        }

        $(targetObject).removeClass("dragged").attr("style", "");
        $(targetObject).parent().find(".placeholder").remove();

        $(".delete").css("opacity", 0);

        if ($(".star").hasClass("hit") === true && $(".star").is(":visible")) {
            $(".star").removeClass("hit");
            addToFav($(targetObject).data("chapter"), $(targetObject).data("verse"));
        }

        if ($(".socialControls").hasClass("hit") === true && $(".socialControls").is(":visible")) {
            $(".socialControls").removeClass("hit");
            getProverb("tweet", $(targetObject).data("chapter"), $(targetObject).data("verse"));
        }

        if ($(".delete").hasClass("hit") === true && $("#screenFavorites").is(":visible")) {
            $(".delete").removeClass("hit");
            $(targetObject).parent().html("<div class='placeholder'></div>");
            updateFavList();
        }

        if ($(".home").hasClass("hit") === true && $(".home").is(":visible")) {
            $(".home").removeClass("hit");
            getProverb("passage", $(targetObject).data("chapter"), $(targetObject).data("verse"));

            //Hide/Show
            $("#screenPassage").show();
            $(".home").hide();

            $(".star").show();
            $("#screenFavorites").hide();

        }


        if (Modernizr.touch) {

        } else {
            $(document).off("mousemove", moveMe);
            $(document).off("mouseup", stopMe);
        }

    };

    //Attach Events
    if (Modernizr.touch) {

        $(targetObject).on("touchstart", start);
        $(targetObject).on("touchmove", moveMe);
        $(targetObject).on("touchend", stopMe);

    } else {

        $(targetObject).on("mousedown", start);

    }

};

/* =PROVERBS
---------------------------------------------------------------------------------------*/

function countObjects(obj) {
    var i = 0;
    for (var x in obj)
        if (obj.hasOwnProperty(x))
            i++;
    return i;
}

function getProverb(type, chapter, verse) {

    //Request
    var requestURL;
    var chapterNum = chapter;
    var verseNum = verse;

    //Return
    var proverbTextChapterNum;
    var proverbTextVerseNum;
    var proverbTextVerse;

    //Output
    var outputType = type;
    var output;

    //URL
    requestURL = "proverbs.json";

    $.getJSON(requestURL, function(data) {

        //debugScript("Chapter Number: First Test = "+chapterNum);

        if (chapterNum === undefined) {
            chapterNum = randomFromTo(10, 21);
        }

        //debugScript("Chapter Number = "+chapterNum);

        //debugScript("Number of verses in chapter ="+countObjects(data[chapterNum]));

        if (verseNum === undefined) {
            verseNum = randomFromTo(0, countObjects(data[chapterNum]) - 1);
        } else {
            verseNum = verseNum;
        }

        //debugScript("Passage Text: First Test ="+data[chapterNum][verseNum]);

        proverbTextVerse = data[chapterNum][verseNum];

        if (proverbTextVerse === undefined) {

            getProverb("passage"); //If the proverb is undefined try again

        } else if (proverbTextVerse.length > 117) {

            getProverb("passage"); //If the proverb is less than 117 characters

        } else {

            //debugScript("Passage Text ="+proverbTextVerse);

            switch (outputType) {
                //Load Passage
                case "passage":
                    $("#passageBase #passageContent").fadeOut(function() {

                        $("#passageBase").data("chapter", chapterNum);
                        $("#passageBase").data("verse", verseNum);

                        output = "<div>";
                        output += "<p id='passageText'>" + proverbTextVerse + "</p>";
                        output += "<p id='passageID'>" + chapterNum + ":" + verseNum + "</p>";
                        //});
                        output += "</div>";
                        $("#passageBase #passageContent").html(output);
                        $("#passageBase #passageContent").fadeIn();
                        $("#app #passageLoad").fadeIn();
                        if (firstTime === 0) {
                            $("#app .star").fadeIn();
                            $("#app .info").fadeIn();
                            $("#app .socialControls").fadeIn();
                            $("#passageLoad").removeClass("loading").addClass("reload");
                        }
                        firstTime++;
                    });

                    break;

                    //Tweet Text
                case "tweet":

                    output = proverbTextVerse + " #Proverbs " + chapterNum + ":" + verseNum + " @SayingOfTheWise";

                    targetChapterVerse = chapterNum + ":" + verseNum;

                    sharePassage(output);

                    break;
            }
        }

    });

}

/* =FAVORITES
---------------------------------------------------------------------------------------*/

//Add passage to favorites
function addToFav(chapter, verse) {

    var favCount = 0;
    $("ul#favorites li").each(function(i) {
        if ($(this).find("div").hasClass("fav") === true) {
            favCount = favCount + 1;
        }
        //debugScript("Number of favorites ="+favCount);
    });

    //Check number of favorites, only 24 fit on a view
    if (favCount < 24) {

        //Remove the last LI
        $("ul#favorites li").last().remove();

        $("ul#favorites").prepend("<li><div data-chapter='" + chapter + "' data-verse='" + verse + "' class='fav'>" + chapter + ":" + verse + "</div></li>");

        var items = [];
        $("ul#favorites li").each(function(i) {

            //Update the fav stored data
            if ($(this).find("div").hasClass("fav") === true) {
                items.push("<div data-chapter='" + $(this).children("div").data("chapter") + "' data-verse='" + $(this).children("div").data("verse") + "' class='fav'>" + $(this).children("div").data("chapter") + ":" + $(this).children("div").data("verse") + "</div>");
            } else {
                items.push("<div data-chapter='' data-verse='' class='placeholder'></div>");
            }

        });

        amplify.store.localStorage("sotwFavorites", items);

        $("ul#favorites li:first-child > div").draggable("", "#appInner");

    } else {
        //display a message
        showModal("favorites", msgFavorites, "<a href='#'>OK</a>");
    }


}

//Add passage to favorites
function updateFavList() {

    //Clear the storage
    amplify.store.localStorage("sotwFavorites", "");

    var items = [];
    $("ul#favorites li").each(function(i) {
        //Update the fav stored data
        if ($(this).find("div").hasClass("fav") === true) {
            items.push("<div data-chapter='" + $(this).children("div").data("chapter") + "' data-verse='" + $(this).children("div").data("verse") + "' class='fav'>" + $(this).children("div").data("chapter") + ":" + $(this).children("div").data("verse") + "</div>");
        } else {
            items.push("<div data-chapter='' data-verse='' class='placeholder'></div>");
        }
    });

    //http://www.sitepoint.com/sophisticated-sorting-in-javascript/
    items.sort(function(a, b) {

        /*
            1.if the function returns less than zero, sort a before b
            2.if the function returns greater than zero, sort b before a
            3.if the function returns zero, leave a and b unchanged with respect to each other
            */

        /* Stable Sort
            IE6+: stable
            Firefox < 3: unstable
            Firefox >= 3: stable
            Chrome <= 5 (i.e., all versions to date): unstable
            Opera < 10: unstable
            Opera >= 10: stable
            Safari 4: stable
            */

        var x = a.indexOf("placeholder");
        var y = b.indexOf("placeholder");

        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else if (x == y) {
            return 0;
        }

    });


    amplify.store.localStorage("sotwFavorites", items);

    buildFavList();

}

//Build Fav List
function buildFavList() {

    //See if this is the first run or a run after the localStorage has been cleared out. This creates the base localStorage container.
    if (amplify.store("sotwFavorites") === undefined) {
        //debugScript("Local Storage key created? ="+"true");
        amplify.store.localStorage("sotwFavorites", "");
    }

    var storedData = [];
    $.each(amplify.store("sotwFavorites"), function(key, value) {
        storedData[key] = value;
    });

    $("ul#favorites li").each(function(i) {
        if (storedData[i] !== null) {
            $(this).html(storedData[i]);
        }
    });

    $("ul#favorites li > div.fav").each(function() {
        $(this).draggable("", "#appInner");
    });

}


/* =TWEET
---------------------------------------------------------------------------------------*/

function sharePassage(proverb) {

    var shareTwitterURL = document.location.protocol + "//twitter.com/intent/tweet?text=" + encodeURIComponent(proverb) + "&related=SayingOfTheWise";

    //Set the data attribute so it can be retrieved by the lookupShareURL function.
    $(".socialControls").attr("data-share-url", shareTwitterURL);

    $("#virtualLinkSharePassage").off('click');

    assignVirtualLinkTrigger("#virtualLinkSharePassage", shareTwitterURL);


    if (navigator.standalone === true) {
        alert("sharemed");
        $("#virtualLinkSharePassage").trigger('click');
    } else {

        showModal("confirmShare", msgConfirmShare, "<a href='#' class='confirm'>OK</a><a href='#' class='deny'>Cancel</a>");
    }

}

/* =HELPER FUNCTIONS
---------------------------------------------------------------------------------------*/

function lookupShareURL() {
    var linkToReturn = $(".socialControls").attr("data-share-url");
    return linkToReturn;
}

function openWindow(windowURL, windowTarget, incWinFeatures, windowWidth, windowHeight) {
    var width = windowWidth;
    var height = windowHeight;
    var left = parseInt((screen.availWidth / 2) - (width / 2));
    var top = parseInt((screen.availHeight / 2) - (height / 2));
    var windowFeatures = "width=" + width + ",height=" + height + ",resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
    if (incWinFeatures === true) {
        if (windowTarget == "inapp") {
            myWindow = window.open(windowURL, "SOTW", windowFeatures);
        } else if (windowTarget == "inbrowser") {
            myWindow = window.open(windowURL, "_system", windowFeatures);
        }
    } else {
        if (windowTarget == "inapp") {
            myWindow = window.open(windowURL, "SOTW");
        } else if (windowTarget == "inbrowser") {
            myWindow = window.open(windowURL, "_system");
        }
    }
}


function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function assignVirtualLinkTrigger(virtualLinkID, virtualLinkURL) {

    $(virtualLinkID).on('click', function() {

        var a = document.createElement('a');
        a.setAttribute("href", virtualLinkURL);
        if (navigator.standalone === true) {
            a.setAttribute("target", "_top");
        } else {
            a.setAttribute("target", "_system");
        }
        var dispatch = document.createEvent("HTMLEvents");
        dispatch.initEvent("click", true, true);
        a.dispatchEvent(dispatch);

        return false;

    });

}

function debugScript(alertMessage) {
    try {
        console.log(alertMessage);
    } catch (err) {
        alert(alertMessage);
    }
}

/* =NAVIGATION
---------------------------------------------------------------------------------------*/

//Initialize Navigation
function initNav() {

    //Social Controls
    assignVirtualLinkTrigger("#virtualLinkShareService", "http://twitter.com/SayingOfTheWise");

    $('.socialControls').on('click', function() {

        if (navigator.standalone === true) {
            $("#virtualLinkShareService").trigger('click');
        } else {
            openWindow("http://twitter.com/SayingOfTheWise", "inbrowser", false);
            //window.open("http://twitter.com/SayingOfTheWise");
        }
    });

    //Fav
    $(".star").on("click", function(e) {

        //Hide/Show
        $("#screenPassage").fadeOut("fast");
        $(".star").fadeOut();
        $(".info").fadeOut();

        $(".home").fadeIn();
        $("#screenFavorites").fadeIn("slow");

        return false;

    });

    //Info
    $(".info").on("click", function(e) {

        showModal("modalInfo", msgAppInfo, '<a href="#">OK</a>');

        return false;

    });

    //Home
    $(".home").on("click", function(e) {

        if ($(this).hasClass("homeFromPrivacy") === true) {

            //Hide/Show
            $("#screenPassage").fadeIn();
            $(".info").fadeIn();
            $(".home").fadeOut();
            $(".socialControls").fadeIn();

            $(".star").fadeIn();
            $("#screenFavorites").fadeOut("fast");
            $("#screenPrivacy").fadeOut("slow");
            $("#info").fadeOut();

        } else {

            //Hide/Show
            $("#screenPassage").fadeIn("slow");
            $(".info").fadeIn();
            $(".home").fadeOut();
            $(".socialControls").fadeIn();

            $(".star").fadeIn();
            $("#screenFavorites").fadeOut("fast");
            $("#screenPrivacy").fadeOut("fast");
            $("#info").fadeOut();

        }

        return false;

    });

    //Reload
    $("#passageLoad").on({
        click: function() {
            getProverb("passage");
        },
        touchend: function() {
            getProverb("passage");
        }
    });
}

//Privacy
function showPrivacyScreen() {

    hideModal();

    //Hide/Show
    $("#screenPassage").fadeOut("fast");
    $("#screenFavorites").fadeOut("fast");
    $(".star").fadeOut();
    $(".info").fadeOut();

    $(".home").fadeIn();
    $("#screenPrivacy").fadeIn("slow");

    $(".home").addClass('homeFromPrivacy');

    return false;
}

function myAnimator(myElement, myToggleDirection) {
    //Show
    if (myToggleDirection == "show") {
        $(myElement).css({
            "opacity": 0,
            "display": "block"
        }).animate({
            opacity: 1
        }, 5000, function() {
            //complete
        });
    }
    //Hide
    if (myToggleDirection == "hide") {
        $(myElement).animate({
            opacity: 0
        }, 5000, function() {
            $(this).css({
                "display": "none"
            });
        });
    }
    return false;
}


/* =Modal Markup
---------------------------------------------------------------------------------------*/

if (navigator.standalone === true) {
    var msgAppInfo = "<div class='Info'><h2 class='unicode'>✝</h2><p><span>Returning with increase</span> to the Lord.</p><p>&copy; 2014 Douglas Scamahorn</p><p><a href='privacy.html' onclick='showPrivacyScreen(); return false;'>Privacy Policy</a></p><p><a href='https://github.com/dscamahorn/SayingsOfTheWise-Proverbs-App' target='_blank'>Source &#60;Code&#47;&#62;</a></p><p><a href='https://twitter.com/SayingOfTheWise' target='_blank'>&#64;SayingOfTheWise</a></p></div>";
} else {
    var msgAppInfo = "<div class='Info'><h2 class='unicode'>✝</h2><p><span>Returning with increase</span> to the Lord.</p><p>&copy; 2014 Douglas Scamahorn</p><p><a href='privacy.html' onclick='showPrivacyScreen(); return false;'>Privacy Policy</a></p><p><a href='https://github.com/dscamahorn/SayingsOfTheWise-Proverbs-App' onclick='openWindow(\"https://github.com/dscamahorn/SayingsOfTheWise-Proverbs-App\",\"inbrowser\",false); return false;'>Source &#60;Code&#47;&#62;</a></p><p><a href='https://twitter.com/SayingOfTheWise' onclick='openWindow(\"https://twitter.com/SayingOfTheWise\",\"inbrowser\",false); return false;'>&#64;SayingOfTheWise</a></p></div>";
}
var msgFavorites = "<div class='Fav'><h2>Forgivness is Divine</h2><p>Sorry, we can't store any more favorites. Delete a favorite before adding another.</p></div>";
var msgConfirmShare = "<div class='modalShare'><h2>Share the wisdom?</h2><p></p></div>";

/* =RUN APP
---------------------------------------------------------------------------------------*/

function runApp() {

    firstTime = 0;

    //Required to override preventScrolling helper behavior. Assign to elements within the app that require scrolling.
    $('.modalMessage, #privacyContent').bind('touchmove', function(e) {
        e.stopPropagation();
    });

    //Setup
    buildFavList();
    initNav();
    initDragDrop();

    $("#app #screenSplash").fadeIn();

    window.setTimeout(function() {
        $("#app #screenSplash").fadeOut();
        $("#app #passageContent").fadeIn(function() {
            getProverb("passage");
        });
    }, 2000);

    //Enable shake script
    $(window).on("shake", function() {
        getProverb("passage");
    });

}

//DOM ready event
$(document).ready(function() {

    //Helpers
    MBP.startupImage();
    MBP.scaleFix();
    MBP.preventScrolling();

    //Run
    runApp();

});
