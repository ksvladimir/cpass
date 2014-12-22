# cpass - [pass][1] gui for chrome

The extension enables quick access to passwords managed by [`pass`][1] that are stored under `web/` prefix. For now, only Mac OS X is supported, but the code should be fairly easy to port.

## Installation

1. Grant cpass chrome extension access to the cpass.py native application:

    ```
    $ ./host/install.sh
    ```

2. Install chrome extension:
  * Open chrome extensions page [chrome://extensions/](chrome://extensions/).
  * Click "Load unpacked extension...".
  * Select cpass folder (the one which contains manifest.json file).

## Updating

1. Update the source tree:

    ```
    $ git pull
    ```

2. Refresh the extension in chrome:
  * Open chrome extensions page [chrome://extensions/](chrome://extensions/).
  * Find cpass extension and click `Reload` link near it.


## Usage

1. Click on the lock icon on the chrome toolbar.
2. Enter the passname (the extension will pre-fill it with the current domain name).
3. Click either "Get password" or "Generate password" button (depending on whether the passname exists or not).
4. The extension will instruct `pass` to copy the password to clipboard for 45 seconds and will show corresponding timer.

[1]: http://www.passwordstore.org/
