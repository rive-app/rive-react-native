#!/bin/bash

get_package_version() {
	PACKAGE_VERSION="$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)"
}
get_package_version

echo "$PACKAGE_VERSION"
