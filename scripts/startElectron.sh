#!/bin/bash

# DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIR="$(dirname "$(readlink -f "$0")")"
cd $DIR && yarn electron:start "$@"
