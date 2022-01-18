#!/usr/bin/env ext

Ext('Ext.examples.JournalTest', 'Ext.data.ManagedCollection', 'Ext.data.JournalSyncManager')

var	a	= new Ext.examples.JournalTest
	,b	= new Ext.examples.JournalTest
	,dbA	= new Ext.data.ManagedCollection({class: Ext.examples.JournalTest})
	,dbB	= new Ext.data.ManagedCollection({class: Ext.examples.JournalTest})
	,A	= new Ext.data.JournalSyncManager(dbA)
	,B	= new Ext.data.JournalSyncManager(dbB)

a.writeEntry({type: 'init'}, 0)
b.journal.push(a.journal[0])
a.writeEntry({type: 'add', n: 99}, 5)
b.writeEntry({type: 'add', n: -42}, 55)
a.writeEntry({type: 'add', n: 1337}, 555)
b.writeEntry({type: 'add', n: 666}, 5555)

a.id = b.id = 'lol'

dbA.add(a)
dbB.add(b)

// STAGE 1
// STAGE 2

var remote = B.stage2(A.genSummary())

// STAGE 3

var next = A.stage3(remote)

// STAGE 4

var data = B.stage4(next)

// STAGE 5

A.stage5(data)

//console.dir(dbA)
console.dir(a)
console.dir(b)
console.log(dbA.cfg.class)
