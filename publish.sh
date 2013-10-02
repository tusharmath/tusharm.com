#!/bin/sh
#Constants
dryrun=$1
path="./temp/dump/master"
branch="master"

##Remove Folder
echo "Clearing Files"
rm -rf $path

##Clone Replositoy
git clone . $path --branch $branch

##Clean folder
rm -rf $path/**


#Build Project
wintersmith build -o $path

#Change Working Dir
cd $path

#Add All files
git add --all

#Show Status
git status $path

#Publish
git commit -m "Publishing to web" $dryrun
git push origin master $dryrun

#Remove Temp folder
cd ../../../
rm -rf ./temp