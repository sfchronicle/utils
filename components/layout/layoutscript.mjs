import React from "react";

const LayoutScript = ({ domain, newMarketing = false }) => {
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
      {newMarketing && (
        <script src="https://d29h410fx4s4sw.cloudfront.net/marketing/marketing.umd.min.js"></script>
      )}
      {domainString && (
        <script dangerouslySetInnerHTML={{ __html: domainString }}></script>
      )}
      {!newMarketing && (
        <script src="https://projects.sfchronicle.com/shared/js/jquery.min.js"></script>
      )}
      {!newMarketing && (
        <script src="https://treg.hearstnp.com/treg.js"></script>
      )}
    </>
  );
};

export default LayoutScript;
