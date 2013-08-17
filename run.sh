#Configuration
git config --global user.email "support@travis-ci.org"
git config --global user.name "travisbot"
git config --global push.default current
 	
echo "https://$GH_TOKEN:@github.com" > .git/modules/github-master/credentials

#Generating  Data
echo ">> Generating Data"
git checkout develop
./node_modules/wintersmith/bin/wintersmith build --output='github-master'

#Change dir
cd github-master
git config credential.helper "store --file=../.git/modules/github-master/credentials"

#Prepare Commit
echo ">> Preparing to commit"
git commit -am "deploy from Travis"

#Pushing
echo ">> Pushing to Git Hub"
git push origin