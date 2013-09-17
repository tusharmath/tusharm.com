#Statics
FROM_REPOSITORY="https://github.com/tusharmath/tusharmath.github.io.git"
TO_REPOSITORY="git@heroku.com:tusharm.git"
PUBLISH_PATH="./build"
BRANCH="master"
WINTERSMITH="./node_modules/wintersmith/bin/wintersmith"

echo "Turn off warnings about SSH keys"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config

echo "Add Global Credentials"
git config --global user.email "tusharmath@gmail.com"
git config --global user.name "Travis-CI"

echo "Set up authentication"
echo "https://$HEROKU_API_KEY:@github.com" > .git/credentials


echo "Clone Repositoy"
git clone $TO_REPOSITORY $PUBLISH_PATH --branch $BRANCH --quiet


echo "Clear Items in master branch"
rm -r $PUBLISH_PATH/*
wintersmith build -o $PUBLISH_PATH


echo "Change dir"
cd $PUBLISH_PATH
git add --all . --verbose

echo "Set up location for reading creds"
git config credential.helper "store --file=../.git/credentials"

echo "Commit and push"
git commit -m "Deploy from travis" --dry-run
git push --repo=$TO_REPOSITORY --force --verbose --dry-run