const mongoose = require("mongoose");

const MusicAlbumSchema = new mongoose.Schema({
  id: { type: Number, require: true, unique: true },
  title: { type: String, require: true },
  artist: { type: String, require: true },
  year: { type: Number, require: true },
});

module.exports = new mongoose.model("Album", MusicAlbumSchema);

/*async function laodIntoTable(url, table) {
  const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");
  const response = await fetch(url);
  const { headers, rows } = await response.json();

  console.log("hello");
  tableHead.innerHTML = "<tr></tr>";
  tableBody.innerHTML = "";
  for (const headerText of headers) {
    const headerElement = document.createElement("th");
    headerElement.textContent = headerText;
    tableHead.querySelector("tr").appendChild(headerElement);
  }
  for (const row of rows) {
    const rowElement = document.createElement("tr");
    for (const cellText of row) {
      const cellElement = document.createElement("td");

      cellElement.textContent = cellText;
      rowElement.appendChild(cellElement);
    }
    tableBody.appendChild(rowElement);
  }
}
laodIntoTable("Albums.json", document.querySelector("table"));*/
