import React from "react";
import CryptoJS from "crypto-js";
import $ from "jquery";

export function getResponse() {
  // Initialize variables and get values from the field
  var xhr;

  // build the url based on the different parameters
  var urlParam = "ProductCode=K351";

  // Final url is built
  var url = "https://api.unleashedsoftware.com/" + "Products?" + urlParam;

  //CryptoJS is being used in javascript to generate the hash security keys
  // We need to pass the url parameters as well as the key to return a SHA256
  var hash = CryptoJS.HmacSHA256(
    urlParam,
    "l5xY526vIKmy5KM3yWt3lgUDjSW8Qf3DwRP3zc6eurBrlDOQzYoSd622ZZva5hqkKwCy0aAe5dY0QuKSvotBMw=="
  );
  // That hash generated has to be set into base64
  var hash64 = CryptoJS.enc.Base64.stringify(hash);

  // Simple ajax function with all the parameters
  xhr = $.ajax({
    url: url,
    dataType: "json",
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-auth-id": "68780761-e9f7-4104-85dd-2da55c4436b7",
      "api-auth-signature": hash64,
      "Content-Type": "application/json",
    },
  })
    .done(function (data) {
      // The request has been successful.
      console.log(data);
    })
    .fail(function (data, status, er) {
      // The request has NOT been successful.
      console.log("error: " + data + " status: " + status + " er:" + er);
      console.log(JSON.stringify(data.responseJSON, false, 2));
    });
}
