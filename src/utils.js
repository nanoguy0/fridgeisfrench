// This file provides various resources to the package

var https = require("https");

module.exports = {
  /**
   * @name request
   * @description Makes a HTTPS request to the url
   *
   * @param {string} url
   * @param {object} body
   * @param {string} opts
   */
  request(url, body, opts) {
    if (body == "") body = undefined;
    opts = opts ? opts : {};
    opts.method = opts.method ? opts.method : body ? "POST" : "GET";
    opts.headers = opts.headers ? opts.headers : {};
    if (body)
      Object.assign(
        opts.headers,
        {
          "Content-Type":
            typeof body == "object" ? "application/json" : "text/plain",
          "Content-Length": Buffer.byteLength(
            typeof body == "object" ? JSON.stringify(body) : body.toString()
          ),
        },
        opts.headers
      );

    return new Promise(function (resolve, reject) {
      var req = https.request(url, opts, (response) => {
        var buff = "";
        response
          .on("data", (chunk) => (buff += chunk))
          .on("end", () => {
            try {
              resolve(buff[0] == "{" ? JSON.parse(buff) : buff);
            } catch (e) {
              resolve(buff);
            }
          })
          .on("error", reject);
      });

      req.on("error", reject);
      if (body)
        req.end(
          typeof body == "object" ? JSON.stringify(body) : body.toString()
        );
      else req.end();
    });
  },
};
