import { auth, db, collection, addDoc } from "./firebase.js";

const API_KEY = "68a2172a83f6ea465ef9b79e5879cfb8";
const IMAGE = "https://image.tmdb.org/t/p/w500";

const id = new URLSearchParams(window.location.search).get("id");

const title = document.getElementById("title");
const poster = document.getElementById("poster");
const overview = document.getElementById("overview");
const addBtn = document.getElementById("addFav");

let currentMovie = null;

// load movie details
async function loadMovie() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );

    const data = await res.json();
    currentMovie = data;

    title.textContent = data.title;

    // safe image
    poster.src = data.poster_path
      ? IMAGE + data.poster_path
      : "https://via.placeholder.com/300x450";

    overview.textContent = data.overview;

  } catch (err) {
    console.error("Error loading movie:", err);
  }
}

// style button immediately
addBtn.className = "btn btn-fav";
addBtn.innerHTML = "❤️ Add to Favorites";

// add to favorites
addBtn.onclick = async () => {
  if (!auth.currentUser) {
    alert("Login first");
    return;
  }

  if (!currentMovie) return;

  try {
    addBtn.textContent = "Adding...";
    addBtn.disabled = true;

    await addDoc(collection(db, "favorites"), {
      userId: auth.currentUser.uid,
      movieId: currentMovie.id,
      title: currentMovie.title,
      poster: currentMovie.poster_path
    });

    addBtn.textContent = "❤️ Added!";
  } catch (err) {
    console.error("Error adding favorite:", err);
    addBtn.textContent = "Try Again";
    addBtn.disabled = false;
  }
};

loadMovie();