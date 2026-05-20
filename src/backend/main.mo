import ProjectsApi "mixins/projects-api";
import AiCopilotApi "mixins/ai-copilot";

actor {
  include ProjectsApi();
  include AiCopilotApi();
};
