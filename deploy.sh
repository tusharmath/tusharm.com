#Statics
FROM_REPOSITORY="https://github.com/tusharmath/tusharmath.github.io.git"
TO_REPOSITORY="git@heroku.com:tusharm.git"
PUBLISH_PATH="./build"
BRANCH="master"
WINTERSMITH="./node_modules/wintersmith/bin/wintersmith"

#Clear Folder
rm -rf $PUBLISH_PATH
mkdir $PUBLISH_PATH

#Clone Repositoy and checkout master
git clone $TO_REPOSITORY $PUBLISH_PATH --branch $BRANCH --verbose --single-branch
git checkout --force master

#Clear Items in master branch
rm -r $PUBLISH_PATH/*
wintersmith build -o $PUBLISH_PATH

#Change dir
cd $PUBLISH_PATH
git add --all

#Show git Status
echo "Modified Files"
git status


#Add Credentials
git commit -m "Deploy from travis"
git push --repo=$TO_REPOSITORY --force --verbose