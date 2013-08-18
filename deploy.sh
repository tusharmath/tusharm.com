#Configuration
git config --global user.email "support@travis-ci.org"
git config --global user.name "travisbot"
git config --global push.default current 	
echo "https://$GH_TOKEN:@github.com" > .git/credentials

#Checkout master
cd github-master
git checkout master --force
git config credential.helper "store --file=../.git/credentials"


#Generating  Data
cd ..
echo ">> Generating Data"
git checkout develop
./node_modules/wintersmith/bin/wintersmith build --output='github-master'


#Prepare Commit
cd github-master
echo ">> Preparing to commit"
git add --all
echo ">> Git Status"	
git status
git commit -m "deploy from Travis [ci skip]"

#Pushing
echo ">> Pushing to Git Hub"
git push origin