<p align="right">
    <a href="CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Code of conduct"></a>
</p>

<p align="center">
    <h1 align="center">SPA API Scoring</h1>
    <p align="center">The SPA that displays what is wrong in your API and leads you to where you can fix it.</p>
    <p align="center"><strong><a href="https://albalro.github.io/ide-extensions/overview/">Learn more in the doc!</a></strong></p>
    <br>
</p>

<br>

This folder contains the **SPA** of the API Scoring extension. The structure is the following:


```bash
└─ spa-apiscoringviewer/
    └─ code/
    	└─ config/
      └─ public/
      └─ scripts/
      └─ src/
        └─ api/
        └─ assets/
        └─ components/
        └─ features/
        └─ hooks/
        └─ locales/
        └─ mocks/
        └─ utils/
	  └─ images/
	    
```
<br>

## How to run the SPA

1. Clone the repository:

	```
    git clone git@github.com:InditexTech/api-scoring-ide-plugins.git
	```

2. Place yourself in the correct directory:

	```
 cd plugins/spa-apiscoringviewer/code
	```

3. Install the dependencies:

	```
	npm i
	```

5. Once the process finishes, start the SPA:

	```
	npm run start
	```

6. If you are executing it on local, validate it works using mock server:
 ```
 http://localhost:3000/protocols/REST/apis/API%20Sample
 ```
<br>

## Usage

[View the documentation](https://albalro.github.io/ide-extensions/api-hub/) for usage information.

