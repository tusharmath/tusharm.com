#Configuration
git config user.email "support@travis-ci.org"
git config user.name "travisbot"
git config push.default origin

#Generating  Data
echo ">> Generating Data"
git checkout develop
wintersmith build --output='github-master'

#Change dir
cd github-master

echo ">> Listing all file"
ls -la

#Prepare Commit
echo ">> Preparing to commit"
git add --all .
git commit -m "deploy from Travis"
git config credential.helper "store --file=.git/credentials"
echo "https://$GH_TOKEN:@github.com" > .git/credentials

#Pushing
echo ">> Pushing to Git Hub"
git push