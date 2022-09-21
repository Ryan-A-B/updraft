#!/bin/bash

docker run --rm -it \
	-v $(pwd):$(pwd) \
	-w $(pwd) \
	node:16 yarn install
