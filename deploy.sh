#Statics
FROM_REPOSITORY="https://github.com/tusharmath/tusharmath.github.io.git"
TO_REPOSITORY="git@heroku.com:tusharm.git"
PUBLISH_PATH="./build"
BRANCH="master"
WINTERSMITH="./node_modules/wintersmith/bin/wintersmith"

#Add Global Credentials
git config --global user.email "tusharmath@gmail.com"
git config --global user.name "Travis-CI"

#Set up authentication
echo "https://$HEROKU_API_KEY:@github.com" > .git/credentials
git config credential.helper "store --file=.git/credentials"

#Clone Repositoy
git clone $TO_REPOSITORY $PUBLISH_PATH --branch $BRANCH --verbose --single-branch

#Clear Items in master branch
rm -r $PUBLISH_PATH/*
wintersmith build -o $PUBLISH_PATH


#Change dir
cd $PUBLISH_PATH
git add --all . --verbose


#Commit and push
git commit -m "Deploy from travis" --dry-run
git push --repo=$TO_REPOSITORY --force --verbose --dry-run