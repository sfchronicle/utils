
let { getBrands } = require('./brands')

// Handle nav for various markets and include nav options for other links
let getFooter = function(meta, forceColor){

	// If we aren't passing meta in, we have to call getSettings here
	if (!meta){
		let {getSettings} = require('./settings')
		meta = getSettings()
	}

	let year = new Date().getFullYear()
 
 	let {attributes: {marketPrefix, invert}} = getBrands(meta.PROJECT.MARKET_KEY)

 	// Handle various CT domains
 	let eedition = "";
	if (typeof window !== "undefined"){
		switch(window.location.origin){
			case "https://www.ctpost.com": marketPrefix = "ct"; eedition = "CT_PO"; break;
			case "https://www.nhregister.com": marketPrefix = "nh"; eedition = "CT_NHR"; break;
			case "https://www.greenwichtime.com": marketPrefix = "gt"; eedition = "CT_GT";  break;
			case "https://www.stamfordadvocate.com": marketPrefix = "st"; eedition = "CT_AD"; break;
			case "https://www.thehour.com": marketPrefix = "th"; eedition = "CT_HR"; break;
			case "https://www.newstimes.com": marketPrefix = "nt"; eedition = "CT_NT"; break;
			case "https://www.middletownpress.com": marketPrefix = "mp"; eedition = "CT_MP"; break;
			case "https://www.ctinsider.com": marketPrefix = "in"; break;
		}
	}
	// If inverted, do black on white nav
	let invertClass = ""
	let color = "white"
	if (invert || forceColor === "white"){
		invertClass = "invert"
		color = "black"
	}

	const footerLinks = {
		"SFC": {
			"About": [
				{text:"Our Company",link:"http://www.hearst.com/newspapers/san-francisco-chronicle"},
				{text:"Privacy Notice / Notice at Collection",link:"https://www.sfchronicle.com/privacy_policy"},
				{text:"Your California Privacy Rights",link:"https://www.sfchronicle.com/privacy_policy/#caprivacyrights"},
				{text:"Interest Based Ads",link:"https://www.sfchronicle.com/privacy_policy/#interestbasedads"},
				{text:"Terms of Use",link:"https://www.sfchronicle.com/terms_of_use/"},
				{text:"Careers",link:"https://eevd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_15/pages/29004"},
				{text:"Advertising",link:"https://marketing.sfgate.com/advertise-with-us-today"}
			],
			"Newsroom": [
				{text:"Ethics Policy",link:"https://www.sfchronicle.com/file/759/0/7590-7528-Hearst_Newspaper_Group_Standards_and_Ethics_Policy.pdf"},
				{text:"How We Cover Politics",link:"https://www.sfchronicle.com/local-politics/article/Election-2020-inside-the-newsroom-How-15519702.php"},
				{text:"Endorsement Process",link:"https://www.sfchronicle.com/opinion/article/How-The-Chronicle-s-endorsement-process-works-14499467.php"},
				{text:"News Tips",link:"https://www.sfchronicle.com/newstips/"},
				{text:"Newsroom News", link:"https://www.sfchronicle.com/about/newsroomnews/"}
			],
			"Contact": [
				{text:"Customer Service",link:"https://www.sfchronicle.com/customer_service"},
				{text:"FAQ",link:"https://www.sfchronicle.com/faq"},
				{text:"Newsroom Contacts",link:"https://www.sfchronicle.com/newsroom_contacts"}
			],
			"CCPA": [
				{text:"Do Not Sell My Personal Information",link:"https://www.sfchronicle.com/mydata/"}
			],
			"Services": [
				{text:"Subscriber Services",link:"https://subscription.sfchronicle.com/"},
				{text:"e-Edition",link:"https://www.sfchronicle.com/e-edition"},
				{text:"Reprints & Permissions",link:"https://www.parsintl.com/publication/sfchronicle/"},
				{text:"Corporate Subscriptions",link:"https://www.sfchronicle.com/corporatesubscriptions/"},
				{text:"App",link:"https://www.sfchronicle.com/mobile-apps/"},
				{text:"Archives",link:"https://www.sfchronicle.com/archive/search/subscriber/"},
				{text:"Membership",link:"https://www.sfchronicle.com/membership"},
				{text:"Store",link:"https://sfchronicle.myshopify.com/?_ga=2.86091355.2125278198.1634578934-724761130.1630448969"},
				{text:"Subscription Offers",link:"https://subscription.sfchronicle.com/checkout/430/866/?siteID=SFC&origin=footer"},
				{text:"sfgate.com",link:"https://www.sfgate.com/"}
			]
		},
		"Houston": {
		  "About": [
		    {
		      "text": "Our Company",
		      "link": "https://www.hearst.com/newspapers/houston-chronicle"
		    },
		    {
		      "text": "Newspaper Delivery Safety Procedures",
		      "link": "https://www.houstonchronicle.com/customer_service/article/How-Hearst-Newspapers-is-delivering-information-15151944.php"
		    },
		    {
		      "text": "Privacy Notice",
		      "link": "https://www.houstonchronicle.com/privacy_policy"
		    },
		    {
		      "text": "Your California Privacy Rights",
		      "link": "https://www.houstonchronicle.com/privacy_policy/#caprivacyrights"
		    },
		    {
		      "text": "Interest Based Ads",
		      "link": "https://www.houstonchronicle.com/privacy_policy/#interestbasedads"
		    },
		    {
		      "text": "Terms of Use",
		      "link": "https://www.houstonchronicle.com/terms_of_use/"
		    },
		    {
		      "text": "Advertising",
		      "link": "http://marketing.chron.com/"
		    },
		    {
		      "text": "Careers",
		      "link": "http://www.chron.com/careers/"
		    }
		  ],
		  "Contact": [
		    {
		      "text": "Subscribe",
		      "link": "https://offers.houstonchronicle.com/?origin=footer&variant=wcm.88837"
		    },
		    {
		      "text": "e-Edition",
		      "link": "https://subscription.houstonchronicle.com/eedition"
		    },
		    {
		      "text": "Archives",
		      "link": "https://www.houstonchronicle.com/archive/"
		    },
		    {
		      "text": "Customer Service",
		      "link": "https://www.houstonchronicle.com/customer_service"
		    },
		    {
		      "text": "Frequently Asked Questions",
		      "link": "https://www.houstonchronicle.com/faq"
		    },
		    {
		      "text": "Newsroom Contacts",
		      "link": "https://www.houstonchronicle.com/newsroom_contacts"
		    }
		  ],
		},
		"SanAntonio": {
		  "About": [
		    {
		      "text": "Our Company",
		      "link": "https://www.hearst.com/newspapers/san-antonio-express-news"
		    },
		    {
		      "text": "Newspaper Delivery Safety Procedures",
		      "link": "https://www.expressnews.com/customer_service/article/How-Hearst-Newspapers-is-delivering-information-15152120.php"
		    },
		    {
		      "text": "Privacy Notice",
		      "link": "https://www.expressnews.com/privacy_policy/"
		    },
		    {
		      "text": "Your California Privacy Rights",
		      "link": "https://www.expressnews.com/privacy_policy/#caprivacyrights"
		    },
		    {
		      "text": "Interest Based Ads",
		      "link": "https://www.expressnews.com/privacy_policy/#interestbasedads"
		    },
		    {
		      "text": "Terms of Use",
		      "link": "https://www.expressnews.com/terms_of_use/"
		    },
		    {
		      "text": "Advertising",
		      "link": "http://www.hearstmediasa.com/"
		    },
		    {
		      "text": "Careers",
		      "link": "http://www.mysanantonio.com/careers/"
		    },
		    {
		      "text": "e-edition",
		      "link": "http://digital.olivesoftware.com/Olive/ODN/SanAntonioExpressNews/Default.aspx"
		    },
		  ],
		  "Contact": [
		    {
		      "text": "Archives",
		      "link": "https://www.expressnews.com/archive"
		    },
		    {
		      "text": "Customer Service",
		      "link": "https://www.expressnews.com/customer_service"
		    },
		    {
		      "text": "Frequently Asked Questions",
		      "link": "https://www.expressnews.com/subscriberfaqs/"
		    },
		    {
		      "text": "Newsroom Contacts",
		      "link": "https://www.expressnews.com/newsroom_contacts"
		    }
		  ]
		},
		"Albany": {
		  "About": [
		    {
		      "text": "Our Company",
		      "link": "http://www.hearst.com/newspapers/albany-times-union",
		    },
		    {
		      "text": "Newspaper Delivery Safety Procedures",
		      "link": "https://www.timesunion.com/home/article/How-Hearst-Newspapers-is-delivering-information-15152131.php"
		    },
		    {
		      "text": "Advertising",
		      "link": "https://www.timesunion.com/advertising/"
		    },
		    {
		      "text": "Interest Based Ads",
		      "link": "https://www.timesunion.com/privacypolicy/#interestbasedads"
		    },
		    {
		      "text": "Terms of Use",
		      "link": "https://www.timesunion.com/termsofservice/"
		    },
		    {
		      "text": "Privacy Notice",
		      "link": "https://www.timesunion.com/privacypolicy/"
		    },
		    {
		      "text": "Your California Privacy Rights",
		      "link": "https://www.timesunion.com/privacypolicy/#additionalinformationforcaliforniaresidents"
		    },
		    {
		      "text": "Contact Us",
		      "link": "https://www.timesunion.com/help/"
		    },
		    {
		      "text": "Jobs at the TU",
		      "link": "https://hearst.referrals.selectminds.com/hearst-capital-region"
		    }
		  ],
		  "Contact": [
		    {
		      "text": "Blogs",
		      "link": "https://www.timesunion.com/blogs/"
		    },
		    {
		      "text": "Weather",
		      "link": "https://www.timesunion.com/weather/"
		    },
		    {
		      "text": "School Closings",
		      "link": "https://www.timesunion.com/closings/"
		    },
		    {
		      "text": "Events Calendar",
		      "link": "https://www.timesunion.com/events/"
		    },
		    {
		      "text": "Weddings/Celebrations",
		      "link": "https://www.timesunion.com/celebrations/"
		    },
		    {
		      "text": "Births",
		      "link": "https://www.timesunion.com/celebrations/"
		    },
		    {
		      "text": "Obituaries",
		      "link": "http://www.legacy.com/obituaries/timesunion-albany/?_ga=2.192771562.1778481536.1592510469-1132101746.1591222524"
		    },
		    {
		      "text": "Online Store",
		      "link": "https://www.timesunion.com/onlinestore/"
		    },
		    {
		      "text": "Puzzles Palace",
		      "link": "http://puzzles.timesunion.com/"
		    }
		  ],
		  "Services": [
		    {
		      "text": "Subscriber Services",
		      "link": "https://subscription.timesunion.com/"
		    },
		    {
		      "text": "Home Delivery",
		      "link": "https://offers.timesunion.com/?offerid=254&origin=footer&variant=timesunion.com.footer"
		    },
		    {
		      "text": "Become a Carrier",
		      "link": "http://www.timesunion.com/carriers"
		    },
		    {
		      "text": "iPad app",
		      "link": "https://www.timesunion.com/ipad/"
		    },
		    {
		      "text": "Copyright and Reprint",
		      "link": "https://www.timesunion.com/copyright/"
		    },
		    {
		      "text": "e-Edition",
		      "link": "https://subscription.timesunion.com/eedition/"
		    }
		  ]
		},
		"CT": {
		  "About": [
		    {
		      "text": "Newspaper Delivery Safety Procedures",
		      "link": "/article/How-Hearst-Newspapers-is-delivering-information-15152129.php",
		    },
		    {
		      "text": "Privacy Notice",
		      "link": "/privacy/"
		    },
		    {
		      "text": "Your California Privacy Rights",
		      "link": "/privacy/#additionalinformationforcaliforniaresidents"
		    },
		    {
		      "text": "Interest Based Ads",
		      "link": "/privacy/#interestbasedads"
		    },
		    {
		      "text": "Terms of Use",
		      "link": "/tos/"
		    },
		    {
		      "text": "Advertising",
		      "link": "https://hearstmediact.com/"
		    },
		    {
		      "text": "Careers",
		      "link": "http://www.hearst.com/careers"
		    }
		  ],
		  "Contact": [
		    {
		      "text": "FAQ",
		      "link": "/faq/"
		    },
		    {
		      "text": "Customer Service",
		      "link": "/feedback/"
		    },
		    {
		      "text": "Today's e-Edition",
		      "link": "https://subscription.hearstmediact.com/eEdition?siteID="+eedition
		    },
		    {
		      "text": "Contact Us",
		      "link": "/contact/"
		    }
		  ],
		  "Connect": [
		    {
		      "text": "RSS",
		      "link": "/rss/"
		    },
		    {
		      "text": "Newsletter Sign-Up",
		      "link": "/newsletters/"
		    }
		  ]
		},
		"TK": {
		  "About": [
		    {
		      "text": "Advertising",
		      "link": "https://hearstmediact.com/"
		    },
		    {
		      "text": "Careers",
		      "link": "http://www.hearst.com/careers"
		    }
		  ]
		}
	}

	let marketLinks = footerLinks[meta.PROJECT.MARKET_KEY]
	// Special case for ctinsider, which doesn't fit the normal CT mold
	if (marketPrefix === "in"){
		marketLinks = {
			"About": [
		    {
		      "text": "Our Company",
		      "link": "https://www.hearst.com/newspapers/hearst-connecticut-media-group",
		    },
		    {
		      "text": "Ad Choices",
		      "link": "https://optout.aboutads.info/?c=2&lang=EN"
		    },
		    {
		      "text": "Careers",
		      "link": "https://eevd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1"
		    },
		    {
		      "text": "Terms of Use",
		      "link": "https://www.ctinsider.com/tos/"
		    },
		    {
		      "text": "Advertising",
		      "link": "https://hearstmediact.com/?_ga=2.121588744.1440353062.1624467793-1527008254.1622131828"
		    },
		    {
		      "text": "Privacy Notice / Notice of Collection",
		      "link": "https://www.ctinsider.com/privacy/"
		    },
		    {
		      "text": "Your Privacy Rights",
		      "link": "https://www.ctinsider.com/privacy/#your_rights"
		    },
		    {
		      "text": "Your California Privacy Rights",
		      "link": "https://www.ctinsider.com/privacy/#additionalinformationforcaliforniaresidents"
		    }
		  ],
		  "Contact": [
		    {
		      "text": "Contact Us",
		      "link": "https://www.ctinsider.com/contact/"
		    },
		    {
		      "text": "FAQ",
		      "link": "https://www.ctinsider.com/faq/"
		    }
		  ]
		}
	}

	let linkHTML = ""
	Object.keys(marketLinks).forEach(function(key,index) {
		// Open the new section
		linkHTML += '<li><div class="footer-title">'+key+'</div><ul class="section">'

		// Create the link items
		for (link in marketLinks[key]){
			let thisLink = marketLinks[key][link]
			linkHTML += '<li><a href="'+thisLink.link+'" target="_blank" rel="noopener noreferrer">'+thisLink.text+'</a></li>'
		}

	  // Close the new section 
	  linkHTML += '</ul></li>'
	});

	let footerHTML = `<footer class="pageFooter ${invertClass}">
    <div class="lock">
      <div class="pageFooter--wrapper">
        <div class="pageFooter--left">
          <a
            href="/"
            class="pageFooter--left-logo"
            aria-label="Click to go to the homepage"
            style="background-image: url(https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-${color}.png)"
          >
            Homepage
          </a>
          <a
            href="/"
            class="pageFooter--left-logo mobile"
            aria-label="Click to go to the homepage"
            style="background-image: url(https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-square-${color}.png)"
          >
            Homepage
          </a>
        </div>
        <div class="pageFooter--right">
          <div class="pageFooter--right-topLine">
            <button id="scrollTop" class="return">
              To Top
            </button>
          </div>
          <div class="pageFooter--right-links">
            <div class="hdnce-e hdnce-item-87230">
              <ul class="wrapper">
                ${linkHTML}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="pageFooter--branding">
        <img
          class="pageFooter--branding-logo"
          src="https://sfchronicle.com/img/hearst_newspapers_logo.svg"
          alt="San Francisco Chronicle logo"
        />
        <span class="pageFooter--branding-copyright">
          ©${year}
          Hearst
        </span>
      </div>
    </div>
  </footer>`

  return footerHTML
}

module.exports = { getFooter }