#!/usr/bin/env bash

yarn bootstrap
./select-env.sh webpack-1
yarn lint
yarn build:runtime
yarn coverage
./select-env.sh webpack-2
yarn coverage
