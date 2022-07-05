require('Ext')('Ext.util.TagManager', 'Ext.util.MixedCollection');

test('Ext is a function?', () => expect(typeof Ext).toBe('function'));

test('Ext.util.TagManager is a class?', () => {
	expect(typeof Ext.util.TagManager).toBe('function');
	expect(Object.getOwnPropertyDescriptor(Ext.util.TagManager, 'prototype').writable).toBe(false); 
});

test('Ext.util.TagManager can accept records ?', () => {
	
	const taggableA  = { tags: new Set };
	const collection = new Ext.util.MixedCollection;
	const tagManager = new Ext.util.TagManager({collection});

	taggableA.tags.add('test-tag-a');

	collection.add(taggableA);

	expect(tagManager.has(taggableA)).toBe(true);
});


test('Ext.util.TagManager can tell if it has a record ?', () => {

	const taggableA  = { tags: new Set };
	const taggableB  = { tags: new Set };
	const collection = new Ext.util.MixedCollection;
	const tagManager = new Ext.util.TagManager({collection});

	taggableA.tags.add('test-tag-a');
	taggableA.tags.add('test-tag-b');
	taggableB.tags.add('test-tag-b');

	expect(tagManager.has(taggableA)).toBe(false);
	expect(tagManager.has(taggableB)).toBe(false);

	collection.add(taggableA);

	expect(tagManager.has(taggableA)).toBe(true);
	expect(tagManager.has(taggableB)).toBe(false);
	
	collection.add(taggableB);

	expect(tagManager.has(taggableA)).toBe(true);
	expect(tagManager.has(taggableB)).toBe(true);
});

test('Ext.util.TagManager can search for a record ?', () => {
	
	const taggableA  = { name: 'A',  tags: new Set };
	const taggableB  = { name: 'B', tags: new Set };
	
	const collection = new Ext.util.MixedCollection;
	const tagManager = new Ext.util.TagManager({collection});

	taggableA.tags.add('test-tag-a');
	taggableA.tags.add('test-tag-b');
	taggableB.tags.add('test-tag-b');

	collection.add(taggableA);
	collection.add(taggableB);

	const onlyA   = tagManager.search('test-tag-a');
	const onlyB   = tagManager.search('test-tag-b', '-test-tag-a');
	const both    = tagManager.search('test-tag-b');
	const neither = tagManager.search('-test-tag-b', 'test-tag-a');

	expect(onlyA.has(taggableA)).toBe(true);
	expect(onlyA.has(taggableB)).toBe(false);
	
	expect(onlyB.has(taggableB)).toBe(true);
	expect(onlyB.has(taggableA)).toBe(false);

	expect(both.has(taggableA)).toBe(true);
	expect(both.has(taggableA)).toBe(true);
	expect(both.has(taggableB)).toBe(true);
	expect(both.has(taggableB)).toBe(true);

	expect(neither.has(taggableA)).toBe(false);
	expect(neither.has(taggableA)).toBe(false);
	expect(neither.has(taggableB)).toBe(false);
	expect(neither.has(taggableB)).toBe(false);

});