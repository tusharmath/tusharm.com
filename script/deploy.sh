DEPLOY_BRANCH="master"
SOURCE_BRANCH="develop"
ORG="tusharmath"
REPO="tusharmath.github.io"
CONTENT_DIR="bin"
CUSTOM_DOMAIN="tusharm.com"

rm -rf bin
mkdir bin
yarn build
REPO_URL="git@github.com:${ORG}/${REPO}.git"
echo "${CUSTOM_DOMAIN}" > bin/CNAME

# Inside the directory
cd bin
git init
git add .
git commit -am "deploying to gh-pages"
git remote add origin "${REPO_URL}"
git push --force origin "${DEPLOY_BRANCH}"
cd ..
