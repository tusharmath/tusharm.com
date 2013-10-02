#Constants
dryrun=$1
path="./temp/dump/master"
branch="master"
timestamp=`eval date`
repo="https://github.com/tusharmath/tusharmath.github.io.git"
##Remove Folder
echo "Clearing Files"
rm -rf $path

#Remove remote master branch
echo "Removing master branch:"
git push $repo :master

#Build Project
wintersmith build -o $path

#Change directory
cd $path
git add --all

#Show Status
echo "File Status:"
git status

#Publish
echo "\nPushing Changes:"
git commit -m "Publishing to web $timestamp" $dryrun
git push $repo master $dryrun --quiet

#Remove Temp folder
#cd ../../../
#rm -rf ./temp