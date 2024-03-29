
let { getBrands } = require('./brands')

let getTopper = function(settings){
   
    let storySettings = settings[0];
    let topperLayout = storySettings.Topper_Layout ? storySettings.Topper_Layout : 'sidebyside';
    let topperTextPosition = storySettings.Topper_Text_Position ? storySettings.Topper_Text_Position : "center-bottom";
    let topperTextBackground = storySettings.Topper_Text_Background ? storySettings.Topper_Text_Background : "gradient";
    let topperSettingsArray = [topperLayout, topperTextPosition, topperTextBackground];
    let topperClass = topperLayout + " " + topperTextPosition + " " + topperTextBackground;
    let mediaChoice = ``;
    let topperImages = [];
    let animationDuration;
    let disableCover = (storySettings.Topper_Contain === true || storySettings.Topper_Contain === "true" || storySettings.Topper_Contain === "TRUE") ? 'contain' : 'cover';
    storySettings.Slide_Duration ? animationDuration = storySettings.Slide_Duration : animationDuration = false;
    let articleAuthorName = storySettings.Byline ? storySettings.Byline : storySettings.Author;
    let articleAuthorLink = storySettings.Byline_Link ? storySettings.Byline_Link : storySettings.AUTHOR_PAGE;
    let noImage = false;

    if(storySettings.Topper_Mp4){
        mediaChoice = `
        <video id="topper-intro-video-sfc-utils" muted loop autoPlay playsInline poster=${storySettings.Topper_Mp4.trim().replace('.mp4', '.jpg')}>
          <source src=${storySettings.Topper_Mp4.trim().replace('.mp4', '.m3u8')} type="application/vnd.apple.mpegurl" />
          <source src=${storySettings.Topper_Mp4.trim()} type="video/mp4" />
        </video>`
    }
    else if(storySettings.TopperVidURL){
        mediaChoice = `
        <video id="topper-intro-video-sfc-utils" muted loop autoPlay playsInline poster=${storySettings.TopperVidURL.trim().replace('.mp4', '.jpg')}>
          <source src=${storySettings.TopperVidURL.trim().replace('.mp4', '.m3u8')} type="application/vnd.apple.mpegurl" />
          <source src=${storySettings.TopperVidURL.trim()} type="video/mp4" />
        </video>`
    }
    else if(storySettings.Topper_ImageID){
        

        // Make sure it's a string before we do string ops
        storySettings.Topper_ImageID = storySettings.Topper_ImageID.toString().trim();
        topperImages = storySettings.Topper_ImageID.split(", ");
        
        if(topperImages.length > 1){
            animationDuration ? animationDuration = topperImages.length * storySettings.Slide_Duration : animationDuration = topperImages.length * 5;
            
            for (let i = 0; i < topperImages.length; i++) {
                let imagePrefix = "https://s.hdnux.com/photos/0/0/0/" + topperImages[i] + "/1/"

                mediaChoice += `<img class="topper-image topper-intro-img-sfc-utils fade${i}"
                    src="${imagePrefix}325x0.jpg"
                    srcSet="${imagePrefix}400x0.jpg 325w,
                        ${imagePrefix}768x0.jpg 768w,
                        ${imagePrefix}1366x0.jpg 1366w,
                        ${imagePrefix}1920x0.jpg 1920w,
                        ${imagePrefix}2560x0.jpg 2560w,
                        ${imagePrefix}3840x0.jpg 3840w">`
            }
        }
            else if(topperImages.length == 1) {
                let imagePrefix = "https://s.hdnux.com/photos/0/0/0/" + topperImages[0] + "/1/"

                mediaChoice += `<img class="topper-image topper-intro-img-sfc-utils"
                    src="${imagePrefix}325x0.jpg"
                    srcSet="${imagePrefix}400x0.jpg 325w,
                        ${imagePrefix}768x0.jpg 768w,
                        ${imagePrefix}1366x0.jpg 1366w,
                        ${imagePrefix}1920x0.jpg 1920w,
                        ${imagePrefix}2560x0.jpg 2560w,
                        ${imagePrefix}3840x0.jpg 3840w">`
            }
        }
    else{
        noImage = true;
    }
    //Split topper images
    const convertDatesToAP = (dateString) => {
        // Convert date string to AP style abbreviations
        let newDateString = dateString;
        newDateString = newDateString.replace('January', 'Jan.').replace('February', 'Feb.').replace('August', 'Aug.').replace('September', 'Sept.').replace('October', 'Oct.').replace('November','Nov.').replace('December','Dec.');
        // Return the result
        return newDateString;
    }
        // Convert date to readable time
        let readablePubDate = convertDatesToAP(storySettings.Publish_Date);
        // Check safely for MOD_DATE
        let readableModDate = storySettings.LastModDate_C2P ? convertDatesToAP(storySettings.LastModDate_C2P) : false;
    let getBylineText = (authorName, authorLink, publishDate, modifyDate) =>{
        let authorNames = []
        if (authorName) {
            authorNames = authorName.split(',')
        }
        let authorLinks = []
        if (authorLink) {
            authorLinks = authorLink.split(',')
        }
        let authorHTML = ""
        for (let i = 0; i<authorNames.length; i++){
            // If we have a matching link, build it
            if (authorLinks[i]){
                authorHTML += `<a itemscope="" itemprop="author" itemtype="http://schema.org/Person" class="byline-link" href=${authorLinks[i].includes('http') ? `\"${authorLinks[i].trim()}\"` : `\"https://${authorLinks[i].trim()}\"`}>${authorNames[i].trim()}</a>`
            } else {
                // If we don't just print the name
                authorHTML += `<span itemscope="" itemprop="author" itemtype="http://schema.org/Person">${authorNames[i].trim()}</span>`
            }
            if (i < authorNames.length - 2){
                authorHTML += ", "
            } else if (i === authorNames.length - 2){
                authorHTML += " and "
            }
        }
        let newPubDateString = publishDate;
        try {
            newPubDateString = publishDate.match(/.*\d{4}/gm)[0];
        } catch (err){
            // That's fine
            console.log(err);
        }
        // let author = authorLink ? 
        //   `<a class="byline-link" href=${authorLink.includes('http') ? `\"${authorLink}\"` : `\"https://${authorLink}\"`}>${authorName.trim()}</a>` 
        //   : authorName.trim();
        let initialText = (`By ${authorHTML} | ${newPubDateString}`);
        if(modifyDate){
            return initialText + (" | Updated: " + modifyDate);
        }
        else{
            return initialText;
        }
    }
    let topperCSS = `
    #topper-intro-video-sfc-utils, .topper-intro-img-sfc-utils {
        max-width: 100%;
        left: 0;
   }
   #topper-intro-video-sfc-utils{
       width: 100%;
       object-fit: ${disableCover};
   }
    #topper-intro-container {
        display: flex;
        max-width: 1400px;
        margin: 0 auto;
   }
   #topper-article-title h1{
    letter-spacing: 1px;
    font-size: 2em;
    margin-top: 0;
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 15px
   }
   #topper-article-title .topper-article-dek{
    margin: 0 auto 10px;
    line-height: 1.2;
    font-size: 1em;
   }
   #topper-article-title .topper-article-byline{
    color: #222;
    line-height: 1.2;
    font-size: 0.8em;
   }
    .topper-intro-img-sfc-utils{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .giftarticle .givegift {
        width: auto;
        display: inline-flex;
        align-items: center;
        padding: 3px 9px !important;
    }
   `
   if(storySettings.Topper_CustomCSS_Inject){
    topperCSS += storySettings.Topper_CustomCSS_Inject;
   }
   if(topperImages.length > 1){
     
       let animationInterval = (100 / topperImages.length);
       for(let i = 0; i < topperImages.length; i++){
        let animationCSS = `@keyframes animfade${i}{`
            for(let interval = 0; interval <= 101; interval+= animationInterval){
                if(Math.round(interval) == 100){
                    if(i != (topperImages.length - 1)){
                    animationCSS += `}`
                    topperCSS += animationCSS;
                    topperCSS += `
                    .fade${i}{
                        opacity: 0;
                        position: absolute;
                        animation: animfade${i} ${animationDuration}s infinite;
                    }
                    `
                }
                else{        
                    // set last image animation           
                        animationCSS += `
                        ${interval - (animationInterval * 1.17)}%{
                            opacity: 0;
                            position: absolute;
                        }
                        ${interval - (animationInterval * 1.16)}%{
                            opacity: 0;
                            position: relative;
                        }
                        ${interval - (animationInterval * 1.15)}%{
                            opacity: 1;
                        }
                        ${interval - animationInterval}%{
                            opacity: 1;
                            position: relative;
                        ${interval - (animationInterval * 0.82)}%{
                            opacity: 0;
                        }
                        ${interval - (animationInterval * 0.92)}%{
                            opacity: 0;
                            position: absolute;
                        }
                        }
                    }
                        `
                        topperCSS += animationCSS;
                    topperCSS += `
                    .fade${i}{
                        opacity: 0;
                        animation: animfade${i} ${animationDuration}s infinite;
                    }
                    `
                    }
                }
                else if(Math.round(((i) * animationInterval)) == Math.round(interval)){
                    animationCSS += `
                    ${interval - (animationInterval * 0.17)}%{
                        opacity: 0;
                        color: red;
                        position: absolute;
                    }
                    ${interval - (animationInterval * 0.16)}%{
                        opacity: 0;
                        color: blue;
                        position: relative;
                    }
                    ${interval - (animationInterval * 0.15)}%{
                        opacity: 0;
                    }
                    ${interval}%{
                        opacity: 1;
                        position: relative;
                    }
                     ${interval + (animationInterval * .7)}%{
                        opacity: 1;
                        position: relative;
                    }
                    ${interval + (animationInterval * 0.81)}%{
                        opacity: 0;
                        position: relative;
                    }
                    ${interval + (animationInterval * 0.82)}%{
                        opacity: 0;
                        position: absolute;
                    }
                    `
                }
               
                else{
                animationCSS += `${interval}%{
                    opacity: 0;
                }`
            }
            }
   
       }
   }
   if(noImage){
       topperCSS += `
       #topper-mediacontainer{
           display: none !important;
       }
       #topper-intro-container{
           justify-content: center;
           align-items: center;
       }
       #topper-article-title{
           text-align: center;
           max-width: 50%;
           margin: 37px auto;
       }
       @media screen and (max-width: 700px){
           #topper-article-title{
               max-width: 80%;
           }
       }
       `
   }
   else{
   for(let setting of topperSettingsArray){
       if(setting == "full"){
           topperCSS += `
           #topper-intro-container > * {
            flex: 0 0 50%;
            overflow: hidden;
        }
        @keyframes arrow-float{
            from{
                bottom: 0;
            }
            to{
                bottom: 10px;
            }
        }
           #topper-intro-container.full {
            background-color: black;
            position: relative;
            top: 0px;
            left: 0;
            right: 0;
            height: calc(100vh - 37px);
       }
       .topper-intro-img-sfc-utils, #topper-intro-video-sfc-utils{
           object-fit: ${disableCover};
           width: 100%;
           height: 100%;
           position: absolute;
       }
       .articleHeader--shareTools {
           justify-content: center;
       }
       #topper-mediacontainer{
           position: absolute;
           top: 37px;
           left: 0;
           right: 0;
           height: calc(100vh - 37px);
           width: 100%;
       }
        #topper-intro-container.full > * {
            flex: 0 0 100%;
       }
        #topper-intro-container.full #topper-article-title {
            position: absolute;
            border: 1px;
            max-width: 500px;
            padding: 20px 40px;
       }
        @media {
            #topper-intro-container.full {
                max-width: 100%;
                position: static;
           }
        }
       
    
    #topper-intro-container.full.center-bottom, #topper-intro-container.full.center-top, #topper-intro-container.full.center {
        justify-content: center;
   }
    
   `
    if(storySettings.Topper_Mobile_Fallback == 'stacked'){
        topperCSS += `     
        @media screen and (max-width: 700px){
            #topper-intro-container > * {
                max-width: 55%;
                margin: 1em auto .5em auto;
           }
            #topper-intro-container.full {
                background-color: unset;
                flex-direction: column-reverse;
                justify-content: flex-end !important;
                height: unset;
                margin-bottom: 30px;
           }
            #topper-intro-container.full > *, #topper-intro-container.full > * {
                flex: 0 0 100%;
                max-width: unset;
                margin: 1em auto .5em auto;
           }
           .topper-intro-img-sfc-utils, #topper-intro-video-sfc-utils{
            object-fit: ${disableCover};
            width: 100%;
            margin: auto;
            position: static;
       }
       #topper-intro-container > * {
           flex: unset !important;
       }
       #topper-mediacontainer{
        flex: unset !important;
        width: 100%;
        height: 40vh;
        position: static;
       }
       .topper-intro-img-sfc-utils, #topper-intro-video-sfc-utils{
           object-fit: contain !important;
           position: relative;
       }
       #topper-intro-container.full #topper-article-title{
           text-align: left !important;
           background: none !important;
           color: black !important;
           position: static;
           padding: 0 !important;
       }
       .topper-article-byline{
           color: #222 !important;
       }
       #topper-intro-container.full > #topper-article-title{
           max-width: unset;
           width: 90%;
       }
       #topper-article-title{
           max-width: unset;
           width: 90%;
       }
        }`
    }
    else if(storySettings.Topper_Mobile_Fallback == 'stacked-reverse'){
        topperCSS += `     
        @media screen and (max-width: 700px){
            #topper-intro-container > * {
                max-width: 55%;
                margin: 1em auto .5em auto;
           }
            #topper-intro-container.full {
                background-color: unset;
                flex-direction: column;
                justify-content: flex-end !important;
                height: unset;
                margin-bottom: 30px;
           }
            #topper-intro-container.full > *, #topper-intro-container.full > * {
                flex: 0 0 100%;
                max-width: unset;
                margin: 1em auto .5em auto;
           }
           .topper-intro-img-sfc-utils, #topper-intro-video-sfc-utils{
            object-fit: ${disableCover};
            width: 100%;
            margin: auto;
       }
       #topper-intro-container > * {
           flex: unset !important;
       }
       #topper-mediacontainer{
        flex: unset !important;
        width: 100%;
        height: 40vh;
        position: relative;
        top: 0px !important
       }
       .topper-intro-img-sfc-utils, #topper-intro-video-sfc-utils{
        object-fit: contain !important;
    }
       #topper-intro-container.full #topper-article-title{
           text-align: left !important;
           background: none !important;
           color: black !important;
           position: static;
           padding: 0 !important;
       }
       .topper-article-byline{
           color: #222 !important;
       }
       #topper-intro-container.full > #topper-article-title{
           max-width: unset;
           width: 90%;
       }
       #topper-article-title{
           max-width: unset;
           width: 90%;
       }
        }`
    }
    else{
        topperCSS += `
        @media screen and (max-width: 700px){
            #topper-article-title{
                padding: 0 20px 50px 20px;
            }
        }
        `
    }
       }
       else if(setting == "opaque" || setting =="opaque-white"){
        topperCSS += `
        #topper-intro-container.full.opaque #topper-article-title, #topper-intro-container.full.opaque-white #topper-article-title {
         background: #ffffff;
    }
        
        `
    }
    else if(setting == "transparent"){
         topperCSS += `
         #topper-intro-container.full.transparent #topper-article-title {
             background: rgba(255,255,255,0.8);
        }
         `
    }
    else if(setting == "opaque-black"){
     topperCSS += `
     #topper-intro-container.full.opaque-black #topper-article-title {
         background: #000000;
         color: white;
    }
     #topper-intro-container.full.opaque-black #topper-article-title time.dateline, #topper-intro-container.full.opaque-black #topper-article-title .topper-article-byline {
         color: lightgray;
    }
    
     
     `
    }
    else if(setting =="transparent-black"){
        topperCSS += `
        #topper-intro-container.transparent-black #topper-article-title {
         background: rgba(0,0,0,0.8);
         color: white;
    }
     #topper-intro-container.transparent-black #topper-article-title time.dateline, #topper-intro-container.transparent-black #topper-article-title .topper-article-byline {
         color: lightgray;
    }
        
        `
    }
    else if (setting == "gradient"){
     topperCSS += `
     #topper-intro-container.full.gradient #topper-article-title {
         max-width: unset !important;
         width: 100%;
         bottom: 0px;
         color: white;
         background: rgb(0,0,0);
         background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, rgba(255,255,255,0) 100%);
         padding-top: 50px;
     }
     #topper-intro-container.full.gradient #topper-article-title time.dateline, #topper-intro-container.full.gradient #topper-article-title .topper-article-byline {
         color: lightgray;
     }
     
     `
    }
       else if(setting == "downright"){
           topperCSS += `
           #topper-intro-container.full.downright #topper-article-title {
            bottom: 40px;
            right: 40px;
       }
       @media screen and (max-width: 700px){
        #topper-intro-container.full.downright #topper-article-title {
            right: 0px;
       }
       }
           `
    }
    else if (setting == "upleft"){
        topperCSS += `
        #topper-intro-container.full.upleft #topper-article-title {
            top: 50px;
            left: 40px;
       }
       @media screen and (max-width: 700px){
        #topper-intro-container.full.upleft #topper-article-title {
            left: 0px;
       }
       }
        `
    }

    else if (setting == "upright"){
        topperCSS += `
        #topper-intro-container.full.upright #topper-article-title {
            top: 50px;
            right: 40px;
       }
       @media screen and (max-width: 700px){
        #topper-intro-container.full.upright #topper-article-title {
            right: 0px;
       }
       }
        `
    }
    else if (setting == "downleft"){
        topperCSS += `
        #topper-intro-container.full.downleft #topper-article-title {
            bottom: 40px;
            left: 40px;
       }
       @media screen and (max-width: 700px){
        #topper-intro-container.full.downleft #topper-article-title {
            left: 0px;
       }
       }
        `
    }
    else if (setting == "center-top"){
        topperCSS += `
        
        #topper-intro-container.full.center-top #topper-article-title {
            top: 50px;
       }
        
        `
    }
    else if(setting =="center-bottom"){
        topperCSS += `
        #topper-intro-container.full.center-bottom #topper-article-title{
            text-align: center;
            justify-content: center;
            bottom: 0px;
        }
        #topper-intro-container.transparent #topper-arrow, #topper-intro-container.opaque #topper-arrow{
            fill: black;
        }
        `
    }
    else if(setting=="center"){
        topperCSS += `
        #topper-intro-container.full.center{
            align-items: center;
        }
        `
    }
    else if(setting == "bottom-right"){
        topperCSS += `
        #topper-intro-container.full.gradient.bottom-right #topper-article-title {
            text-align: right;
            bottom: 0px !important;
            padding-bottom: 20px !important;
            right: 0 !important;
       }
       #topper-intro-container.full.gradient.bottom-right #topper-article-title > *{
           margin-right: 20px !important;
       }
       #topper-intro-container.full.bottom-right #topper-article-title {
        bottom: 40px;
        right: 40px;
   }
       @media screen and (max-width: 700px){
        #topper-intro-container.full.bottom-right #topper-article-title {
            right: 0px;
       }
    }
        `
    }
    else if(setting == "bottom-left"){
        topperCSS += `
        #topper-intro-container.full.gradient.bottom-left #topper-article-title {
            text-align: left;
            bottom: 0px !important;
            padding-bottom: 20px !important;
            left: 0 !important;
       }
       #topper-intro-container.full.gradient.bottom-left #topper-article-title > *{
           margin-left: 20px !important;
       }
       #topper-intro-container.full.bottom-left #topper-article-title {
        bottom: 40px;
        left: 40px;
   }
       @media screen and (max-width: 700px){
        #topper-intro-container.full.bottom-left #topper-article-title {
            left: 0px;
       }
        #topper-intro-container.full.gradient.bottom-left #topper-article-title {
            padding-bottom: 50px;
       }
    }
        `
    }
       else if(setting == "half-stacked" || setting == "half-stacked-reverse"){
           topperCSS += `#topper-intro-container.half-stacked {
            flex-direction: column-reverse;
            margin-bottom: 30px;
       }
        #topper-intro-container.half-stacked-reverse{
            flex-direction: column;
            margin-bottom: 30px;
        }
        #topper-intro-container.half-stacked > *, #topper-intro-container.half-stacked-reverse > * {
            max-width: 55%;
            margin: 1em auto .5em auto;
       }
       #topper-intro-container.half-stacked .topper-intro-img-sfc-utils, #topper-intro-container.half-stacked-reverse .topper-intro-img-sfc-utils {
        object-fit: ${disableCover};
        height: 100% !important;
        width: 100%;
        margin: auto;
   }
   #topper-mediacontainer{
       position: relative;
       width: 55%;
       height: 60vh;
   }
       @media screen and (max-width: 700px){
        #topper-intro-container.half-stacked > *, #topper-intro-container.half-stacked-reverse > * {
            max-width: unset;
            margin: 1em auto .5em auto;
       }
        #topper-mediacontainer{
            flex: unset !important;
            width: 100%;
            height: 40vh;
            position: relative;
        }
        #topper-article-title{
            width: 90%;
        }
       `
       }
       else if(setting == "wide-stacked" || setting =="wide-stacked-reverse"){
        topperCSS += `#topper-intro-container.wide-stacked, #topper-intro-container.half-stacked {
         flex-direction: column-reverse;
         margin-bottom: 30px;
    }
  
    #topper-intro-container.wide-stacked .topper-intro-img-sfc-utils, #topper-intro-container.wide-stacked-reverse .topper-intro-img-sfc-utils {
     object-fit: ${disableCover};
     height: 100% !important;
     width: 100%;
     margin: auto;
}
#topper-mediacontainer{
    width: 100%;
    height: 90vh;
    pointer-events: none;
}
    #topper-intro-container.wide-stacked > *, #topper-intro-container.wide-stacked-reverse > * {
     margin: 1em auto .5em auto;
 }
     #topper-intro-container.wide-stacked-reverse{
         flex-direction: column;
         margin-bottom: 30px;
    }
    @media screen and (max-width: 700px){
        #topper-mediacontainer{
            flex: unset !important;
            width: 100%;
            height: 40vh;
            position: relative;
        }
        #topper-intro-container.wide-stacked .topper-intro-img-sfc-utils, #topper-intro-container.wide-stacked-reverse .topper-intro-img-sfc-utils {
            object-fit: ${disableCover};
        }
        #topper-article-title{
            width: 90%;
        }
    }
    `
    }
      
       else if(setting == "sidebyside" || setting == "sidebyside-reverse"){
           topperCSS += `
           #topper-intro-container > * {
            flex: 0 0 50%;
        }
           #topper-intro-container.sidebyside, #topper-intro-container.sidebyside-reverse{
            align-items: center;
            max-width: unset !important;
             margin: 0;
             height: 60vh;
        }
        #topper-mediacontainer{
            flex: 0 0 50%;
            max-width: 50%;
            margin: 1em 0;
            height: 60vh;
            position: relative;
            display: flex;
            align-items: center;
        }
         .topper-intro-img-sfc-utils {
             width: 100%;
             height: 100%;
             left: 0;
             object-fit: ${disableCover};
        }
        #topper-intro-container.sidebyside > #topper-article-title, #topper-intro-container.sidebyside-reverse > #topper-article-title {
         flex: 0 0 50%;
         max-width: 40%;
         margin: 1em 5%;
         text-align: center;
     }
         #topper-intro-container.sidebyside-reverse{
             flex-direction: row-reverse;
        }
        #topper-intro-container.opaque-black{
            background-color: black;
            
            color: white
       }
        #topper-intro-container.opaque-black .topper-article-byline{
       color: lightgray;
        }
        @media screen and (max-width: 700px){
            #topper-intro-container.sidebyside, #topper-intro-container.sidebyside-reverse{
                height: unset !important;
            }
            #topper-intro-container.sidebyside {
                flex-direction: column-reverse;
                margin-bottom: 30px;
           }
           #topper-intro-container.sidebyside-reverse{
               flex-direction: column !important;
               margin-bottom: 30px;
           }
            #topper-intro-container.sidebyside > *, #topper-intro-container.sidebyside-reverse > * {
                flex: 0 0 100%;
                max-width: unset;
                margin: 1em auto .5em auto;
           }
           #topper-intro-container.sidebyside .topper-intro-img-sfc-utils, #topper-intro-container.sidebyside-reverse .topper-intro-img-sfc-utils {
            object-fit: ${disableCover};
            height: 100% !important;
            width: 100%;
            margin: auto;
       }
       #topper-intro-container > * {
           flex: unset !important;
       }
       #topper-mediacontainer{
        flex: unset !important;
        width: 100%;
        position: relative
        height: 40vh;
       }
       #topper-intro-container.sidebyside > #topper-article-title, #topper-intro-container.sidebyside-reverse > #topper-article-title{
           max-width: unset;
           width: 90%;
       }
       #topper-article-title{
           max-width: unset;
           width: 90%;
       }
        }
           `
       } 
   }
}
    let topperHTML = `
    <style>
    ${topperCSS}
    
    
    </style>
    <div id="topper-intro-container" class="${topperClass}" style="">
    <div id="topper-mediacontainer">
    ${mediaChoice}
    </div>
    <div id="topper-article-title">
    <h1 class="topper-article-hed">${storySettings.Title}</h1>
    <h2 class="topper-article-dek">${storySettings.Deck}</h2>
    <h3 class ="topper-article-byline">${getBylineText(articleAuthorName, articleAuthorLink, readablePubDate, readableModDate)}</h3>
    <div class="articleHeader--shareTools"><div class="share-list" id="sharebutton-wrapper"></div></div>
    </div>
    </div>
`

  return topperHTML
}

module.exports = { getTopper }