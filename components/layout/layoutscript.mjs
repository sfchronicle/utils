import React from "react";

const LayoutScript = ({ domain }) => {
  let domainString = "";
  // Check if domain is string
  if (domain && typeof domain === "string") {
    domain = domain.replace("https://www.", "").replace(".com", "");
    domainString = `
      var treg = treg || {};
      treg.url_overide="realm.${domain}.noux.com";
    `;
  }
  return (
    <>
      <script src="https://projects.sfchronicle.com/shared/js/jquery.min.js"></script>
      {domainString && (
        <script dangerouslySetInnerHTML={{ __html: domainString }}></script>
      )}
      <script src="https://treg.hearstnp.com/treg.js"></script>
    </>
  );
};

export default LayoutScript;
