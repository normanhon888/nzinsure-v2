List release risks in JSON with EXACT keys:
- breaking_changes (array)
- security_risks (array)
- data_migration_risks (array)
- rollback_notes (array of strings)

Rules:
- Output ONLY valid JSON (no markdown).
- Each risk item must be:
  { "risk": "...", "files": ["..."], "severity": "high|medium|low" }
