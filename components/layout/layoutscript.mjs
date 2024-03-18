import React from "react";

const LayoutScript = (domain) => {
  let domainString = "";
  if (domain) {
    domain = domain.replace(".com", "");
    domainString = `
      var treg = treg || {};
      treg.url_override="realm.${domain}.noux.com";
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
