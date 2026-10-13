const list = document.querySelector("#repository-list");
const status = document.querySelector("#repository-status");
const count = document.querySelector("#repository-count");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  item.className = "repository-item";

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = repository.name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const meta = document.createElement("div");
  meta.className = "repository-meta";

  const starredDate = document.createElement("span");
  starredDate.textContent = `Starred ${formatDate(repository.starredAt)}`;
  meta.append(starredDate);

  if (repository.language) {
    const language = document.createElement("span");
    language.className = "repository-language";
    language.textContent = repository.language;
    meta.append(language);
  }

  item.append(link, description, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const repositories = await response.json();
    if (!Array.isArray(repositories)) throw new Error("Repository data must be a list.");

    list.replaceChildren(...repositories.map(createRepositoryItem));
    count.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;
    status.textContent = repositories.length ? "" : "No starred repositories yet.";
  } catch (error) {
    status.textContent = "Couldn't load repositories. Serve this folder over HTTP and try again.";
    console.error("Failed to load starred repositories:", error);
  }
}

loadRepositories();