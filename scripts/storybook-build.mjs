#!/usr/bin/env node

console.log(
  "[storybook-build] Storybook static build is temporarily skipped due to upstream webpack cache issues.",
);
console.log(
  "[storybook-build] See TODO.md item #35 to restore a real build once the hosted workflow is ready.",
);

process.exit(0);
