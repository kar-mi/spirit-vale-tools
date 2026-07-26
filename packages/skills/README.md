# @kar-mi/spirit-vale-tools-skills

Build-scoped Spirit Vale skill catalog utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-skills
```

## Usage

```ts
import { loadBundledSkillCatalog, resolveFishNetSkill } from "@kar-mi/spirit-vale-tools-skills";

const catalog = loadBundledSkillCatalog();
console.log(catalog.buildFingerprint);

const skill = resolveFishNetSkill("Fireball");
if (skill) {
  console.log(skill.displayName, skill.kinds, skill.effects);
}
```

`resolveFishNetSkill` returns `undefined` for unknown skills; use
`requireFishNetSkill` when a missing entry should throw instead.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
