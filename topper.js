
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
    let disableCover = storySettings.Topper_Contain == 'true' ? 'contain' : 'cover';
    storySettings.Slide_Duration ? animationDuration = storySettings.Slide_Duration : animationDuration = false;
    let imageResolution = 1280;
    let articleAuthorName = storySettings.Byline ? storySettings.Byline : storySettings.Author; 

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
        storySettings.Topper_ImageID = storySettings.Topper_ImageID.toString();
        topperImages = storySettings.Topper_ImageID.split(", ");
        let currentImageID = topperImages[0]
        let currentImageIndex = 0;
        let topperImageURLs =[];
        for(let id of topperImages){
            topperImageURLs.push("https://s.hdnux.com/photos/0/0/0/" + id + "/1/" + imageResolution + "x0.jpg")
        }
        let currentImageURL = topperImageURLs[0];
        
        if(topperImages.length > 1){
            animationDuration ? animationDuration = topperImages.length * storySettings.Slide_Duration : animationDuration = topperImages.length * 5;
            
            for (let i = 0; i < topperImages.length; i++){
                mediaChoice += `<img class = "topper-intro-img-sfc-utils fade${i}" src=${topperImageURLs[i]}>`
            }
        }
            else if(topperImages.length == 1){
                mediaChoice = `<img class="topper-intro-img-sfc-utils" src=${topperImageURLs[0]}>`
            }
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
    let getBylineText = (authorName, publishDate, modifyDate) =>{
        let newPubDateString = publishDate;
        try {
            newPubDateString = publishDate.match(/.*\d{4}/gm)[0];
        } catch (err){
            // That's fine
            console.log(err);
        }
        let initialText = ("By " + authorName + " | " + newPubDateString);
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
   #topper-arrow{
       display: none;
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
    line-height: 1;
    margin-bottom: 15px
   }
   #topper-article-title .topper-article-dek{
    margin: 0 auto 10px;
    line-height: 1.2;
    font-size: 1.2em;
   }
   #topper-article-title .topper-article-byline{
    color: #222;
    line-height: 1.2;
   }

   #topper-intro-container.opaque #topper-article-title, #topper-intro-container.opaque-black #topper-article-title, #topper-intro-container.transparent #topper-article-title, #topper-intro-container.transparent-black #topper-article-title{

   }
    .topper-intro-img-sfc-utils{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
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
                        ${interval - (animationInterval * 0.17)}%{
                            opacity: 0;
                            position: absolute;
                        }
                        ${interval - (animationInterval * 0.16)}%{
                            opacity: 0;
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

   for(let setting of topperSettingsArray){
       if(setting == "full"){
           topperCSS += `

           #topper-intro-container > * {
            flex: 0 0 50%;
            overflow: hidden;
        }
        #topper-arrow{
            display: none;
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0%);
            bottom: 0;
            animation: arrow-float 1s ease-in-out alternate infinite;
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
        console.log("mobile stacked")
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
       #topper-intro-container.full #topper-article-title{
           text-align: left !important;
           background: none !important;
           color: black !important;
           position: static;
           padding-top: unset !important;
           padding: 0 40px !important
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
        console.log("mobile stacked reverse")
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
        position: static;
       }
       #topper-intro-container.full #topper-article-title{
           text-align: left !important;
           background: none !important;
           color: black !important;
           position: static;
           padding-top: unset !important;
           padding: 0 40px !important;
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
       else if(setting == "opaque"){
        topperCSS += `
        #topper-intro-container.full.opaque #topper-article-title {
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
    <h3 class ="topper-article-byline">${getBylineText(articleAuthorName, readablePubDate, readableModDate)}</h3>
    </div>
    <svg id="topper-arrow" xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 0 22 22" width="44px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <polyline points="6 9 12 15 18 9" />
</svg>
    </div>
`

  return topperHTML
}

module.exports = { getTopper }