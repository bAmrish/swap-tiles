rm -rf dist
rm -rf public
mkdir public
npm run ng build
cp -r dist/swap-tiles/* public
firebase deploy
