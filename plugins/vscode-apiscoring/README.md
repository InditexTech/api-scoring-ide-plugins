<!--
SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX

SPDX-License-Identifier: Apache-2.0
-->

<p align="right">
    <a href="CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Code of conduct"></a>
</p>

<p align="center">
    <h1 align="center">API Scoring (VS Code)</h1>
    <p align="center">The tool that establishes communication between the certification SPA and the files in your IDE.</p>
    <p align="center"><strong><a href="https://albalro.github.io/ide-extensions/api-hub/">Learn more in the doc!</a></strong></p>
    <br>
</p>

<br>

## Installation and usage

1. Clone the repository:

	```
    git clone git@github.com:InditexTech/api-scoring-ide-plugins.git
	```

2. Install the VSCE following the [documentation](https://www.npmjs.com/package/@vscode/vsce) with the following command:

    ```bash
    npm install --global @vscode/vsce
    ```

3. In the terminal, use the next command inside the `/code` folder:

    ```bash
    npm install
    vsce package
    ```

4. The previous step should create a `.vsix` file in the directory. Use the `.vsix` file to install it.


<br>

## Usage

[View the documentation](https://albalro.github.io/ide-extensions/api-hub/) for usage information.
