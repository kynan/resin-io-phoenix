#!/bin/bash

set -eux

NPROCS=${NPROCS:-4}

for i in `seq 1 $NPROCS`; do
  systemctl enable phoenix@${i}
done

for i in `seq 1 $NPROCS`; do
  systemctl start phoenix@${i}
done
