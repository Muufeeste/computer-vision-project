const API_KEY = "68a2172a83f6ea465ef9b79e5879cfb8";
const IMAGE = "https://image.tmdb.org/t/p/w500";

let page = 1;
let totalPages = 1;
let loading = false;

const container = document.getElementById("movies");
const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");

// get query from URL
let query = new URLSearchParams(window.location.search).get("q") || "";

// put query in input
input.value = query;

// search again
function goToSearch() {
  const q = input.value.trim();
  if (q) {
    window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  }
}

btn.addEventListener("click", goToSearch);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") goToSearch();
});

// render movies
function renderMovies(movies) {
  movies.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie";

    const img = movie.poster_path
      ? IMAGE + movie.poster_path
      : "https://via.placeholder.com/200x300";

    div.innerHTML = `
      <img src="${img}">
      <h3>${movie.title}</h3>
    `;

    div.onclick = () => {
      window.location.href = `details.html?id=${movie.id}`;
    };

    container.appendChild(div);
  });
}

// load movies
async function loadMovies() {
  if (loading || page > totalPages || !query) return;

  loading = true;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
    );

    const data = await res.json();

    if (!data.results) {
      console.error("API ERROR:", data);
      return;
    }

    totalPages = data.total_pages;

    renderMovies(data.results);

    page++;

  } catch (err) {
    console.error("ERROR:", err);
  }

  loading = false;
}

// infinite scroll
window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (nearBottom) {
    loadMovies();
  }
});

// initial load
loadMovies();