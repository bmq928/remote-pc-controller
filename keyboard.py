from pynput.keyboard import Controller, Key
import json
import click

keyboard = Controller()


def tap_key(key_name):
    key_tapped = get_tapped_key(key_name)

    keyboard.press(key_tapped)
    keyboard.release(key_tapped)


def tap_and_hold_key(key_name, inside_action):
    key_tapped = key_name if len(
        key_name) == 1 else getattr(Key, key_name).value

    keyboard.press(key_tapped)
    inside_action()
    keyboard.release(key_tapped)


def exec_group_keys(keys_name):
    if len(keys_name) == 1:
        tap_key(keys_name[0])
        return
    
    tap_and_hold_key(keys_name[0], lambda: exec_group_keys(keys_name[1:]))


def get_tapped_key(name):
    tapped_key = name if len(name) == 1 else getattr(Key, name)
    return tapped_key


@click.command()
@click.option('--tap/--no-tap', default=False, help='Use tap style')
@click.option('--execution/--no-execution', default=False, help='Execute a group of key')
@click.option('--data', default='{"keys": []}', help='List key')
def main(tap, execution, data):
    if not any([tap, execution]):
        print('At least on of the option must be set')
        return

    commands = json.loads(data)['keys']

    if tap:
        tap_key(commands[0])
        return

    if execution:
        exec_group_keys(commands)
        return


if __name__ == '__main__':
    # pylint: disable=no-value-for-parameter
    main()
