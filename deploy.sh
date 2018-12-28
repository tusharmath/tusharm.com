DEPLOY_BRANCH="master"
SOURCE_BRANCH="develop"
ORG="tusharmath"
REPO="tusharmath.github.io"
CONTENT_DIR="packages/tusharm.com/bin"
CUSTOM_DOMAIN="tusharm.com"

rm -rf $CONTENT_DIR
mkdir -p $CONTENT_DIR
yarn build
REPO_URL="git@github.com:${ORG}/${REPO}.git"
echo "${CUSTOM_DOMAIN}" > $CONTENT_DIR/CNAME

# Inside the directory
cd $CONTENT_DIR
git init
git add .
git commit -am "deploying to gh-pages"
git remote add origin "${REPO_URL}"
git push --force origin "${DEPLOY_BRANCH}"
cd -
