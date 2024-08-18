module.exports = {
  /**
   * check parameters
   * @param {object} request body
   * @returns Object
   */
  checkParamPresence: function (body) {
    const required = ["name", "surname", "number"];
    let missingField = "";

    required.map((req) => {
      if (body[req] === "") {
        missingField += req + " ";
      }
    });
    return { valid: !missingField.length, message: missingField.trim() };
  },
};
