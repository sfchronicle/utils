import React from "react";

const newRelicBrowserConfig = `
;window.NREUM||(NREUM={});NREUM.init={distributed_tracing:{enabled:true},performance:{capture_measures:true},browser_consent_mode:{enabled:false},privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"],capture_payloads:'none'}};

;NREUM.loader_config={accountID:"3540744",trustKey:"41019",agentID:"626880230",licenseKey:"NRJS-bef5859a29fb3c538c2",applicationID:"626880230"};
;NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"NRJS-bef5859a29fb3c538c2",applicationID:"626880230",sa:1};
`;

const LayoutScript = ({ domain, marketingVer = 1 }) => {
  let domainString = "";
  // Check if domain is string
  if (domain && typeof domain === "string") {
    // To handle multi-site publishing:
    // Cut off after .com
    domain = domain.substring(0, domain.indexOf(".com") + 4);
    // Fallback handling for domain
    domain = domain.replace("https://www.", "").replace(".com", "");
    domainString = `
      var treg = treg || {};
      treg.url_overide="realm.${domain}.noux.com";
    `;
  }
  return (
    <>
      {marketingVer === 2 && (
        <>
          <script src="https://d29h410fx4s4sw.cloudfront.net/marketing/marketing.umd.min.js"></script>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: newRelicBrowserConfig }}
          />
          <script
            type="text/javascript"
            src="https://js-agent.newrelic.com/nr-loader-spa-1.313.1.min.js"
            crossOrigin="anonymous"
          />
        </>
      )}
      {domainString && (
        <script dangerouslySetInnerHTML={{ __html: domainString }}></script>
      )}
      {marketingVer === 1 && (
        <script src="https://projects.sfchronicle.com/shared/js/jquery.min.js"></script>
      )}
      {marketingVer === 1 && (
        <script src="https://treg.hearstnp.com/treg.js"></script>
      )}
    </>
  );
};

export default LayoutScript;
