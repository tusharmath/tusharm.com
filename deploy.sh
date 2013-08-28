#Configuration
MODULE_NAME=".deploy-master"
git config --global user.email "support@travis-ci.org"
git config --global user.name "travisbot"
git config --global push.default current 	
echo "https://$GH_TOKEN:@github.com" > .git/credentials

#Clone master 
git clone https://github.com/tusharmath/tusharmath.github.io.git $MODULE_NAME -b master
cd "$MODULE_NAME"
git config credential.helper "store --file=../.git/credentials"
find . ! -name ".git" -type f | xargs rm -f

#Generating  Data
cd ..
echo ">> Generating Data"
git checkout develop
./node_modules/wintersmith/bin/wintersmith build --output="$MODULE_NAME"


#Prepare Commit
cd "$MODULE_NAME"
echo ">> Preparing to commit"
git add --all
echo ">> Git Status"	
git status
git commit -m "deploy from Travis [ci skip]"

#Pushing
echo ">> Pushing to Git Hub"
git push origin