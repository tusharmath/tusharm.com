#Constants
dryrun=$1
path="./temp/dump/master"
branch="master"
timestamp=date
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
echo "File Status:"
git status

#Publish
echo "\nPushing Changes:"
git commit -m "Publishing to web $timestamp" $dryrun
git push origin master $dryrun --quiet

#Remove Temp folder
cd ../../../
rm -rf ./temp