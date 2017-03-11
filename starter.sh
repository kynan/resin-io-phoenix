#!/bin/bash

set -eux

NPROCS=${NPROCS:-4}

for i in `seq 1 $NPROCS`; do
  N=$i node server.js &
done
