#!/bin/bash

get_package_version() {
	PACKAGE_VERSION="$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)"
}
get_package_version
PACKAGE_WITHOUT_PATCH=$(echo $PACKAGE_VERSION | sed "s/\./\n/g" | head -2 | sed "N;s/\n/\./g")

echo "$PACKAGE_WITHOUT_PATCH.$1"
