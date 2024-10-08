const works = [
  {
    title: "file-boy",
    desc: "A no-BS encryption/decryption CLI, made with golang. It allows you to encrypt and decrypt files or entire directories with ease.",
    tags: ["go", "cli"],
    github: "https://github.com/Muhammed-Rajab/file-boy",
  },
  {
    title: "img2ascii.cpp",
    desc: "Convert your images🖼️ to ASCII art🎨 instantly with img2ascii.cpp!",
    tags: ["cpp", "cli"],
    github: "https://github.com/Muhammed-Rajab/img2ascii.cpp/",
  },
  {
    title: "camouflage.cpp",
    desc: "A fun and visual🦎 way to see natural selection in action!",
    tags: ["cpp", "raylib", "genetic algoritm"],
    github: "https://github.com/Muhammed-Rajab/camouflage.cpp",
  },
];

const worksContainer = document.querySelector(".works-container");
const worksCategoriesContainer = document.querySelector(".works-categories");

const generateProject = ({ title = "", desc = "", tags = [], github = "" }) => {
  // Create the 'div' element with the 'project' class
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project");

  // Create the 'p' element for the title
  const titleP = document.createElement("p");
  titleP.classList.add("title");
  titleP.appendChild(document.createTextNode("["));

  // Create the 'a' element with the link
  const linkA = document.createElement("a");
  linkA.classList.add("work-link");
  linkA.href = github;
  linkA.target = "_blank";
  linkA.textContent = `${title}`;

  // Append the 'a' element to the title paragraph
  titleP.appendChild(linkA);
  titleP.appendChild(document.createTextNode("]"));

  // Create the 'p' element for the description
  const descriptionP = document.createElement("p");
  descriptionP.classList.add("description");
  descriptionP.textContent = desc;

  // Create the 'p' element for the tags
  const tagsP = document.createElement("p");
  tagsP.classList.add("tags");
  tagsP.appendChild(
    document.createTextNode(tags.length > 1 ? "Tags: " : "Tag: ")
  );

  // Create the 'a' elements for the tags
  tags.forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.disabled = true;
    tagEl.href = "";
    // tagEl.classList.add("");
    tagEl.textContent = tag;
    tagsP.appendChild(tagEl);
    tagsP.innerHTML += "&nbsp;".repeat(2);
  });

  // Append all the elements to the project div
  projectDiv.appendChild(titleP);
  projectDiv.appendChild(descriptionP);
  projectDiv.appendChild(tagsP);

  // Append the project div to the body (or another container element)
  return projectDiv;
};

works.forEach((work) => worksContainer.append(generateProject(work)));

// Add work categories
const categories = [
  "all",
  ...new Set(
    works.map((work) => work.tags).reduce((acc, curr) => [...acc, ...curr])
  ),
];

categories.forEach((category) => {
  const btn = document.createElement("button");
  btn.innerText = `${category}`;
  btn.addEventListener("click", (e) => {

    worksCategoriesContainer.querySelectorAll("button").forEach(button => {
      button.classList.remove("bold-button")
    })

    btn.classList.add("bold-button")

    e.preventDefault();
    // SHOW ONLY THE TAGS
    worksContainer.innerHTML = "";
    if (category === "all") {
      works
        .forEach((work) => {
          worksContainer.appendChild(generateProject(work));
        });
    } else {
      works
        .filter((work) => work.tags.includes(category))
        .forEach((work) => {
          worksContainer.appendChild(generateProject(work));
        });
    }
  });
  if (category === 'all') {
    btn.classList.add("bold-button")
  }
  worksCategoriesContainer.appendChild(btn);
  worksCategoriesContainer.appendChild(
    document.createTextNode("\u00A0".repeat(2))
  );
});
