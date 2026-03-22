Serena tool reference for this workspace:
- activate_project: Activate/select project context before Serena operations.
- check_onboarding_performed: Check whether Serena onboarding memories exist.
- delete_memory: Delete an existing Serena memory.
- edit_memory: Edit memory content by exact string/regex replacement.
- find_file: Find files by filename mask under a path.
- find_referencing_symbols: Find symbol references/usages.
- find_symbol: Find symbol definitions by name path pattern.
- get_current_config: Inspect current Serena config, modes, active tools.
- get_symbols_overview: Get compact symbol overview for a file.
- initial_instructions: Load Serena operating manual/instructions.
- insert_after_symbol: Insert content after a symbol definition.
- insert_before_symbol: Insert content before a symbol definition.
- list_dir: List directories/files under a relative path.
- rename_symbol: Semantic rename for a symbol across code references.
- list_memories: List available Serena memories.
- onboarding: Run onboarding workflow when project is new/uninitialized.
- read_memory: Read a memory by name.
- rename_memory: Rename/move a memory entry.
- replace_symbol_body: Replace an entire symbol body.
- search_for_pattern: Regex/plain pattern search across repo/files.
- write_memory: Persist new project memory for future sessions.

Usage policy:
1) activate_project first.
2) check_onboarding_performed; if false, run onboarding + write_memory.
3) prefer symbolic navigation/edit tools over full-file reads when possible.
4) store stable conventions/commands/findings to memory after major tasks.