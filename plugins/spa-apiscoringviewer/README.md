<!--
SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX

SPDX-License-Identifier: Apache-2.0
-->

<p align="right">
    <a href="CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Code of conduct"></a>
</p>

<p align="center">
    <h1 align="center">SPA API Scoring</h1>
    <p align="center">The SPA that displays what is wrong in your API and leads you to where you can fix it.</p>
    <p align="center"><strong><a href="https://inditextech.github.io/api-scoring-doc/ide-extensions/overview/">Learn more in the doc!</a></strong></p>
    <br>
</p>

<br>

This folder contains the **SPA** of the API Scoring extension. The structure is the following:

```bash
└─ spa-apiscoringviewer/
   └─ packages/
      └─ apiscoringviewer/
         └─ src/
            └─ certification/
            └─ components/
            └─ files/
            └─ hooks/
            └─ locales/
            └─ utils/
      └─ spa-apiscoringviewer/
         └─ src/
            └─ components/
```

<br>

## How to run the SPA

1. Clone the repository:

   ```
   git clone git@github.com:InditexTech/api-scoring-ide-plugins.git
   ```

2. Navigate to the SPA directory:

   ```
   cd plugins/spa-apiscoringviewer
   ```

3. Install dependencies:

   ```
    npm install --global pnpm
    pnpm install
    ```

4. Once the process finishes, start the SPA:

   ```
   pnpm start
   ```

5. Configure the VSCode plugin (for local development): 

If you are running the SPA locally, open VSCode with the plugin already installed. Then, in the plugin settings, go to (Api Scoring › Certification › Frontend: Url) and set the frontend URL to:

```
http://localhost:3000
```



> [!TIP]
> If you need to remove all dependencies, you can use the following command:
>
> ```bash
> pnpm clean
> ```

<br>

## Usage

[View the documentation](https://inditextech.github.io/api-scoring-doc/ide-extensions/api-hub/) for usage information.
