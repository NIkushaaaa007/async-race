Basic Structure — 80/80 pts

✅ Two Views (10pts)
✅ Garage View Content — name, create/edit panel, race control panel, garage section (30pts)
✅ Winners View Content — name, table, pagination (10pts)
✅ Persistent State — page numbers and inputs preserved between view switches (30pts)

Garage View — 90/90 pts

✅ CRUD Operations — create, update, delete, empty/too-long names handled, deleted from winners too (20pts)
✅ Color Selection — RGB color picker, color shown on car image (10pts)
✅ Random Car Creation — 100 cars, 10 brands × 10 models, random hex color (20pts)
✅ Car Management Buttons — select and delete per car (10pts)
✅ Pagination — 7 per page (10pts)
✅ Extra: Empty Garage message (10pts)
✅ Extra: Auto-redirect to previous page when last car on page deleted (10pts)

Winners View — 50/50 pts

✅ Display Winners — car shown after winning (15pts)
✅ Pagination — 10 per page (10pts)
✅ Winners Table — №, icon, name, wins, best time; wins increment, best time only updated if faster (15pts)
✅ Sorting — by wins and time, ASC/DESC (10pts)

Race — 170/170 pts

✅ Start Engine Animation — waits for velocity, animates, calls drive, stops on 500 (20pts)
✅ Stop Engine Animation — waits for response, car returns to start (20pts)
✅ Responsive Animation — works on 500px screens (30pts)
✅ Start Race Button — starts all cars on current page (10pts)
✅ Reset Race Button — returns all cars to start (15pts)
✅ Winner Announcement — banner shows first car's name (5pts)
✅ Button States — start disabled while driving, stop disabled while idle (20pts)
✅ Actions during race — delete, edit, create, pagination, view switching all blocked (50pts)

Prettier and ESLint — 10/10 pts

✅ Prettier — format and ci:format scripts in package.json (5pts)
✅ ESLint — Airbnb config, lint script, strict tsconfig (5pts)




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

