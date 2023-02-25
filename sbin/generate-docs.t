#!/usr/bin/env trash

dir = ./docs

rm -rf $dir
ext-doc -p var/ext.xml -o $dir
