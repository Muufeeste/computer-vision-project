import { 
  auth, 
  db, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  where
} from "./firebase.js";

const container = document.getElementById("favorites");
const IMAGE = "https://image.tmdb.org/t/p/w500";

async function loadFavorites() {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", auth.currentUser.uid)
    );
    

    const snapshot = await getDocs(q);

    container.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      const div = document.createElement("div");
      div.className = "movie";

      const img = data.poster
        ? IMAGE + data.poster
        : "https://via.placeholder.com/200x300";

      div.innerHTML = `
        <img src="${img}">
        <h3>${data.title}</h3>
        <button class="btn btn-remove" data-id="${docSnap.id}">
          🗑 Remove
        </button>
      `;

      div.querySelector("button").onclick = async () => {
        await deleteDoc(doc(db, "favorites", docSnap.id));
        loadFavorites();
      };

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading favorites:", err);
  }
}

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Login first");
    window.location.href = "index.html";
  } else {
    loadFavorites();
  }
});