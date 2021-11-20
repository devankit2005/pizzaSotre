const Noty = require("noty");

export const toaster = (msg, type) => {
  new Noty({
    type: type,
    layout: "topRight",
    timeout: 1000,
    progressBar: false,
    text: msg,
  }).show();
};


