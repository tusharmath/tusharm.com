#Constants
dryrun=$1
path="./temp/dump/master"
branch="master"
timestamp=`eval date`
repo="https://github.com/tusharmath/tusharmath.github.io.git"



##Remove Folder
rm -rf $path
mkdir -p $path

#Remove remote master branch
echo "Removing master branch:"
git push $repo :master
wintersmith build -o $path

#Change directory
cd $path
git init .
git add --all
git commit -m "Publishing to Web $timestamp" $dryrun --quiet

#Pushing to Github Pages
echo "Pushing Changes:"
git push $repo master:master $dryrun

#Remove Temp folder
#cd ../../../
#rm -rf ./temp

echo "Publishing on: $timestamp"