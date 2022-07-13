require('..')('Ext.util.DueDate', 'Ext.util.DueDateCollection')

test('Ext is a function?', () => expect(typeof Ext).toBe('function'));

test('Ext.util.DueDate is a class?', () => {
	expect(typeof Ext.util.DueDate).toBe('function');
	expect(Object.getOwnPropertyDescriptor(Ext.util.DueDate, 'prototype').writable).toBe(false);
});

const onTime = (x,y) => setTimeout(y,x);

test('Ext.util.DueDate can be named?', () => {
	const one = new Ext.util.DueDate({
		interval: 1000,
		name: 'One second',
		warn: 750,
	});
	expect(one.name).toEqual('One second');
});

test('Ext.util.DueDate can expire?', () => {
	const one = new Ext.util.DueDate({
		name: 'One second',
		interval: 1000
	});
	expect(one.isOverdue()).toBe(false);

	return new Promise(accept => onTime(1500, () => {
		expect(one.isOverdue()).toBe(true);
		accept();
	}));
});

test('Ext.util.DueDate can be reset?', () => {
	const one = new Ext.util.DueDate({
		name: 'One second',
		interval: 1000
	});
	return new Promise(accept => onTime(1500, () => {
		one.reset();
		expect(one.isOverdue()).toBe(false);
		accept();
	}));
});

test('Ext.util.DueDate can be reset flexibly?', () => {
	const one = new Ext.util.DueDate({
		name: 'One second',
		interval: 1000,
		flex: true
	});
	
	one.reset();
	
	return new Promise(accept => onTime(1500, () => {
		expect(one.isOverdue()).toBe(true);
		accept();
	}));
});

test('Ext.util.DueDate can warn?', () => {
	const one = new Ext.util.DueDate({
		name: 'One second',
		interval: 1000,
		warn: 250
	});

	expect(one.isOverdue()).toBe(false);

	return Promise.allSettled([
		new Promise(accept => onTime(500, () => {
			expect(one.isWarning()).toBe(false);
			accept();
		})),
		new Promise(accept => onTime(850, () => {
			expect(one.isWarning()).toBe(true);
			accept();
		})),
	]);
});

test('Ext.util.DueDateCollection can accept DueDate?', () => {

	const one = new Ext.util.DueDate({
		name: 'One second',
		interval: 1000,
		warn: 250
	});

	const two = new Ext.util.DueDate({
		name: 'Two seconds',
		interval: 2000,
		warn: 250
	});

	const collection = new Ext.util.DueDateCollection;

	collection.add(one);
	collection.add(two);

	const key1 = collection.getKey(one);
	const key2 = collection.getKey(two);

	expect(one).toEqual(collection.get(key1));
	expect(one).toEqual(collection.itemAt(0));

	expect(two).toEqual(collection.get(key2));
	expect(two).toEqual(collection.itemAt(1));
});

test('Ext.util.DueDateCollection can provide defaults to new DueDates?', () => {

	const interval   = 1000;
	const collection = new Ext.util.DueDateCollection({defaults: {interval}});

	collection.add({});

	expect(interval).toEqual(collection.itemAt(0).interval);
});

test('Ext.util.DueDate throws error when given no interval or expiry ?', () => {

	let caught = false;

	try
	{
		const one = new Ext.util.DueDate({
			name: 'One second', warn: 250
		});
	}
	catch(error)
	{
		caught = error;
	}

	expect(caught).toEqual('Expiry or interval must be defined.');
});

test('Ext.util.DueDate throws error when given both interval and expiry ?', () => {

	let caught = false;

	try
	{
		const one = new Ext.util.DueDate({
			name: 'One second', warn: 250, interval: 100, expiry: 100, 
		});
	}
	catch(error)
	{
		caught = error;
	}

	expect(caught).toEqual('Either expiry or interval must be defined (not both).');
});


test('Ext.util.DueDate throws error when marked as once and reset ?', () => {

	let caught = false;

	try
	{
		const one = new Ext.util.DueDate({
			name: 'One second', warn: 250, interval: 100, once: true
		});

		one.reset();
	}
	catch(error)
	{
		caught = error;
	}

	expect(caught).toEqual('Cannot reset DueDate marked as "once".');
});
