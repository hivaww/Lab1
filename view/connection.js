async function getAlbums() {
  let allAlbums = await fetch("/albums", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });
  allAlbums = await allAlbums.json();
  let albumTable = document
    .getElementById("album_table")
    .querySelector("tbody");
  albumTable.innerHTML = "";
  allAlbums.forEach((album) => {
    let row = albumTable.insertRow();
    row.insertCell().innerText = album.id;
    row.insertCell().innerText = album.title;
    row.insertCell().innerText = album.artist;
    row.insertCell().innerText = album.year;
    let actionCell = row.insertCell();
    const detailsButton = document.createElement("button");
    detailsButton.innerText = "Details";
    detailsButton.addEventListener("click", async () => {
      albumTable.innerHTML = "";
      row = albumTable.insertRow();
      row.insertCell().innerHTML = album._id;
      row.insertCell().innerText = album.title;
      row.insertCell().innerText = album.artist;
      row.insertCell().innerText = album.year;
    });
    actionCell.appendChild(detailsButton);

    const updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", async (e) => {
      row = e.target.parentNode.parentNode;
      const cells = row.querySelectorAll("td:not(:first-child, :last-child)");
      cells.forEach((cell) => {
        const input = cell.innerHTML.trim();
        cell.innerHTML = `<input type="text" value="${input}">`;
      });
    });
    actionCell.appendChild(updateButton);

    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.addEventListener("click", async (e) => {
      row = e.target.parentNode.parentNode;
      const cells = row.querySelectorAll("td:not(:first-child, :last-child)");
      cells.forEach((cell) => {
        const input = cell.querySelector("input").value;
        console.log(input);
        cell.innerHTML = "";
        cell.textContent = input;
      });

      const nTitle = cells[0].textContent;
      const nArtist = cells[1].textContent;
      const nYear = cells[2].textContent;
      try {
        const nUpdate = await fetch(`/albums/${album.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: nTitle,
            artist: nArtist,
            year: nYear,
          }),
        });
        const result = await nUpdate.json();
        console.log(result, "res");
      } catch (err) {
        console.log("Error", err);
      }
    });
    actionCell.appendChild(saveButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", async (e) => {
      if (confirm("Delete")) {
        const row = e.target.parentNode.parentNode;
        try {
          await fetch(`/albums/${album.id}`, {
            method: "DELETE",
          });
          row.remove();
        } catch (error) {
          console.log(error);
        }
      }
    });
    actionCell.appendChild(deleteButton);
  });
}

const postAlbum = document.getElementById("add-Album");
postAlbum.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const year = document.getElementById("year").value.trim();

  try {
    const res = await fetch("/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, artist, year }),
    });
    document.getElementById("title").value = "";
    document.getElementById("artist").value = "";
    document.getElementById("year").value = "";
  } catch (error) {
    console.log(error);
  }
});

window.addEventListener("load", () => {
  getAlbums();
});
