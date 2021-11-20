const bcrypt = require("bcrypt");

const encrypt = async (str, saltRound) => {
  return await bcrypt.hash(str, saltRound);
};

const decrypt = async (planText, hash) => {
  return await bcrypt.compare(planText, hash);
};

module.exports = { encrypt, decrypt };
