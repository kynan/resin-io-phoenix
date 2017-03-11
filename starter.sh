#!/bin/bash

set -eux

NPROCS=${NPROCS:-4}

if [[ $(uname -m) == "armv7l" ]]; then
  for i in `seq 0 $((NPROCS-1))`; do
    systemctl enable phoenix@${i}
  done

  for i in `seq 0 $((NPROCS-1))`; do
    systemctl start phoenix@${i}
  done
else
  for i in `seq 0 $((NPROCS-1))`; do
    N=$i ./server.js &
  done
fi
