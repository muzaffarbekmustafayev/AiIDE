# AI & Agent Integration

## Chat & Agent Interfaces
- **Chat Panel:** A conversational UI for Q&A, code explanation, debugging help, and generating small snippets.
- **Agent Panel:** A task-oriented UI where the AI acts autonomously, breaking down large tasks and executing them step-by-step (e.g., scaffolding a project, refactoring a whole file).

## Settings & Permissions
To ensure safety and user control, the AI operates under strict permissions configurable in the Settings menu. Users can toggle:
- `allow_file_creation`: Can the AI create new files/folders?
- `allow_file_editing`: Can the AI modify existing files?
- `allow_terminal_execution`: Can the AI run shell commands directly?
- `allow_package_installation`: Can the AI run npm/pip installs autonomously?

## Custom AI Models & Extensions
- **Bring Your Own Key (BYOK):** Users can integrate their own AI models by connecting external API keys (e.g., OpenRouter API key).
- **Custom AI Workspaces:** By integrating these keys, users can open dedicated Agentic or Chat windows powered by their chosen custom models.
- **Extension Support:** This custom AI integration can be added to the IDE as a pluggable extension, allowing seamless connection between external AI providers and the IDE environment.

## Model Selection
- A dropdown UI allowing users to switch the backing LLM dynamically depending on the task (e.g., OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, local Llama models, and custom models via OpenRouter).