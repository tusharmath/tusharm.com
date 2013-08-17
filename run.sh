#Remove GH Pages Folder
GH_TOKEN="d5ab1906e27ad4a3cbd32743fda35b71336f663a"
echo ">> Clearing folder"
rm -rf .github-master

#Clone Repo using https
echo ">> Cloning repo"
#git clone "https://github.com/tusharmath/tusharmath.github.io.git" .github-master

#Wintersmith build
echo ">> Wintersmith Build"
wintersmith build --output='bin'

#Copy files
echo ">> Copying files"
copy bin/** .github-master

cd .github-master

echo ">> Setting up user details"
git config user.email "support@travis-ci.org"
git config user.name "travisbot"

echo ">> Preparing to commit"
git add .

echo ">> Comitting"
git commit -m "deploy from $WERCKER_STARTED_BY"

echo ">> Pushing to Git Hub"
git push -f remote "https://$GH_TOKEN@github.com/$tusharmath.github.io.git"