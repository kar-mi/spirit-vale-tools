# Package releases

Reusable `@kar-mi/spirit-vale-tools-*` packages are versioned and published
independently through Changesets and GitHub Packages.

## Validation

Before releasing, verify a clean checkout:

```powershell
bun install --frozen-lockfile
bun run check
bun run build:packages
```

## Create a release

Add a Changeset for every user-facing change to a public package:

```powershell
bunx changeset
```

Commit the generated Markdown file with the implementation. On `main`, the
**Version and Publish Packages** workflow opens or updates a version pull
request. Merging that pull request builds and publishes the changed packages to
GitHub Packages.

`bun run release:packages` always runs `build:packages` before
`changeset publish`, because publishable packages include generated `dist`
output.

## GitHub configuration

The package workflow requires `contents: write`, `packages: write`, and
`pull-requests: write`. Repository Actions settings must allow GitHub Actions
to create and approve pull requests.
