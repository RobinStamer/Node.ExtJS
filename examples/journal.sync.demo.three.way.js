#!/usr/bin/env ext

Ext('Ext.examples.JournalTest', 'Ext.data.ManagedCollection', 'Ext.data.JournalSyncManager')

var	a	= new Ext.examples.JournalTest
	,b	= new Ext.examples.JournalTest
	,c	= new Ext.examples.JournalTest
	,dbA	= new Ext.data.ManagedCollection({class: Ext.examples.JournalTest})
	,dbB	= new Ext.data.ManagedCollection({class: Ext.examples.JournalTest})
	,dbC	= new Ext.data.ManagedCollection({class: Ext.examples.JournalTest})
	,A	= new Ext.data.JournalSyncManager(dbA)
	,B	= new Ext.data.JournalSyncManager(dbB)
	,C	= new Ext.data.JournalSyncManager(dbC)

a.writeEntry({type: 'init'}, 0)
b.journal.push(a.journal[0])
c.journal.push(a.journal[0])

var	arr	= [a, b, c]
	,nums	= [99, -42, 1337, 666, 404, 23, 13]

for (var i = 0; i < nums.length; ++i) {
	arr[i % arr.length].writeEntry({
		type:	'add'
		,n:	nums[i]
	}, Math.pow(5, i + 1))
}

a.id = b.id = c.id = 'lol'

dbA.add(a)
dbB.add(b)
dbC.add(c)

// STAGE 1
// STAGE 2

var remote = B.stage2(A.genSummary())

// STAGE 3

var next = A.stage3(remote)

// STAGE 4

var data = B.stage4(next)

// STAGE 5

A.stage5(data)

remote	= C.stage2(A.genSummary())
next	= A.stage3(remote)
data	= C.stage4(next)
A.stage5(data)

remote	= C.stage2(B.genSummary())
next	= B.stage3(remote)
data	= C.stage4(next)
B.stage5(data)

//console.dir(dbA)
console.dir(a)
console.dir(b)
console.dir(c)
