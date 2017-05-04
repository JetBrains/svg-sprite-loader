#!/usr/bin/env bash

yarn bootstrap
yarn lint
yarn build:runtime

yarn env:webpack-1
yarn test
yarn env:webpack-2
yarn coverage
