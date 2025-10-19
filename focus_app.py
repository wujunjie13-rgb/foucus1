#!/usr/bin/env python3
"""
Focus Timer Application with Airplane Cabin Sound
替换了电视声音，现在使用飞机舱内的环境音
"""

import json
import os

def load_config():
    """Load configuration from config.json"""
    config_path = os.path.join(os.path.dirname(__file__), 'config.json')
    with open(config_path, 'r') as f:
        return json.load(f)

def get_sound_type():
    """Get the current sound type setting"""
    config = load_config()
    return config['sound_type']

def get_sound_description():
    """Get the sound description"""
    config = load_config()
    return config['sound_description']

if __name__ == '__main__':
    config = load_config()
    print(f"Focus App - Sound Configuration")
    print(f"================================")
    print(f"Sound Type: {config['sound_type']}")
    print(f"Description: {config['sound_description']}")
    print(f"Volume: {config['volume']}")
    print(f"\nAmbient Type: {config['features']['ambient_type']}")
    print(f"Previous Version Used: {config['features']['previous_version']}")
    print(f"\n飞机舱内环境音已启用 (Airplane cabin sound enabled)")
