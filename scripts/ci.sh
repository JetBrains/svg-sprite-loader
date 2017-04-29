#!/usr/bin/env bash

yarn bootstrap
yarn env:webpack-1
yarn lint
yarn build:runtime
yarn coverage
yarn env:webpack-2
yarn coverage
