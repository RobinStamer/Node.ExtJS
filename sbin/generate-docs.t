#!/usr/bin/env trash

dir = ./docs

rm -rf $dir
ext-doc -p ext.xml -o $dir
