#!/bin/bash
truffle compile
truffle migrate --reset

if [ "$1" = "testrpc" ]
then
  echo "Running and compiling on testrpc"
  yarn run testrpc
else
  echo "Running and compiling on Kovan"
  yarn start
fi
