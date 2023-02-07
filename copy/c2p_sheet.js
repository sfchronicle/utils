/*

If confirmed through the startup prompt, this task will create a C2P sheet that handles the metadata for this project

*/

var { google } = require("googleapis");
var api = google.sheets("v4");
var writeFile = require("write");
var authObj = require("./googleauth");
var fs = require("fs");
var os = require("os");
var path = require("path");

// Get config so we're ready to write it back out
// let config = fs.readFileSync('../project-config.json')
// let configData = JSON.parse(config)

let googleAuth = (configData) => {
  var auth = null;
  authObj
    .authenticate({ fallback: false })
    .then((resp) => {
      auth = resp;
      createSheet(auth, false, configData).catch(() => {
        // If the first attempt failed, then make another req using the fallback
        authObj.authenticate({ fallback: true }).then((resp) => {
          auth = resp;
          createSheet(auth, true, configData);
        });
      });
    })
    .catch(() => {
      // Failure if we fall back but there's no token
      auth = authObj.task();
      createSheet(auth, true, configData);
    });
};

let createSheet = (auth, fallback, configData) => {
  console.log(configData, "config data from create sheet");
  return new Promise((resolveAll, rejectAll) => {
    let gmail;
    if (!fallback) {
      // Only need gmail to share if it's not a fallback
      try {
        let credsLocation = path.join(os.homedir(), ".credentials.json");
        let credsData = JSON.parse(fs.readFileSync(credsLocation, "utf-8"));
        gmail = credsData.gmail;
      } catch (err) {
        // If we had any trouble getting the gmail address, fail out
        console.log(err);
        rejectAll();
        return;
      }
      if (!gmail) {
        // If gmail is blank, fail out
        console.log("'gmail' is blank in credentials file!");
        rejectAll();
        return;
      }
    }

    const drive = google.drive({ version: "v3", auth });
    const body = { title: "New C2P sheet" };
    const templateId = "1DUvYnFdxtBv1AXcDI9X00s_opUSu4uHJmd5LNemCN9E";
    drive.files.copy(
      {
        fileId: templateId, // Base template
        resource: body,
        //'copyCollaborators': true // This doesn't work unfortunately
      },
      (err, resp) => {
        console.log("SHEET RESP", resp);
        // Make edits to the sheet to match the repo details
        let resources = {
          auth: auth,
          spreadsheetId: resp.data.id,
          resource: {
            valueInputOption: "RAW",
            data: [
              {
                range: "story_settings!A2",
                values: [[configData.PROJECT.MARKET_KEY]],
              },
              {
                range: "story_settings!B2",
                values: [[configData.PROJECT.SUBFOLDER]],
              },
              {
                range: "story_settings!C2",
                values: [[configData.PROJECT.SLUG]],
              },
              {
                range: "system_settings!A2",
                values: [[configData.PROJECT.SLUG]], // Repo is usually slug by default
              },
            ],
          },
        };
        api.spreadsheets.values.batchUpdate(
          resources,
          (updateErr, updateResp) => {
            if (updateErr) {
              console.log("Data Error :", updateErr);
            }
          }
        );

        // Write out config with new sheet added
        configData.GOOGLE_SHEETS = [resp.data.id];
        writeFile("project-config.json", JSON.stringify(configData, null, 2));

        // Okay, now give the team permissions
        if (err) {
          console.log("An error prevented the creation of this sheet!");
          rejectAll();
        } else {
          // If this is a fallback, it was created with the user's account, so we shouldn't need to share it -- finish up
          if (fallback) {
            console.log(
              "The above errors were a failure to create the new sheet with a service account! Your default token was used instead."
            );
            console.log(
              "Your new C2P sheet should be live at this URL:",
              `https://docs.google.com/spreadsheets/d/${resp.data.id}/edit`
            );
            resolveAll();
          } else {
            // Transfer ownership to the user
            const permission = {
              type: "user",
              role: "owner",
              emailAddress: gmail
            };
            drive.permissions.create(
              {
                resource: permission,
                fileId: resp.data.id, // Modify the created file
                transferOwnership: true
              },
              (permErr, permResp) => {
                //console.log("permResp", permResp, permErr)
                if (permErr) {
                  console.log("An error prevented the sharing of this sheet!");
                  rejectAll();
                } else {
                  console.log(
                    "Your new C2P sheet should be live at this URL:",
                    `https://docs.google.com/spreadsheets/d/${resp.data.id}/edit`
                  );
                  console.log(
                    `NOTE: It may take a few seconds before your gmail, ${gmail}, has access`
                  );
                  // Now share with the service account
                  const permission2 = {
                    type: "user",
                    role: "writer",
                    emailAddress: "sfchronicle-gatsby@zinc-proton-250521.iam.gserviceaccount.com",
                  };
                  drive.permissions.create(
                    {
                      resource: permission2,
                      fileId: resp.data.id, // Modify the created file
                    },
                    (permErr, permResp) => {
                      if (permErr) {
                        console.log("An error prevented the sharing of this sheet with the service account!");
                        rejectAll();
                      } else {
                        console.log(
                          `Sheet also shared with service account for quick deploying!`
                        );
                        resolveAll();
                      }
                    }
                  )
                }
              }
            );
          }
        }
      }
    );
  });
};

module.exports = { googleAuth };
