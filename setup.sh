if [ ! -d ./node_modules ]; then
    npm install
fi

if [ ! -d ./.env ]; then
    cd packages/setup
    node index.js
    cd ../..
fi

