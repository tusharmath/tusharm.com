#Configuration
git config user.email "support@travis-ci.org"
git config user.name "travisbot"
git config push.default current
git config credential.helper "store --file=.git/credentials"
echo "https://$GH_TOKEN:@github.com" > .git/credentials

#Generating  Data
echo ">> Generating Data"
git checkout develop
wintersmith build --output='github-master'

#Change dir
cd github-master

#Prepare Commit
echo ">> Preparing to commit"
git commit -am "deploy from Travis"

#Pushing
echo ">> Pushing to Git Hub"
git push origin