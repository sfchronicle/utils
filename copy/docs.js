/*


  * Uses the Google Drive API to parse Google Doc with ArchieML generate JSON file
  * Docs must be shared with the service account email before they can be accessed with this task
  * @param {object} config standard object from project-config.json or project.json
  * @param {string} directory optional alternate path to directory in which to save the output
  * @param {array} filenames optional array of objects with name and id key/values used to specify a filename for a specific doc


 */

var { google } = require("googleapis");
var async = require("async");
var url = require("url");
var writeFile = require("write");
var authObj = require("./googleauth");
var archieml = require("archieml");
var htmlparser = require("htmlparser2");
var Entities = require("html-entities").AllHtmlEntities;

let googleAuth = (config, directory = null, filenames = null, useID = null) => {
  var auth = null;
  authObj
    .authenticate({ fallback: false })
    .then((resp) => {
      auth = resp;
      grabDocs(auth, config, directory, filenames, useID).catch(() => {
        // If the first attempt failed, then make another req using the fallback
        authObj.authenticate({ fallback: true }).then((resp) => {
          auth = resp;
          grabDocs(auth, config, directory, filenames, useID);
        });
      });
    })
    .catch(() => {
      // Failure if we fall back but there's no token
      auth = authObj.task();
      grabDocs(auth, config, directory, filenames, useID);
    });
};

var camelCase = function (str) {
  return str.replace(/[^\w]+(\w)/g, function (all, match) {
    return match.toUpperCase();
  });
};

/*
 * Large document sets may hit rate limits; you can find details on your quota at:
 * https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=<project>
 * where <project> is the project you authenticated with using `grunt google-auth`
 */
let grabDocs = (
  auth,
  config,
  directory = null,
  filenames = null,
  useID = null
) => {
  return new Promise((resolve, reject) => {
    var drive = google.drive({
      auth,
      version: "v3",
    });

    async.eachLimit(
      config.GOOGLE_DOCS,
      3, // adjust this up or down based on rate limiting
      async function (fileId) {
        var meta = await drive.files
          .get({
            fileId,
          })
          .catch(() => {
            // Maybe service account we doesn't have permissions -- try with normal token
            reject();
          });
        if (!meta) {
          return;
        }

        var filename = meta.data.name.replace(/\s+/g, "_");
        if (useID) {
          // If we want to use the ID as the filename, do it
          filename = fileId;
        } else if (filenames) {
          //find the appropriate filename if filenames arr is included in params
          let match = filenames.find((f) => f.id === fileId);
          filename = match.name;
        }

        //specify directory if included in params
        directory = directory || "src/data/";

        //build file path
        var file_path = `${directory}${filename}.json`;

        drive.files.export({ fileId: fileId, mimeType: "text/html" }, function (
          err,
          docHtml
        ) {
          //Here's the parser
          var handler = new htmlparser.DomHandler(function (error, dom) {
            //First, we establish the tag handlers object that will parse
            //different tags in different ways
            //zoom down below the tagHandles object...
            var tagHandlers = {
              //the whole body of the doc comes thru here and is passed thru the _base key
              _base: function (tag) {
                var str = "";
                //for each tag in the body...
                tag.children.forEach(function (child) {
                  //...if the tag is in the tagHandles object, run the function
                  //we do this because there are lots of tags that we don't want to parse
                  if ((func = tagHandlers[child.name || child.type]))
                    // console.log('LOG 4: printing the child ***********************')
                    // console.log(child)

                    str += func(child);
                  // console.log("start of a string ***********************")
                  // console.log(str)
                });
                return str;
              },
              text: function (textTag) {
                // console.log('LOG 6: and finally a text tag ***********************')
                // console.log(textTag)

                var styledTag = textTag.data;
                if (textTag.parent.attribs.style !== undefined) {
                  if (
                    textTag.parent.attribs.style.includes("font-style:italic")
                  ) {
                    styledTag = "<i>" + styledTag + "</i>";
                  }
                  if (
                    textTag.parent.attribs.style.includes("font-weight:700")
                  ) {
                    styledTag = "<b>" + styledTag + "</b>";
                  }
                }
                return styledTag;
              },
              span: function (spanTag) {
                //we rerun span tags thru _base to catch any nested tags
                //eventually, we're trying to get to a text tag
                return tagHandlers._base(spanTag);
              },
              p: function (pTag) {
                //we rerun p tags thru _base to catch any nested tags
                //eventually, we're trying to get to a text tag
                return tagHandlers._base(pTag) + "\n";
              },
              a: function (aTag) {
                var href = aTag.attribs.href;
                if (href === undefined) return "";

                // extract real URLs from Google's tracking
                // from: http://www.google.com/url?q=http%3A%2F%2Fwww.sfchronicle.com...
                // to: http://www.sfchronicle.com...
                if (
                  aTag.attribs.href &&
                  url.parse(aTag.attribs.href, true).query &&
                  url.parse(aTag.attribs.href, true).query.q
                ) {
                  href = url.parse(aTag.attribs.href, true).query.q;
                }
                // console.log('LOG 5: printing an a tag ***********************')
                // console.log(aTag)

                //ok if there is a bold/italics with a link, we need to do something special
                //because that info is with the aTag parent and not registered in the parents
                //of the children of the aTag.
                //console.log((aTag.children).length)
                //looks like an aTag only ever has 1 child so we can probably send it right to
                //text... but we probably need to reconstruct the element
                //so text parser expects this syntax:
                // { type: 'text',
                //   data: 'this is the text',
                //   parent: {
                //     attribs: {
                //       style: '-webkit-text-decoration-skip:none;color:#1155cc;font-weight:700;text-decoration:underline;text-decoration-skip-ink:none;font-style:italic'
                //     }
                //   }
                // }
                //so we need to reconstruct the aTag object to include the style info
                //and then send it to the text parser

                aTag = {
                  type: "text",
                  data: aTag.children[0].data,
                  parent: {
                    attribs: {
                      style: aTag.parent.attribs.style,
                    },
                  },
                };

                if (
                  aTag.parent.attribs.style &&
                  typeof aTag.parent.attribs.style === "string" &&
                  (aTag.parent.attribs.style.includes("font-style:italic") ||
                    aTag.parent.attribs.style.includes("font-weight:700"))
                ) {
                  aTag["parent"] = {
                    attribs: {
                      style: aTag.parent.attribs.style,
                    },
                  };
                }

                var str = '<a target="_blank" href="' + href + '">';
                str += tagHandlers.text(aTag);
                str += "</a>";
                return str;
              },
              li: function (tag) {
                return "* " + tagHandlers._base(tag) + "\n";
              },
            };

            //special cases for lists
            ["ul", "ol"].forEach(function (tag) {
              tagHandlers[tag] = tagHandlers.span;
            });

            //and headers
            ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (tag) {
              tagHandlers[tag] = tagHandlers.p;
            });

            //dom is something that the htmlparser2 produces from our docHtml.data
            //let's look at it
            // console.log('LOG 2: printing the dom ***********************')
            // console.log(dom)
            var body = dom[0].children[1];

            //all of our content is nested in dom[0].children[1] object
            //let's look at it
            // console.log('LOG 3: printing the body ***********************')
            // console.log(body)

            //now let's jump back to the tagHandlers object
            var parsedText = tagHandlers._base(body);

            // Convert html entities into the characters as they exist in the google doc
            var entities = new Entities();
            parsedText = entities.decode(parsedText);

            // Remove smart quotes from inside tags
            parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
              return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
            });

            // Parse with Archie
            var parsed = archieml.load(parsedText);

            // Create the file
            writeFile(file_path, JSON.stringify(parsed, null, 2));
          });

          var parser = new htmlparser.Parser(handler);

          //This what the google doc html looks like
          //A lot of crappy tags we don't want.
          // console.log('LOG 1: printing the docHtml ***********************')
          // console.log(docHtml)

          //now we parse the docHtml.data with our parser!
          parser.write(docHtml.data);
          parser.done();
          console.log("\x1b[32m", file_path + " created successfully");
          // Exit the promise
          resolve(true);
        });
      }
    );
  });
};

module.exports = { googleAuth };
