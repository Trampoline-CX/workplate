# Workplate

Use Yarn Workspaces to define complex project templates. Clone a template defined in a Yarn workspace and all its dependent packages.

## Usage

Use `npx` or `yarn create` command for easy project creation. This will copy the repository and keep only the `foo-bar` package and all its dependencies.

```shell
npx @trampoline/workplate create appName https://github.com/user/repo --workspace foo-bar
```

If you want to clone the whole repository, simply remove the `--workspace` parameter.

For more advanced options and usage, see `npx @trampoline/workplate --help`

## How it works

1. Clone the target repository.
2. Get workspace dependencies of the target template.
3. Remove unreferenced packages in the repository.

### Example

Let's say we have the following minimal repo structure:

```
repo-root
 ┣ 📂 packages
 ┃ ┣ 📂 package-a
 ┃ ┣ 📂 package-b
 ┃ ┗ 📂 package-c
 ┗ 📜package.json
```

Let's also say that `package-b` depends on `package-a`. By running `npx @trampoline/workplate create appName https://github.com/user/repo --workspace package-b`, we will get a repo with the following structure:

```
repo-root
 ┣ 📂 packages
 ┃ ┣ 📂 package-a
 ┃ ┗ 📂 package-b
 ┗ 📜package.json
```

`package-c` is no longer there since it is not a dependency (direct or indirect) of `package-b`. `package-a` is still there since it is a dependency of `package-b`.

## Template Structure

Your template repository should just be a normal repository, with Yarn Workspaces root `package.json` at the root of the repository.
