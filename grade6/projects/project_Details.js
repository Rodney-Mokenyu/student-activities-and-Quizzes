"use strict";
document.addEventListener("DOMContentLoaded", () => {
    // ----- Get Project Index from URL -----
    const urlParams = new URLSearchParams(window.location.search);
    const rawIndex = urlParams.get("index");
    const index = isNaN(parseInt(rawIndex !== null && rawIndex !== void 0 ? rawIndex : "")) ? 0 : parseInt(rawIndex !== null && rawIndex !== void 0 ? rawIndex : "0");
    // ----- Fetch and Render Project -----
    fetch("project scores.json")
        .then(res => res.json())
        .then((projects) => {
        const project = projects[index];
        if (!project) {
            console.warn("Project not found");
            return;
        }
        displayProjectDetails(project);
    })
        .catch(err => {
        console.error("Failed to load project data:", err);
    });
    // ----- Render Project Details -----
    function displayProjectDetails(project) {
        const container = document.getElementById("detailContainer");
        if (!container)
            return;
        container.innerHTML = `
      <h1>${project.projectName}</h1>
      <p>${project.projectDescription}</p>
      <p><strong>Total Points:</strong> ${project.projectScore}</p>
      <p>📅 Date Created: ${project.dateCreated}</p>
      <h2>Groups</h2>
    `;
        const groupTable = buildGroupTable(project.groups, project.projectScore);
        container.appendChild(groupTable);
    }
    // ----- Build Group Table with Tie-Aware Medals -----
    function buildGroupTable(groups, totalScore) {
        const table = document.createElement("table");
        table.className = "table table-striped table-bordered group-table";
        const thead = document.createElement("thead");
        thead.innerHTML = `
    <tr>
      <th>Group Name</th>
      <th>Members</th>
      <th>Points Scored / ${totalScore}</th>
    </tr>
  `;
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        // Sort groups by score descending
        const sortedGroups = [...groups].sort((a, b) => b.groupPoints - a.groupPoints);
        // Get unique scores and assign ranks
        const uniqueScores = [...new Set(sortedGroups.map(g => g.groupPoints))].sort((a, b) => b - a);
        const scoreToRank = new Map();
        uniqueScores.forEach((score, index) => {
            scoreToRank.set(score, index + 1); // Rank starts at 1
        });
        // Render each group
        sortedGroups.forEach(group => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.textContent = group.groupName;
            row.appendChild(nameCell);
            const membersCell = document.createElement("td");
            group.groupMembers.forEach((member, i) => {
                const line = document.createElement("div");
                line.textContent = `${i + 1}. ${member}`;
                membersCell.appendChild(line);
            });
            row.appendChild(membersCell);
            const pointsCell = document.createElement("td");
            pointsCell.textContent = group.groupPoints.toString();
            // 🏅 Add medal based on rank
            const rank = scoreToRank.get(group.groupPoints);
            if (rank === 1) {
                const badge = document.createElement("span");
                badge.textContent = " 🥇";
                badge.className = "badge-gold";
                pointsCell.appendChild(badge);
            }
            else if (rank === 2) {
                const badge = document.createElement("span");
                badge.textContent = " 🥈";
                badge.className = "badge-silver";
                pointsCell.appendChild(badge);
            }
            else if (rank === 3) {
                const badge = document.createElement("span");
                badge.textContent = " 🥉";
                badge.className = "badge-bronze";
                pointsCell.appendChild(badge);
            }
            row.appendChild(pointsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        return table;
    }
});
