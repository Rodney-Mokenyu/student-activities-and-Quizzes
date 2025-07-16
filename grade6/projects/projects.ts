document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const container = document.getElementById("projectContainer");

  // ----- Type Definitions -----
  type Group = {
    groupName: string;
    groupPoints: number;
    groupMembers: string[];
  };

  type Project = {
    projectUrl: string;
    projectName: string;
    projectDescription: string;
    projectScore: number;
    projectIndex: number;
    dateCreated: string;
    groups: Group[];
  };

  // ----- Load and render cards -----
  fetch("project scores.json")
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((projects: Project[]) => {
      projects.forEach((project, i) => {
        const card = createProjectCard(project, i);
        container?.appendChild(card);
      });
    });

  // ----- Card creation function -----
  function createProjectCard(project: Project, index: number): HTMLDivElement {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <div class="card-image"></div>
      <div class="card-body">
        <h4>${project.projectName}</h4>
        <p>${project.projectDescription}</p>
        <p class="date-created">📅 Created: ${project.dateCreated}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.open(`project-Details.htm?index=${index}`, "_blank");
    });

    return card;
  }

  // ----- Optional utility: open link in popup window -----
  function openLink(linkUrl: string) {
    window.open(linkUrl, "popupWindow", "width=600,height=800");
  }

  // ----- Placeholder: for displaying project details -----
  function displayProjectDetails(project: Project) {
    // Future implementation
  }
});
