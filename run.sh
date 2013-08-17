#Generating  Data
echo ">> Generating Data"
git checkout develop
wintersmith build --output='	github-master'

#Prepare Commit
echo ">> Preparing to commit"
cd github-master
git config user.email "support@travis-ci.org"
git config user.name "travisbot"
git add --all .
git commit -m "deploy from Travis"
git config credential.helper "store --file=.git/credentials"
echo "git://$GH_TOKEN:@github.com" > .git/credentials

#Pushing
echo ">> Pushing to Git Hub"
git push origin