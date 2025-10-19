#!/usr/bin/env python3
"""
Tests for Focus App
Ensure sound type is airplane, not TV
"""

import json
import unittest
from focus_app import load_config, get_sound_type, get_sound_description


class TestFocusApp(unittest.TestCase):
    """Test cases for the focus application"""
    
    def test_sound_type_is_airplane(self):
        """Test that sound type is set to airplane"""
        sound_type = get_sound_type()
        self.assertEqual(sound_type, 'airplane', 
                        "Sound type should be 'airplane', not TV")
    
    def test_ambient_type_is_airplane_cabin(self):
        """Test that ambient type is airplane cabin"""
        config = load_config()
        ambient_type = config['features']['ambient_type']
        self.assertEqual(ambient_type, 'airplane_cabin',
                        "Ambient type should be 'airplane_cabin'")
    
    def test_previous_version_was_tv(self):
        """Test that previous version was TV static"""
        config = load_config()
        previous = config['features']['previous_version']
        self.assertEqual(previous, 'tv_static',
                        "Previous version should be 'tv_static'")
    
    def test_sound_type_is_not_tv(self):
        """Explicitly test that sound type is NOT TV"""
        sound_type = get_sound_type()
        self.assertNotEqual(sound_type, 'tv', 
                           "Sound type should NOT be 'tv'")
        self.assertNotEqual(sound_type, 'tv_static', 
                           "Sound type should NOT be 'tv_static'")
    
    def test_sound_description_mentions_airplane(self):
        """Test that sound description mentions airplane"""
        description = get_sound_description()
        self.assertIn('airplane', description.lower(),
                     "Description should mention 'airplane'")


if __name__ == '__main__':
    unittest.main()
