/* =SCROLLMAGIC
---------------------------------------------------------------------------------------*/

function initScrolling() {

    if (Modernizr.mq('(min-width: 800px)') && Modernizr.touch !== true ) {


        //Header Intro
        //Hide the Buttons and h1
        $("header h1").css("opacity", "0").css("left", 50).css("display", "none");
        $("header .button").css("opacity", "0").css("display", "none");

        //Animate the intro elements
        var introTextAnimation = new TimelineMax({})
            .add(TweenMax.to("header p", 0, {
                opacity: 0,
                top: "-=50",
                ease: Power1.easeOut
            }))
            .add(TweenMax.to("header p", 0.8, {
                opacity: 1,
                top: "+=50",
                ease: Power1.easeOut,
                delay: 1
            }))
            .add(TweenMax.to("header p cite", 0, {
                opacity: 0,
                top: "-=50",
                ease: Power1.easeOut
            }))
            .add(TweenMax.to("header p cite", 0.2, {
                opacity: 1,
                top: "-=50",
                ease: Power1.easeOut
            }));

        var introBGAnimation = new TimelineMax({})
            .add(TweenMax.to("header", 1, {
                backgroundPosition: "50% -200px",
                ease: Power1.easeOut,
                delay: 1
            }));


        //Setup the ScrollMagic controller
        controller = new ScrollMagic({
            //container: "#content-wrapper",
            globalSceneOptions: {
                triggerHook: "onLeave"
            }
        });
        //Setup ScrollScenes
        //Intro animations
        var intro = new ScrollScene({
                duration: $("header").height()
            })
            .addTo(controller)
            .setTween(new TimelineMax()
                .add([
                    TweenMax.to("header p", 0.4, {
                        opacity: 0,
                        ease: Power1.easeOut
                    }),
                    TweenMax.to("header p", 0.8, {
                        top: "-200",
                        ease: Power1.easeOut
                    }),
                    TweenMax.to("header", 0.6, {
                        backgroundPosition: "50% 290px",
                        ease: Power1.easeIn
                    })
                ])
            );
        //Intro Pin
        var pinIntro = new ScrollScene({
                duration: $(".features").height() + 1975,
                //duration:0,
                offset: $("header").height() - 124
            })
            .setPin("header", {
                pushFollowers: false
            })
            .addTo(controller);
            //Intro Events
        intro.on("end", function(event) {
            resetFeature();
            $("header h1").css("display", "block");
            $("header .button").css("display", "block");
            var nervousHeader = new TimelineMax({})
                .add(TweenMax.to("header h1", 0.6, {
                    opacity: 1,
                    left: "0",
                    ease: Power1.easeOut
                }))
                .add(TweenMax.to("header .button", 0.4, {
                    opacity: 1,
                    ease: Power1.easeOut
                }));
        });
        //Features Scene Pin
        var pinFeatures = new ScrollScene({
                duration: $(".features").height() + 1975,
                offset: $("header").height() - 124
            })
            .setPin(".features", {
                pushFollowers: false
            })
            .addTo(controller);
            //Features pin event
        pinFeatures.on("end", function(event) {
            resetFeature();
        });
        //Animate Features on scroll
        //scene: Read
        var highlightFeatureRead = new ScrollScene({
                duration: 600,
                offset: $("header").height() + 175
            })
            .addTo(controller);
            //read events
        highlightFeatureRead.on("enter", function(event) {
            makeFeatureActive("Read", "home");
        });
        //scene: Save
        var highlightFeatureSave = new ScrollScene({
                duration: 600,
                offset: $("header").height() + 775
            })
            .addTo(controller);
            //save events
        highlightFeatureSave.on("enter", function(event) {
            makeFeatureActive("Save", "star");
        });
        //scene: Share
        var highlightFeatureShare = new ScrollScene({
                duration: 600,
                offset: $("header").height() + 1375
            })
            .addTo(controller);
            //share events
        highlightFeatureShare.on("enter", function(event) {
            makeFeatureActive("Share", "socialControls");
        });
        //Footer Pin Scene
        var pinFooter = new ScrollScene({
                duration: $(".features").height() + 1975,
                offset: $("header").height() - 124
            })
            .setPin("footer", {
                pushFollowers: true
            })
            .addTo(controller);
    }
}


/* =FEATURED IMAGERY
---------------------------------------------------------------------------------------*/

function initFeaturedImagery() {

    $(".featureList li.home").on("click", function() {
        makeFeatureActive("Read", "home");
    });

    $(".featureList li.star").on("click", function() {
        makeFeatureActive("Save", "star");
    });

    $(".featureList li.socialControls").on("click", function() {
        makeFeatureActive("Share", "socialControls");
    });

}

function makeFeatureActive(featureImg, featureList) {
    if ($(".featureList ." + featureList).hasClass("active") !== true) {
        resetFeature();
        //image
        $(".featureImagery .image" + featureImg).addClass("active");
        //list item
        $(".featureList ." + featureList).addClass("active");
    } else {
        resetFeature();
    }
}

function resetFeature() {
    $(".featureImagery .img").removeClass("active");
    $(".featureList li").removeClass("active");
}

/* =HELPER FUNCTIONS
---------------------------------------------------------------------------------------*/

function lookupShareURL() {
    var linkToReturn = $(".socialControls").attr("data-share-url");
    return linkToReturn;
}

function openWindow(windowURL, windowWidth, windowHeight) {
    var width = windowWidth;
    var height = windowHeight;
    var left = parseInt((screen.availWidth / 2) - (width / 2));
    var top = parseInt((screen.availHeight / 2) - (height / 2));
    var windowFeatures = "width=" + width + ",height=" + height + ",resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
    myWindow = window.open(windowURL, "SOTW", windowFeatures);
}


function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function debugScript(alertMessage) {
    try {
        console.log(alertMessage);
    } catch (err) {
        alert(alertMessage);
    }
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

/* =RUN APP
---------------------------------------------------------------------------------------*/

function runApp() {

    window.setTimeout(function() {
        //fade in UI elements
    }, 2000);
    initScrolling();
    initFeaturedImagery();

}

//DOM ready event
$(document).ready(function() {

    //Helpers
    MBP.scaleFix();

    //Run
    runApp();

});
