#!/bin/bash

set -e

cd $(dirname $0)
CPASS_DIR=$(pwd)

CPASS_EXTENSION_ID="mmlmjdejoehfpjakdbpkfdnjjohjkajm"
CPASS_NATIVE_APP=$CPASS_DIR/cpass.py

CHROME_LIB="$HOME/Library/Application Support/Google/Chrome"

echo "Configuring chrome to use cpass.py at $CPASS_NATIVE_APP..."

mkdir -p "$CHROME_LIB/NativeMessagingHosts"
sed -e "s|CPASS_EXTENSION_ID|$CPASS_EXTENSION_ID|" -e "s|CPASS_NATIVE_APP|$CPASS_NATIVE_APP|" \
    $CPASS_DIR/com.ksvladimir.cpass.json > "$CHROME_LIB/NativeMessagingHosts/com.ksvladimir.cpass.json"

echo "Done."
