const fs = require("fs");
const util = require("util");

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (error) =>
    error
      ? console.error(error)
      : console.info(`Data written to ${destination}.`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

module.exports = { readFromFile, writeToFile, readAndAppend };
