NPRI Data Explorer
==================

What works
----------
- Explore the map
- Add to your home screen on Android (using Chrome) or iOS (using Safari) and it looks like an (Android) app

What needs work
---------------
- View pollutant release records of facilities

Getting started
---------------
1. `git clone` [`https://github.com/GolamRagib/npri-dex.git`](https://github.com/GolamRagib/npri-dex.git)
2. Import the database into MongoDB
3. Create a `.env` file with the following variables:
    - MONGODB_SERVER
    - WEBPACK_CONFIG
    - GOOGLE_MAPS_API_KEY
4. Run `npm install` to install packages
5. Run `npm i -g nodemon` to install nodemon
    - Run `sudo npm i -g nodemon` if you need `root` previlege
6. Run
    - `npm run start` for production environment
    - `npm run startDev` for development environment
