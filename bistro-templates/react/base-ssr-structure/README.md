# Introduction

This SSR frontend project, generated using the Bistro CLI, adheres to the **HOFA (Hexagonal, Onion, Feature-Sliced, and Atomic Design)** architecture pattern as advocated by [Ekino Gems](https://github.com/ekino/gems).  

HOFA combines these architectural approaches to create an application that is:

* **Maintainable**
* **Scalable**
* **Testable**

## Architecture

### HOFA (Hexagonal, Onion, Feature-Sliced, and Atomic Design)

The project structure is organized based on the HOFA pattern, integrating the following key principles:

* **Hexagonal Architecture:** Isolate core application logic from external dependencies through ports and adapters.
* **Onion Architecture:** Structure the application into layers with clear dependencies and separation of concerns.
* **Feature-Sliced Design:** Organize code into independent features for better maintainability and scalability.
* **Atomic Design:** Build UI components in a modular and reusable fashion.

For in-depth understanding, refer to the [Ekino Gems Architecture documentation](https://github.com/ekino/gems/blob/main/architecture/README.md).

### Recommended Guidelines

We follow the best practices from Ekino Gems for code style, testing, etc., to ensure consistency and maintainability.

### Socle Versions

This project utilizes specific versions of key libraries and tools (socle) for stability. See the `package.json` file for details.

## Getting Started

1. **Clone:** `git clone <repository-url>`
2. **Install:** `pnpm install`
3. **Start:** `pnpm start`

## Project Health

We prioritize project health and use [Vitality](https://github.com/ekino/v6y) to monitor its metrics, including code quality and test coverage.

## Contributing

Contributions are welcome! See our `CONTRIBUTING.md` for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

