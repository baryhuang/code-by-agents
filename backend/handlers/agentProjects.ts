import { Context } from "hono";
import type { ProjectInfo, ProjectsResponse } from "../../shared/types.ts";
import { getEncodedProjectName } from "../history/pathUtils.ts";

/**
 * Handles GET /api/agent-projects requests
 * Retrieves list of available project directories from Claude configuration for agent endpoints
 * @param c - Hono context object
 * @returns JSON response with projects array
 */
export async function handleAgentProjectsRequest(c: Context) {
  console.log("🔍 handleAgentProjectsRequest called");
  try {
    const { runtime } = c.var.config;

    const homeDir = runtime.getHomeDir();
    if (!homeDir) {
      return c.json({ error: "Home directory not found" }, 500);
    }

    const claudeConfigPath = `${homeDir}/.claude.json`;

    try {
      const configContent = await runtime.readTextFile(claudeConfigPath);
      const config = JSON.parse(configContent);

      if (config.projects && typeof config.projects === "object") {
        const projectPaths = Object.keys(config.projects);

        // Get encoded names for each project, only include projects with history
        const projects: ProjectInfo[] = [];
        for (const path of projectPaths) {
          const encodedName = await getEncodedProjectName(path, runtime);
          // Only include projects that have history directories
          if (encodedName) {
            projects.push({
              path,
              encodedName,
            });
          }
        }

        const response: ProjectsResponse = { projects };
        console.log("🔍 Returning projects:", projects.length, "projects");
        console.log("🔍 Projects:", projects);
        return c.json(response);
      } else {
        console.log("🔍 No projects found in config");
        const response: ProjectsResponse = { projects: [] };
        return c.json(response);
      }
    } catch (error) {
      // Handle file not found errors in a cross-platform way
      if (error instanceof Error && error.message.includes("No such file")) {
        const response: ProjectsResponse = { projects: [] };
        return c.json(response);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error reading agent projects:", error);
    return c.json({ error: "Failed to read agent projects" }, 500);
  }
}