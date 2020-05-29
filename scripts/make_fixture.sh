#!/bin/bash

set -eu

yarn jest --coverage
cat ./coverage/coverage-final.json | sed -e "s|$PWD||g" > fixture/coverage-final.json
