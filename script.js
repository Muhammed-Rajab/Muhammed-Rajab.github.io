/* [[ BLOGS: i rarely write, lol]] */
const InitializeBlogsSection = () => {
  /*
   * NOTE: update this list to add or remove blogs from homepage.
   * yes, i know it's too much manual work.
   *
   * SCHEMA:
   * {
   *  title:  string,     // title of the blog
   *  link:   string,     // link to blog
   *  new:    boolean?    // whether the blog is new or not (adds gif to the end of title)
   * }
   *
   * try adding new blogs to the beginning. or you can add a timestamp field, which is unnecessary.
   */
  const blogs = [
    {
      title: "I Miss The Good Ol' Telnet Days - So I Built My Own Server",
      link: "/blog/posts/i-miss-the-old-telnet-days-so-i-built-my-own-server/",
      new: true,
    },
  ];

  const blogsList = document.querySelector(".blogs > .container > ul");

  function createBlogItem(href, text, new_post = false) {
    const li = document.createElement("li");
    li.className = "blog";

    const a = document.createElement("a");
    a.href = href;
    a.className = "blog-link";
    a.target = "_blank";
    a.textContent = text;

    li.appendChild(a);

    if (new_post) {
      const gif = document.createElement("img");
      gif.src = "./assets/images/new-gif-smol.gif";
      gif.alt = "";
      gif.setAttribute("aria-hidden", "true");

      gif.style.width = "32px";
      gif.style.height = "auto";

      li.appendChild(gif);
    }

    return li;
  }

  function updateBlogsList() {
    // NOTE: unnecessary optimisation #1
    blogsList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    blogs.forEach((blog) => {
      fragment.appendChild(createBlogItem(blog.link, blog.title, blog.new));
    });

    blogsList.appendChild(fragment);
  }

  // main iife, keeps things clean
  (() => {
    updateBlogsList();
  })(); // main iife
};

/* [[Projects: lol, a bunch of jr. DEV projects]] */
const InitializeProjectsSection = () => {
  /*
   * NOTE: update this array to add or remove projects.
   *
   * SCHEMA:
   * {
   *  title:              string,   // project title
   *  desc:               string,   // project description
   *  tags:               string[], // tags associated
   *  github:             string,   // github repo url
   *  under_development:  boolean?, // whether it's still under development  TODO: add gif
   *  new_project:        boolean?  // whether it's a new project (adds gif)
   * }
   *
   * maybe add priority??? so it would show important stuff in the beginning?
   * NOTE: as of now, it's getting filtered top to bottom? so no need for priority???
   *       i don't know if it works every time since we are using sets.
   * */

  /**************************************
   * PROJECTS
   *************************************/
  const projects = [
    {
      title: "chip8.cpp",
      desc: "A modern C++ implementation of the classic CHIP-8 system including an emulator, an assembler and a disassembler.",
      tags: ["c++", "graphic"],
      github: "https://github.com/Muhammed-Rajab/chip8.cpp",
      under_development: false,
      new_project: true,
    },
    {
      title: "shadespheare.lua",
      desc: "like ShaderToy, but it actually LÖVES you back. made because I refuse to leave Neovim.",
      tags: ["lua", "graphic", "cli"],
      github: "https://github.com/Muhammed-Rajab/shadespheare.lua",
      under_development: true,
      new_project: true,
    },
    {
      title: "fretty mercury",
      desc: "A silly guitar fretboard visualizer written in Lua 🎸💖",
      tags: ["lua", "music", "cli"],
      github: "https://github.com/Muhammed-Rajab/fretty-mercury",
      under_development: true,
      new_project: true,
    },
    {
      title: "file-boy",
      desc: "a no-BS encryption/decryption CLI, made with golang. It allows you to encrypt and decrypt files or entire directories with ease.",
      tags: ["go", "cli"],
      github: "https://github.com/Muhammed-Rajab/file-boy",
      under_development: false,
      new_project: false,
    },
    {
      title: "terrible-renderer.cpp",
      desc: "Who knew drawing colored pixels in a terminal buffer could be this fun?",
      tags: ["c++", "cli", "graphic"],
      github: "https://github.com/Muhammed-Rajab/terrible-renderer.cpp",
      under_development: false,
      new_project: false,
    },
    {
      title: "camouflage.cpp",
      desc: "a fun and visual🦎 way to see natural selection in action!",
      tags: ["c++", "graphic"],
      github: "https://github.com/Muhammed-Rajab/camouflage.cpp",
      under_development: false,
      new_project: false,
    },
    {
      title: "img2ascii.cpp",
      desc: "convert your images🖼️ to ASCII art🎨 instantly with img2ascii.cpp!",
      tags: ["c++", "cli"],
      github: "https://github.com/Muhammed-Rajab/img2ascii.cpp/",
      under_development: false,
      new_project: false,
    },
  ];

  /**************************
   * CONSTANTS & UI ELEMENTS
   *************************/

  // categories
  const projectCategoriesContainer = document.querySelector(
    ".projects > .categories",
  );

  // project list
  const projectsContainer = document.querySelector(".projects > .container");

  // pagination
  const paginationParagraph = document.querySelector(
    ".projects > .navigator> .pagination",
  );
  const prevProjectsBtn = document.querySelector(
    ".projects > .navigator>.prev-btn",
  );
  const nextProjectsBtn = document.querySelector(
    ".projects > .navigator>.next-btn",
  );

  // extract all tags
  const categories = [
    "all",
    ...new Set(projects.flatMap((project) => project.tags)),
  ];

  let currentPageIndex = 0;
  let currentCategory = "all";
  const MAX_PROJECTS_PER_PAGE = 4;
  let pageCount = Math.ceil(projects.length / MAX_PROJECTS_PER_PAGE);

  /**********************
   * DOM CREATION HELPERS
   *********************/

  // project list item
  function createProjectListItem({
    title = "",
    desc = "",
    tags = [],
    github = "",
    under_development = false,
    new_project = false,
  }) {
    // Create the 'div' element with the 'project' class
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");

    // Create the 'p' element for the title
    const titleP = document.createElement("p");
    titleP.classList.add("title");

    const lspan = document.createElement("span");
    lspan.innerText = "⚞";
    titleP.appendChild(lspan);

    // Create the 'a' element with the link
    const linkA = document.createElement("a");
    linkA.classList.add("work-link");

    linkA.href = github;
    linkA.target = "_blank";
    linkA.textContent = `${title}`;

    titleP.appendChild(linkA);

    const rspan = document.createElement("span");
    rspan.innerText = "⚟";
    titleP.appendChild(rspan);

    if (new_project) {
      const gif = document.createElement("img");
      gif.src = "./assets/images/new-gif-smol.gif";
      gif.alt = "";

      gif.style.width = "32px";
      gif.style.height = "auto";
      titleP.appendChild(gif);
    }

    if (under_development) {
      const gif = document.createElement("img");
      gif.src = "./assets/images/under-construction-smol.gif";
      gif.alt = "";

      gif.style.width = "52px";
      gif.style.height = "auto";
      titleP.appendChild(gif);
    }

    // Create the 'p' element for the description
    const descriptionP = document.createElement("p");
    descriptionP.classList.add("description");
    descriptionP.textContent = desc;

    // Create the 'p' element for the tags
    const tagsP = document.createElement("p");
    tagsP.classList.add("tags");
    tagsP.appendChild(
      document.createTextNode(tags.length > 1 ? "tags: " : "tag: "),
    );

    // Create the 'a' elements for the tags
    tags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.href = "";
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
  }

  function createProjectCategoryButton(category, onClick) {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.classList.toggle("bold-button", category === "all");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      onClick(category, btn);
    });
    return btn;
  }

  /*********
   * HELPERS
   ********/
  function filterProjectsByCategory(projects, category) {
    return category === "all"
      ? projects
      : projects.filter((project) => project.tags.includes(category));
  }

  function paginate(projects, pageIndex, perPage) {
    const start = pageIndex * perPage;
    return projects.slice(start, start + perPage);
  }

  /****************
   * EVENT HANDLERS
   ***************/
  function handleCategoryClick(category, btn) {
    currentCategory = category;
    currentPageIndex = 0;

    // console.log("current page index:", currentPageIndex);
    // console.log("current category:", currentCategory);
    // console.log("page count:", pageCount);

    // reset highlight
    projectCategoriesContainer
      .querySelectorAll("button")
      .forEach((b) => b.classList.remove("bold-button"));

    btn.classList.add("bold-button");
    updateProjectsContainer(currentPageIndex, currentCategory);

    // TODO: update the page count
    // TODO: update the page numbers?
  }

  /**********************
   * RENDERING & UPDATION
   *********************/

  // page number update
  function updatePageNumber(currentPageIndex, pageCount) {
    paginationParagraph.innerHTML = `${currentPageIndex + 1} out of ${pageCount}`;
  }

  // pagination button update
  function updatePaginationButtons() {
    prevProjectsBtn.disabled = currentPageIndex === 0;
    nextProjectsBtn.disabled = currentPageIndex >= pageCount - 1;
  }

  // render the projects
  function renderProjects(projects) {
    // NOTE: unnecessary optimization #2
    const fragment = document.createDocumentFragment();

    projects.forEach((project, i, arr) => {
      fragment.append(createProjectListItem(project));
      // add <hr/> if not the last project
      if (i < arr.length - 1) fragment.append(document.createElement("hr"));
    });

    projectsContainer.innerHTML = "";
    projectsContainer.append(fragment);
  }

  // update projects list based on page number
  function updateProjectsContainer(pageIndex = 0, category = "all") {
    const filtered = filterProjectsByCategory(projects, category);
    const paginated = paginate(filtered, pageIndex, MAX_PROJECTS_PER_PAGE);

    // TODO: update page count here, as it will always be called when changing category or page
    pageCount = Math.ceil(filtered.length / MAX_PROJECTS_PER_PAGE);
    renderProjects(paginated);

    // ui update
    updatePageNumber(pageIndex, pageCount);

    // figure update
    updatePaginationButtons();
  }

  // * render categories buttons
  function renderProjectCategoriesBtns() {
    const fragment = document.createDocumentFragment();

    categories.forEach((category) => {
      const btn = createProjectCategoryButton(category, handleCategoryClick);
      fragment.append(btn, document.createTextNode("\u00A0".repeat(2)));
    });

    projectCategoriesContainer.innerHTML = "";
    projectCategoriesContainer.append(fragment);
  }

  // * handle press on prev and next btn
  prevProjectsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPageIndex > 0) {
      currentPageIndex--;
      updateProjectsContainer(currentPageIndex, currentCategory);
    }
  });

  nextProjectsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPageIndex < pageCount - 1) {
      currentPageIndex++;
      updateProjectsContainer(currentPageIndex, currentCategory);
    }
  });

  // main iife, if __name__ == "__main__": # lol
  (() => {
    renderProjectCategoriesBtns();
    updateProjectsContainer(currentPageIndex, currentCategory);
  })(); // main iife
};

/* [[EXTRA: for my fellow developers ;)]] */
const RevealSecret = () => {
  let called = false;
  return () => {
    if (called) return;

    called = true;

    const frames = [
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
      "data:image/png;base64,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",
    ];

    let currentFrame = 0;

    setInterval(() => {
      console.clear();
      console.log(
        "%c ",
        `
      font-size: 32px; 
      padding: 32px 150px;
      background: url(${frames[currentFrame]}) no-repeat;
      background-size: contain;
    `,
      );
      currentFrame = (currentFrame + 1) % frames.length;
    }, 500);
  };
};

const DisplayConsoleMessage = () => {
  console.log(
    "%cyour are very curious. call 'reveal_the_matrix()'",
    "color: #00FF00; background-color: black; font-weight: bold; font-family: monospace;",
  );
  window.reveal_the_matrix = RevealSecret();
};

// initialize both sections only after loading the DOM content
// since both of em heavily relies on it
window.addEventListener("DOMContentLoaded", () => {
  InitializeBlogsSection();
  InitializeProjectsSection();
  DisplayConsoleMessage();
});
