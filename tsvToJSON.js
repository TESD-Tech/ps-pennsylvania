import fs from 'fs';
import csv from 'csv-parser';
const results = [];

// Get the input filename from the command line arguments
const inputFilename = process.argv[2];
const outputFilename = process.argv[3];

fs.createReadStream(inputFilename)
  .pipe(csv({ separator: '\t' }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // Write the results to the output file
    fs.writeFile(outputFilename, JSON.stringify(results, null, 2), 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
  });