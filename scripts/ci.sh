#!/usr/bin/env bash

set -ev

yarn bootstrap
yarn lint
yarn test:webpack-1
yarn test:webpack-2
