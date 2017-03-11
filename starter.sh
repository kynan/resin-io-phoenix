#!/bin/bash

set -eux

NPROCS=${NPROCS:-4}

for i in `seq 0 $((NPROCS-1))`; do
  systemctl enable phoenix@${i}
done

for i in `seq 0 $((NPROCS-1))`; do
  systemctl start phoenix@${i}
done
