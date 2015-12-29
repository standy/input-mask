var stringMaskInit = require('../lib/utils/string-mask.js');

var mask = '..99..aa..';
var placeholder = '..##..@@..';

describe('StringMask', function() {
	beforeEach(function() {
		this.stringMask = stringMaskInit({
			mask: '..99..aa..',
			placeholder: '..##..@@..',
		});
	});

	it('.mask()', function() {
		[
			['', ''],
			['11', '..11'],
			['11zz', '..11..zz'],
			['1234567890', '..12..@@..'],
			['abcdefghkj', '..##..cd..'],
			['a1', '..#1']
		].forEach(test => {
			expect(this.stringMask.mask(test[0])).toBe(test[1]);
		});
	});

	it('.unmask()', function() {
		[
			['', ''],
			['..', ''],
			['..2', '2'],
			['..22..', '22'],
			['..22..z', '22z'],
			['..22..zz', '22zz'],
			['..22..zz..', '22zz'],
		].forEach(test => {
			expect(this.stringMask.unmask(test[0])).toBe(test[1]);
		});
	});

	it('.maskIndex()', function() {
		[
			[0, 0],
			[1, 3],
			[2, 4],
			[3, 7],
			[4, 8],
		].forEach(test => {
			expect(this.stringMask.maskIndex(test[0])).toBe(test[1]);
		});
	});

	it('.unmaskIndex()', function() {
		[
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 1],
			[4, 2],
			[5, 2],
			[6, 2],
			[7, 3],
			[8, 4],
			[9, 4],
			[10, 4],
		].forEach(test => {
			expect(this.stringMask.unmaskIndex(test[0])).toBe(test[1]);
		});
	});

	it('.getPlaceholder()', function() {
		[
			['', '..##..@@..'],
			['1', '..1#..@@..'],
			['.1', '..1#..@@..'],
			['q1', '..#1..@@..'],
			['11zz', '..11..zz..'],
			['..zz', '..##..@@..'],
			['..1zz', '..1#..z@..'],
			['..1?..zz', '..1#..zz..'],
			['..1?..?z', '..1#..@z..'],
			['..11..zz..', '..11..zz..'],
		].forEach(test => {
			expect(this.stringMask.getPlaceholder(test[0])).toBe(test[1]);
		});
	});

	it('.skip()', function() {
		[
			[0, 2],
			[1, 2],
			[2, 2],
			[3, 3],
			[4, 6],
			[5, 6],
			[6, 6],
			[7, 7],
			[8, 10],
			[9, 10],
			[10, 10],
			[11, 11],
		].forEach(test => {
			expect(this.stringMask.skip(test[0], 1)).toBe(test[1]);
		});
	});

	it('.firstToType()', function() {
		[
			['', 2],
			['..', 2],
			['..##..@@..', 2],
			['..9', 3],
			['..9a', 3],
			['..9#..@@..', 3],
			['..99', 6],
			['..99..@@..', 6],
			['..99..9@..', 6],
			['..99..a', 7],
			['..99..a@..', 7],
			['..99..aa..', 10],
		].forEach(test => {
			expect(this.stringMask.firstToType(test[0], 1)).toBe(test[1]);
		});
	});

	it('.charMask()', function() {
		[
			[0, '.', '.'],
			[0, 'a', '.'],
			[0, '1', '.'],
			[2, '.', ''],
			[2, 'b', ''],
			[2, '2', '2'],
			[4, '.', '.'],
			[4, 'c', '.'],
			[4, '3', '.'],
			[6, '.', ''],
			[6, 'd', 'd'],
			[6, '4', ''],
			[8, '.', '.'],
			[8, 'e', '.'],
			[8, '5', '.'],
			[10, '.', ''],
			[10, 'f', ''],
			[10, '6', ''],
		].forEach(test => {
			expect(this.stringMask.charMask(test[0], test[1])).toBe(test[2]);
			expect(this.stringMask.charMask(test[0] + 1, test[1])).toBe(test[2]);
		});
	});

});