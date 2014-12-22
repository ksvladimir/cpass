#!/usr/bin/env python

import subprocess
import traceback
import logging
import struct
import json
import sys
import os


import logging.config

logging.basicConfig(filename=__file__ + '.log', level=logging.ERROR)
logger = logging.getLogger(__name__)


password_store = os.path.expanduser('~/.password-store/')
password_store_root = 'web'


def passname2local(passname):
    return os.path.join(password_store_root, passname)


def get_pass_names():
    names = {}
    top = password_store + password_store_root + '/'

    if not os.path.isdir(top):
        return names

    for root, dirs, files in os.walk(top):
        assert root.startswith(top)
        root = root[len(top):]

        for f in files:
            if not f.startswith('.') and f.endswith('.gpg'):
                names[os.path.join(root, f[:-4])] = 1

        hidden = [d for d in dirs if d.startswith('.')]
        for d in hidden:
            dirs.remove(d)

    return names


def run_pass(args):
    env = dict(os.environ)
    env['PATH'] += ':/opt/local/bin'
    devnull = os.open('/dev/null', os.O_WRONLY)
    out = subprocess.call(['/opt/local/bin/pass'] + args,
                          env=env, stdout=devnull, stderr=devnull)
    os.close(devnull)
    if out != 0:
        # FIXME: add meaningful error messages
        error = 'pass returned non-zero error code: %d' % out
        logger.error(error)
        return {'result': 'error', 'error': error}

    logger.debug('pass returncode: %s' % repr(out))
    return {'result': 'success'}


def main():
    msg_len = sys.stdin.read(4)
    msg_len = struct.unpack('i', msg_len)[0]
    msg = sys.stdin.read(msg_len).decode('utf-8')
    args = json.loads(msg)

    logger.debug('args = %s', repr(args))
    action = args['action']

    if action == 'get-pass-names':
        logger.info('Got %s request' % action)
        output = get_pass_names()

    elif args['action'] == 'get-password':
        passname = args['passname']
        logger.info('Got %s request for %s' % (action, repr(passname)))
        output = run_pass(['-c', passname2local(passname)])

    elif args['action'] == 'generate-password':
        passname = args['passname']
        logger.info('Got %s request for %s' % (action, repr(passname)))
        output = run_pass(['generate', '-c', passname2local(passname), '16'])

    else:
        logger.critical('Got unknown request: %s!' % repr(action))
        sys.exit(1)

    output = json.dumps(output)
    logger.debug('Output: %s' % repr(output))

    sys.stdout.write(struct.pack('I', len(output)))
    sys.stdout.write(output)
    sys.stdout.flush()


if __name__ == '__main__':
    logger.debug('Received new request, sys.argv=%s' % repr(sys.argv))

    try:
        main()
    except Exception, e:
        logger.critical('Unhandled exception: %s', str(e))
        logger.debug('Traceback: %s', traceback.format_exc())
        raise

    logger.debug('Done.')
