#!/usr/bin/env bash

e=$1

cd $PWD/../env/$e/node_modules

cd webpack
yarn link

cd ../extract-text-webpack-plugin
yarn link

cd ../enhanced-resolve
yarn link

cd ../../../../

yarn link webpack
yarn link extract-text-webpack-plugin
yarn link enhanced-resolve
