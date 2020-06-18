
let { getSettings } = require('./settings')
let settings = getSettings()

let { getMarketConfig } = require('./marketconfig')

// Handle nav for various markets and include nav options for other links
let getFooter = function(inverted){

	let year = new Date().getFullYear()
 
 	let [marketPrefix, invert] = getMarketConfig(inverted)

	// If inverted, do black on white nav
	let invertClass = ""
	let color = "white"
	if (inverted){
		invertClass = "invert"
		color = "black"
	}

	const footerLinks = {
		"SFC": {
			"About": [
				{text:"Our Company",link:"http://www.hearst.com/newspapers/san-francisco-chronicle"},
				{text:"Newspaper Delivery Safety Procedures",link:"https://www.sfchronicle.com/customer_service/article/How-Hearst-Newspapers-is-delivering-information-15151951.php"},
				{text:"Privacy Notice",link:"https://www.sfchronicle.com/privacy_policy"},
				{text:"Your California Privacy Rights",link:"https://www.sfchronicle.com/privacy_policy/#caprivacyrights"},
				{text:"Interest Based Ads",link:"https://www.sfchronicle.com/privacy_policy/#interestbasedads"},
				{text:"Terms of Use",link:"https://www.sfchronicle.com/terms_of_use/"},
				{text:"Careers",link:"http://www.sfchronicle.com/hr/"},
				{text:"Advertising",link:"https://marketing.sfgate.com/advertise-with-us-today"}
			],
			"Newsroom": [
				{text:"Ethics Policy",link:"https://www.sfchronicle.com/file/519/1/5191-Chronicle%20ethics%2C%20standards%20and%20practices.pdf"},
				{text:"Corrections Policy",link:"https://www.sfchronicle.com/file/518/8/5188-Correction%20policy.pdf"},
				{text:"Visual Ethics Guidelines",link:"https://www.sfchronicle.com/file/519/0/5190-San%20Francisco%20Chronicle%20Photo%20Ethics.pdf"},
				{text:"Anonymous Sources Policy",link:"https://www.sfchronicle.com/file/518/9/5189-SFChronicle%20anonymous%20source%20policy.pdf"},
				{text:"Endorsement Process",link:"https://www.sfchronicle.com/opinion/article/How-The-Chronicle-s-endorsement-process-works-14499467.php"},
				{text:"News Tips",link:"https://newstips.sfchronicle.com/"}
			],
			"Contact": [
				{text:"Customer Service",link:"https://www.sfchronicle.com/customer_service"},
				{text:"FAQ",link:"https://www.sfchronicle.com/faq"},
				{text:"Newsroom Contacts",link:"https://www.sfchronicle.com/newsroom_contacts"}
			],
			"CCPA": [
				{text:"Do Not Sell My Info"}
			],
			"Services": [
				{text:"Subscriber Services",link:"https://subscription.sfchronicle.com/"},
				{text:"e-edition",link:"https://www.sfchronicle.com/e-edition"},
				{text:"Reprints & Permissions",link:"https://www.parsintl.com/publication/sfchronicle/"},
				{text:"Corporate Subscriptions",link:"https://www.sfchronicle.com/corporatesubscriptions/"},
				{text:"App",link:"https://www.sfchronicle.com/mobile-apps/"},
				{text:"Archives",link:"https://www.sfchronicle.com/archive"},
				{text:"Membership",link:"https://www.sfchronicle.com/membership"},
				{text:"Store",link:"https://sfchronicle.myshopify.com/?_ga=2.16099766.1468984225.1592235434-1564600934.1588693453"},
				{text:"Subscription Offers",link:"https://offers.sfchronicle.com/subscribe/?origin=sfc.footer&ipid=suboffers"},
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
		}
	}

	const marketLinks = footerLinks[settings.PROJECT.MARKET_KEY]
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

	let navHTML = `<footer class="pageFooter ${invertClass}">
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
              Return to top
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

  return navHTML
}

module.exports = { getFooter }