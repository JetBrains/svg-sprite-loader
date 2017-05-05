#!/usr/bin/env bash

set -ev

yarn bootstrap
yarn env:webpack-1
yarn build:runtime

yarn lint
yarn test
yarn env:webpack-2
yarn coverage
