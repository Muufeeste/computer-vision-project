import { setupAuth } from "./auth.js";

const API_KEY = "68a2172a83f6ea465ef9b79e5879cfb8";
const IMAGE = "https://image.tmdb.org/t/p/w500";

let allMovies = [];
let page = 1;
let totalPages = 1;
let loading = false;
let currentGenre = "all";

document.addEventListener("DOMContentLoaded", () => {

  // 🔐 setup login system
  setupAuth();

  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  const container = document.getElementById("movies");

  // --- search ---
  function goToSearch() {
    const query = input.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }

  btn.addEventListener("click", goToSearch);

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") goToSearch();
  });

  // --- render movies ---
  function renderMovies(movies) {
    container.innerHTML = "";

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

  // --- filter ---
  function applyFilter() {
    if (currentGenre === "all") {
      renderMovies(allMovies);
      return;
    }

    const filtered = allMovies.filter(movie =>
      movie.genre_ids.includes(parseInt(currentGenre))
    );

    renderMovies(filtered);
  }

  // --- load movies ---
  async function loadMovies() {
    if (loading || page > totalPages) return;

    loading = true;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`
      );

      const data = await res.json();

      if (!data.results) {
        console.error("API ERROR:", data);
        return;
      }

      totalPages = data.total_pages;

      allMovies = [...allMovies, ...data.results];

      applyFilter(); // 🔥 keeps filter active

      page++;

    } catch (err) {
      console.error("ERROR:", err);
    }

    loading = false;
  }

  // --- infinite scroll ---
  window.addEventListener("scroll", () => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (nearBottom) {
      loadMovies();
    }
  });

  // --- filter buttons (with active UI) ---
  const filterButtons = document.querySelectorAll(".filters button");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      filterButtons.forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      currentGenre = btn.dataset.genre;

      applyFilter();
    });
  });

  // default active
  document.querySelector('[data-genre="all"]').classList.add("active");

  // initial load
  loadMovies();
});