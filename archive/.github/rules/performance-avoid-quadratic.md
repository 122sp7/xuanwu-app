---
title: Avoid O(n²) Algorithms
impact: HIGH
impactDescription: Prevents performance degradation at scale
tags: performance, algorithms, complexity
---

## Avoid O(n²) Algorithms

**Impact: HIGH**

Nested loops over the same dataset are a common source of performance issues. When processing lists, prefer Map/Set lookups (O(1)) over inner loops (O(n)).

**Incorrect (O(n²) nested loop):**

```typescript
function matchTasksToSkills(tasks: Task[], skills: Skill[]): Match[] {
  const matches: Match[] = [];
  for (const task of tasks) {
    for (const skill of skills) {                           // ❌ O(n²)
      if (task.requiredSkillId === skill.id) {
        matches.push({ task, skill });
      }
    }
  }
  return matches;
}
```

**Correct (O(n) with index map):**

```typescript
function matchTasksToSkills(tasks: Task[], skills: Skill[]): Match[] {
  const skillMap = new Map(skills.map(s => [s.id, s]));     // ✅ O(n) index
  const matches: Match[] = [];
  for (const task of tasks) {
    const skill = skillMap.get(task.requiredSkillId);       // ✅ O(1) lookup
    if (skill) matches.push({ task, skill });
  }
  return matches;
}
```

**Common scenarios to watch:**
- Matching entities across modules (tasks ↔ skills, schedules ↔ workspaces)
- Filtering lists within lists (use Set for membership checks)
- Building derived views from multiple data sources (use indexes)
